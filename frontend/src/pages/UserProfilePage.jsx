import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { Calendar, Bookmark, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useContentStore } from "../store/content";

function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

const UserProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setContentType } = useContentStore();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`/api/v1/profile/users/${id}`);
                setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                if (error.response?.status === 404) {
                    toast.error("User not found");
                } else {
                    toast.error("Failed to load user profile");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserProfile();
        }
    }, [id]);

    const handleWatchlistItemClick = (item) => {
        setContentType(item.type);
    };

    if (loading) {
        return (
            <div className='bg-black min-h-screen text-white'>
                <Navbar />
                <div className='max-w-6xl mx-auto px-4 py-8'>
                    <div className='animate-pulse'>
                        <div className='bg-gray-700 rounded-md w-40 h-6 mb-4 shimmer'></div>
                        <div className='bg-gray-700 rounded-md w-full h-32 mb-4 shimmer'></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className='bg-black text-white h-screen'>
                <div className='max-w-6xl mx-auto'>
                    <Navbar />
                    <div className='text-center mx-auto px-4 py-8 h-full mt-40'>
                        <h2 className='text-2xl sm:text-5xl font-bold text-balance'>User not found 😥</h2>
                        <br />
                        <Link to='/profile' className='text-red-500 hover:text-red-400 underline'>
                            Back to Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto container px-4 py-8">
                <Navbar />
                
                {/* Back Button */}
                <div className="max-w-4xl mx-auto mb-4">
                    <Link 
                        to="/profile" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to My Profile
                    </Link>
                </div>

                {/* User Profile Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 mb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <img
                                src={user.image}
                                alt={user.username}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Bookmark size={16} />
                                        <span>{user.watchlist?.length || 0} items in watchlist</span>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {user.bio || "This user hasn't written a bio yet."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User's Watchlist */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            {user.username}'s Watchlist
                        </h2>
                        
                        {user.watchlist?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {user.watchlist.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/watch/${item.id}`}
                                        onClick={() => handleWatchlistItemClick(item)}
                                        className="group"
                                    >
                                        <div className="relative overflow-hidden rounded-lg">
                                            <img
                                                src={SMALL_IMAGE_BASE_URL + item.image}
                                                alt={item.title}
                                                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                                        </div>
                                        <h4 className="mt-2 text-sm font-semibold line-clamp-2 group-hover:text-red-400 transition-colors">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    item.type === "movie"
                                                        ? "bg-red-600/20 text-red-400"
                                                        : "bg-blue-600/20 text-blue-400"
                                                }`}
                                            >
                                                {item.type === "movie" ? "Movie" : "TV Show"}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg mb-4">
                                    {user.username} hasn't added anything to their watchlist yet.
                                </p>
                                <Link 
                                    to="/search" 
                                    className="text-red-500 hover:text-red-400 underline"
                                >
                                    Discover content to add to your own watchlist
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;