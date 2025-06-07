import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import { Info, Star, Clock } from 'lucide-react'
import useGetTrendingContent from '../../hooks/useGetTrendingContent.jsx'
import { MOVIE_CATEGORIES, ORIGINAL_IMAGE_BASE_URL, TV_CATEGORIES } from '../../utils/constants.js'
import { useContentStore } from '../../store/content.js'
import MovieSlider from '../../components/MovieSlider.jsx'
import { useState } from 'react'

const HomeScreen = () => {
    const { trendingContent } = useGetTrendingContent();
    const {contentType } = useContentStore();
    const [imgLoading, setImgLoading] = useState(true);
    
    // Helper function to format runtime
    const formatRuntime = (minutes) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if(!trendingContent) return (
        <div className='h-screen text-white relative'>
            <Navbar />
            <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10
            shimmer'
            />
        </div>
    )

    return (
        <>
            <div className='relative h-screen text-white'>
                <Navbar />
                {imgLoading && (
					<div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10' />
				)}
                <img 
                    src={ORIGINAL_IMAGE_BASE_URL + trendingContent?.backdrop_path}
                    alt="Hero img"
                    className='absolute top-0 left-0 w-full h-full object-cover -z-50'
                    onLoad={() => {
                        setImgLoading(false)
                    }}
                />
                <div className='absolute top-0 left-0 w-full h-full -z-50 bg-black/50'
                aria-hidden='true'/>

                <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center
                px-8 md:px-16 lg:px-32'>
                <div
                    className='bg-gradient-to-b from-black via-transparent to-transparent
                    absolute w-full h-full top-0 left-0 -z-10'
                    />
                    <div className='max-w-2xl'>
                        <h1 className='mt-4 text-6xl font-extrabold text-balance'>
                            {trendingContent?.title || trendingContent?.name}
                        </h1>
                        
                        {/* Enhanced info section with runtime, rating, and parental rating */}
                        <div className='mt-4 flex flex-wrap items-center gap-4 text-lg'>
                            <span>
                                {trendingContent?.release_date?.split("-")[0] ||
                                    trendingContent?.first_air_date?.split("-")[0]}
                            </span>
                            
                            {/* Parental Rating */}
                            <span>•</span>
                            <span>
                                {trendingContent?.adult ? (
                                    <span className='bg-red-600 px-2 py-1 rounded text-sm font-semibold'>18+</span>
                                ) : (
                                    <span className='bg-green-600 px-2 py-1 rounded text-sm font-semibold'>PG-13</span>
                                )}
                            </span>

                            {/* Runtime for movies */}
                            {contentType === 'movie' && trendingContent?.runtime && (
                                <>
                                    <span>•</span>
                                    <div className='flex items-center gap-1'>
                                        <Clock className='size-4' />
                                        <span>{formatRuntime(trendingContent.runtime)}</span>
                                    </div>
                                </>
                            )}

                            {/* Seasons info for TV shows */}
                            {contentType === 'tv' && trendingContent?.number_of_seasons && (
                                <>
                                    <span>•</span>
                                    <span>{trendingContent.number_of_seasons} Season{trendingContent.number_of_seasons !== 1 ? 's' : ''}</span>
                                </>
                            )}

                            {/* Rating */}
                            {trendingContent?.vote_average && (
                                <>
                                    <span>•</span>
                                    <div className='flex items-center gap-1'>
                                        <Star className='size-4 text-yellow-400 fill-yellow-400' />
                                        <span className='font-semibold'>{trendingContent.vote_average.toFixed(1)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <p className='mt-4 text-lg'>
                            {trendingContent?.overview.length > 200
								? trendingContent?.overview.slice(0, 200) + "..."
								: trendingContent?.overview}
                        </p>
                    </div>
                    
                    {/*More Info */}
                    <div className='flex mt-8'>
						<Link
							to={`/watch/${trendingContent?.id}`}
							className='bg-gray-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg flex items-center
                            transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl'
						>
							<Info className='size-6 mr-2' />
							More Info
						</Link>
					</div>
                </div>
            </div>

            <div className='flex flex-col gap-10 bg-black py-10'>
                {contentType === "movie" 
                    ? MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)
                    : TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}
            </div>
        </>
  )
}

export default HomeScreen