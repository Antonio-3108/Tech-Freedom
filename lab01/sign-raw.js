/**
 * sign-raw.js
 * Demuestra firmas ECDSA secp256k1 brutas con Viem
 */

const { privateKeyToAccount, generatePrivateKey } = require('viem/accounts');
// const { Wallet } = require('@wdk/wallet');  <-- Este paquete no existe???
const crypto = require('crypto');

console.log('=== Script 1: Firmas ECDSA Brutas con Viem ===\n');

// Paso 1: Genera un par de claves EC secp256k1 (Node.js crypto)
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

console.log('✓ Par de claves secp256k1 generado\n');

// Paso 2: Firma el mensaje "Hello UFM" usando Node.js crypto
const message = 'Hello UFM';
const signer = crypto.createSign('SHA256');
signer.update(message);
const signatureHex = signer.sign(privateKey, 'hex');

console.log(`📝 Mensaje: "${message}"`);
console.log(`📄 Firma (hexadecimal):\n${signatureHex}\n`);

// Paso 3: Verifica la firma válida
const verifier = crypto.createVerify('SHA256');
verifier.update(message);
const isValid = verifier.verify(publicKey, Buffer.from(signatureHex, 'hex'));
console.log(`✓ Firma válida verificada: ${isValid}\n`);

// Paso 4: Corrompe un byte y verifica que falla
const corruptedSig = signatureHex.substring(0, 2) +
  (parseInt(signatureHex.substring(2, 4), 16) ^ 0xFF).toString(16).padStart(2, '0') +
  signatureHex.substring(4);

const verifier2 = crypto.createVerify('SHA256');
verifier2.update(message);
const isValidCorrupted = verifier2.verify(publicKey, Buffer.from(corruptedSig, 'hex'));

console.log(`🔴 Firma corrupta verificada: ${isValidCorrupted}`);
console.log('❌ Firma inválida\n');

// Paso 5: Genera un wallet Ethereum (estoy usando Viem envez de @wdk/wallet)
const walletPrivateKey = generatePrivateKey();
const account = privateKeyToAccount(walletPrivateKey);
console.log(`✓ Wallet generado con Viem`);
console.log(`📍 Dirección Ethereum: ${account.address}\n`);
console.log(`🔐 Clave privada (GUARDAR PARA SCRIPT 2):`);
console.log(`${walletPrivateKey}\n`);

console.log('=== Script 1 Completado ===');

// Clave privada (GUARDAR PARA SCRIPT 2):
// 0x53a8dd9ec34c3a06e8c46d0cca7ef65311df933467afae421766eb8cdca270c2