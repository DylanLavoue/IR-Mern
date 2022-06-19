import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => { // wraps the whole of our app, 
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(); // if we create it just inside the component, it will stay inside the component. But since we are creating inside the context api, this constitutes the whole of our app.
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);  // to populate all the chats inside the chats state

  const history = useHistory();

  useEffect(() => { // local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // when we create user, we store it under local storage. Json because in a string format. 
    setUser(userInfo); // after that, we store it under setUser

    if (!userInfo) {
      history.push("/"); // if user is not loggedin, it is going to be pushed to loggin page
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser, // to make  const [user, setUser] accessible to the whole of our app, we have to put them under  a value 
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => { // all of the state is inside of this variable
  return useContext(ChatContext); // makes the state accessible throughout the app. it is a hook => const ChatContext = createContext();
  // How do we create the state inside of our context api?  const [user, setUser] = useState();
};

export default ChatProvider;