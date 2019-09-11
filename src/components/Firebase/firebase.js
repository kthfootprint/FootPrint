import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import config from "./config.js";

import * as ROLES from '../../constants/roles';

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  // Auth
  // ------------------------------------------------------------
  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password).then(authUser => {
      var newUser = this.db.collection("users").doc(authUser.user.uid);

      newUser.set({
        email,
        roles: {}
      });
    });

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider)
      .then(socialAuthUser => {
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          var newUser = this.db.collection('users').doc(socialAuthUser.user.uid);

          newUser.set({
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {}
          })
        }
      return socialAuthUser;
    })

  signOut = () => this.auth.signOut();

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  updatePassword = password =>
    this.auth.currentUser.updatePassword(password);

  authUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.getProfile(authUser.uid)
          .then(dbUser => {
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            if (dbUser.email) {
              dbUser.dbEmail = dbUser.email
              delete dbUser.email
            }

            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // Get
  // ------------------------------------------------------------
  getProfile = (userId) => this.db.collection('users').doc(userId)
    .get()
    .then(snapshot => {
      return snapshot.data();
    });

  getMe = async () => {
    if(this.auth.currentUser) 
      this.getProfile(this.auth.currentUser.uid)
  }

  // Set
  // ------------------------------------------------------------
  setMyUserData = async (age, gender, roles) => {
    var userRef = this.db.collection("users").doc(this.auth.currentUser.uid);
    var dbRoles = {};

    roles.forEach(role => {
      dbRoles[role] = role;
    });

    userRef.set({ 
      age, 
      gender,
      roles: dbRoles
    }, { merge: true })
  }

  setSelectedRoute = async (orig, dest, routeList, route) => {
    var routeListNoUndefined = this.undefinedToNullInObject(routeList)
    var routeNoUndefined = this.undefinedToNullInObject(route)

    if (!this.auth.currentUser.uid) {
      this.db.collection("chosenRoutes").doc()
        .set({
          author: this.auth.currentUser.uid,
          orig,
          dest,
          selectedRoute: routeNoUndefined,
          routeOptions: routeListNoUndefined
        })
    }
    else 
      throw 'No signed in user, cannot save data'
  }

  // Helpers
  // ------------------------------------------------------------
  birthdateToAge = (birthdate) => { 
    var diff_ms = Date.now() - birthdate.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  undefinedToNullInObject = (obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') this.undefinedToNullInObject(obj[key]);
      else if (obj[key] === undefined) obj[key] = null;
    });
    return obj;
  };
}

export default Firebase;
