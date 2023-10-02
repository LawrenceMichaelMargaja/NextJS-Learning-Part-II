import NextAuth, {NextAuthOptions} from "next-auth";
import GitHubAuthProvider from 'next-auth/providers/github';
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const authOptions: NextAuthOptions = {
    providers: [
        GitHubAuthProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            async profile(profile, tokens) {
                // find out the user
                await dbConnect();
                const oldUser = await User.find({
                    email: profile.email
                });

                const userProfile = {
                    email: profile.email,
                    name: profile.name || profile.login,
                    avatar: profile.avatar_url,
                    role: 'user'
                };

                // store new user in DB.
                if(!oldUser) {
                    const newUser = new User({
                        ...userProfile,
                        provider: 'github',
                    });

                    await newUser.save();
                } else {
                    userProfile.role = oldUser.role
                }
                return {
                    id: profile.id,
                    email: profile.email,
                    // role: userProfile.role
                };
            }
        }),
    ],
    callbacks: {
        jwt: async ({token, user, account, profile, isNewUser}) => {
            if(user) {
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                console.log("DB User:", dbUser); // Log the user fetched from the database
                if(dbUser) token.role = dbUser.role;
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/404'
    }
};

export default NextAuth(authOptions);