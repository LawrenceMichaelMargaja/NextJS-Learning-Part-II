import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage} from "next";
import DefaultLayout from "../components/layout/DefaultLayout";
import dbConnect from "../lib/dbConnect";
import Post from "../models/Post";
import parse from 'html-react-parser';
import Image from "next/image";
import dateFormat from "dateformat";

type Props = InferGetStaticPropsType<typeof getStaticProps>

const SinglePost: NextPage<Props> = ({ post }) => {

    const { title, content, tags, meta, slug, thumbnail, createdAt } = post;

    return (
        <DefaultLayout title={title} desc={meta}>
            {thumbnail ? (
                <div className="relative aspect-video">
                    <Image src={thumbnail} alt={title} layout='fill'/>
                </div>
                )
            : null}

            <div className="flex items-center justify-between py-2">
                {tags.map((t, index) => (
                    <span key={t + index}>
                        #{t}
                    </span>
                ))}
                <span>
                    {dateFormat(createdAt, 'd-mmm-yyyy')}
                </span>
            </div>

            <div className="prose prose-lg max-w-full mx-auto">
                <h1>{title}</h1>
                {parse(content)}
            </div>
        </DefaultLayout>
    );
};

export default SinglePost;

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        await dbConnect();
        const posts = await Post.find().select('slug');
        const paths = posts.map(({slug}) => {
            return { params: { slug } }
        });
        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.log("the error === ", error);
        return {
            paths: [{
                params: {slug: '/'}
            }],
            fallback: false
        }
    }
};

interface StaticPropsResponse {
    post: {
        id: string,
        title: string,
        content: string,
        meta: string,
        tags: string[],
        slug: string,
        thumbnail: string,
        createdAt: string,
    }
};

export const getStaticProps: GetStaticProps<StaticPropsResponse, {slug: string}> = async ({params}) => {
    try {
        await dbConnect();
        const post = await Post.findOne({slug: params?.slug});

        if(!post) {
            return { notFound: true };
        }

        const { _id, title, content, meta, slug, tags, thumbnail, createdAt } = post;

        return {
            props: {
                post: {
                    _id: _id.toString(),
                    title,
                    content,
                    meta,
                    slug,
                    tags,
                    thumbnail: thumbnail?.url || '',
                    createdAt: createdAt.toString()
                }
            }
        }
    } catch (error) {
        return { notFound: true };
    }
};