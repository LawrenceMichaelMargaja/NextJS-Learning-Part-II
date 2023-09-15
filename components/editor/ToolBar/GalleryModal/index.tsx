import ModalContainer, {ModalProps} from '@/components/common/ModalContainer';
import {FC, useState, useCallback, ChangeEventHandler} from 'react';
import Gallery from './Gallery';
import Image from 'next/image';
import ActionButton from '@/components/common/ActionButton';
import {AiOutlineCloudUpload} from 'react-icons/ai';

export interface ImageSelectionResult {
    src: string;
    altText: string;
}

interface Props extends ModalProps {
    images: { src: string }[]

    onFileSelect(image: File): void;

    onSelect(result: ImageSelectionResult): void;

    uploading?: boolean;
}

/**
 * This component is the modal where we can see and select images. It also contains a button that allows us to upload an image of our own.
 * It accepts as props, visible, onImageSelect, onSelect, and onClose.
 *
 * Functions of the different props
 * 1. visible = if visible is true, the gallery modal appears.
 * 2. onImageSeelect
 */
const GalleryModal: FC<Props> = ({
                                     visible,
                                     images,
                                     uploading,
                                     onFileSelect,
                                     onSelect,
                                     onClose
                                 }): JSX.Element => {

    /**
     * This state sets the selected image and is not the state that holds the uploaded images.
     */
    const [selectedImage, setSelectedImage] = useState('');
    const [altText, setAltText] = useState('');

    const handleClose = useCallback(() => {
        onClose && onClose();
    }, [onClose])

    const handleOnImageChange: ChangeEventHandler<HTMLInputElement> = ({target}) => {
        const {files} = target;
        if (!files) return

        const file = files[0];
        if (!file.type.startsWith('image')) {
            return handleClose();
        }

        onFileSelect(file)
    }

    const handleSelection = () => {
        if (!selectedImage) return handleClose();
        onSelect({src: selectedImage, altText: altText})
        handleClose()
    }

    return (
        <ModalContainer visible={visible} onClose={onClose}>
            <div className="max-w-4xl p-2 bg-primary-dark dark:bg-primary rounded">
                <div className="flex">
                    {/* gallery */}
                    <div className="basis-[75%] max-h-[450px] overflow-y-auto custom-scroll-bar">
                        <Gallery
                            images={images}
                            onSelect={(src) => setSelectedImage(src)}
                            selectedImage={selectedImage}
                            uploading={uploading}
                        />
                    </div>

                    {/* image selection and upload */}
                    <div className="basis-1/4 px-2">
                        <div className="space-y-4">
                            <div>
                                {/* this causes an error -> handleOnImageChange */}
                                <input onChange={handleOnImageChange} hidden type="file" id='image-input'/>
                                <label htmlFor="image-input">
                                    <div
                                        className='w-full border-2 border-action text-action flex items-center justify-center space-x-2 p-2 cursor-pointer rounded'>
                                        <AiOutlineCloudUpload/>
                                        <span>Upload Image</span>
                                    </div>
                                </label>
                            </div>
                            {selectedImage ? (
                                <>
                                    <textarea
                                        className='resize-none w-full bg-transparent rounded border-2 border-secondary-dark focus:ring-1 text-primary dark:text-primary-dark h-32 p-1'
                                        placeholder='Alt Text'
                                        value={altText}
                                        onChange={({target}) => setAltText(target.value)}
                                    ></textarea>
                                    <ActionButton onClick={handleSelection} title='Select'/>

                                    <div className='relative aspect-video bg-png-pattern'>
                                        <Image src={selectedImage} alt='an image' layout='fill' objectFit='contain'/>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}

export default GalleryModal;