import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import React, { useEffect } from "react";
import firebase from "firebase";
import { AppProps } from "next/app";
import db from "../utils/db";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.usersWrite.doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;

  if (!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
