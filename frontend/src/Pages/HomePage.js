import React from 'react'
import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentification/Login";
import Signup from "../components/Authentification/Signup";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
const HomePage = () => {

    const history = useHistory();

  useEffect(() => { // local storage
    const user = JSON.parse(localStorage.getItem("userInfo")); // when we create user, we store it under local storage. Json because in a string format.

    if (!user) {
      history.push("/"); // if user is not loggedin, it is going to be pushed to loggin page
    }
  }, [history]);

    const wrapper = {
        marginTop: '10%'
    };

    const titleStyle = {
        fontHeight: '30px'
    }

    return (
        <Container maxW="x1" centerContent>
            <Box className="box" >
                <Text fontSize="4x1" fontFamily="Work sans" color="black" style={ titleStyle }>
                    CyberChat</Text>
            </Box>
            <Box bg="white" w="70%" p={4} borderRadius="lg" borderWidth="1px" style={ wrapper } >
                <Tabs variant='soft-rounded'>
                    <TabList>
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels >
                        <TabPanel><Login/></TabPanel>
                        <TabPanel><Signup/></TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
