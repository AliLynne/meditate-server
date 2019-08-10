const functions = require('firebase-functions')
const app = require('express')()

const cors = require('cors')
app.use(cors())





const { login, getSessions, newSession } = require('./handlers')

app.get('/getSessions', getSessions)

app.post('/newSession', newSession)

app.post('/login', login)

exports.app = functions.https.onRequest(app)