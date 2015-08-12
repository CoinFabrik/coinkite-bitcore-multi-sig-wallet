var Promise = require('bluebird'),
    ck = require('../coinkite-helper'),
    _ = require('lodash'),
    getSignature = require('./sign').getSignature,
    bitcore = require('bitcore');
Promise.promisifyAll(ck);

/**
 * A wallet for sending multisig transactions. The keys are an array of {priv:String, pub:String}
 * @param {{account:String, keys:Array, cosigners:int, threshold:int}} params
 * @constructor
 */
var Wallet = function (params) {
    if (params.keys.length !== params.cosigners) {
        throw new Error('The number of keys should be equal to the number of cosigners');
    }
    this.account = params.account;
    this.keys = params.keys;
    this.cosigners = params.cosigners;
    this.threshold = params.threshold;
    this.network = params.network;
};

function keyHasChecksum(key, checksum) {
    return key.slice(103) == checksum;
}

Wallet.prototype.getCosignerKeys = function(cosigner) {
    return _.find(this.keys, function(key) {
        return keyHasChecksum(key.pub, cosigner.xpubkey_check);
    });
};

/**
 * Checks that the cosigners' HD public keys exists in this.keys.
 * @param {Object} cosigners
 */
Wallet.prototype.checkCosignersKeys = function(cosigners) {
    var self = this;
    _.each(cosigners, function(c) {
        if (!self.getCosignerKeys(c)) {
            throw new Error('Cosigner ' + c.user_label + '(' + c.CK_refnum +
                ') pub key (... ' + c.xpubkey_check + ') not found in this.keys.');
        }
    });
};

function getSignatures(cosigningInfo, hdPrivateKey, network) {
    return cosigningInfo.input_info.map(function(input, index) {
        var sighash = cosigningInfo.inputs[index][1],
            pathIndex = input.sp,
            address = cosigningInfo.req_keys[pathIndex][0],
            privateKey = new bitcore.HDPrivateKey(hdPrivateKey, network)
                .derive(input.full_sp)
                .privateKey;
        if (cosigningInfo.inputs[index][0] !== pathIndex) {
            throw 'Expected input to have pathIndex = ' + pathIndex;
        }
        if (address !== privateKey.toAddress().toString()) {
            throw 'Expected address found in signing info (' + address +') to match address' +
                ' derived by "' + input.full_sp + '" derivation path from hd key ' +
                hdPrivateKey.toString() + ' (' + privateKey.toAddress().toString() + ')';
        }
        return [
            getSignature(privateKey, sighash),
            sighash,
            pathIndex
        ]
    });
}

Wallet.prototype.sign = function(cosigner, signingInfo) {
    var sendRequest = signingInfo.request,
        signatures,
        keys;
    if (signingInfo.has_signed_already) {
        return;
    }
    keys = this.getCosignerKeys(cosigner);
    if (keys.priv) {
        console.log('Cosigner ' + cosigner.user_label + ' hd private key found, signing...');
        signatures = getSignatures(signingInfo, keys.priv, this.network);
        console.log('Sending signatures: ' + JSON.stringify(signatures));
        return ck.signAsync(sendRequest, cosigner.CK_refnum, signatures).spread(function(response, body) {
            console.log(JSON.stringify(body));
            return [response, body];
        });
    } else {
        console.log('Cosigner ' + cosigner.user_label + ' private key not in possession,' +
            ' requesting for Coinkite to sign...');
        return ck.signAsync(sendRequest, cosigner.CK_refnum, []).spread(function(response, body) {
            console.log('Coinkite\'s signing appears to be successful: ' + JSON.stringify(body));
            return [response, body];
        });
    }
};

function printSigningStatus(cosignInfo) {
    console.log('Signature status:');
    cosignInfo.cosigners.forEach(function(c) {
        console.log(c.user_label + ' (' + c.CK_refnum + ')' +
            (cosignInfo.has_signed_already[c.CK_refnum] ? ' has signed.' : ' has not signed.'));
    });
}

function getCosignersLeftToSign(cosignInfo) {
    return cosignInfo.cosigners.filter(function(c) {
        return !cosignInfo.has_signed_already[c.CK_refnum];
    });
}

Wallet.prototype.performCosigningProcess = function(cosignInfo) {
    var self = this,
        leftToSign = getCosignersLeftToSign(cosignInfo),
        sendRequest = cosignInfo.request;
    self.checkCosignersKeys(cosignInfo.cosigners);
    printSigningStatus(cosignInfo);
    if (leftToSign.length == 0) {
        console.log('All cosigners signed, transaction successful.');
        return;
    }
    return Promise.map(leftToSign, function(cosigner) {
        console.log('Getting signing requirements for cosigner ' + cosigner.user_label);
        return ck.getCosignRequirementsAsync(sendRequest, cosigner.CK_refnum).spread(function(response, body) {
            console.log('Gotten signing info:' + JSON.stringify(body.signing_info));
            return {
                cosigner: cosigner,
                signingInfo: body.signing_info
            };
        });
    }).each(function(cosigningInfo) {
        return self.sign(cosigningInfo.cosigner, cosigningInfo.signingInfo)
            .catch(function(e) {
                console.log('Error when sending ' + cosigningInfo.cosigner.user_label +
                    '\'s signatures (Coinkite may already have all the necessary signatures):\n' + JSON.stringify(e));
            });
    }).then(function() {
        return ck.getCosignersAsync(sendRequest);
    }).spread(function(response, body) {
        return self.performCosigningProcess(body);
    });
};

Wallet.prototype.send = function(destination, amount) {
    var self = this,
        currentSendRequest;
    console.log('Creating a new send request for ' + amount + ' BTC to ' + destination);
    return ck.newSendAsync(this.account, amount, destination).spread(function(response, body) {
        currentSendRequest = body.result.CK_refnum;
        console.log('Getting cosigners\' information...');
        return ck.getCosignersAsync(currentSendRequest);
    }).spread(function(response, body) {
        return self.performCosigningProcess(body);
    }).catch(function(e) {
        if (currentSendRequest) {
            console.log('Error found, cancelling send request...');
            return ck.cancelSendAsync(currentSendRequest).then(function() {
                currentSendRequest = null;
            }).then(function() {
                throw e;
            });
        } else {
            throw e;
        }
    });
};

exports.Wallet = Wallet;