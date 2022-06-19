import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  
  const { selectedChat } = ChatState();  // whenever a chat is selected, the chat is appear

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }} // the display will be in the base xreen, if the chat is selected it is going to be flex, otherwise, it is going to be none
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> 
    </Box> // when we leave the group, the list on the left has to be updated. So we have to create a parent page in the ChatPage
  );
};

export default Chatbox;