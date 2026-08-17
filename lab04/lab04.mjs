import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import WalletManagerBtc from '@tetherto/wdk-wallet-btc'
import * as bip39 from 'bip39'

const WALLETS_FILE = './wallets.json'
const EXPLORER_TX_URL = 'https://blockstream.info/testnet/tx/'

const btcConfig = {
  client: {
    type: 'electrum',
    clientConfig: { host: 'electrum.blockstream.info', port: 60001 }
  },
  network: 'testnet'
}

function loadWallets() {
  if (!existsSync(WALLETS_FILE)) {
    throw new Error('No existe wallets.json. Primero corre: node lab04.mjs init')
  }
  return JSON.parse(readFileSync(WALLETS_FILE, 'utf-8'))
}

// --- Generar billeteras ---
async function cmdInit() {
  const mnemonicA = bip39.generateMnemonic()
  const mnemonicB = bip39.generateMnemonic()

  const walletA = new WalletManagerBtc(mnemonicA, btcConfig)
  const walletB = new WalletManagerBtc(mnemonicB, btcConfig)

  const accountA = await walletA.getAccount(0)
  const accountB = await walletB.getAccount(0)

  const addressA = await accountA.getAddress()
  const addressB = await accountB.getAddress()

  writeFileSync(
    WALLETS_FILE,
    JSON.stringify(
      {
        A: { mnemonic: mnemonicA, address: addressA },
        B: { mnemonic: mnemonicB, address: addressB }
      },
      null,
      2
    )
  )

  console.log('Billetera A (propia) creada.')
  console.log('  Dirección A:', addressA)
  console.log('\nBilletera B (destino) creada.')
  console.log('  Dirección B:', addressB)

  walletA.dispose()
  walletB.dispose()
}

// --- Mostrar UTXOs y balance de cada billetera ---
async function cmdStatus() {
  const wallets = loadWallets()

  for (const [label, w] of Object.entries(wallets)) {
    const wallet = new WalletManagerBtc(w.mnemonic, btcConfig)
    const account = await wallet.getAccount(0)

    const balance = await account.getBalance()
    const transfers = await account.getTransfers({ direction: 'incoming', limit: 20 })

    console.log(`\n--- Billetera ${label} (${w.address}) ---`)
    console.log(`Balance: ${balance}`)
    console.log('UTXOs recibidos:')
    if (transfers.length === 0) {
      console.log('  (sin fondos o la transacción del faucet aún no confirma)')
    } else {
      for (const t of transfers) {
        const conf = t.height > 0 ? `confirmado (bloque ${t.height})` : 'sin confirmar'
        console.log(`  txid=${t.txid} vout=${t.vout} valor=${t.value} sats [${conf}]`)
      }
    }

    wallet.dispose()
  }
}

// --- Enviar de A a B ---
async function cmdSend(satoshisStr, feeRateStr) {
  const wallets = loadWallets()
  const satoshis = BigInt(satoshisStr)
  const feeRate = BigInt(feeRateStr || 2)

  const walletA = new WalletManagerBtc(wallets.A.mnemonic, btcConfig)
  const accountA = await walletA.getAccount(0)

  const balance = await accountA.getBalance()
  console.log(`Balance actual de A: ${balance}`)
  console.log(`Enviando ${satoshis} de A hacia B (${wallets.B.address}) a ${feeRate} sat/vB`)

  const result = await accountA.sendTransaction({
    to: wallets.B.address,
    value: satoshis,
    feeRate
  })

  console.log('\nTransacción enviada.')
  console.log('  Hash:', result.hash)
  console.log(`  Fee: ${result.fee}`)
  console.log('  Link:', EXPLORER_TX_URL + result.hash)

  walletA.dispose()
}

const [, , command, arg, arg2] = process.argv

try {
  switch (command) {
    case 'init':
      await cmdInit()
      break
    case 'status':
      await cmdStatus()
      break
    case 'send':
      await cmdSend(arg, arg2)
      break
    default:
      console.log('node lab04.mjs init                        # genera billeteras A y B')
      console.log('node lab04.mjs status                      # muestra UTXOs y balance')
      console.log('node lab04.mjs send <satoshis> [feeRate]   # envía de A a B')
  }
} catch (err) {
  console.error('Error:', err.message)
  process.exit(1)
} finally {
  process.exit(0)
}
