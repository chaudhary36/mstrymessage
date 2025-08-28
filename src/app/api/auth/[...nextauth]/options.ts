import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email" , type: "text" , placeholder: "Enter your Email here" },
                password: { label: "Password" , type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},

                        ]
                    });

                    if(!user){
                        throw new Error("No user Found!")
                    }

                    if(!user.isVerified){
                        throw new Error("Please berify you account!")
                    }

                const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password);

                if(!isPasswordCorrect){
                    throw new Error("Password is incorrect!")
                }else{
                    return user;
                }

                } catch (error: any) {
                    throw new Error(error)
                }

            }
        })
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({token , user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username;
            }
            return token
        },
        async session({token , session}){
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isVerified
            }
            return session
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
};
