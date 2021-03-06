import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
// import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";

import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]); // all the different profiles after searching
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {
        user,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
    } = ChatState(); // selectedChatin order to be available in whole of the app
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
        toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
            });
        return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `http://localhost:5000/api/auth/user?search=${search}`,
                config
            ); // destructure data. ?should have a query => {query}, and after give the config
            setLoading(false);
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

    const accessChat = async (Id) => {
        console.log(user.token);

        try {
        setLoadingChat(true);

        const config = {
            headers: {
            "Content-type": "application/json", // send json data.
            Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post(
            "http://localhost:5000/api/chat",
            { Id },
            config
        ); // api request, takes user id, it will return a chat that is created ; we are creating the new chat. But if the chat is already in the chat state, we want to append it.

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //if it exists and finds it  and hatis already inside of this chat state, we will append it. If finds in the list, it will update the list by doing setchats and appending the chats inside of it.

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
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

    return (
        <>
        <Box
            d="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
                <i className="fas fa-search"></i>
                <Text d={{ base: "none", md: "flex" }} px={4}>
                Search User
                </Text>
            </Button>
            </Tooltip>
            <Text fontSize="2x1" fontFamily="Work sans">
            CyberChat
            </Text>
            <div>
            <Menu>
                <MenuButton p={1}>
                <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                />
                <BellIcon fontSize="2x1" m={1} />
                </MenuButton>
                <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => {
                    <MenuItem
                    key={notif._id}
                    onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(notification.filter((n) => n !== notif));
                    }}
                    >
                    {notif.chat.isGroupChat
                        ? `New Message in ${notification.chat.chatName}` //
                        : `New Message from ${getSender(user, notif.chat.users)}`}
                    </MenuItem>;
                })}
                </MenuList>
            </Menu>
            <Menu ml={10}><span style={{marginLeft: "5px", marginRight: "5px"}}>{user.name}</span></Menu>
            <Menu>
                <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                <Avatar
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                />
                </MenuButton>
                <MenuList>
                <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>{" "}
                </ProfileModal>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
            </div>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
                <Box d="flex" pb={2}>
                <Input
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                <ChatLoading />
                ) : (
                searchResult?.map((user) => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)} // when we click on it, it creates a chat with the user's id.
                    />
                ))
                )}
                {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    );
};

export default SideDrawer;
