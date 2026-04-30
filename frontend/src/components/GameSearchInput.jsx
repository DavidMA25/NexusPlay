import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GameSearchInput({ value, onChange, onSelect }) {
    const { api } = useAuth();
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const isSelecting = useRef(false);

    const [errorMsg, setErrorMsg] = useState(null);

    // Update query if parent value changes externally (e.g. initial load)
    useEffect(() => {
        if (value !== query && !isSelecting.current) {
            setQuery(value || '');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        console.log("GameSearchInput useEffect triggered with query:", query);
        const fetchGames = async () => {
            console.log("fetchGames running for query:", query);
            if (!query.trim() || query.length < 2) {
                console.log("Query too short or empty, returning");
                setResults([]);
                setIsOpen(false);
                setErrorMsg(null);
                return;
            }

            if (isSelecting.current) {
                console.log("isSelecting is true, skipping search");
                isSelecting.current = false;
                return;
            }

            setIsLoading(true);
            setErrorMsg(null);
            try {
                console.log("Making API request to /igdb/search?q=", query);
                const response = await api.get(`/igdb/search?q=${encodeURIComponent(query)}`);
                console.log("API response:", response.data);
                setResults(response.data || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Error searching games:", error);
                setErrorMsg(error.message || "Error searching games");
                setResults([]);
                setIsOpen(true); // Keep open to show error
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchGames, 500);
        return () => {
            console.log("Clearing debounce timer for query:", query);
            clearTimeout(debounceTimer);
        };
    }, [query, api]);

    const handleInputChange = (e) => {
        isSelecting.current = false;
        setQuery(e.target.value);
        onChange(e.target.value); // Keep parent state in sync with text
    };

    const handleSelect = (game) => {
        isSelecting.current = true;
        setQuery(game.name);
        setIsOpen(false);
        setErrorMsg(null);
        onSelect({
            gameId: game.id,
            title: game.name,
            cover_url: game.cover?.url || null
        });
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (results.length > 0 || errorMsg) setIsOpen(true);
                    }}
                    placeholder="e.g. League of Legends"
                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-600 pl-8"
                />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </div>
            </div>

            {isOpen && (results.length > 0 || errorMsg) && (
                <div className="absolute z-50 w-full mt-2 bg-[#121212] border border-gray-800 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                    {errorMsg && (
                        <div className="p-3 text-red-500 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    {!errorMsg && results.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => handleSelect(game)}
                            className="flex items-start gap-3 p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0"
                        >
                            {game.cover?.url ? (
                                <img 
                                    src={game.cover.url} 
                                    alt={game.name} 
                                    className="w-12 h-16 object-cover rounded bg-gray-900 flex-shrink-0"
                                />
                            ) : (
                                <div className="w-12 h-16 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-600 text-xs text-center">No Cover</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white truncate">{game.name}</h4>
                                {game.summary && (
                                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                        {game.summary}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
