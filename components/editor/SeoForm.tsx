import {ChangeEventHandler, FC, useEffect, useState} from 'react';
import classnames from 'classnames';
import slugify from 'slugify';

export interface SeoResult {
    meta: string;
    slug: string;
    tags: string;
}

interface Props {
    initialValue?: SeoResult;
    title?: string;
    onChange(result: SeoResult): void;
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

const SEOForm: FC<Props> = ({title = "", onChange, initialValue}): JSX.Element => {

    const [values, setValues] = useState({meta: '', slug: '', tags: ''});

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLInputElement> = ({target}) => {
        let {name, value} = target
        /**
         * The commented out code is below and it works but I decided to use the code from the tutorial.
         * The reason is because my code works for stoping at 150 characters but you cannot remove added values.
         */
        // if(name === 'meta' && meta.length === 150) {
        //     return
        // }
        if(name === 'meta') value = value.substring(0, 150);
        console.log("the target.name === ", target.name);
        const newValues = {...values, [name]: value}
        setValues(newValues);
        onChange(newValues);
    }

    useEffect(() => {
        const slug = slugify(title.toLocaleLowerCase())
        const newValues = {...values, slug}
        setValues(newValues);
        onChange(newValues);
    }, [title])

    useEffect(() => {
        if(initialValue) {
            setValues({...initialValue, slug: slugify(initialValue.slug)})
        }
    }, [initialValue])

    const {meta, slug, tags} = values;

    return (
        <div className="space-y-4">
            <h1 className="text-primary-dark dark:text-primary text-xl font-semibold">
                SEO Section
            </h1>

            <Input
                name="slug"
                placeholder="slug-goes-here"
                label="Slug:"
                value={slug}
                onChange={handleChange}
            />
            <Input
                name="tags"
                placeholder="React, Next JS"
                label="Tags:"
                value={tags}
                onChange={handleChange}
            />
            <div className="relative">
                <textarea
                    name="meta"
                    value={meta}
                    className={classnames(commonInput, 'text-lg h-20 resize-none')}
                    placeholder="meta description"
                    onChange={handleChange}
                >

                </textarea>
                <p>{meta.length}/150</p>
            </div>
        </div>
    )

};

export default SEOForm;