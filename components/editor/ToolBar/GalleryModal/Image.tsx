import { FC } from 'react';
import NextImage from 'next/legacy/image';
import CheckMark from '@/components/common/CheckMark';

interface Props {
    src: string;
    selected?: boolean;
    onClick?(): void;
    alt: string;
}

const Image: FC<Props> = ({src, selected, onClick}): JSX.Element => {
    return (
        <div onClick={onClick} className='relative rounded overflow-hidden cursor-pointer'>
            <NextImage 
                className='bg-secondary-light hover:scale-110 transition'
                src={src} 
                alt='Gallery Image' 
                objectFit='cover'
                width={200} 
                height={200}
            />
            <div className="absolute top-2 left-2">
                <CheckMark visible={selected || false}/>
            </div>
        </div>
    )
}

export default Image;