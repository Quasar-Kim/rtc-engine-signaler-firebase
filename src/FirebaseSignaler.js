import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, doc, connectFirestoreEmulator, onSnapshot, getDoc } from 'firebase/firestore'
import Mitt from './Mitt.js'

export default class FirebaseSignaler extends Mitt {
  constructor (firebaseConfig, emulator = false) {
    super()

    this.app = initializeApp(firebaseConfig)
    if (emulator) {
      this.db = getFirestore()
      connectFirestoreEmulator(this.db, 'localhost', 8080)
    } else {
      this.db = getFirestore(this.app)
    }
    this.messagesDocRef = undefined
    this.stopListening = () => {}
  }

  async createConnection () {
    // room에 해당하는 doc를 생성하고 레퍼런스를 저장
    this.messagesDocRef = await addDoc(collection(this.db, 'rooms'), {
      createdAt: serverTimestamp()
    })
    this.listenMsg()

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
    this.listenMsg()
  }

  get ready () {
    return Promise.resolve()
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
    console.log('started listening')
  }

  send (data) {
    const msg = JSON.stringify(data)
    // message 컬렉션에 메시지 작성
    addDoc(collection(this.messagesDocRef, 'messages'), { msg })
  }

  close () {
    this.stopListening()
  }
}
