import { GetServerSideProps } from "next";
import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth } from "../../firebase";
import { Chat as ChatType, Message } from "../../types/types";
import db, { converter } from "../../utils/db";
import getRecipientEmail from "../../utils/getRecipientEmail";
import firebase from "firebase/app";
import { useAuthState } from "../../utils/useAuthState";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/lib/function";
interface Props {
  chat: ChatType<"read">;
  messages: string;
}
export default function Chat({ chat, messages }: Props) {
  const [user] = useAuthState(auth);

  return pipe(
    user,
    O.map((user) => ({ user, msgs: JSON.parse(messages) })),
    O.map(({ user, msgs }) => ({
      user,
      msgs: msgs.map((msg: Message<"read">) => ({
        ...msg,
        timestamp: firebase.firestore.Timestamp.fromMillis(
          msg.timestamp.nanoseconds / 1_000_000
        ),
      })),
    })),
    O.map(({ user, msgs }) => (
      <Container key={`${chat.users[0]}-${chat.users[1]}`}>
        <Head>
          <title>Chat with {getRecipientEmail(user)(chat.users)}</title>
        </Head>
        <Sidebar />
        <ChatContainer>
          <ChatScreen chat={chat} messages={msgs} />
        </ChatContainer>
      </Container>
    )),
    O.getOrElse(
      constant(<div>How are you here? You should be logged in - [id]</div>)
    )
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
