import "../styles/globals.css";
import { auth } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import React, { useEffect } from "react";
import firebase from "firebase/app";
import { AppProps } from "next/app";
import db from "../utils/db";
import { useAuthState } from "../utils/useAuthState";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    pipe(
      user,
      O.map((user) =>
        db.usersWrite.doc(user.uid).set(
          {
            email: user.email,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL,
          },
          { merge: true }
        )
      )
    );
  }, [user]);

  if (loading) return <Loading />;

  if (O.isNone(user)) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
