import Header from "@/components/Home/Header";
import Interests from "@/components/admin/Interests";
import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";

export default function Component() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });
  return (
    <>
      <Header />
      <Container>
        <Interests />
      </Container>
    </>
  );
}
