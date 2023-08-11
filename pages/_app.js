import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "../styles/globals.css";

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
        <link rel="icon" type="image/x-icon" href="/Round_Logo.png" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          primaryColor: "blue",
          loader: "bars",
          activeStyles: { transform: "scale(0.95)" },
        }}
      >
        <SessionProvider session={session}>
          <Notifications />
          <ModalsProvider>
            <Component {...pageProps} />
          </ModalsProvider>
        </SessionProvider>
      </MantineProvider>
    </>
  );
}
