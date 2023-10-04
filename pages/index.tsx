import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next';
import DefaultLayout from "../components/layout/DefaultLayout";
import {formatPosts, readPostsFromDb} from "../lib/utils";
import {PostDetail} from "../utils/types";
import InfiniteScrollPosts from "../components/common/InfiniteScrollPosts";
import {useState} from "react";
import axios from "axios";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<Props> = ({posts}) => {

    //
    const [postsToRender, setPostsToRender] = useState(posts);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const isAdmin = false;

    // fetches the posts from the db and sets the value of the local state(postsToRender)
    // value of postsToRender is then passed as props into the component InfiniteScrollPosts
    // the function itself is passed as a value of the next attribute of the Infinite Scroll component which automatically fires based on the logic of the function.
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
        <DefaultLayout>
            <InfiniteScrollPosts
                hasMore={hasMorePosts}
                next={fetchMorePosts}
                dataLength={postsToRender.length}
                posts={postsToRender}
                showControls={isAdmin}
            />
        </DefaultLayout>
    )
}

interface ServerSideResponse {
    posts: PostDetail[];
}

let pageNo = 0;
const limit = 9;

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

export default Home;