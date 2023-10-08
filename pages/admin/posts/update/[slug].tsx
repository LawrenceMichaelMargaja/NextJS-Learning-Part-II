import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from "next";
import Editor, {FinalPost} from "../../../../components/editor/index";
import dbConnect from "../../../../lib/dbConnect";
import AdminLayout from "../../../../components/layout/AdminLayout";
import Post from "../../../../models/Post";
import {generateFormData} from "../../../../utils/helper";
import axios from "axios";

// Include the PostResponse and ServerSideResponse interfaces here

interface PostResponse extends FinalPost {
    id: string;
    // You can add the author if it's relevant here.
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({post}) => {

    const handleSubmit = async (post: FinalPost) => {
        try {
            // we have to generate FormData
            const formData = generateFormData(post);

            // submit our posts
            const {data} = await axios.patch("/api/posts/" + post.id, formData);
            // console.log(data);
        } catch (error: any) {
            console.log(error.response.data);
        }
    };

    return (
        <AdminLayout title="Update">
            {/*<h1>Hello World!</h1>*/}
            {/*{JSON.stringify(post)}*/}
            <div className="max-w-4xl mx-auto">
                <Editor
                    initialValue={post}
                    onSubmit={handleSubmit}
                    btnTitle='Update'
                />
            </div>
        </AdminLayout>
    );
};

type ServerSideProps = {
    // post: PostResponse;
    post: FinalPost & {
        id: string; // you can keep this as it's optional in FinalPost
    };
}

// export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
//
//     try {
//         const slug = context.query.slug as string;
//         console.log("the slug --- ", slug);
//
//         await dbConnect();
//         const post = await Post.findOne({ slug });
//         //
//         // if (!post) return { notFound: true };
//         //
//         const {_id, title, content, thumbnail, meta, tags} = post
//         console.log("the post ==== ", post)
//
//         return {
//             props: {
//                 post: {
//                     id: _id.toString(),
//                     title,
//                     content,
//                     tags: tags.join(', '),
//                     thumbnail: thumbnail?.url || '',
//                     slug,
//                     meta
//                 }
//             }
//         }
//     } catch (error) {
//         // return is different from tutorial because the return statement there caused an error.
//         // the return in the tutorial is return { notFound: true }
//         console.log("there was an error === ", error.message)
//         return
//     }
// }

//from chat gpt

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
    try {
        const slug = context.query.slug as string;
        console.log("the slug --- ", slug);

        await dbConnect();
        // const post = await Post.findOne({ slug });

        // from chat gpt
        const post = await Post.findOne({slug});
        if (!post) return {notFound: true};

        const {_id, title, content, thumbnail, meta, tags} = post;

        // Log the meta value and type here
        console.log("Meta value:", meta);
        console.log("Meta type:", typeof meta);

        // return {
        //     props: {
        //         post: {
        //             id: _id.toString(),
        //             title,
        //             content,
        //             tags: tags.join(', '),
        //             thumbnail: thumbnail?.url || '',
        //             slug,
        //             meta
        //         }
        //     }
        // }

        //from chat gpt
        return {
            props: {
                post: {
                    id: _id.toString(),
                    title,
                    content,
                    tags: tags.join(', '),
                    thumbnail: thumbnail?.url || '',
                    slug,
                    meta: meta.toString() // ensure meta is a string, just to be explicit
                }
            }
        } as { props: ServerSideProps }
    } catch (error: any) {
        if (error instanceof Error) {
            console.log("there was an error === ", error.message);
        } else {
            console.log("Caught something unexpected:", error);
        }
        return {
            props: {
                post: {
                    id: "",
                    title: "",
                    content: "",
                    tags: "",
                    thumbnail: "",
                    slug: "",
                    meta: ""
                }
            }
        };
    }

}


export default Update;
