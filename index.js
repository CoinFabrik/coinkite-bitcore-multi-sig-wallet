// Replace these values.
API_KEY = 'qwer';
API_SECRET = 'asdf';

var request = require('request');

function sign(endpoint, force_ts)
{
    var ts = force_ts || (new Date()).toISOString();
    var data = endpoint + '|' + ts;

    var crypto = require('crypto');
    var hm = crypto.createHmac('sha256', API_SECRET).update(data).digest('hex');

    return [hm, ts]
}

console.log(sign('/example/endpoint', '2014-06-03T17:48:47.774453'));

var endpoint = '/v1/my/self';

CK_API = require('coinkite-javascript/coinkite-api.js');
var authHeaders = CK_API.auth_headers(API_KEY, API_SECRET, endpoint);
console.log("Example:\n", authHeaders);


var options = {
    url: 'https://api.coinkite.com/' + endpoint,
    headers: {
        'User-Agent': 'request',
        'Host': 'api.coinkite.com',
        'X-CK-Key': authHeaders['X-CK-Key'],
        'X-CK-Sign': authHeaders['X-CK-Sign'],
        'X-CK-Timestamp': authHeaders['X-CK-Timestamp']
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(body);
    } else {
        console.log(error);
        console.log(response.statusCode);
    }

}

request(options, callback);
