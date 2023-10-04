import { FC } from 'react';

interface Props {};

const SearchBar: FC<Props> = (props): JSX.Element => {
    return (
        <input
            className='border-2 bg-transparent border-secondary-dark p-2 text-primary-dark dark:text-primary rounded focus:border-primary-dark dark:focus:border-primary outline-none transition'
            type="text"
            placeholder="Search..."
        />
    );
};

export default SearchBar;