var coinkite = require('./coinkite');

coinkite.request('/v1/my/self', 'GET', {}, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(body);
    } else {
        console.log(error);
        console.log(response.statusCode);
    }
});
