import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (
          credentials.email === "vishal.kondle@gmail.com" &&
          credentials.password === "Vammavg@78"
        ) {
          return { id: "1", name: "J Smith", email: "jsmith@example.com" };
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
