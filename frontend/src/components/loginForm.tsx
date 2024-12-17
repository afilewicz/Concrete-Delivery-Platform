import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Container,
  Button,
  Input,
  Stack,
  FormControl,
  InputGroup,
  InputLeftElement,
  Text,
  InputRightElement,
} from "@chakra-ui/react";
import Link from "next/link";
import { LockIcon, PhoneIcon } from "@chakra-ui/icons";

interface LoginData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    console.log(data);
  };

  return (
    <Container as="form" maxW="sm" onSubmit={handleSubmit(onSubmit)}>
      <Stack
        gap={4}
        rounded="md"
        p={4}
        shadow="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Sign in
        </Text>
        <FormControl id="username" isInvalid={!!errors.username}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
              variant="filled"
              placeholder="Phone number"
              required
            />
          </InputGroup>
        </FormControl>
        <FormControl label="Password">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <LockIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type={show ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              variant="filled"
              placeholder="Password"
              required
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick} bg="gray.300">
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button variant="link" color="blue.500">
          <Link href={"/recover-password"}>Forgot password?</Link>
        </Button>
        <Button type="submit" border="1px" isLoading={isSubmitting}>
          Submit
        </Button>
        <Text textAlign="center">
          Already have an account?{" "}
          <Button variant="link" color="blue.500" textAlign="center">
            <Link href={"/register"}>Sign up</Link>
          </Button>
        </Text>
      </Stack>
    </Container>
  );
};

export default LoginForm;
