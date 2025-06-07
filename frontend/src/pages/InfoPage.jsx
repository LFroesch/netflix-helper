import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Search, Bookmark, History, Play, Users, Tv, Film } from "lucide-react";

const InfoPage = () => {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto container px-4 py-8">
                <Navbar />
                
                {/* Hero Section */}
                <div className="text-center py-16 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                        Welcome to Netflix Clone
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Discover, watch, and organize your favorite movies and TV shows. 
                        Your entertainment journey starts here.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    
                    {/* Browse Movies */}
                    <Link to="/" onClick={() => window.dispatchEvent(new CustomEvent('setContentType', { detail: 'movie' }))}>
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <Film className="text-red-500 mr-3 group-hover:text-red-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-red-400 transition-colors">Browse Movies</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Explore trending movies, discover new releases, and find classics across different categories like popular, top rated, and upcoming.
                            </p>
                        </div>
                    </Link>

                    {/* Browse TV Shows */}
                    <Link to="/" onClick={() => window.dispatchEvent(new CustomEvent('setContentType', { detail: 'tv' }))}>
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <Tv className="text-blue-500 mr-3 group-hover:text-blue-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-blue-400 transition-colors">Browse TV Shows</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Dive into binge-worthy series, from currently airing shows to completed masterpieces. Find your next obsession.
                            </p>
                        </div>
                    </Link>

                    {/* Search Content */}
                    <Link to="/search">
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <Search className="text-green-500 mr-3 group-hover:text-green-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-green-400 transition-colors">Search & Discover</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Find specific movies, TV shows, or actors. Search across our entire database to discover exactly what you're looking for.
                            </p>
                        </div>
                    </Link>

                    {/* My Watchlist */}
                    <Link to="/watchlist">
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <Bookmark className="text-purple-500 mr-3 group-hover:text-purple-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-purple-400 transition-colors">My Watchlist</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Save movies and shows you want to watch later. Build your personal collection and never forget what caught your interest.
                            </p>
                        </div>
                    </Link>

                    {/* Actor Profiles */}
                    <Link to="/search">
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <Users className="text-yellow-500 mr-3 group-hover:text-yellow-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-yellow-400 transition-colors">Actor Profiles</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Explore detailed actor profiles, see their filmography, and discover new content through your favorite stars.
                            </p>
                        </div>
                    </Link>

                    {/* Search History */}
                    <Link to="/history">
                        <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:scale-105 group cursor-pointer h-full flex flex-col">
                            <div className="flex items-center mb-4">
                                <History className="text-orange-500 mr-3 group-hover:text-orange-400" size={32} />
                                <h3 className="text-2xl font-semibold group-hover:text-orange-400 transition-colors">Search History</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed flex-grow">
                                Revisit your previous searches and quickly find content you've looked for before. Never lose track of your discoveries.
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Quick Start Section */}
                <div className="text-center py-12 max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8">Ready to Start Watching?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            to="/" 
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105"
                        >
                            <Play className="fill-white" size={24} />
                            Browse Content
                        </Link>
                        <Link 
                            to="/search" 
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105"
                        >
                            <Search size={24} />
                            Search Now
                        </Link>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="max-w-4xl mx-auto bg-gray-900/30 rounded-xl p-8 border border-gray-800">
                    <h3 className="text-2xl font-bold mb-6 text-center">Pro Tips</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">
                                <span className="text-white font-semibold">Quick Navigation:</span> Use the navbar to switch between Movies and TV Shows instantly.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">
                                <span className="text-white font-semibold">Save for Later:</span> Add interesting content to your watchlist while browsing.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">
                                <span className="text-white font-semibold">Discover More:</span> Check out similar content and cast members on watch pages.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">
                                <span className="text-white font-semibold">Search Smart:</span> Use the person search to find content by your favorite actors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;