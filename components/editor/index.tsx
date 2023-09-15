import React, {FC, useEffect, useState} from 'react'
import {useEditor, EditorContent, getMarkRange, Range} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import EditLink from './Link/EditLink';
import Youtube from '@tiptap/extension-youtube';
import GalleryModal, {ImageSelectionResult} from './ToolBar/GalleryModal';
import TipTapImage from '@tiptap/extension-image';
import axios from "axios";
import SEOForm from "./SeoForm";

interface Props {

}

const content = `
        <></>
`

const Editor: FC<Props> = (props): JSX.Element => {

    const [selectionRange, setSelectionRange] = useState<Range>();
    const [uploading, setUploading] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [images, setImages] = useState<{ src: string }[]>([]);

    /**
     * Changes made in this code are that content variable is added to the editor
     */
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                autolink: false,
                linkOnPaste: false,
                openOnClick: false,
                HTMLAttributes: {
                    target: '',
                }
            }),
            Placeholder.configure({
                placeholder: "Type Something."
            }),
            Youtube.configure({
                width: 840,
                height: 472.5,
                HTMLAttributes: {
                    class: 'mx-auto rounded',
                }
            }),
            TipTapImage.configure({
                HTMLAttributes: {
                    class: 'mx-auto'
                }
            })
        ],
        content,
        editorProps: {
            handleClick(view, pos, event) {
                const {state} = view;
                const selectionRange = getMarkRange(state.doc.resolve(pos), state.schema.marks.link);

                if (selectionRange) {
                    setSelectionRange(selectionRange);
                }
            },
            attributes: {
                class: 'prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full'
            }
        }
    });

    const fetchImages = async () => {
        const {data} = await axios('/api/image');
        // console.log(data)
        setImages(data.images);
    }

    /**
     * This function is used as a callback inside of Gallery Modal and is fired when the handleSubmit of the Gallery Modal component is fired.
     */
    const handleImageSelection = (result: ImageSelectionResult) => {
        editor?.chain().focus().setImage({src: result.src, alt: result.altText}).run();
    }

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({src: url}).run()
        }
    }

    const handleImageUpload = async (image: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", image);
        const {data} = await axios.post("/api/image", formData);
        setUploading(false);

        // console.log("the data === ", data);
        setImages([data, ...images]);
    };


    useEffect(() => {
        if (editor && selectionRange) {
            editor.commands.setTextSelection(selectionRange);
        }
    }, [editor, selectionRange])

    useEffect(() => {
        fetchImages()
    }, [])

    return (
        <>
            <div className='p-3 dark:bg-primary-dark bg-primary transition'>
                <input type="text"
                       className="py-2 outline-none bg-transparent w-full border-0 border-b-[1px] border-secondary-dark dark:border-secondary-light text-3xl font-semibold italic text-primary-dark dark:text-primary mb-3"
                       placeholder="Title..."
                />
                <ToolBar editor={editor} onOpenImageClick={() => setShowGallery(true)}/>
                <div className='h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3'/>
                {editor ? <EditLink editor={editor}/> : null}
                <EditorContent editor={editor}/>
                <SEOForm/>
            </div>

            <GalleryModal
                images={images}
                visible={showGallery}
                onClose={() => setShowGallery(false)}
                onSelect={handleImageSelection}
                onFileSelect={handleImageUpload}
                uploading={uploading}
            />
        </>
    )
}

export default Editor