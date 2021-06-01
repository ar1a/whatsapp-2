import firebase from "firebase";

export const getRecipientEmail = (
  users: string[],
  userLoggedIn: firebase.User
) => users?.filter((userToFilter) => userToFilter !== userLoggedIn.email)[0];

export default getRecipientEmail;
