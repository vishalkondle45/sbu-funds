import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleLogin = (values) => {
    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((response) => {
        console.log(response);
        if (response.ok && !response.error) {
          notifications.show({
            title: "Login Succeess 😎",
            color: "green",
            message: "You have successfully logged in",
            icon: <IconCheck />,
          });
          router.push("/");
        }
        if (response.error) {
          if (response.error == "CredentialsSignin") {
            notifications.show({
              title: "Login Failed 😓",
              color: "red",
              message: "Username or Password is wrong.",
              icon: <IconCheck />,
            });
          } else {
            notifications.show({
              title: "Login Failed 😓",
              color: "red",
              message: "Some unknown error occured.",
              icon: <IconCheck />,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error.status);
      });
  };

  // const { status } = useSession();

  // if (status === "authenticated") {
  //   router.push("/dashboard");
  //   return <></>;
  // }

  return (
    <Container size={420} my={100}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome to SBU Funds
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            required
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="md">
            <Button type="button" color="dark" onClick={() => router.back()}>
              Back To Home
            </Button>
            <Button type="button" color="dark" onClick={() => signOut()}>
              signOut
            </Button>
            <Button type="submit" color="dark">
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
