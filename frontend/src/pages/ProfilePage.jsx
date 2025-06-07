import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { Edit3, Calendar, Users, Bookmark } from "lucide-react";
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

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBio, setEditingBio] = useState(false);
    const [bioText, setBioText] = useState("");
    const { setContentType } = useContentStore();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Get current user profile
                const profileRes = await axios.get('/api/v1/profile/me');
                setUser(profileRes.data.user);
                setBioText(profileRes.data.user.bio || "");

                // Get suggested users
                const suggestedRes = await axios.get('/api/v1/profile/suggested');
                setSuggestedUsers(suggestedRes.data.users);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleBioSave = async () => {
        try {
            const res = await axios.put('/api/v1/profile/bio', { bio: bioText });
            setUser(res.data.user);
            setEditingBio(false);
            toast.success("Bio updated successfully");
        } catch (error) {
            console.error("Error updating bio:", error);
            toast.error("Failed to update bio");
        }
    };

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

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto container px-4 py-8">
                <Navbar />
                
                {/* User Profile Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 mb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <img
                                src={user?.image}
                                alt={user?.username}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
                                <p className="text-gray-400 mb-4">{user?.email}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>Joined {formatDate(user?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Bookmark size={16} />
                                        <span>{user?.watchlist?.length || 0} items in watchlist</span>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold">Bio</h3>
                                        <button
                                            onClick={() => setEditingBio(!editingBio)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                    
                                    {editingBio ? (
                                        <div>
                                            <textarea
                                                value={bioText}
                                                onChange={(e) => setBioText(e.target.value)}
                                                className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white resize-none"
                                                rows="3"
                                                maxLength="500"
                                                placeholder="Tell others about yourself..."
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-gray-400">{bioText.length}/500</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setBioText(user?.bio || "");
                                                            setEditingBio(false);
                                                        }}
                                                        className="px-4 py-2 text-gray-400 hover:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleBioSave}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 leading-relaxed">
                                            {user?.bio || "No bio yet. Click the edit icon to add one!"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Watchlist Preview */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">My Watchlist</h2>
                            <Link to="/watchlist" className="text-red-500 hover:text-red-400">
                                View All
                            </Link>
                        </div>
                        
                        {user?.watchlist?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {user.watchlist.slice(0, 6).map((item) => (
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
                                        </div>
                                        <h4 className="mt-2 text-sm font-semibold line-clamp-2">{item.title}</h4>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">
                                Your watchlist is empty. <Link to="/search" className="text-red-500 hover:text-red-400">Start adding some content!</Link>
                            </p>
                        )}
                    </div>

                    {/* Discover Other Users */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Users size={24} />
                            Discover Other Users
                        </h2>
                        
                        {suggestedUsers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {suggestedUsers.map((suggestedUser) => (
                                    <Link
                                        key={suggestedUser._id}
                                        to={`/user/${suggestedUser._id}`}
                                        className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={suggestedUser.image}
                                                alt={suggestedUser.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold group-hover:text-red-400 transition-colors">
                                                    {suggestedUser.username}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {suggestedUser.watchlist?.length || 0} items in watchlist
                                                </p>
                                                {suggestedUser.bio && (
                                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                                        {suggestedUser.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">
                                No other users found. Be the first to explore!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;