// node seeder.js archivo.txt

const Hyperswarm = require('hyperswarm')
const Hypercore = require('hypercore')
const fs = require('fs')

const FILE = process.argv[2] || 'archivo.txt'
const CHUNK = 16 * 1024
const ts = () => new Date().toISOString()

async function main () {
  const core = new Hypercore('./seeder-storage')
  await core.ready()

  if (core.length === 0) {
    const data = fs.readFileSync(FILE)
    console.log(ts(), 'archivo:', FILE, 'tamaño:', data.length, 'bytes')
    for (let i = 0; i < data.length; i += CHUNK) {
      await core.append(data.subarray(i, i + CHUNK))
    }
  }
  console.log(ts(), 'bloques en el core:', core.length)
  console.log('KEY (pásasela al downloader):', core.key.toString('hex'))

  const swarm = new Hyperswarm()
  swarm.on('connection', (conn) => {
    const id = conn.remotePublicKey.toString('hex').slice(0, 8)
    console.log(ts(), 'downloader conectado', id)
    conn.on('error', (e) => console.log(ts(), 'error', e.message))
    conn.on('close', () => console.log(ts(), 'downloader desconectado', id))
    core.replicate(conn)
  })

  swarm.join(core.discoveryKey, { server: true, client: false })
  await swarm.flush()
  console.log(ts(), 'seeding... (Ctrl+C para detener)')
}

main().catch((e) => console.error(e))
