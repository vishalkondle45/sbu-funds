import EmailBanner from "@/components/Home/Email";
import { FeaturesCards } from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import Hero from "@/components/Home/Hero";
import { Container } from "@mantine/core";

export default function Component() {
  return (
    <>
      <Header />
      <Container>
        <Hero />
        <FeaturesCards />
        <EmailBanner />
      </Container>
      <Footer />
    </>
  );
}
