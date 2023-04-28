import EmailBanner from "@/components/Home/Email";
import { FeaturesCards } from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import Hero from "@/components/Home/Hero";
import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Component() {
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status == "authenticated") {
    if (session.user.isAdmin) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }
  return (
    <>
      {status !== "authenticated" ? (
        <>
          <Header />
          <Container>
            <Hero />
            <FeaturesCards />
            <EmailBanner />
          </Container>
          <Footer />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
