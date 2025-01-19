import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs' ;
import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      id: "credentials",
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const User = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier.username },
            ],
          });
          if (!User) {
            throw new Error(
              "Could not find the user with the provided identity"
            );
          }
          if (!User.isVerified) {
            throw new Error("User with the provided identity is not verified");
          }

          const isPassword = await bcrypt.compare(
            credentials.password,
            User.password
          );
          if (!isPassword) {
            throw new Error("Invalid password");
          } else {
            return User;
          }
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ], //  callbacks , session , secert , pages etc now add the token , user and token is there in session call back types in special file in next.types.d
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
