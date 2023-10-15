import NextAuth, {NextAuthOptions} from "next-auth";
import GitHubAuthProvider from 'next-auth/providers/github';
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GIT_CLIENT_ID_LOCAL,
    GIT_CLIENT_SECRET_LOCAL,
    MODE
} = process.env

const GIT_CLIENT_ID = MODE === 'development' ? GIT_CLIENT_ID_LOCAL : GITHUB_CLIENT_ID
const GIT_CLIENT_SECRET = MODE === 'development' ? GIT_CLIENT_SECRET_LOCAL : GITHUB_CLIENT_SECRET

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubAuthProvider({
            clientId: GIT_CLIENT_ID as string,
            clientSecret: GIT_CLIENT_SECRET as string,
            async profile(profile, tokens) {
                // find out the user
                await dbConnect();
                const oldUser = await User.findOne({
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
                if(dbUser) {
                    token.name = user.name;
                    token.role = dbUser.role;
                    token.image = user.image;
                }
            }
            return token;
        },
        async session({session, token}) {
            await dbConnect();
            const user = await User.findOne({email: session.user?.email});
            if(user) {
                session.user = {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                } as any;
            }
            // console.log('the session === ', session);
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/404'
    }
};

export default NextAuth(authOptions);