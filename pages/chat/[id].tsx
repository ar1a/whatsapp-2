import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth } from "../../firebase";
import { Chat as ChatType, Message } from "../../types/types";
import db, { converter } from "../../utils/db";
import getRecipientEmail from "../../utils/getRecipientEmail";
import firebase from "firebase/app";
interface Props {
  chat: ChatType<"read">;
  messages: string;
}
export default function Chat({ chat, messages }: Props) {
  // TODO: firebase.auth.Auth -> [Maybe<firebase.User>, boolean, Maybe<firebase.auth.Error>]
  const [user] = useAuthState(auth);

  if (!user) return <div>How are you here? You should be logged in - [id]</div>;

  // ? This will fail poorly, should we just accept that, or deal with it?
  const msgs: Message<"read">[] = JSON.parse(messages);
  // sent from server it's just the values of Timestamp, and needs to be
  // converted back into the Timestamp type.
  // Disgusting, but...
  const msgsFixed = msgs.map((msg) => ({
    ...msg,
    timestamp: firebase.firestore.Timestamp.fromMillis(
      msg.timestamp.nanoseconds / 1_000_000
    ),
  }));
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(user)(chat.users)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={msgsFixed} />
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (
    context?.params?.id === undefined || // assert if undefined
    typeof context.params.id === "object" // assert if string[] or string
  )
    return { redirect: { permanent: false, destination: "/" } };
  const ref = db.chatsRead.doc(context.params.id);

  const messagesRes = await ref
    .collection("messages")
    .withConverter(converter<Message<"read">>())
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
};
