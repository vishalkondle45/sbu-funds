import Accounts from "@/components/Home/Accounts";
import Header from "@/components/Home/Header";
import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function Component() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });
  return (
    <>
      <Header />
      <Container>
        <Accounts />
      </Container>
    </>
  );
}
