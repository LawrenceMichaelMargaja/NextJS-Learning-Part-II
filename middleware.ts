// req => <= middleware => <= res

import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(function middleware(req) {
        // navigate our user
        // console.log("the req from withAuth === ", req);
        return NextResponse.rewrite(new URL(req.url));
    },
    {
        callbacks: {
            authorized({token }) {
                // console.log("this is the token --- ", token);
                return token?.role === 'admin'
            },
        },
    });

export const config = {
    matcher: ['/admin/:path*']
};