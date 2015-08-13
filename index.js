var coinkite = require('./coinkite-helper'),
    wallet = require('./wallet');

var keysTestnet = [
    {
        //Cosigner CK_refnum: 1EC3A1CFFE-2DAE34
        //private key in Coinkite's possesion
        pub: 'tpubD6NzVbkrYhZ4XToJPakbKtqneuM1XTD6YWpjPfZvJS8GD4RZBn2D2PZ87VSPD82W4mH7CD1fuyG3QWUkBFomHoaoYjc85iv1UADrumgqaM9'
    },
    {
        //Cosigner CK_refnum: 1B590633FF-3B60BC
        priv: 'tprv8ZgxMBicQKsPeDqD9DMaymA8uyHTDzuiQU23mZzy8NnV25jncw9dp3DTkzD5yzPMkKyZfynGro9rPFs5sGEfV3wndmpvSd7MjDXvhBzzxzp',
        pub:'tpubD6NzVbkrYhZ4Xgs12s2BPApFUzoPPL6cymcq463GYeasrZzZFKyDzXqKw8t8aXHpFd1AVV7sznkKNbFcDm66vvhukqScJkaRuKnANz6KXnh'
}];

wallet.get('coinfabrik', keysTestnet).then(function(wallet){
  return wallet.send('2MuwbT2BkNxF9HDjypBgzfMGtovLqAcbs89', 0.0003);
}).then(function() {
    console.log('Funds sent!');
});
