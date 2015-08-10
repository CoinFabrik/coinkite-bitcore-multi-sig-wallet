var request = require('request'),
    CK_API = require('coinkite-javascript/coinkite-api.js'),
    keys = require('./api-keys'),
    _ = require('lodash');


request.debug = false;

function makeRequest(endPoint, method, params, cb) {
    var authHeaders = CK_API.auth_headers(keys.API_KEY, keys.API_SECRET, endPoint);
    console.log('Calling ' + endPoint);
    request({
        url: 'https://api.coinkite.com' + endPoint,
        headers: {
            'User-Agent': 'request',
            'Host': 'api.coinkite.com',
            'X-CK-Key': authHeaders['X-CK-Key'],
            'X-CK-Sign': authHeaders['X-CK-Sign'],
            'X-CK-Timestamp': authHeaders['X-CK-Timestamp']
        },
        method: method,
        json: params || true
    }, function(error, response, body) {
        if (error) {
            return cb(error);
        }
        if (response && response.statusCode !== 200) {
            return cb(new Error(response.statusCode + ': ' + JSON.stringify(body)));
        }
        cb(null, response, body);
    });
}

var RateLimiter = require('limiter').RateLimiter;

var limiter = new RateLimiter(1, 3500); // at most 1 request every 3500 ms
exports.request = function throttledRequest() {
    var requestArgs = arguments;
    limiter.removeTokens(1, function() {
        makeRequest.apply(this, requestArgs);
    });
};



exports.validateKeys = function() {
    //TODO
};

/**
 * Gets a new send request, to be signed later.
 * @param account
 * @param amount
 * @param dest
 * @param callback
 */
exports.newSend = function(account, amount, dest, callback) {
    exports.request('/v1/new/send', 'PUT', {
        amount: amount,
        account: account,
        dest: dest
    }, callback);
};

/**
 * Gets the cosigners' information involved in the send request.
 * @param sendRequestRef The send request CK_refnum (Get this through newSend).
 * @param callback
 */
exports.getCosigners = function(sendRequestRef, callback) {
    exports.request('/v1/co-sign/' + sendRequestRef, 'GET', {}, callback);
};

/**
 * Gets all the necessary information for a particular cosigner to sign.
 * @param sendRequestRef
 * @param cosignerRef
 * @param callback
 */
exports.getCosignRequirements = function(sendRequestRef, cosignerRef, callback) {
    exports.request('/v1/co-sign/' + sendRequestRef + '/' + cosignerRef, 'GET', {}, callback);
};

/**
 * Sign a proposed transaction.
 * @param sendRequestRef
 * @param cosignerRef
 * @param signatures
 * @param callback
 */
exports.sign = function(sendRequestRef, cosignerRef, signatures, callback) {
    exports.request('/v1/co-sign/' + sendRequestRef + '/' + cosignerRef + '/sign', 'PUT', {
        signatures: signatures
    }, callback);
};

exports.cancelSend = function (sendRequestRef, callback) {
    exports.request('/v1/update/' + sendRequestRef + '/cancel_send', 'PUT', {}, callback);
};