import { NextPage } from 'next';
import { FC, useState } from 'react';
import Button from '../ToolBar/Button';
import { BsYoutube } from 'react-icons/bs';


interface Props {
    onSubmit(link: string): void;
}

const EmbedYoutube: FC<Props> = ({ onSubmit }): JSX.Element => {

    const [url, setUrl] = useState('');
    const [visible, setVisible] = useState(false);

    const showForm = () => setVisible(true);
    const hideForm = () => setVisible(false); 

    const handleSubmit = () => {
        if(!url.trim()) return hideForm();
        
        onSubmit(url);
        hideForm();
    }

    return (
        <div onKeyDown={({key}) => {
            if(key === 'Escape') hideForm();
        }} className="relative">
            <div onClick={visible ? hideForm : showForm}>
                <BsYoutube/>
            </div>
            {visible && 
            <div className="absolute top-full mt-4 right-0 z-50">
                <div className="flex space-x-2">
                    <input 
                        autoFocus
                        type="text" 
                        className='bg-transparent rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary'
                        placeholder='https://YouTube.com'
                        value={url}
                        onChange={({target}) => setUrl(target.value)}
                    />
                    <button 
                        className='bg-action p-2 text-primary rounded text-sm'
                        onClick={handleSubmit}
                    >
                        Embed
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default EmbedYoutube;