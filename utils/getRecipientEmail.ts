import firebase from "firebase/app";

export const getRecipientEmail = (
  users: string[],
  userLoggedIn: firebase.User
) => users?.filter((userToFilter) => userToFilter !== userLoggedIn.email)[0];

export default getRecipientEmail;
