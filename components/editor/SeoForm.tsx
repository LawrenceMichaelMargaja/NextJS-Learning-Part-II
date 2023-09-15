import {ChangeEventHandler, FC} from 'react';
import classnames from 'classnames';

interface Props {
}

const commonInput = "w-full bg-transparent outline-none border-2 border-secondary-dark focus:border-primary-dark focus:dark:border-primary rounded transition p-2 text-primary-dark dark:text-primary"

const Input: FC<{
    name?: string
    label?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
    value?: string
    placeholder?: string
}> = ({name, label, onChange, value, placeholder}) => {
    return (
        <label className='block relative'>
                <span
                    className='absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-dark dark:text-primary pl-2'>
                    {label}
                </span>
            <input
                type="text"
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={classnames(commonInput, 'italic pl-10')}
            />
        </label>
    )
}

const SEOForm: FC<Props> = (props): JSX.Element => {
    return (
        <div className="space-y-4">
            <h1 className="text-primary-dark dark:text-primary text-xl font-semibold">
                SEO Section
            </h1>

            <Input
                name="slug"
                placeholder="slug-goes-here"
                label="Slug:"
            />
            <Input
                name="tags"
                placeholder="React, Next JS"
                label="Tags:"
            />

            <textarea className={classnames(commonInput, 'text-lg h-20 resize-none')} placeholder="meta description">

            </textarea>
        </div>
    )

};

export default SEOForm;