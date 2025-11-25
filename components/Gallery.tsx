import React from 'react';
import { MoviePoster } from '../types';

interface GalleryProps {
  posters: MoviePoster[];
  onSelect: (poster: MoviePoster) => void;
  selectedId?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ posters, onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-32">
      {posters.map((poster) => {
        const isSelected = selectedId === poster.id;

        return (
          <div
            key={poster.id}
            onClick={() => onSelect(poster)}
            className={`
              group relative cursor-pointer rounded-xl sm:rounded-2xl transition-all duration-300 bg-white
              ${isSelected
                ? 'ring-4 ring-yellow-400 ring-offset-2 sm:ring-offset-4 ring-offset-white shadow-2xl shadow-yellow-500/30 transform scale-[1.02] z-10'
                : 'hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 shadow-sm border border-slate-100'
              }
            `}
          >
            <div className="aspect-[2/3] w-full relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100">
              <img
                src={poster.imageUrl}
                alt={poster.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 p-3 sm:p-5 w-full flex flex-col justify-end h-full">
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-1.5 leading-tight drop-shadow-md">
                    {poster.title}
                  </h3>

                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-yellow-400 text-slate-900 p-1.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};