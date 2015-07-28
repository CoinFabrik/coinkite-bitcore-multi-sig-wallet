var request = require('request'),
    CK_API = require('coinkite-javascript/coinkite-api.js'),
    keys = require('./api-keys');

request.debug = true;
exports.request = function(endPoint, method, params, cb) {
    var authHeaders = CK_API.auth_headers(keys.API_KEY, keys.API_SECRET, endPoint);
    request({
        url: 'https://api.coinkite.com' + endPoint,
        headers: {
            'User-Agent': 'request',
            'Host': 'api.coinkite.com',
            'X-CK-Key': authHeaders['X-CK-Key'],
            'X-CK-Sign': authHeaders['X-CK-Sign'],
            'X-CK-Timestamp': authHeaders['X-CK-Timestamp']
        },
        method: method
    }, cb);
};