import { NextPage } from 'next';
import { FC } from 'react';
import Image from './Image';
import { BsCardImage } from 'react-icons/bs'


/**
 * How is "uploading" working here when I don't it as props when I render this component in Gallery Modal?
 */
interface Props {
    images: {src: string}[];
    onSelect(src: string): void; 
    uploading?: boolean;
    selectedImage?: string;
}

const Gallery: FC<Props> = ({images, uploading = false, selectedImage = '', onSelect}): JSX.Element => {
    return (
        <div className='flex flex-wrap'>
            {uploading && 
                <div className='basis-1/4 p-2 aspect-square flex flex-col items-center justify-center bg-secondary-light text-primary-dark rounded animate-pulse'>
                    <BsCardImage size={60}/>
                    <p>Uploading</p>
                </div>
            }
            {images.map(({src}, index) => {
                return (
                    <div key={index} className="basis-1/4 p-2">
                        <Image onClick={() => onSelect(src)} src={src} selected={selectedImage === src}/>
                    </div>
                )
            })}
        </div>
    )
}

export default Gallery;