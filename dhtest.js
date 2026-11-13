crypto = require("crypto");

/*
dh = crypto.createDiffieHellman('modp5');
dh.generateKeys();

console.log(dh.getPrime());
console.log(dh.getGenerator());
console.log(dh.getPublicKey());
console.log(dh.getPrivateKey());
*/

var jose = require('node-jose');

//jose.JWK.createKey()