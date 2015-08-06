"C:\Program Files (x86)\JetBrains\WebStorm 10.0.3\bin\runnerw.exe" "C:\Program Files\nodejs\node.exe" --debug-brk=49373 --nolazy index.js
Debugger listening on port 49373
<Address: 1FpHntvFVKNYSMSHPv25hxbKwLvDq19CHo, type: pubkeyhash, network: livenet>
18aWaxB9h3JQ4pPRtW1wSAknRMNNPsFmdD
L1tmyUBkTD1QsUJag3yAmRT7X3LLReQoMn5oMEmrK6d2nyqHEk3N
public key:027dbc8993286327139d9f17cbc2b90a59c63f427da5e19dde63a2c084bf2793d1
public key:02cfd3d9bda555a41cd89b88a98d1dbe2c42274239b8de2a8bf9eb85cb4423fe58
public key:02a1b222f0d1fef933cf13ef2f17feb715603bf3ac6202d6fc6031f45d17d5d6d7
    [ <Address: 12MdK9vE8nkEjj5UEz2kyHK9p9JqqMVS4i, type: pubkeyhash, network: livenet>,
<Address: 1KavCAxKWgQKbfWGgNhNyB8BZzoWTZA5Xh, type: pubkeyhash, network: livenet>,
<Address: 18aWaxB9h3JQ4pPRtW1wSAknRMNNPsFmdD, type: pubkeyhash, network: livenet> ]
??var a= 1;
?undefined
??require('bitcore/lib/address')
?function Address(data, network, type) {
??var s = require('bitcore/lib/transaction/sighash')
?undefined
??s
?Object
??s.sighash
?function sighash(transaction, sighashType, inputNumber, subscript) {
    ??var e = require('bitcore/lib/crypto/ecdsa')
?undefined
??e
?function ECDSA(obj) {
        ??e
?function ECDSA(obj) {
            ??hdkey.privateKey
?PrivateKey
??hdkey.privateKey.toString()
?8b723f4570765a197ec212c956135f9cbf951e5f026552b962ea5deed884cdfa
??hdkey.privateKey.toBase58()
                TypeError: undefined is not a function
??hdkey.privateKey.toBase58Check()
                TypeError: undefined is not a function
??e.sign('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04')
                TypeError: Cannot read property 'bn' of undefined
??var sig = e.sign('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04', hdkey.privateKey, 'little').set({nhashtype: 1})
                bitcore.ErrorInvalidState: Invalid state: Error: hashbuf must be a 32 byte buffer
??new Buffer('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04')
?Buffer
??var sig = e.sign(new Buffer('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04'), hdkey.privateKey, 'little').set({nhashtype: 1})
                bitcore.ErrorInvalidState: Invalid state: Error: hashbuf must be a 32 byte buffer
??new Buffer('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04', 'hex')
?Buffer
??var b = new Buffer('375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04', 'hex')
?undefined
??b
?Buffer
??b.toString()
?7P0??''???2.?<??-??&?}??KUnL
        ??b.toHex()
            TypeError: undefined is not a function
??var sig = e.sign(b, hdkey.privateKey, 'little').set({nhashtype: 1})
?undefined
??sig
?Signature
??sig.toDER()
?Buffer
??sig.toDER().toHex()
            TypeError: undefined is not a function
??sig.toDER().toString()
?0D ,??v???,`P???>%?]??????;?e? #T??? ?????,?;;??5?0d??
??sig.toDER()
?Buffer
??sig.toString()
?304402202c848476cdd2f62c6050e4fbcea73e25eb075dcc83c29efbaef6ae3bf5651fb3022023541213b518b3f90085ea1aeed0abc1022ced3b3be2048135ba306408cfd199
??sig.toString('hex')
?304402202c848476cdd2f62c6050e4fbcea73e25eb075dcc83c29efbaef6ae3bf5651fb3022023541213b518b3f90085ea1aeed0abc1022ced3b3be2048135ba306408cfd199
??var hashTypeBuffer = new Buffer(1);
            hashTypeBuffer.writeUInt8(1, 0);
?1
??var b2 = Buffer.concat([sig.toDER(), hashTypeBuffer])
?undefined
??b2
?Buffer
??b2.toString('hex')
?304402202c848476cdd2f62c6050e4fbcea73e25eb075dcc83c29efbaef6ae3bf5651fb3022023541213b518b3f90085ea1aeed0abc1022ced3b3be2048135ba306408cfd19901
??b.toString('hex')
?375030f6a5271727f4c9cebc322e1cf73c979f2dfda226d57dbfbc4b556e4c04
??hdkey.privateKey
?PrivateKey
??var p = hdkey.privateKey
?undefined
??p
?PrivateKey
??p.toWIF()
?L1tmyUBkTD1QsUJag3yAmRT7X3LLReQoMn5oMEmrK6d2nyqHEk3N
