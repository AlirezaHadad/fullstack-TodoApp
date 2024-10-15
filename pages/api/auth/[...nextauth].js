import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import UserTodo from "../../../models/User";
import { verifyPassword } from "../../../utils/auth";
import connectDB from "../../../utils/connectDB";

const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectDB();
        } catch (error) {
          throw new Error("Error in connecting to DB!");
        }

        if (!email || !password) {
          throw new Error("Invalid Data!");
        }

        const user = await UserTodo.findOne({ email: email });

        if (!user) throw new Error("User doesn't exist!");

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) throw new Error("Username or password is incorrect!");

        return { email };
      },
    }),
  ],
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);