import firebase from "firebase";

export interface User extends firebase.User {
  lastSeen: firebase.firestore.FieldValue | string;
}

export interface Chat {
  users: string[];
  messages: Message[];
}

export interface Message {
  message: string;
  photoURL: string;
  timestamp: string;
  user: string;
}
