const firestoreService = require('firestore-export-import')
const firebaseConfig = require('./config.js')
const serviceAccount = require('./serviceAccount.json')

const jsonToFirestore = async () => {
  try {
    console.log('Init firebase')
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL)
    console.log('Firebase init\'d')
    await firestoreService.restore('../sessions.json')
    console.log('Upload Success')
  }
  catch (error) {
    console.log(error)
  }
}

jsonToFirestore()