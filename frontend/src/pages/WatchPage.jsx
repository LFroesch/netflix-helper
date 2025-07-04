import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BanknoteArrowDown, BanknoteArrowUp, ChartNoAxesCombined, ChevronLeft, ChevronRight, CircleDollarSign, Star, Bookmark, BookmarkCheck } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMAGE_BASE_URL, SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import toast from "react-hot-toast";


const WatchPage = () => {
    const {id} = useParams();
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({});
    const [similarContent, setSimilarContent] = useState([]);
    const [credits, setCredits] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const {contentType} = useContentStore();

    const sliderRef = useRef(null);

    useEffect(() => {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
                setTrailers(res.data.trailers);
            } catch (error) {
                if(error.message.includes("404")) {
                    console.error("No trailers found for this content");
                    setTrailers([]);
                } else {
                    console.error("Error fetching trailers:", error);
                }
            }
        };
        getTrailers();
    }, [id, contentType]);

    useEffect(() => {
        const getSimilarContent = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
                setSimilarContent(res.data.similar);
                console.log("Similar content:", res.data.similar);
            } catch (error) {
                if(error.message.includes("404")) {
                    console.error("No similar content found for this content");
                    setSimilarContent([]);
                } else {
                    console.error("Error fetching similar content:", error);
                }
            }
        };
        getSimilarContent();
    }, [id, contentType]);

    useEffect(() => {
        const getContentDetails = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
                setContent(res.data.content);
                console.log(res.data.content);
            } catch (error) {
                if(error.message.includes("404")) {
                    setContent(null);
                    }
                } finally {
                    setLoading(false);
                }
            };
        getContentDetails();
    }, [id, contentType]);

    useEffect(() => {
        const getCredits = async () => {
            try {
                const res = await axios.get(`/api/v1/${contentType}/${id}/credits`);
                setCredits(res.data.content);
            } catch (error) {
                if(error.message.includes("404")) {
                    console.error("No credits found for this content");
                    setCredits(null);
                } else {
                    console.error("Error fetching credits:", error);
                }
            }
        };
        getCredits();
    }, [id, contentType]);

    // Check watchlist status
    useEffect(() => {
        const checkWatchlistStatus = async () => {
            try {
                const res = await axios.get(`/api/v1/watchlist/status/${id}`);
                setIsInWatchlist(res.data.isInWatchlist);
            } catch (error) {
                console.error("Error checking watchlist status:", error);
            }
        };
        if (id) {
            checkWatchlistStatus();
        }
    }, [id]);

    const handleWatchlistToggle = async () => {
        if (!content) return;
        
        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                // Remove from watchlist
                await axios.delete(`/api/v1/watchlist/${id}`);
                setIsInWatchlist(false);
                toast.success("Removed from watchlist");
            } else {
                // Add to watchlist
                await axios.post(`/api/v1/watchlist/add`, {
                    id: parseInt(id),
                    title: content.title || content.name,
                    image: content.poster_path,
                    type: contentType
                });
                setIsInWatchlist(true);
                toast.success("Added to watchlist");
            }
        } catch (error) {
            console.error("Error toggling watchlist:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setWatchlistLoading(false);
        }
    };

    const handlePrev = () => {
        if (currentTrailerIdx > 0) {
            setCurrentTrailerIdx(currentTrailerIdx - 1);
        }
    };
    const handleNext = () => {
        if (currentTrailerIdx < trailers.length - 1) {
            setCurrentTrailerIdx(currentTrailerIdx + 1);
        }
    }; 

    const scrollLeft = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	};
	const scrollRight = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

    // Helper function to format runtime
    const formatRuntime = (minutes) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Helper function to format budget/revenue
    const formatMoney = (amount) => {
        if (!amount || amount === 0) return `N/A`;
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toLocaleString()}`;
    };

    if (loading) return (
			<div className='min-h-screen bg-black p-10'>
				<WatchPageSkeleton />
			</div>
		);

    if (!content) {
		return (
			<div className='bg-black text-white h-screen'>
				<div className='max-w-6xl mx-auto'>
					<Navbar />
					<div className='text-center mx-auto px-4 py-8 h-full mt-40'>
						<h2 className='text-2xl sm:text-5xl font-bold text-balance'>Content not found 😥</h2>
                        {/* new line */}
                        <br />
                        <button className='outline-double outline-1 outline-offset-4'>
                            <Link to='/' className='text-white'>Go back to Home</Link>
                        </button>
					</div>
				</div>
			</div>
		);
	}

    return <div className="bg-black text-white min-h-screen">
        <div className="mx-auto container px-4 py-8 h-full">
            <Navbar />
            {trailers.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                    <button className={`
                        bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ? 
                        "opacity-50 cursor-not-allowed" : ""}
                        `}
                        disabled={currentTrailerIdx === 0}
                        onClick={handlePrev}
                        >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-sm text-gray-400">
                            {currentTrailerIdx + 1} of {trailers.length}
                    </span>
                    <button className={`
                        bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length - 1 ? 
                        "opacity-50 cursor-not-allowed" : ""}
                        `}
                        disabled={currentTrailerIdx === trailers.length - 1}
                        onClick={handleNext}
                        >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            <div className='aspect-video mb-8 p-2 sm:px-10 md:px-32'>
					{trailers.length > 0 && (
						<ReactPlayer
							controls={true}
							width={"100%"}
							height={"70vh"}
							className='mx-auto overflow-hidden rounded-lg'
							url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
						/>
					)}

					{trailers?.length === 0 && (
						<h2 className='text-xl text-center mt-5'>
							No trailers available for{" "}
							<span className='font-bold text-red-600'>{content?.title || content?.name}</span> 😥
						</h2>
					)}
				</div>

                {/* movie/tv details */}
				<div
					className='flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto'
				>
					<div className='mb-4 md:mb-0'>
						<h2 className='text-5xl font-bold text-balance'>{content?.title || content?.name}</h2>

                        {/* Tagline */}
                        {content?.tagline && (
                            <p className='mt-3 text-xl italic text-gray-300'>"{content.tagline}"</p>
                        )}

                        {/* Basic Info Row */}
						<div className='mt-4 flex flex-wrap items-center gap-4 text-lg'>
							<span>
                                {formatReleaseDate(content?.release_date || content?.first_air_date)}
                            </span>
                            <span>•</span>
							<span>
                                {content?.adult ? (
                                    <span className='text-red-600'>18+</span>
                                ) : (
                                    <span className='text-green-600'>PG-13</span>
                                )}
                            </span>

                            {/* Runtime for movies */}
                            {contentType === 'movie' && content?.runtime && (
                                <>
                                    <span>•</span>
                                    <span>{formatRuntime(content.runtime)}</span>
                                </>
                            )}

                            {/* Seasons/Episodes for TV */}
                            {contentType === 'tv' && (
                                <>
                                    {content?.number_of_seasons && (
                                        <>
                                            <span>•</span>
                                            <span>{content.number_of_seasons} Season{content.number_of_seasons !== 1 ? 's' : ''}</span>
                                        </>
                                    )}
                                    {content?.number_of_episodes && (
                                        <>
                                            <span>•</span>
                                            <span>{content.number_of_episodes} Episodes</span>
                                        </>
                                    )}
                                </>
                            )}
						</div>

                        {/* Genres */}
                        {content?.genres && content.genres.length > 0 && (
                            <div className='mt-3'>
                                <div className='flex flex-wrap gap-2'>
                                    {content.genres.map((genre) => (
                                        <span 
                                            key={genre.id} 
                                            className='px-3 py-1 bg-gray-800 rounded-full text-sm'
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rating and Popularity */}
                        {(content?.vote_average || content?.popularity) && (
                            <div className='mt-4 flex flex-wrap items-center gap-6 text-lg'>
                                {content?.vote_average && (
                                    <div className='flex items-center gap-2'>
                                        <Star className='text-yellow-400'/>
                                        <span>{content.vote_average.toFixed(1)}/10</span>
                                    </div>
                                )}
                                {content?.popularity && (
                                    <div className='flex items-center gap-2'>
                                        <ChartNoAxesCombined className='text-blue-400'/>
                                        <span>Popularity Score: {Math.round(content.popularity)}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Budget and Revenue for movies */}
                        {contentType === 'movie' && (
                            <div className='mt-4 space-y-2'>
                                <div className='flex items-center gap-2 text-lg'>
                                    <BanknoteArrowUp className='text-green-400'/>
                                    <span>Box Office: {formatMoney(content?.revenue)}</span>
                                </div>
                                <div className='flex items-center gap-2 text-lg'>
                                    <BanknoteArrowDown className='text-red-500' />
                                    <span>Budget: {formatMoney(content?.budget)}</span>
                                </div>
                            </div>
                        )}

                        {/* Watchlist Button */}
                        <div className='mt-6'>
                            <button
                                onClick={handleWatchlistToggle}
                                disabled={watchlistLoading}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                    isInWatchlist
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gray-600 hover:bg-gray-700'
                                } ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {watchlistLoading ? (
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : isInWatchlist ? (
                                    <BookmarkCheck size={20} />
                                ) : (
                                    <Bookmark size={20} />
                                )}
                                <span>
                                    {watchlistLoading 
                                        ? 'Loading...' 
                                        : isInWatchlist 
                                            ? 'Remove from Watchlist' 
                                            : 'Add to Watchlist'
                                    }
                                </span>
                            </button>
                        </div>

                        {/* Overview */}
						<p className='mt-6 text-lg leading-relaxed'>{content?.overview}</p>
					</div>
					<img
						src={ORIGINAL_IMAGE_BASE_URL + content?.poster_path}
						alt='Poster image'
						className='max-h-[600px] rounded-md'
					/>
				</div>

                {/* Cast Section */}
                {credits && credits.cast && credits.cast.length > 0 && (
                    <div className='mt-12 max-w-6xl mx-auto'>
                        <h3 className='text-3xl font-bold mb-6'>
                            Cast <span className='text-xl text-gray-400'>({credits.cast.filter(person => {
                                return person.profile_path && 
                                        person.character && 
                                        !person.character.toLowerCase().includes('uncredited');
                            }).length} Members)</span>
                        </h3>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                            {credits.cast
                                .filter(person => {
                                    // Filter for relevant cast members
                                    return person.profile_path && 
                                            person.character && 
                                            !person.character.toLowerCase().includes('uncredited');
                                })
                                .slice(0, 12) // Limit to 12 cast members
                                .map((person) => (
                                    <Link 
                                        key={person.id} 
                                        to={`/person/${person.id}`}
                                        className='group'
                                    >
                                        <div className='relative overflow-hidden rounded-lg'>
                                            <img
                                                src={SMALL_IMAGE_BASE_URL + person.profile_path}
                                                alt={person.name}
                                                className='w-full h-auto transition-transform duration-300 group-hover:scale-105'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300' />
                                        </div>
                                        <h4 className='mt-2 text-sm font-semibold line-clamp-2'>{person.name}</h4>
                                        {person.character && (
                                            <p className='text-xs text-gray-400 line-clamp-1'>as {person.character}</p>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
                
				{similarContent.length > 0 && (
					<div className='mt-12 max-w-5xl mx-auto relative'>
						<h3 className='text-3xl font-bold mb-4'>Similar Movies/Tv Show</h3>

						<div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
							 {similarContent
                            .filter((content) => {
                                // Filter for quality similar content
                                return content.poster_path && 
                                    content.vote_count > 5 && // Minimum vote threshold for quality
                                    content.original_language === 'en'; // English content only
                            })
                            .map((content) => {
								if (content.poster_path === null) return null;
								return (
									<Link key={content.id} to={`/watch/${content.id}`} className='w-52 flex-none'>
										<img
											src={SMALL_IMAGE_BASE_URL + content.poster_path}
											alt='Poster path'
											className='w-full h-auto rounded-md'
										/>
										<h4 className='mt-2 text-lg font-semibold'>{content.title || content.name}</h4>
									</Link>
								);
							})}

							<ChevronRight
								className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full'
								onClick={scrollRight}
							/>
							<ChevronLeft
								className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full'
								onClick={scrollLeft}
							/>
						</div>
					</div>
				)}
        </div>
    </div>
}

export default WatchPage