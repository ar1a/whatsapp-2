import { pipe } from "fp-ts/lib/function";
import { useAuthState as uAS } from "react-firebase-hooks/auth";
import * as O from "fp-ts/Option";
import firebase from "firebase/app";
import "firebase/auth";

export const useAuthState = (
  auth: firebase.auth.Auth
): [O.Option<firebase.User>, boolean, O.Option<firebase.auth.Error>] =>
  pipe(auth, uAS, ([user, bool, err]) => [
    O.fromNullable(user),
    bool,
    O.fromNullable(err),
  ]);

// TODO: Figure out a way to make this unnecesary. Can't call useCollection
// inside a condition (O.map). Can we pass in undefined or some shit? it
// takes :any, and then just not use it.
export const useAuthStateUnsafe = uAS;
