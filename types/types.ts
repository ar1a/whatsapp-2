import firebase from "firebase/app";

type FieldValue = firebase.firestore.FieldValue;
export type Timestamp = firebase.firestore.Timestamp;

export interface User<MODE extends "create" | "read"> extends firebase.User {
  lastSeen: MODE extends "create" ? FieldValue : Timestamp;
}

export interface Chat<MODE extends "create" | "read"> {
  users: string[];
  messages?: Message<MODE>[];
}

export interface Message<MODE extends "create" | "read"> {
  id: string;
  message: string;
  photoURL: string;
  timestamp: MODE extends "create" ? FieldValue : Timestamp;
  user: string;
}
