import React from 'react';
import { HistoryItem } from '../services/dataService';

interface HistoryGalleryProps {
    history: HistoryItem[];
    onClose: () => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Your Studio History</h2>
                        <p className="text-slate-500 text-sm">Past generations saved to your account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium text-slate-400">No history yet</p>
                            <p className="text-sm text-slate-400">Create your first poster to see it here!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {history.map((item) => (
                                <div key={item.id} className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
                                    <img
                                        src={item.image_url}
                                        alt="Generated Poster"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <a
                                            href={item.image_url}
                                            download={`cinestar-${item.id}.png`}
                                            className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                        >
                                            Download
                                        </a>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-xs font-medium truncate">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
