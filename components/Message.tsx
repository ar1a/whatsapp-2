import moment from "moment";
import styled from "styled-components";
import { auth } from "../firebase";
import { Message as MessageType } from "../types/types";
import { useAuthState } from "../utils/useAuthState";
import * as O from "fp-ts/Option";
import { constant, pipe } from "fp-ts/lib/function";
interface Props {
  user: string;
  message: MessageType<"read">;
}
export default function Message({ user, message }: Props) {
  const [loggedInUserM] = useAuthState(auth);

  return pipe(
    loggedInUserM,
    O.map((loggedInUser) => (user === loggedInUser.email ? Sender : Reciever)),
    O.map((TypeOfMessage) => (
      <Container key={`${message.id}-M`}>
        <TypeOfMessage>
          {message.message}
          <Timestamp>
            {message.timestamp
              ? moment(message.timestamp.toDate().getTime()).format("LT")
              : "..."}
          </Timestamp>
        </TypeOfMessage>
      </Container>
    )),
    O.getOrElse(
      constant(
        <div>How are you here? You should already be logged in - Message</div>
      )
    )
  );
}

const Container = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
