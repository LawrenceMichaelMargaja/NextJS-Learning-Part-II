import Editor from '../../../../components/editor';
import { NextPage } from 'next';
import AdminLayout from "../../../../components/layout/AdminLayout";
import {FinalPost} from "../../../../components/editor/index";
import axios from "axios";
import {generateFormData} from "../../../../utils/helper";

interface Props {}

const Create: NextPage<Props> = () => {

    const handleSubmit = async (post: FinalPost) => {
        try {
            // we have to generate FormData
            const formData = generateFormData(post);

            // submit our posts
            const { data } = await axios.post("/api/posts", formData);

            console.log(data);
        } catch (error: any) {
            console.log(error.response.data);
        }
    };

    return (
        <AdminLayout title='New Post'>
            <div className="max-w-4xl mx-auto">
                <Editor
                    onSubmit={handleSubmit}
                />
            </div>
        </AdminLayout>
    )
}

export default Create;