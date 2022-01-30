import FirebaseSignaler from '../src/FirebaseSignaler.js'
// import RTCEngine from 'rtc-engine'
import RTCEngine from 'https://jspm.dev/rtc-engine'

async function main () {
  const signaler = new FirebaseSignaler({
    apiKey: 'api-key',
    authDomain: 'rtc-engine-demo.firebaseapp.com',
    projectId: 'rtc-engine-demo',
    storageBucket: 'rtc-engine-demo.appspot.com',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId'
  }, true)
  const engine = new RTCEngine(signaler, { autoConnect: false })

  document.querySelector('#createRoom').addEventListener('click', async () => {
    const roomId = await signaler.createConnection()
    console.log('room created', roomId)
    engine.connect()
  })

  document.querySelector('#connect').addEventListener('click', async () => {
    const roomId = document.querySelector('#roomId').value
    await signaler.connect(roomId)
    engine.connect()
  })

  document.querySelector('#sendMsg').addEventListener('click', () => {
    const msg = document.querySelector('#msg').value
    signaler.send(msg)
  })

  signaler.on('message', msg => {
    console.log('received', msg)
  })
}

main()
