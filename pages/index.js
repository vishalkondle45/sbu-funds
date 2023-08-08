import Accounts from "@/components/Home/Accounts";
import EmailBanner from "@/components/Home/Email";
import { FeaturesCards } from "@/components/Home/Features";
import Header from "@/components/Home/Header";
import Hero from "@/components/Home/Hero";
import LastFiveTransactions from "@/components/Home/LastFiveTransactions";
import { Container } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Component() {
  const { status, data: session } = useSession({
    // required: true,
    // onUnauthenticated() {
    //   window.location.href = "/login";
    // },
  });
  const router = useRouter();

  if (status == "authenticated") {
    if (session.user.isAdmin) {
      router.push("/admin/home");
    }
    // else {
    //   router.push("/");
    // }
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
        </>
      ) : (
        <>
          {!session.user.isAdmin && (
            <>
              <Header />
              <Container>
                <LastFiveTransactions />
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
}
