import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import Logo from '../Logo';
import { IconType } from 'react-icons';
import { RiMenuUnfoldFill, RiMenuFoldFill } from 'react-icons/ri';

interface Props {
    navItems: {label: string, icon: IconType, href: string}[]
}

const NAV_OPEN_WIDTH = 'w-60'
const NAV_CLOSE_WIDTH = 'w-12'
const NAV_VISIBILITY = 'nav-visibility'

const AdminNav: FC<Props> = ({navItems}) => {

    const [visible, setVisible] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const toggleNav = (visibility: boolean) => {
        const currentNav = navRef.current;
        if(!currentNav) return;

        const {classList} = currentNav
        if(visibility) {
            // hide our nav
            classList.remove(NAV_OPEN_WIDTH);
            classList.add(NAV_CLOSE_WIDTH);
        } else {
            // show our nav
            classList.remove(NAV_CLOSE_WIDTH);
            classList.add(NAV_OPEN_WIDTH);
        }
    }

    const updateNavState = () => {
        // The code is my code and it works but I am going to use the code from the tutorial.
        // setVisible(visible => !visible);
        // console.log("the visible status === ", visible);
        
        toggleNav(visible);

        const newState = !visible;
        setVisible(newState);
        localStorage.setItem(NAV_VISIBILITY, JSON.stringify(newState));
    }

    useEffect(() => {
        const navState = localStorage.getItem(NAV_VISIBILITY);
        if(navState !== null) {
            const newState = JSON.parse(navState);
            setVisible(newState);
            toggleNav(!newState);
        } else {
            setVisible(true);
        }
    }, []);

    return (
        <nav ref={navRef} className='h-screen w-60 shadow-sm bg-secondary-light dark:bg-secondary-dark  flex flex-col justify-between transition-width overflow-hidden sticky top-0'>
            <div>
                <Link href="/admin">
                    <div className='flex items-center space-x-2 p-3 mb-10'>
                        <Logo className='fill-highlight-light dark:fill-highlight-dark w-5 h-5' />
                        {visible && <span className='text-highlight-light leading-none dark:text-highlight-dark text-xl font-semibold'>Admin</span>}
                    </div>
                </Link>

                {/* nav items */}
                <div className='space-y-6'>

                    {navItems.map((item) => {
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className='flex items-center text-highlight-light dark:text-highlight-dark text-xl p-3 hover:scale-[0.98] transition'>
                                    <item.icon size={24} />
                                    {visible && <span className='ml-2 leading-none'>{item.label}</span>}
                                </div>
                            </Link>
                        )
                    })}

                </div>
            </div>

            {/*  nav toggler button  */}
            <button 
                onClick={updateNavState}
                className='text-highlight-light dark:text-highlight-dark p-3 hover:scale-[0.98] transition self-end'>
                    {visible ? <RiMenuFoldFill size={25}/> : <RiMenuUnfoldFill size={25}/>}
                    {/* <RiMenuUnfoldFill/> */}
            </button>
        </nav>
    )
}

export default AdminNav;