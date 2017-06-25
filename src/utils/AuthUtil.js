import { CustomRebase } from '../common/CustomRebase';

export function authenticatePassword(username, password, callback) {
  CustomRebase.initializedApp.auth().signInWithEmailAndPassword(username, password).catch((err) => {
    callback(err)
  }).then((user) => {
    callback(null, user);
  });
}

export function isAuthenticated() {
  if (CustomRebase.initializedApp.auth().currentUser) {
    return true
  } else {
    let hasLocalStorageUser = false;
    for (let key in localStorage) {
      if (key.startsWith('firebase:authUser:')) {
        hasLocalStorageUser = true;
      }
    }
    return hasLocalStorageUser
  }
}
