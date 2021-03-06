import { Avatar } from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";
import db from "../utils/db";
import { useAuthStateUnsafe } from "../utils/useAuthState";
import { push } from "../utils/router";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/lib/function";
interface Props {
  id: string;
  users: string[];
}
export default function Chat({ id, users }: Props) {
  // Should already be logged in
  const [user] = useAuthStateUnsafe(auth);
  const router = useRouter();

  //  should already be logged in, and can't assert because it's before react
  //  hooks
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const recipientEmail = getRecipientEmail(user!)(users);

  const [recipientSnapshotUnsafe] = useCollection(
    db.usersRead.where("email", "==", recipientEmail)
  );

  const enterChat = push(`/chat/${id}`)(router);

  const recipientSnapshot = O.fromNullable(recipientSnapshotUnsafe);

  const recipient = pipe(
    recipientSnapshot,
    O.match(constant(null), (recipientSnapshot) =>
      recipientSnapshot.docs?.[0]?.data()
    )
  );
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
