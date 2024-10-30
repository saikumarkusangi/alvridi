// import { handlers } from "@/app/auth"
// export const { GET, POST } = handlers

import dbConnect from "@/config/dbConnect"
import User, { IUser } from "@/models/user"
import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"

export const GET = NextAuth({

    providers: [


        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

    ],
    secret: process.env.AUTH_SECRET,

    session: {
        strategy: 'jwt'


    },


    jwt: {

        secret: process.env.AUTH_SECRET,

    },


    pages: {
        // signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },


    callbacks: {
        async signIn({ user }): Promise<boolean> {
            await dbConnect();

            const existingUser: IUser | null = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create({
                    name: user.name!,
                    email: user.email!,
                    image: user.image,
                    watchList: []
                });
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Redirect to home page ("/") after successful sign-in
            return baseUrl;
        },
        // async session({ session, token, user }) { return session },
        // async jwt({ token, user, account, profile, isNewUser }) { return token }
    },


    events: {},

    debug: true,
})

export const POST = NextAuth({

    providers: [


        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

    ],
    secret: process.env.AUTH_SECRET,

    session: {
        strategy: 'jwt'


    },


    jwt: {

        secret: process.env.AUTH_SECRET,

    },


    pages: {
        // signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },


    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) { return true },
        async signIn({ user }): Promise<boolean> {
            await dbConnect();

            const existingUser: IUser | null = await User.findOne({ email: user.email });
            if (!existingUser) {
                // Create a new user if one doesn't exist
                await User.create({
                    name: user.name!,
                    email: user.email!,
                    image: user.image,
                    watchList: []
                });
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Redirect to home page ("/") after successful sign-in
            return baseUrl;
        },
        // async session({ session, token, user }) { return session },
        // async jwt({ token, user, account, profile, isNewUser }) { return token }
    },


    events: {},

    debug: true,
})