import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/Firebase';
import { COMIC_PROMPT } from '../prompts';

const FrontPage = ({ retro90sStyle, aiInterface }) => {
    const [todoNycSummary, setTodoNycSummary] = useState('');
    const [blogSummary, setBlogSummary] = useState('');
    const [graffitiSummary, setGraffitiSummary] = useState('');
    const [comicImages, setComicImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreatingComic, setIsCreatingComic] = useState(false);
    const [comicTheme, setComicTheme] = useState('');
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }, []);

    const fetchTodoNycSummary = useCallback(async () => {
        try {
            const todoNyc = await aiInterface.getTodoNycSummary();
            setTodoNycSummary(todoNyc);
            return todoNyc;
        } catch (err) {
            console.error('Error fetching Todo NYC summary:', err);
            return null;
        }
    }, [aiInterface]);

    const fetchBlogSummary = useCallback(async () => {
        try {
            const blog = await aiInterface.getBlogSummary();
            setBlogSummary(blog);
            return blog;
        } catch (err) {
            console.error('Error fetching Blog summary:', err);
            return null;
        }
    }, [aiInterface]);

    const fetchGraffitiSummary = useCallback(async () => {
        try {
            const graffiti = await aiInterface.getGraffitiSummary();
            setGraffitiSummary(graffiti);
            return graffiti;
        } catch (err) {
            console.error('Error fetching Graffiti summary:', err);
            return null;
        }
    }, [aiInterface]);

    const fetchAllSummaries = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const todoNyc = await fetchTodoNycSummary();
            const blog = await fetchBlogSummary();
            const graffiti = await fetchGraffitiSummary();
            
            localStorage.setItem('summaries', JSON.stringify({ todoNyc, blog, graffiti }));
            localStorage.setItem('summariesTimestamp', new Date().getTime().toString());
        } catch (err) {
            setError('Failed to fetch summaries. Please try again.');
            console.error('Error fetching summaries:', err);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTodoNycSummary, fetchBlogSummary, fetchGraffitiSummary]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const storedSummaries = localStorage.getItem('summaries');
                const storedTimestamp = localStorage.getItem('summariesTimestamp');
                const currentTime = new Date().getTime();

                if (storedSummaries && storedTimestamp && (currentTime - parseInt(storedTimestamp) < 20 * 60 * 1000)) {
                    const { todoNyc, blog, graffiti } = JSON.parse(storedSummaries);
                    setTodoNycSummary(todoNyc);
                    setBlogSummary(blog);
                    setGraffitiSummary(graffiti);
                    
                    // Check if any summary is null and recompute if necessary
                    if (!todoNyc) await fetchTodoNycSummary();
                    if (!blog) await fetchBlogSummary();
                    if (!graffiti) await fetchGraffitiSummary();
                } else {
                    await fetchAllSummaries();
                }

                // Fetch comic before rendering
                await fetchComic();
            } catch (error) {
                console.error('Error loading data:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();

        const intervalId = setInterval(fetchAllSummaries, 20 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [fetchAllSummaries, fetchBlogSummary, fetchGraffitiSummary, fetchTodoNycSummary]);

    const fetchComic = async () => {
        try {
            const imageSet = await api.getImageSet();
            if (imageSet) {
                setComicImages(imageSet.imageUrls || []);
                setComicTheme(imageSet.associatedText || '');
            }
        } catch (err) {
            console.error('Error fetching comic:', err);
        }
    };

    const createComic = async () => {
        setIsCreatingComic(true);
        try {
            console.log("Creating comic...");
            console.log(COMIC_PROMPT);
            // Write the comic prompt to Firestore
            const aiGeneratedTheme = await aiInterface.chat(COMIC_PROMPT, 1, 400);
            await aiInterface.createThreePartComic(aiGeneratedTheme);
            await fetchComic();
        } catch (error) {
            console.error("Error creating comic:", error);
        } finally {
            setIsCreatingComic(false);
        }
    };

    const mediumBlackBorder = '2px solid #000000';
  
    const pageStyle = {
        ...retro90sStyle,
        width: '100%',
        padding: '20px',
        overflowY: 'auto',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };

    const titleStyle = {
        textAlign: 'center',
        textShadow: '2px 2px #FF69B4',
        margin: '0'
    };

    const buttonStyle = {
        ...retro90sStyle,
        cursor: 'pointer',
        padding: '5px 10px',
        border: mediumBlackBorder,
    };

    const summariesContainerStyle = {
        ...retro90sStyle,
        marginBottom: '20px',
        padding: '10px',
        border: mediumBlackBorder,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    };

    const summaryTileStyle = {
        ...retro90sStyle,
        width: '30%',
        margin: '10px 0',
        padding: '10px',
        border: mediumBlackBorder,
        minHeight: '200px',
    };

    const comicContainerStyle = {
        ...retro90sStyle,
        marginTop: '20px',
        padding: '10px',
        border: mediumBlackBorder,
    };

    const comicThemeStyle = {
        textAlign: 'center',
        marginBottom: '10px',
        fontWeight: 'bold',
    };

    const comicImagesStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const comicImageStyle = {
        width: '30%',
        height: 'auto',
        border: mediumBlackBorder,
    };

    return (
        <div className="front-page" style={pageStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Front Page</h2>
                <div>
                    <button 
                        onClick={fetchAllSummaries} 
                        style={{
                            ...buttonStyle, 
                            backgroundColor: '#32CD32',
                            color: 'black', 
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Refresh Summaries'}
                    </button>
                    {isLocalhost && (
                        <button 
                            onClick={createComic} 
                            style={{
                                ...buttonStyle, 
                                backgroundColor: '#4169E1',
                                color: 'white', 
                                fontWeight: 'bold'
                            }}
                            disabled={isCreatingComic}
                        >
                            {isCreatingComic ? 'Creating Comic...' : 'Create Comic'}
                        </button>
                    )}
                </div>
            </div>
            <div className="summaries-container" style={summariesContainerStyle}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <>
                        <div style={summaryTileStyle}>
                            <h3>Todo NYC</h3>
                            {todoNycSummary ? (
                                <ReactMarkdown>{todoNycSummary}</ReactMarkdown>
                            ) : (
                                <p>Loading Todo NYC summary...</p>
                            )}
                        </div>
                        <div style={summaryTileStyle}>
                            <h3>Blog</h3>
                            {blogSummary ? (
                                <ReactMarkdown>{blogSummary}</ReactMarkdown>
                            ) : (
                                <p>Loading Blog summary...</p>
                            )}
                        </div>
                        <div style={summaryTileStyle}>
                            <h3>Graffiti</h3>
                            {graffitiSummary ? (
                                <ReactMarkdown>{graffitiSummary}</ReactMarkdown>
                            ) : (
                                <p>Loading Graffiti summary...</p>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="comic-container" style={comicContainerStyle}>
                <div style={comicThemeStyle}>{comicTheme}</div>
                <div style={comicImagesStyle}>
                    {comicImages.length ? (
                        comicImages.map((imageUrl, index) => (
                            <img key={index} src={imageUrl} alt={`Comic panel ${index + 1}`} style={comicImageStyle} />
                        ))
                    ) : (
                        <p>Loading comic...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FrontPage;
