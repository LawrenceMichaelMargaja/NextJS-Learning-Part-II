import AdminLayout from '../../../components/layout/AdminLayout';
import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next';
import {useState} from "react";
import PostCard from "../../../components/common/PostCard";
import {PostDetail} from "../../../utils/types";
import {formatPosts, readPostsFromDb} from "../../../lib/utils";
import InfiniteScrollPosts from "../../../components/common/InfiniteScrollPosts";
import axios from "axios";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

let pageNo = 0;
const limit = 9;

// const posts = [
//     {
//         title: "This is my new post for now",
//         slug: "this-is-my-first-post",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     },
//     {
//         title: "This is my new post for now 2",
//         slug: "this-is-my-new-post-for-now-2",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.unsplash.com/photo-1682687982502-1529b3b33f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     },
//     {
//         title: "This is my new post for now 3",
//         slug: "this-is-my-new-post-for-now-3",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.unsplash.com/photo-1682687982029-edb9aecf5f89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     },
//     {
//         title: "This is my new post for now 4",
//         slug: "this-is-my-new-post-for-now-4",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.unsplash.com/photo-1695446635028-f301e352f06a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     },
//     {
//         title: "This is my new post for now 5",
//         slug: "this-is-my-new-post-for-now-5",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.unsplash.com/photo-1682686578842-00ba49b0a71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     },
//     {
//         title: "This is my new post for now 6",
//         slug: "this-is-my-new-post-for-now-6",
//         meta: "This is my first post, and typesetting industry.",
//         tags: ["post"],
//         thumbnail: "https://images.unsplash.com/photo-1695755594813-14e57fab9a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
//         createdAt: "Mon Oct 10 2022 14:58:49 GMT+0530 (India Standard Time)",
//     }
// ]

const Posts: NextPage<Props> = ({posts}) => {

    const [postsToRender, setPostsToRender] = useState(posts);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const fetchMorePosts = async () => {
        try {
            pageNo++
            const { data } = await axios(`/api/posts?limit=${limit}&pageNo=${pageNo}`);

            // this checks if the number of posts is less than the limit and if it is less than the limit that means we've run out of posts in the DB.
            if(data.posts.length < limit) {
                setPostsToRender([...postsToRender, ...data.posts]);
                setHasMorePosts(false);
            } else {
                setPostsToRender([...postsToRender, ...data.posts]);
            }
        } catch (error) {
            setHasMorePosts(false);
            console.log("the error === ", error)
        }
    };

    return (
        <AdminLayout>
            <InfiniteScrollPosts
                hasMore={hasMorePosts}
                next={fetchMorePosts}
                dataLength={postsToRender.length}
                posts={postsToRender}
                showControls
            />
        </AdminLayout>
    )
};

interface ServerSideResponse {
    posts: PostDetail[];
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async () => {

    try {
        //read posts
        const posts = await readPostsFromDb(limit, pageNo);
        //format posts
        const formattedPosts = formatPosts(posts);
        return {
            props: {
                posts: formattedPosts
            }
        }
    } catch (error) {
        // return {notFound: true}
        console.log(" the error === ", error)
        return
    }
};
export default Posts;