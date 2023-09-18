import Editor from '../../../components/editor';
import { NextPage } from 'next';
import AdminLayout from "../../../components/layout/AdminLayout";

interface Props {}

const Create: NextPage<Props> = () => {
    return (
        <AdminLayout title='New Post'>
            <div className="max-w-4xl mx-auto">
                <Editor
                    onSubmit={(post) => {
                        console.log("the post ---- ", post);
                    }}
                />
            </div>
        </AdminLayout>
    )
}

export default Create;