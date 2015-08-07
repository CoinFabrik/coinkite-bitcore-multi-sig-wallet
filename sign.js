var ecdsa = require('bitcore/lib/crypto/ecdsa');

/**
 * Adds "01" at the end.
 * @param signature
 */
function addSighashAll(signature) {
    var hashTypeBuffer = new Buffer(1);
    hashTypeBuffer.writeUInt8(1, 0);
    return Buffer.concat([signature.toDER(), hashTypeBuffer]);
}

exports.getSignature = function(privateKey, sighash) {
    var b = new Buffer(sighash, 'hex');
    var sig = ecdsa.sign(b, privateKey).set({nhashtype: 1});
    return addSighashAll(sig).toString('hex');
};