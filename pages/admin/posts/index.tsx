import AdminLayout from '../../../components/layout/AdminLayout';
import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next';
import {useState} from "react";
import PostCard from "../../../components/common/PostCard";
import {PostDetail} from "../../../utils/types";
import {formatPosts, readPostsFromDb} from "../../../lib/utils";
import InfiniteScrollPosts from "../../../components/common/InfiniteScrollPosts";
import axios from "axios";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {filter} from "domutils";
import {filterPosts} from "../../../utils/helper";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

let pageNo = 0;
const limit = 9;

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
        <>
            <AdminLayout>
                <InfiniteScrollPosts
                    hasMore={hasMorePosts}
                    next={fetchMorePosts}
                    dataLength={postsToRender.length}
                    posts={postsToRender}
                    showControls
                    onPostRemoved={(post) => setPostsToRender(filterPosts(posts, post))}
                />
            </AdminLayout>
        </>
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