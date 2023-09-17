import Editor from '../../../components/editor';
import { NextPage } from 'next';

interface Props {}

const Create: NextPage<Props> = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Editor
                onSubmit={(post) => {
                console.log("the post ---- ", post);
                }}
                initialValue={{
                    title: 'This is from Create',
                    meta: 'This is the META from Create',
                    content: '<h1>I am from content from create</h1>',
                    slug: "this-is-from-create",
                    tags: 'javascript',
                    thumbnail: 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3VuZGFtfGVufDB8fDB8fHww&w=1000&q=80'
                }}
            />
        </div>
    )
}

export default Create;