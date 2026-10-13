// node downloader.js <KEY_DEL_SEEDER>

const Hyperswarm = require('hyperswarm')
const Hypercore = require('hypercore')
const fs = require('fs')

const KEY = process.argv[2]
if (!KEY) {
  console.log('Uso: node downloader.js <KEY_DEL_SEEDER>')
  process.exit(1)
}

const PAUSA_MS = 300
const TIMEOUT_MS = 15000
const ts = () => new Date().toISOString()

async function main () {
  const core = new Hypercore('./downloader-storage', Buffer.from(KEY, 'hex'))
  await core.ready()

  const swarm = new Hyperswarm()
  swarm.on('connection', (conn) => {
    const id = conn.remotePublicKey.toString('hex').slice(0, 8)
    console.log(ts(), 'conectado a peer', id)
    conn.on('error', (e) => console.log(ts(), 'error', e.message))
    conn.on('close', () => console.log(ts(), 'peer desconectado', id))
    core.replicate(conn)
  })

  const done = core.findingPeers()
  swarm.join(core.discoveryKey, { server: false, client: true })
  swarm.flush().then(done)

  await core.update()
  console.log(ts(), 'bloques totales:', core.length)

  const out = fs.createWriteStream('recibido.txt')
  let recibidos = 0
  for (let i = 0; i < core.length; i++) {
    try {
      const block = await core.get(i, { timeout: TIMEOUT_MS })
      out.write(block)
      recibidos++
      console.log(ts(), `bloque ${i + 1}/${core.length}`)
    } catch (e) {
      console.log(ts(), `FALLO en bloque ${i + 1}/${core.length}:`, e.message)
      break
    }
    await new Promise((r) => setTimeout(r, PAUSA_MS))
  }
  out.end()

  if (recibidos === core.length) console.log(ts(), 'COMPLETO: recibido.txt')
  else console.log(ts(), `INCOMPLETO: ${recibidos}/${core.length} bloques`)
  await swarm.destroy()
  process.exit(0)
}

main().catch((e) => console.error(e))
