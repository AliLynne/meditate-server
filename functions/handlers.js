const admin = require('firebase-admin')
const firebase = require('firebase')
require('firebase/auth')

// const serviceAccount = require('./serviceAccount.json')

// const credentials = {
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://meditate-46519.firebaseio.com"
// }

admin.initializeApp()


const db = admin.firestore()

const config = require('./config')

firebase.initializeApp(config)

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err)
      return res.status(403).json({ general: 'Wrong credentials, please try again' })
    })
}

exports.getSessions = (req, res) => {
  db
    .collection('sessions')
    .orderBy('startedAt', 'desc')
    .limit(30)
    .get()
    .then(data => {
      let sessions = []
      data.forEach(doc => {
        sessions.push({
          sessionId: doc.id,
          date: doc.data().createdAt,
          startedAt: doc.data().startedAt,
          duration: doc.data().duration,
          guided: doc.data().guided
        })
      })
      return res.json(sessions)
    })
    .catch(err => console.error(err))
}

exports.newSession = (req, res) => {
  const newSession = {
    createdAt: new Date().toISOString(),
    startedAt: req.body.startedAt,
    duration: req.body.duration,
    guided: req.body.guided
  }

  db
    .collection('sessions')
    .add(newSession)
    .then(ref => {
      return res.json({ message: `Sucessfully saved ${ref.id}` })
    })
    .catch(err => {
      return res.json({ error: err.code })
    })
}