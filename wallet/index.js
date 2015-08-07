var Promise = require('bluebird'),
    ck = require('../coinkite-helper'),
    _ = require('lodash');
Promise.promisifyAll(ck);

/**
 *
 * @param {{account:String, keys:Array, cosigners:int, threshold:int}} params
 * @constructor
 */
exports.Wallet = function (params) {
    if (params.keys.length !== params.cosigners) {
        throw new Error('The number of keys should be equal to the number of cosigners');
    }
    this.account = params.account;
    this.keys = params.keys;
    this.cosigners = params.cosigners;
    this.threshold = params.threshold;
};

/**
 * Checks that the cosigners' HD public keys exists in this.keys.
 * @param {Object} cosigners
 */
exports.Wallet.prototype.checkCosigners = function(cosigners) {
    var self = this;
    _.each(cosigners, function(c) {
        if (!_.any(self.keys, function(key) {
            return key.pub.slice(103) == c.xpubkey_check;
        })) {
            throw new Error('Cosigner ' + c.user_label + '(' + c.CK_refnum +
                ') pub key (... ' + c.xpubkey_check + ') not found in this.keys.');
        }
    });
};

function attemptSign() {

}

exports.Wallet.prototype.send = function(destination, amount) {
    var self = this;
    console.log('Creating a new send request...');
    return ck.newSendAsync(this.account, amount, destination).spread(function(response, body) {
        console.log('Getting cosigners\' information...');
        return ck.getCosignersAsync(body.result.CK_refnum);
    }).spread(function(response, body) {
        self.checkCosigners(body.cosigners);
        return body.cosigners;
    }).map(function(cosigner) {
        console.log('cosigner info:' + JSON.stringify(cosigner));
    });
};