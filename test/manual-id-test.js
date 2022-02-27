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
  }, { emulator: true, port: 8080, id: 'something-new' })
  const engine = new RTCEngine(signaler)

  const channel = await engine.channel('chat')
  channel.on('message', msg => console.log(msg))

  document.querySelector('#sendMsg').addEventListener('click', () => {
    const msg = document.querySelector('#msg').value
    channel.send(msg)
  })
}

main()
