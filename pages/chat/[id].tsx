import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth } from "../../firebase";
import { Chat, Message } from "../../types/types";
import db, { converter } from "../../utils/db";
import getRecipientEmail from "../../utils/getRecipientEmail";
interface Props {
  chat: Chat<"read">;
  messages: Message<"read">[];
}
export default function Chat({ chat, messages }: Props) {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
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

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
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
