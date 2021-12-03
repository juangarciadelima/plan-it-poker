import React, { useState } from "react";
import { useRoomsContext } from "../../context";
import {
  Box,
  Grid,
  Flex,
  Heading,
  Input,
  Link,
  Button,
  Text,
  Divider,
  Stack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { serviceLogin } from "../../services/administrador";
import { useHistory } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({ email: "" });
  const { usuario, setUsuario } = useRoomsContext();

  const history = useHistory();

  async function signIn() {
    const response = await serviceLogin(user.email);
    setUsuario(response);
    history.push("/salas");
  }
  function handleChangeEmail(e) {
    setUser((oldUser) => {
      oldUser.email = e.target.value;
      console.log(user.email);
      return { ...oldUser };
    });
  }
  return (
    <Flex alignItems="center" justify="center" minH="90vh" marginBottom="3rem">
      <Stack spacing="8" py="12" px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Faça Login em sua conta</Heading>
        </Stack>
        <Box rounded="lg" bg="gray.200" boxShadow="lg" p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                size="lg"
                onChange={handleChangeEmail}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                marginTop="3rem"
                bg="red.600"
                color="white"
                _hover={{
                  bg: "red.500",
                }}
                onClick={signIn}
              >
                Logar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export { Login };
