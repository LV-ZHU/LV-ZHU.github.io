import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_CONFIG } from './config'

const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
export const auth = getAuth(app)
export const db = getFirestore(app)
