/**
 * sign-erc712.js
 * Demuestra firmado de datos tipificados ERC-712 con Viem
 * 
 * Viem es una biblioteca moderna, type-safe para Ethereum.
 * Superior a ethers.js por su claridad y rendimiento.
 */

const { privateKeyToAccount } = require('viem/accounts');
const { hashTypedData } = require('viem');

async function main() {
    console.log('=== Script 2: ERC-712 Datos Tipificados con Viem ===\n');

    // Paso 1: Recupera el wallet usando tu clave privada del Script 1
    // IMPORTANTE: Reemplaza esto con tu clave privada del Script 1
    const PRIVATE_KEY = '0xfa9b94a5d84bcc7f8e7e3ecc168b76aa01e63f464bfa7f93efbe90d58642eab7'; // REEMPLAZA CON TU CLAVE PRIVADA

    // Crear cuenta desde clave privada
    const account = privateKeyToAccount(PRIVATE_KEY);

    console.log(`✓ Wallet Viem recuperado`);
    console.log(`📍 Dirección: ${account.address}\n`);

    // Paso 2: Define el dominio EIP-712
    // El dominio identifica únicamente esta aplicación, cadena y versión
    const domain = {
    name: 'UFM Course',
    version: '1',
    chainId: 31337, // anvil usa chainId 31337
    // verifyingContract se agregará después cuando despleguemos el contrato
    };

    console.log('📋 Dominio EIP-712:');
    console.log(`   Nombre: ${domain.name}`);
    console.log(`   Versión: ${domain.version}`);
    console.log(`   Chain ID: ${domain.chainId}\n`);

    // Paso 3: Define la estructura de datos tipificados
    // Esto define exactamente qué campos estamos firmando
    const types = {
    Enrollment: [
        { name: 'student', type: 'address' },
        { name: 'course', type: 'string' }
    ]
    };

    console.log('📝 Tipo Enrollment:');
    console.log(`   - student (address)`);
    console.log(`   - course (string)\n`);

    // Paso 4: Crea el mensaje de inscripción
    const message = {
    student: account.address,
    course: 'SE-4XX'
    };

    console.log('✉️  Mensaje de Inscripción:');
    console.log(`   student: ${message.student}`);
    console.log(`   course: ${message.course}\n`);

    // Paso 5: Calcula el hash EIP-712 usando Viem
    // Este es el hash que será firmado
    const eip712Hash = hashTypedData({
    account,
    domain,
    types,
    primaryType: 'Enrollment',
    message
    });

    console.log('🔐 Hash EIP-712 (para firmado):');
    console.log(`${eip712Hash}\n`);

    // Paso 6: Firma los datos tipificados usando Viem
    // account.signTypedData es el método de Viem para firmar ERC-712
    const signature = await account.signTypedData({
    domain,
    types,
    primaryType: 'Enrollment',
    message
    });

    console.log('✍️  Firma ERC-712:');
    console.log(`${signature}\n`);

    // Paso 7: Decodifica la firma en componentes r, s, v
    // Esto es necesario para ecrecover en Solidity
    const sig = signature.slice(2); // Remove '0x'
    const r = '0x' + sig.slice(0, 64);
    const s = '0x' + sig.slice(64, 128);
    const v = parseInt(sig.slice(128, 130), 16);

    console.log('🔧 Componentes de la firma (para ecrecover):');
    console.log(`   r: ${r}`);
    console.log(`   s: ${s}`);
    console.log(`   v: ${v}\n`);

    console.log('📌 SALIDA IMPORTANTE:');
    console.log(`   - Dirección del estudiante: ${account.address}`);
    console.log(`   - Hash EIP-712: ${eip712Hash}`);
    console.log(`   - Firma completa: ${signature}`);
    console.log(`   - Componente r: ${r}`);
    console.log(`   - Componente s: ${s}`);
    console.log(`   - Componente v: ${v}\n`);

    console.log('=== Script 2 Completado ===');
}

main();