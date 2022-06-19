import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast, Grid, GridItem } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Checkbox from "./Checkbox";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('Email');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const [checked, setChecked] = useState(false);

  const handleGest = function () {
    setChecked(!checked);
    if (checked === false) {
      setPassword("_GuestD7L0");
      setTitle("Nickname")
    }
    else {
      setEmail("");
      setPassword("");
      setTitle("Email")
    }
  }

  return (
    <VStack spacing="10px">
      <FormControl id="emaillogin" isRequired>
        <FormLabel>{title}</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder={checked ? "Enter Your Nickname" : "Enter Your Email Address"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            disabled ={password==="_GuestD7L0"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorscheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      

          <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem w='100%' h='10'>
              <Checkbox id="1" onChange={handleGest} value={checked}></Checkbox>
            </GridItem>
            <GridItem w='100%' h='10'>
              <span>Connect as guest</span>
              </GridItem>
          </Grid>

    </VStack>
  );
};

export default Login;