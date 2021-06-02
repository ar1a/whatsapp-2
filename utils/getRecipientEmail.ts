import firebase from "firebase/app";

// TODO: firebase.User -> string[] -> string
export const getRecipientEmail = (
  users: string[],
  userLoggedIn: firebase.User
) => users?.filter((userToFilter) => userToFilter !== userLoggedIn.email)[0];

export default getRecipientEmail;
