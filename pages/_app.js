import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Notifications } from "@mantine/notifications";
// import image from "@/public/SB"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>SBU</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" type="image/x-icon" href="/SBU-Circle.png" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <SessionProvider session={session}>
          <Notifications />
          <Component {...pageProps} />
        </SessionProvider>
      </MantineProvider>
    </>
  );
}
