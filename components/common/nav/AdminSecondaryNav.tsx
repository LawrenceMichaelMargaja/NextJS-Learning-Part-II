import {FC} from 'react';
import DropdownOptions, {dropDownOptions} from "../DropdownOptions";
import ProfileHead from "../ProfileHead";
import {useRouter} from "next/router";
import useDarkMode from "../../../hooks/useDarkMode";
import {signOut} from "next-auth/react";
import SearchBar from "../SearchBar";

interface Props {
};

const AdminSecondaryNav: FC<Props> = (props): JSX.Element => {

    const router = useRouter();
    const { toggleTheme } = useDarkMode();

    const navigateToCreateNewPost = () => {
        router.push('/admin/posts/create');
    }

    const handleLogOut = async () => {
        await signOut();
    }

    const options: dropDownOptions = [
        {
            label: 'Add New Post',
            onClick: navigateToCreateNewPost,
        },
        {
            label: 'Change Theme',
            onClick: toggleTheme,
        },
        {
            label: 'Log Out',
            onClick: handleLogOut,
        },
    ]

    return (
        <div className='flex items-center justify-between'>
            {/*  Search bar  */}
            <SearchBar/>
            {/*  options / Profile Head  */}
            <DropdownOptions options={options} head={<ProfileHead initialName="L" />}/>
        </div>
    );
};

export default AdminSecondaryNav;