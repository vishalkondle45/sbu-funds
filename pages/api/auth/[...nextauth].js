import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Customer from "../../../models/customer";
import mongoose from "mongoose";

const connectMongo = async () => mongoose.connect(process.env.mongodburl);

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        await connectMongo();
        const user = await Customer.findOne({
          email: credentials.email,
          password: credentials.password,
        }).select("-password");
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
