import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, setDoc, serverTimestamp, doc, connectFirestoreEmulator, onSnapshot, getDoc } from 'firebase/firestore'
import Mitt from './Mitt.js'
import { ObservableEntry } from 'rtc-engine/util'

export default class FirebaseSignaler extends Mitt {
  constructor (firebaseConfig, { emulator = false, id = undefined, port }) {
    super()

    this.app = initializeApp(firebaseConfig)
    if (emulator) {
      this.db = getFirestore()
      connectFirestoreEmulator(this.db, 'localhost', port)
    } else {
      this.db = getFirestore(this.app)
    }
    this.messagesDocRef = undefined
    this.stopListening = () => {}
    this.ready = new ObservableEntry(false)
    this.id = id
  }

  async start () {
    if (!this.id) return

    // id가 설정되어 있으면 방 만들기
    this.messagesDocRef = doc(collection(this.db, 'rooms'), this.id)
    await setDoc(this.messagesDocRef, {
      createdAt: serverTimestamp()
    })

    // 상대방이 보내는 메시지 받기
    this.ready.set(true)
    this.listenMsg()
  }

  send (data) {
    const msg = JSON.stringify(data)
    // message 컬렉션에 메시지 작성
    addDoc(collection(this.messagesDocRef, 'messages'), { msg })
  }

  async createConnection () {
    // room에 해당하는 doc를 생성하고 레퍼런스를 저장
    this.messagesDocRef = await addDoc(collection(this.db, 'rooms'), {
      createdAt: serverTimestamp()
    })
    this.listenMsg()
    this.ready.set(true)

    return this.messagesDocRef.id
  }

  async connect (roomId) {
    // room에 해당하는 doc의 레퍼런스를 만들고 존재하나 확인
    const ref = doc(this.db, 'rooms', roomId)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) {
      throw new Error('invalid room id')
    }

    this.messagesDocRef = ref
    this.ready.set(true)
    this.listenMsg()
  }

  listenMsg () {
    this.stopListening = onSnapshot(collection(this.messagesDocRef, 'messages'), querySnapshot => {
      for (const change of querySnapshot.docChanges()) {
        // remote에서 오는 added 타입만 잡기
        if (change.type !== 'added' || change.doc.metadata.hasPendingWrites) continue

        const { msg } = change.doc.data()
        this.emit('message', JSON.parse(msg))
      }
    })
  }

  close () {
    this.ready.set(false)
    this.stopListening()
  }
}
