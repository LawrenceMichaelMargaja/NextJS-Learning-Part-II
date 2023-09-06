import React, { FC } from 'react'
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {}

const Editor: FC<Props> = (props): JSX.Element => { 
    const editor = useEditor({
        extensions: [
            StarterKit
        ]
    });
  
    return (
    <EditorContent editor={editor}/>
  )
}

export default Editor