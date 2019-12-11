import app from "firebase/app";
import { isMobile } from "react-device-detect";
import "firebase/auth";
import "firebase/firestore";

import config from "./config.js";

//import * as ROLES from "../../constants/roles";

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.facebookProvider = new app.auth.FacebookAuthProvider();

    this.orig = null;
    this.dest = null;
    this.routeList = null;
    this.selectedIndex = null;
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

  signInWithFacebook = () => {
    if (isMobile) {
      return this.auth
        .signInWithRedirect(this.facebookProvider)
        .then(socialAuthUser => {
          if (socialAuthUser.additionalUserInfo.isNewUser) {
            var newUser = this.db
              .collection("users")
              .doc(socialAuthUser.user.uid);

            newUser.set({
              email: socialAuthUser.additionalUserInfo.profile.email,
              roles: {}
            });
          }

          localStorage.removeItem("fbOathExpires");
          return socialAuthUser;
        });
    } else {
      return this.auth
        .signInWithPopup(this.facebookProvider)
        .then(socialAuthUser => {
          if (socialAuthUser.additionalUserInfo.isNewUser) {
            var newUser = this.db
              .collection("users")
              .doc(socialAuthUser.user.uid);

            newUser.set({
              email: socialAuthUser.additionalUserInfo.profile.email,
              roles: {}
            });
          }

          localStorage.removeItem("fbOathExpires");
          return socialAuthUser;
        });
    }
  };

  signOut = () => this.auth.signOut();

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  updatePassword = password => this.auth.currentUser.updatePassword(password);

  authUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.getProfile(authUser.uid).then(dbUser => {
          if (dbUser && !dbUser.roles) {
            dbUser.roles = {};
          }

          if (dbUser && dbUser.email) {
            dbUser.dbEmail = dbUser.email;
            delete dbUser.email;
          }

          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            ...dbUser
          };

          next(authUser);
        });
      } else {
        fallback();
      }
    });

  // Get
  // ------------------------------------------------------------
  getProfile = userId =>
    this.db
      .collection("users")
      .doc(userId)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });

  getMe = async () => {
    if (this.auth.currentUser) this.getProfile(this.auth.currentUser.uid);
  };

  getSelectedRoutes = async () =>
    this.db
      .collection("chosenRoutes").orderBy("author")
      .get()
      .then(snapshot => {
        let userActions = [];
        snapshot.forEach(doc => {
          let action = doc.data();
          action.id = doc.id;

          action.routeEmissions = [];
          action.routeOptions.map((option, k) => {
            return (action.routeEmissions[k] = this.calculateEmission(
              option.transitInfo
            ));
          });
          action.chosenRouteEmission = this.calculateEmission(
            action.routeOptions[action.selectedIndex].transitInfo
          );

          userActions.push(action);
        });
        return userActions;
      });

  // Set
  // ------------------------------------------------------------
  setMyUserData = async (age, gender, roles) => {
    var userRef = this.db.collection("users").doc(this.auth.currentUser.uid);
    var dbRoles = {};

    roles.forEach(role => {
      dbRoles[role] = role;
    });

    userRef.set(
      {
        age,
        gender,
        roles: dbRoles
      },
      { merge: true }
    );
  };

  setSelectedRoute = async route => {
    var routeListNoUndefined = this.undefinedToNullInObject(this.routeList);
    var routeNoUndefined = this.undefinedToNullInObject(route);

    if (this.auth.currentUser.uid) {
      this.db
        .collection("chosenRoutes")
        .doc()
        .set({
          author: this.auth.currentUser.uid,
          orig: this.orig,
          dest: this.dest,
          savedAt: new Date(),
          selectedIndex: this.selectedIndex,
          selectedRoute: routeNoUndefined,
          routeOptions: routeListNoUndefined
        });
    } else throw Error("No signed in user, cannot save data");
  };

  // Helpers
  // ------------------------------------------------------------
  calculateEmission = transit => {
    let emissionOut = 0;
    const eBus = 8 / 1000;
    const eSub = 0.16 / 1000;
    for (let i = 0; i < transit.length; i++) {
      let distance = transit[i].distance.value;
      if (transit[i].type === "BUS" || transit[i].type === "FERRY") {
        emissionOut += distance * eBus;
      } else if (
        transit[i].type === "SUBWAY" ||
        transit[i].type === "TRAIN" ||
        transit[i].type === "TRAM" ||
        transit[i].type === "HEAVY_RAIL"
      ) {
        emissionOut += distance * eSub;
      }
    }
    return Math.round(emissionOut * 100) / 100;
  };

  birthdateToAge = birthdate => {
    var diff_ms = Date.now() - birthdate.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  undefinedToNullInObject = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === "object")
        this.undefinedToNullInObject(obj[key]);
      else if (obj[key] === undefined) obj[key] = null;
    });
    return obj;
  };
}

export default Firebase;
