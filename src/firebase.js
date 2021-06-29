import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC7QZCVKQCiVMYuW5a0xuDVt7Rxsy8Arw8",
  authDomain: "smart-monteiro.firebaseapp.com",
  databaseURL: "https://smart-monteiro.firebaseio.com",
  projectId: "smart-monteiro",
  storageBucket: "smart-monteiro.appspot.com",
  messagingSenderId: "112036165256",
  appId: "1:112036165256:web:df85be51ae25b2f93bd13d",
  measurementId: "G-NK3F9GNRNQ"
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storageRef = firebase.storage().ref()

const usersCollection = db.collection('users')
const ridesCollection = db.collection('rides')
const parkedsCollection = db.collection('parkeds')
const organicAdsCollection = db.collection('organicAds')
const garbageAdsCollection = db.collection('garbageAds')

export {
  db,
  auth,
  storageRef,
  usersCollection,
  ridesCollection,
  parkedsCollection,
  organicAdsCollection,
  garbageAdsCollection
}
