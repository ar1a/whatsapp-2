import { db as firestore } from "../firebase";
import firebase from "firebase";
import { Chat, User } from "../types/types";

const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

export const db = {
  users: dataPoint<User>("users"),
  chats: dataPoint<Chat>("chats"),
};

export default db;
