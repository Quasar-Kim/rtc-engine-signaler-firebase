import FirebaseSignaler from '../src/FirebaseSignaler.js'
import RTCEngine from 'rtc-engine'

async function main () {
  const signaler = new FirebaseSignaler({
    apiKey: 'api-key',
    authDomain: 'rtc-engine-demo.firebaseapp.com',
    projectId: 'rtc-engine-demo',
    storageBucket: 'rtc-engine-demo.appspot.com',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId'
  }, true)

  document.querySelector('#createRoom').addEventListener('click', async () => {
    const roomId = await signaler.createConnection()
    console.log('room created', roomId)
  })

  document.querySelector('#connect').addEventListener('click', async () => {
    const roomId = document.querySelector('#roomId').value
    await signaler.connect(roomId)
  })

  const engine = new RTCEngine(signaler)
  const channel = await engine.channel('chat')

  document.querySelector('#sendMsg').addEventListener('click', () => {
    const msg = document.querySelector('#msg').value
    channel.send(msg)
  })
}

main()
