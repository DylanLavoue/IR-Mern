import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "../../Context/ChatProvider";
  import UserBadgeItem from "../userAvatar/UserBadgeItem";
  import UserListItem from "../userAvatar/UserListItem";
  
  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();
  
    // if selected users already includes this object, then show a toast and return it by saying already there. Otherwise, we are going to add it.  ... means spreading selected users and then add user to add. 
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) { // already exist
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]); // spread already there
    };
  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true); // as the search start
        const config = { // pass the token
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`http://localhost:5000/api/auth/user?search=${search}`, config); //? is a query, {search} template query and provide the config
        console.log(data);
        setLoading(false); // whatever the data we get, we are going to set the loading to false
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
  
    const handleDelete = (delUser) => { //user to be deleted
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id)); // filter the selectedusers. If it is not equal to the user to be deleted, then we will delete it.
    };
  
    const handleSubmit = async () => { // if groupaname or user are empty, then fill all the fields. 
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post( // fetch the data and takes the user data as an array in the stringify format
          `/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)), //see why they stringify
          },
          config // give the bearer
        );
        setChats([data, ...chats]); // this chat is created, add it to the list of our chats. We are riding the data before spreading it because we want to add it to the top of our chats.
        onClose(); // then close the model.
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
 
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: Michel, Jaquie"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)} // as we search our users, we will render them belw
                />
              </FormControl>  
              <Box w="100%" d="flex" flexWrap="wrap"> 
                {selectedUsers.map((u) => ( // render selected users (u = user). The userBadge item is gonna take the user and userbadge item. Wrap it under box so that it is stylish.
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)} // enables to delete when you add it.
                  />
                ))} 
              </Box>
              
              {loading ? (
                // <ChatLoading /> if it is loading, write loading, otherwise take the search result and map to it.  Display only 4 resulsts by slicing. 
                //Using UserlistItem. This takes a key since we are mapping this and taking the user itself + handlefunctin which when we will click on it , it is gonna add it to our selected usersarray (setslecetdusers)
                <div>Loading...</div> 
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id} // because mapping it
                      user={user}
                      handleFunction={() => handleGroup(user)} // when we click on it, it adds it to selectedUsers
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorscheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;