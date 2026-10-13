const Hyperswarm = require('hyperswarm')
const crypto = require('crypto')

const CARNET = '20230050_1'
const topic = crypto.createHash('sha256').update('cs031-s19-20261012').digest()

const swarm = new Hyperswarm()

swarm.on('connection', (conn) => {
  const peerId = conn.remotePublicKey.toString('hex').slice(0, 8)
  console.log(new Date().toISOString(), 'connected', peerId)
  console.log(new Date().toISOString(), 'remote:', conn.rawStream.remoteHost, conn.rawStream.remotePort)
  conn.write(`ping desde ${CARNET}`)
  conn.on('data', (d) => console.log(new Date().toISOString(), peerId, d.toString()))
  conn.on('error', (e) => console.log('error', e.message))
})

swarm.join(topic, { server: true, client: true })
console.log('topic', topic.toString('hex').slice(0, 8))