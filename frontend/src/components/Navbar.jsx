import { LogOut, Menu, Search, Bookmark, Info } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {user, logout} = useAuthStore();
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

	const { setContentType } = useContentStore();

    return (
		<header className='max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
			<div className='flex items-center gap-10 z-50'>
				<Link to='/'>
					<img src='/streaming-logo.svg' alt='Streaming Helper Logo' className='w-60 sm:w-40' />
				</Link>

				{/* desktop navbar items */}
				<div className='hidden sm:flex gap-2 items-center'>
					<Link to='/' className='outline-double outline-1 outline-offset-4 hover:text-red-500' onClick={() => setContentType("movie")}>
						Movies
					</Link>
					<p>{" "}</p>
					<Link to='/' className='outline-double outline-1 outline-offset-4 hover:text-red-500' onClick={() => setContentType("tv")}>
						Tv Shows
					</Link>
					<p>{" "}</p>
					<Link to='/watchlist' className='outline-double outline-1 outline-offset-4 hover:text-red-500'>
						My Watchlist
					</Link>
					<p>{" "}</p>
					<Link to='/history' className='outline-double outline-1 outline-offset-4 hover:text-red-500'>
						Search History
					</Link>
					<p>{" "}</p>
					<Link to='/info' className='outline-double outline-1 outline-offset-4 hover:text-red-500'>
						Help
					</Link>
				</div>
			</div>

			<div className='flex gap-2 items-center z-50'>
				<Link to={"/search"}>
					<Search className='size-6 cursor-pointer' />
				</Link>
				<Link to={"/watchlist"}>
					<Bookmark className='size-6 cursor-pointer hover:text-red-500 transition-colors' />
				</Link>
				<Link to={"/info"}>
					<Info className='size-6 cursor-pointer hover:text-red-500 transition-colors' />
				</Link>
				<Link to={"/profile"}>
					<img src={user.image} alt='Avatar' className='h-8 rounded cursor-pointer hover:ring-2 hover:ring-red-500 transition-all'/>
				</Link>
				<LogOut className='size-6 cursor-pointer' onClick={logout} />
				<div className='sm:hidden'>
					<Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu} />
				</div>
			</div>

			{/* mobile navbar items */}
			{isMobileMenuOpen && (
				<div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
					<Link to={"/"} className='block hover:underline p-2' onClick={() => {toggleMobileMenu(); setContentType("movie");}}>
						Movies
					</Link>
					<Link to={"/"} className='block hover:underline p-2' onClick={() => {toggleMobileMenu(); setContentType("tv");}}>
						Tv Shows
					</Link>
					<Link to={"/watchlist"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						My Watchlist
					</Link>
					<Link to={"/history"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Search History
					</Link>
					<Link to={"/info"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Help
					</Link>
				</div>
			)}
		</header>
	);
};
export default Navbar;