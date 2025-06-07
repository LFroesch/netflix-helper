import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ORIGINAL_IMAGE_BASE_URL, SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import { useContentStore } from "../store/content";

const PersonPage = () => {
    const { id } = useParams();
    const [person, setPerson] = useState({});
    const [movieCredits, setMovieCredits] = useState(null);
    const [tvCredits, setTvCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMovieSectionExpanded, setIsMovieSectionExpanded] = useState(true);
    const [isTvSectionExpanded, setIsTvSectionExpanded] = useState(true);
    const { setContentType } = useContentStore();

    useEffect(() => {
        const getPersonData = async () => {
            try {
                // Get person details
                const personRes = await axios.get(`/api/v1/person/${id}/details`);
                setPerson(personRes.data.content);
                console.log("Person data:", personRes.data.content);

                // Get movie credits
                try {
                    const movieRes = await axios.get(`/api/v1/person/${id}/movie-credits`);
                    setMovieCredits(movieRes.data.content);
                } catch (error) {
                    console.log("Failed to fetch movie credits:", error);
                }

                // Get TV credits
                try {
                    const tvRes = await axios.get(`/api/v1/person/${id}/tv-credits`);
                    setTvCredits(tvRes.data.content);
                } catch (error) {
                    console.log("Failed to fetch TV credits:", error);
                }

            } catch (error) {
                if (error.message.includes("404")) {
                    setPerson(null);
                }
            } finally {
                setLoading(false);
            }
        };
        getPersonData();
    }, [id]);

    // Helper function to calculate age
    const calculateAge = (birthDate, deathDate = null) => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        const end = deathDate ? new Date(deathDate) : new Date();
        const age = end.getFullYear() - birth.getFullYear();
        const monthDiff = end.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
            return age - 1;
        }
        return age;
    };

    if (loading) return (
        <div className='min-h-screen bg-black p-10'>
            <WatchPageSkeleton />
        </div>
    );

    if (!person) {
        return (
            <div className='bg-black text-white h-screen'>
                <div className='max-w-6xl mx-auto'>
                    <Navbar />
                    <div className='text-center mx-auto px-4 py-8 h-full mt-40'>
                        <h2 className='text-2xl sm:text-5xl font-bold text-balance'>Person not found 😥</h2>
                        <br />
                        <button className='outline-double outline-1 outline-offset-4'>
                            <Link to='/' className='text-white'>Go back to Home</Link>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto container px-4 py-8 h-full">
                <Navbar />
                
                {/* Person details */}
                <div className='flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto'>
                    <div className='mb-4 md:mb-0'>
                        <h2 className='text-5xl font-bold text-balance'>{person.name}</h2>
                        
                        {person.known_for_department && (
                            <p className='mt-2 text-xl text-gray-300'>
                                Known for: <span className='text-white font-semibold'>{person.known_for_department}</span>
                            </p>
                        )}

                        {/* Personal Info Section */}
                        <div className='mt-4 space-y-2'>
                            {person.birthday && (
                                <div className='flex items-center gap-2 text-lg'>
                                    <span className='text-blue-400'>🎂</span>
                                    <span className='text-gray-400'>Born:</span>
                                    <span className='text-white'>
                                        {formatReleaseDate(person.birthday)}
                                        {calculateAge(person.birthday, person.deathday) && (
                                            <span className='text-gray-400'>
                                                {' '}(Age {calculateAge(person.birthday, person.deathday)}{person.deathday ? ' at death' : ''})
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}
                            
                            {person.place_of_birth && (
                                <div className='flex items-center gap-2 text-lg'>
                                    <span className='text-green-400'>📍</span>
                                    <span className='text-gray-400'>Birthplace:</span>
                                    <span className='text-white'>{person.place_of_birth}</span>
                                </div>
                            )}
                            
                            {person.deathday && (
                                <div className='flex items-center gap-2 text-lg'>
                                    <span className='text-red-400'>⚰️</span>
                                    <span className='text-gray-400'>Died:</span>
                                    <span className='text-white'>{formatReleaseDate(person.deathday)}</span>
                                </div>
                            )}

                            {person.popularity && (
                                <div className='flex items-center gap-2 text-lg'>
                                    <span className='text-yellow-400'>⭐</span>
                                    <span className='text-gray-400'>Popularity Score:</span>
                                    <span className='text-white'>{Math.round(person.popularity)}</span>
                                </div>
                            )}
                        </div>
                        
                        {person.biography && (
                            <div className='mt-8'>
                                <h3 className='text-2xl font-semibold mb-4'>Biography</h3>
                                <div className='text-base leading-relaxed space-y-4 text-gray-300'>
                                    {person.biography.split(/\.\s+/).filter(sentence => sentence.trim()).map((sentence, index, array) => {
                                        // Group sentences into paragraphs of 3-4 sentences each
                                        if (index % 3 === 0) {
                                            const paragraphSentences = array.slice(index, index + 3);
                                            return (
                                                <p key={index} className='mb-4'>
                                                    {paragraphSentences.join('. ') + (paragraphSentences[paragraphSentences.length - 1].endsWith('.') ? '' : '.')}
                                                </p>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {person.profile_path && (
                        <img
                            src={ORIGINAL_IMAGE_BASE_URL + person.profile_path}
                            alt={person.name}
                            className='max-h-[600px] rounded-md'
                        />
                    )}
                </div>

                {/* Movie Credits */}
                {movieCredits && movieCredits.cast && movieCredits.cast.length > 0 && (
                <div className='mt-12 max-w-6xl mx-auto'>
                    <div 
                        className='flex items-center justify-between cursor-pointer hover:bg-red-900 p-2 rounded-lg transition-colors duration-200 mb-6'
                        onClick={() => setIsMovieSectionExpanded(!isMovieSectionExpanded)}
                    >
                        <h3 className='text-3xl font-bold'>
                            Movie Credits <span className='text-xl text-gray-400'>({movieCredits.cast.filter(movie => {
                                return movie.poster_path && 
                                        movie.release_date && 
                                        movie.vote_count > 10 && 
                                        movie.original_language === 'en' && 
                                        movie.character && 
                                        !movie.character.toLowerCase().includes('uncredited');
                            }).length} Results)</span>
                        </h3>
                        <div className='text-gray-00 hover:text-white transition-colors duration-200'>
                            {isMovieSectionExpanded ? (
                                <ChevronUp size={24} />
                            ) : (
                                <ChevronDown size={24} />
                            )}
                        </div>
                    </div>
                    
                    {isMovieSectionExpanded && (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                            {movieCredits.cast
                                .filter(movie => {
                                    // Filter for more relevant movies
                                    return movie.poster_path && 
                                            movie.release_date && 
                                            movie.vote_count > 10 && // Movies with some popularity
                                            movie.original_language === 'en' && // English movies only
                                            movie.character && // Must have a character name
                                            !movie.character.toLowerCase().includes('uncredited'); // Exclude uncredited roles
                                })
                                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                                //.slice(0, 12) // Limit to 12
                                .map((movie) => (
                                    <Link 
                                        key={movie.id} 
                                        to={`/watch/${movie.id}`}
                                        onClick={() => setContentType("movie")}
                                        className='group'
                                    >
                                        <div className='relative overflow-hidden rounded-lg'>
                                            <img
                                                src={SMALL_IMAGE_BASE_URL + movie.poster_path}
                                                alt={movie.title}
                                                className='w-full h-auto transition-transform duration-300 group-hover:scale-105'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300' />
                                        </div>
                                        <h4 className='mt-2 text-sm font-semibold line-clamp-2'>{movie.title}</h4>
                                        {movie.character && (
                                            <p className='text-xs text-gray-400 line-clamp-1'>as {movie.character}</p>
                                        )}
                                        {movie.release_date && (
                                            <p className='text-xs text-gray-500'>{new Date(movie.release_date).getFullYear()}</p>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
                )}

                {/* TV Credits */}
                {tvCredits && tvCredits.cast && tvCredits.cast.length > 0 && (
                <div className='mt-12 max-w-6xl mx-auto'>
                    <div 
                        className='flex items-center justify-between cursor-pointer hover:bg-red-900 p-2 rounded-lg transition-colors duration-200 mb-6'
                        onClick={() => setIsTvSectionExpanded(!isTvSectionExpanded)}
                    >
                        <h3 className='text-3xl font-bold'>
                            TV Credits <span className='text-xl text-gray-400'>({tvCredits.cast.filter(show => {
                                return show.poster_path && 
                                        show.first_air_date && 
                                        show.vote_count > 5 && 
                                        show.original_language === 'en' && 
                                        show.character && 
                                        show.episode_count > 1;
                            }).length} Results)</span>
                        </h3>
                        <div className='text-gray-400 hover:text-white transition-colors duration-200'>
                            {isTvSectionExpanded ? (
                                <ChevronUp size={24} />
                            ) : (
                                <ChevronDown size={24} />
                            )}
                        </div>
                    </div>
                    
                    {isTvSectionExpanded && (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                            {tvCredits.cast
                                .filter(show => {
                                    // Filter for more relevant TV shows
                                    return show.poster_path && 
                                            show.first_air_date && 
                                            show.vote_count > 5 && // Shows with some popularity
                                            show.original_language === 'en' && // English shows only
                                            show.character && // Must have a character name
                                            show.episode_count > 1; // Must appear in more than 1 episode
                                })
                                .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
                                //.slice(0, 12) // Limit to 12
                                .map((show) => (
                                    <Link 
                                        key={show.id} 
                                        to={`/watch/${show.id}`}
                                        onClick={() => setContentType("tv")}
                                        className='group'
                                    >
                                        <div className='relative overflow-hidden rounded-lg'>
                                            <img
                                                src={SMALL_IMAGE_BASE_URL + show.poster_path}
                                                alt={show.name}
                                                className='w-full h-auto transition-transform duration-300 group-hover:scale-105'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300' />
                                        </div>
                                        <h4 className='mt-2 text-sm font-semibold line-clamp-2'>{show.name}</h4>
                                        {show.character && (
                                            <p className='text-xs text-gray-400 line-clamp-1'>as {show.character}</p>
                                        )}
                                        {show.first_air_date && (
                                            <p className='text-xs text-gray-500'>{new Date(show.first_air_date).getFullYear()}</p>
                                        )}
                                        {show.episode_count && (
                                            <p className='text-xs text-gray-500'>{show.episode_count} episodes</p>
                                        )}
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};

export default PersonPage;