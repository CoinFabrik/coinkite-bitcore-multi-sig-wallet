var Promise = require('bluebird'),
    ck = require('../coinkite-helper'),
    _ = require('lodash'),
    getSignature = require('./sign');
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
Wallet.prototype.checkCosigners = function(cosigners) {
    var self = this;
    _.each(cosigners, function(c) {
        if (!self.getCosignerKeys(c)) {
            throw new Error('Cosigner ' + c.user_label + '(' + c.CK_refnum +
                ') pub key (... ' + c.xpubkey_check + ') not found in this.keys.');
        }
    });
};


Wallet.prototype.attemptSign = function(sendRequest, cosigner) {
    var keys = this.getCosignerKeys(cosigner);
    if (keys.priv) {
        console.log('Cosigner ' + cosigner.user_label + '\'s private key found, signing...');

    } else {
        console.log('Cosigner ' + cosigner.user_label + '\'s private key not in possession,' +
            ' requesting for Coinkite to sign...');
        return ck.signAsync(sendRequest, cosigner.CK_refnum, {}).spread(function(response, body) {
            console.log('Coinkite\'s signing appears to be successful: ' + JSON.stringify(body));
        });
    }
};

Wallet.prototype.send = function(destination, amount) {
    var self = this,
        currentSendRequest;
    console.log('Creating a new send request...');
    return ck.newSendAsync(this.account, amount, destination).spread(function(response, body) {
        console.log('Getting cosigners\' information...');
        currentSendRequest = body.result.CK_refnum;
        return ck.getCosignersAsync(currentSendRequest);
    }).spread(function(response, body) {
        self.checkCosigners(body.cosigners);
        return body.cosigners;
    }).map(function(cosigner) {
        console.log('Getting signing requirements for cosigner ' + cosigner.user_label);
        return ck.getCosignRequirementsAsync(currentSendRequest, cosigner.CK_refnum).spread(function(response, body) {
            return body;
        });
    }).all(function(cosigningInfo) {
        console.log(JSON.stringify(cosigningInfo));
    }).catch(function(e) {
        if (currentSendRequest) {
            //TODO: cancel send
        }
        throw e;
    });
};

exports.Wallet = Wallet;