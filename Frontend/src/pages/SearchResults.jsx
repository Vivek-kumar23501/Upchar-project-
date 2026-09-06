import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-10 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#bec9c2] hover:bg-gray-50 text-[#004d37] transition-colors"
                >
                    <span className="material-symbols-rounded">arrow_back</span>
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-[#004d37]">
                    Search Results
                </h2>
            </div>

            {/* Results Container */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#bec9c2]/40 shadow-sm min-h-[400px]">
                {query ? (
                    <div>
                        <p className="text-[#3f4944] text-lg mb-6 border-b border-gray-100 pb-4">
                            Showing results for: <span className="font-bold text-[#00668a]">"{query}"</span>
                        </p>
                        
                        {/* Placeholder for your actual search results map */}
                        <div className="flex flex-col items-center justify-center py-16 opacity-70">
                            <span className="material-symbols-rounded text-[48px] text-gray-300 mb-4">
                                search
                            </span>
                            <p className="text-gray-500 font-medium">
                                We are searching our database for "{query}".
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                (API Integration Pending)
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Please enter a search term in the search bar.</p>
                )}
            </div>
        </div>
    );
}