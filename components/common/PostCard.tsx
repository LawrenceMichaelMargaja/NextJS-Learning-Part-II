import { FC } from 'react';
import {PostDetail} from "../../utils/types";
import Image from "next/image";

interface Props {
    post: PostDetail
}

const PostCard: FC<Props> = ({post}): JSX.Element => {

    const {title, slug, meta, tags, thumbnail, createdAt} = post;

    return (
        <div className="rounded shadow-sm shadow-secondary-dark overflow-hidden bg-primary dark:bg-primary-dark transition flex flex-col h-full">
            {/*{JSON.stringify(post)}*/}
            {/*  Thumbnail  */}
            <div className="aspect-video relative">
                {!thumbnail ? (
                    <div className="w-full h-full flex items-center justify-center text-secondary-dark opacity-50 font-semibold">
                        No Image
                    </div>
                ) : (
                    <Image src={thumbnail} layout='fill' alt="Thumbnail" />
                )}
            </div>

            {/*  Post Info  */}
            <div className="p-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-sm text-primary-dark dark:text-primary">
                    <div className="flex items-center space-x-1">
                        {tags.map((tag, index) => (
                            <span key={tag + index}>
                            #{tag}
                        </span>
                        ))}
                    </div>
                    <span>{createdAt}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;