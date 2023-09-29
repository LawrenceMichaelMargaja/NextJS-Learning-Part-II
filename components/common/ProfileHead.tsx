import {FC, useCallback} from 'react';
import Image from "next/image";
import classNames from "classnames";
import {AiFillCaretDown} from "react-icons/ai";

interface Props {
    lightOnly?: boolean;
    avatar?: string;
    initialName?: string;
};

const commonClasses = 'relative flex items-center justify-center rounded-full overflow-hidden w-8 h-8 select-none';

const ProfileHead: FC<Props> = ({lightOnly, initialName, avatar,}): JSX.Element => {

    const getStyle = useCallback(() => {
        if(lightOnly) {
            return 'text-primary-dark bg-primary';
        } else {
            return 'bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary'
        }
    }, [lightOnly]);

    return (
        <div className='flex items-center'>
            {/* Image / name initial */}
            <div className={classNames(commonClasses, getStyle())}>
                {avatar ? (<Image src={avatar} layout='fill' alt='profile'/>) : initialName}
            </div>
            {/*  down icon  */}
            <AiFillCaretDown className={lightOnly ? 'text-primary' : 'text-primary-dark dark:text-primary'} />
        </div>
    );
};

export default ProfileHead;