import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useContentStore } from "../store/content";

function formatDate(dateString) {
	const date = new Date(dateString);
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = monthNames[date.getUTCMonth()];
	const day = date.getUTCDate();
	const year = date.getUTCFullYear();
	return `${month} ${day}, ${year}`;
}

const WatchlistPage = () => {
	const [watchlist, setWatchlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const { setContentType } = useContentStore();

	useEffect(() => {
		const getWatchlist = async () => {
			try {
				const res = await axios.get(`/api/v1/watchlist`);
				setWatchlist(res.data.content);
			} catch (error) {
				console.error("Error fetching watchlist:", error);
				setWatchlist([]);
			} finally {
				setLoading(false);
			}
		};
		getWatchlist();
	}, []);

	const handleDelete = async (item, e) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await axios.delete(`/api/v1/watchlist/${item.id}`);
			setWatchlist(watchlist.filter((watchItem) => watchItem.id !== item.id));
			toast.success("Removed from watchlist");
		} catch (error) {
			console.error("Error removing from watchlist:", error);
			toast.error("Failed to remove from watchlist");
		}
	};

	const handleItemClick = (item) => {
		setContentType(item.type);
	};

	if (loading) {
		return (
			<div className='bg-black min-h-screen text-white'>
				<Navbar />
				<div className='max-w-6xl mx-auto px-4 py-8'>
					<h1 className='text-3xl font-bold mb-8'>My Watchlist</h1>
					<div className='flex justify-center items-center h-96'>
						<div className='animate-pulse'>
							<div className='bg-gray-700 rounded-md w-40 h-6 mb-4 shimmer'></div>
							<div className='bg-gray-700 rounded-md w-full h-32 mb-4 shimmer'></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (watchlist?.length === 0) {
		return (
			<div className='bg-black min-h-screen text-white'>
				<Navbar />
				<div className='max-w-6xl mx-auto px-4 py-8'>
					<h1 className='text-3xl font-bold mb-8'>My Watchlist</h1>
					<div className='flex flex-col justify-center items-center h-96'>
						<p className='text-xl mb-4'>Your watchlist is empty</p>
						<p className='text-gray-400 mb-8'>Start adding movies and TV shows you want to watch!</p>
						<Link 
							to="/search" 
							className='bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded'
						>
							Browse Content
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-black text-white min-h-screen'>
			<Navbar />

			<div className='max-w-6xl mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold mb-8'>
					My Watchlist 
					<span className='text-xl text-gray-400 ml-2'>({watchlist.length} items)</span>
				</h1>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{watchlist?.map((item) => (
						<Link
							key={item.id}
							to={`/watch/${item.id}`}
							onClick={() => handleItemClick(item)}
							className='bg-gray-800 p-4 rounded flex items-start cursor-pointer hover:bg-gray-700 transition-colors group'
						>
							<img
								src={SMALL_IMAGE_BASE_URL + item.image}
								alt={item.title}
								className='size-16 rounded object-cover mr-4'
							/>
							<div className='flex flex-col flex-1'>
								<span className='text-white text-lg group-hover:text-red-400 transition-colors'>
									{item.title}
								</span>
								<span className='text-gray-400 text-sm'>
									Added {formatDate(item.createdAt)}
								</span>
							</div>

							<div className='flex items-center gap-2'>
								<span
									className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ${
										item.type === "movie"
											? "bg-red-600"
											: "bg-blue-600"
									}`}
								>
									{item.type === "movie" ? "Movie" : "TV Show"}
								</span>
								<Trash
									className='size-5 cursor-pointer hover:fill-red-600 hover:text-red-600 transition-colors z-20'
									onClick={(e) => handleDelete(item, e)}
								/>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default WatchlistPage;