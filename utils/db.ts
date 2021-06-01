import { db as firestore } from "../firebase";
import firebase from "firebase";
import { Chat, User } from "../types/types";

export const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: firebase.firestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  firestore.collection(collectionPath).withConverter(converter<T>());

export const db = {
  usersRead: dataPoint<User<"read">>("users"),
  chatsRead: dataPoint<Chat<"read">>("chats"),
  usersWrite: dataPoint<User<"create">>("users"),
  chatsWrite: dataPoint<Chat<"create">>("chats"),
};

export default db;
