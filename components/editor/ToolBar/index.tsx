import { FC } from 'react';
import { Editor } from '@tiptap/react';
import DropdownOptions from '@/components/common/DropdownOptions';
import { AiFillCaretDown } from 'react-icons/ai';
import { getFocusedEditor } from '../EditorUtils';

interface Props {
    editor: Editor | null;
}

const ToolBar: FC<Props> = ({editor}): JSX.Element | null => {
    if(!editor) return null;

    const options = [
        {label: "Paragraph", onClick: () => {
            getFocusedEditor(editor).setParagraph().run();
        }},
        {label: "Heading 1", onClick: () => {
            getFocusedEditor(editor).toggleHeading({ level: 1 }).run();
        }},
        {label: "Heading 2", onClick: () => {
            getFocusedEditor(editor).toggleHeading({ level: 2 }).run();
        }},
        {label: "Heading 3", onClick: () => {
            getFocusedEditor(editor).toggleHeading({ level: 3 }).run();
        }},
    ]

    const getLabel = (): string => {
        if(editor.isActive('heading', {level: 1})) return 'Heading 1';
        if(editor.isActive('heading', {level: 2})) return 'Heading 2';
        if(editor.isActive('heading', {level: 3})) return 'Heading 3';

        return "Paragraph"
    }

    const Head = () => {
        return (
            <div className='flex'>
                <p>{getLabel()}</p>
                <AiFillCaretDown/>
            </div>
        )
    }

    return (
        <div className='flex items-center space-x-2 text-primary-dark dark:text-primary'>
            <DropdownOptions
                options={options}
                head={<Head/>}
            />
        </div>
    )
}

export default ToolBar;