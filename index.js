var coinkite = require('./coinkite');
var bitcore = require('bitcore');

var keys = [{priv: 'xpub661MyMwAqRbcGWgcbzgTxQXHz71cstnhGS54Ho6fRy39EaJFYbQBhUCXJm5wsiZtzAhajJScjJEFaiTSbfcAhbGbC8fKDRwyQz6utFup1UH'},
    {
    priv: 'xprv9s21ZrQH143K2vQPnZbpt5rdZoVUNsGSkvA5Usxmtf1sKu1hthgvc7U49DeixZHNAwPnQWq9hyCB37SdTddVYwyiEt7m6sJcrLMQp75QcBu',
    pub: 'xpub661MyMwAqRbcFQUrtb8qFDoN7qKxnKzJ895gHGNPSzYrChLrSF1B9unXzWTHXYTcMTZrjsijWnbEJG3QjZ4Qdy9mdc56HQawfqFcVP8VxpW'


},
    {
        priv: 'xprv9s21ZrQH143K27KwUhjnfmJH4jFZzCEqu1CkJzaa1FM9JexvBrmCxJ87p5VPqY8Uh7495zwyi62HSVCAwDMsL1F8qkFroDPQdiQ6iWdfadL',
        pub: 'xpub661MyMwAqRbcEbQQajGo2uF1cm64PexhGE8M7NzBZat8BTJ4jQ5TW6SbfLfvfXvtViGNdJsrRe3Wkv4Y2ZpnVVPuTDEa3gek96dU5LunXKv'
    }];
var p1 = new bitcore.HDPublicKey('xpub661MyMwAqRbcGWgcbzgTxQXHz71cstnhGS54Ho6fRy39EaJFYbQBhUCXJm5wsiZtzAhajJScjJEFaiTSbfcAhbGbC8fKDRwyQz6utFup1UH');
var p1a = p1.derive('m/0');
var p2 = new bitcore.HDPublicKey('xpub661MyMwAqRbcFQUrtb8qFDoN7qKxnKzJ895gHGNPSzYrChLrSF1B9unXzWTHXYTcMTZrjsijWnbEJG3QjZ4Qdy9mdc56HQawfqFcVP8VxpW');
var p2a = p2.derive('m/0');
var p3 = new bitcore.HDPublicKey('xpub661MyMwAqRbcEbQQajGo2uF1cm64PexhGE8M7NzBZat8BTJ4jQ5TW6SbfLfvfXvtViGNdJsrRe3Wkv4Y2ZpnVVPuTDEa3gek96dU5LunXKv');
var p3a = p3.derive('m/0');
//console.log(JSON.stringify(p1a));


var p2shAddress = new bitcore.Address([p1a.publicKey,
    p2a.publicKey, p3a.publicKey], 2);
console.log(p2shAddress.toString());
function callbackGenerico(error, response, body) {
    if (!error && response.statusCode == 200) {
        //var info = JSON.parse(body);
        try {
            console.log(JSON.stringify(body));
        }
        catch(e) {
            console.log(body);
        }
    } else {
        console.log(body);
        console.log(error);
        console.log(response.statusCode);
    }
}


//coinkite.request('/v1/co-sign/9B41B8A6FE-4538BE/13B8AE9034-1CC9D9/sign', 'PUT', {},callbackGenerico);

//process.exit();
/*
    coinkite.request('/v1/new/send', 'PUT', {
        amount: '0.0003',
        account: 'coinfabrik',
        dest: '1JPzktin88qmzFJDYEDCDiWFDrBt1vuyi8'
    },callbackGenerico);
*/