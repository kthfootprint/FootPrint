import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import config from './config.js'

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // Auth
  // ------------------------------------------------------------
  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      var newUser = this.db.collection('users').doc(authUser.user.uid);

      newUser.set({
        email: authUser.user.email
      })
    })

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  // Get
  // ------------------------------------------------------------
  

  // Set
  // ------------------------------------------------------------

};

export default Firebase;