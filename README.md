# RTCEngine Firebase Signaler

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Firebase Cloud Firestore를 이용한 시그널러입니다.

[라이브 데모](https://stackblitz.com/edit/js-5nfron?file=index.js)

__Demo Only!__ 실제 앱에 사용하지 마세요. 데모용으로 제작되었습니다.

# 예시 코드
아래 코드는 작동하지 않습니다.
실제로 작동하는 코드를 보려면 위 라이브 데모 링크를 따라가세요.
```javascript
import RTCEngine from 'rtc-engine'
import Signaler from 'rtc-engine-signaler-firebase'

const signaler = new Signaler({
  /* firebase sdk의 initializeApp에 전달할 옵션 오브젝트 */
})
const engine = new RTCEngine(signaler, { autoConnect: false })

// 피어 A
const roomID = await signaler.createConnection()
console.log('다음 room ID를 붇여 넣으세요', roomID)
await engine.connect()
const channel = await engine.channel('message')
channel.send('hello RTCEngine!')

// 피어 B
const roomID = prompt('room ID?')
await signaler.connect(roomID)
await engine.connect()
const channel = await engine.channel('message')
channel.on('message', msg => console.log(msg)) // hello RTCEngine!
```

# 설치
`rtc-engine` 버전 0.5 이상이 필요합니다.
```
npm i rtc-engine rtc-engine-signaler-firebase
```

# API
## exports
```javascript
import FirebaseSignaler from 'rtc-engine-signaler-firebase'
```
 - `default(FirebaseSignaler)`: 시그널러 클래스

## FirebaseSignaler

### constructor (firebaseConfig, emulator)
넘겨받은 설정으로 firebase app을 시작합니다. `emulator` 옵션이 `true`면 localhost:8080에 있는 firestore emulator와 연결합니다.

### createConnection ()
firestore에 `rooms/{id}`형식의 문서를 만들고 id를 돌려줍니다. id는 firestore에서 자동으로 생성합니다. 또 `listenMsg()` 메소드를 호출합니다.

### connect (roomId)
firestore에 `rooms/{roomId}`가 있나 확인하고, 있으면 `listenMsg()` 메소드를 호출합니다.

### listenMsg ()
room 문서의 하위 컬렉션인 `messages`에 시그널링 메시지를 담은 새로운 문서가 생기면 `message` 이벤트를 발생시킵니다.

### get ready ()
`Promise.resolve()`를 돌려줍니다.