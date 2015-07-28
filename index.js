// Replace these values.
API_KEY = 'this-is-my-key'
API_SECRET = 'this-is-my-secret'

function sign(endpoint, force_ts)
{
    var ts = force_ts || (new Date()).toISOString();
    var data = endpoint + '|' + ts;

    var crypto = require('crypto');
    var hm = crypto.createHmac('sha256', API_SECRET).update(data).digest('hex')

    return [hm, ts]
}

console.log(sign('/example/endpoint', '2014-06-03T17:48:47.774453'))