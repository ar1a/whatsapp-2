import firebase from "firebase/app";
import { filter, head } from "fp-ts/Array";
import { constant, flow } from "fp-ts/function";
import * as O from "fp-ts/Option";

export const getRecipientEmail = (user: firebase.User) =>
  flow(
    filter<string>((other) => other !== user.email),
    head,
    O.getOrElse(constant("email not found"))
    // ? Should we return the Option instead?
  );

export default getRecipientEmail;
