const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

// const serviceAccount = require('../meditate-46519-firebase-adminsdk-cva04-617ea580d8.json')

// const credentials = {
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://meditate-46519.firebaseio.com"
// }

admin.initializeApp()

const db = admin.firestore()

app.get('/getSessions', (req, res) => {
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
  })

app.post('/newSession', (req, res) => {
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
      return res.json({ message: `Sucessfully saved ${ref.id}`})
    })
    .catch(err => {
      return res.json({ error: err.code })
    })
})

exports.app = functions.https.onRequest(app)