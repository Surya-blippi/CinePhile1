import React, { useCallback, useState } from 'react';
import { Button } from './Button';
import { MoviePoster } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  onBack: () => void;
  selectedTemplate: MoviePoster;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onBack, selectedTemplate }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Please keep it under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleConfirm = () => {
    if (preview) {
      onImageSelected(preview);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">You're almost the star</h2>
        <p className="text-slate-500 mt-2">Upload a clear photo to be cast into <span className="font-bold text-yellow-600">"{selectedTemplate.title}"</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left Col: Target Template (Context) */}
        <div className="hidden md:block">
          <div className="bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 rotate-[-2deg]">
            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden relative">
              <img src={selectedTemplate.imageUrl} alt="Target" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg font-medium">
                  Target Style
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Selected Scene</p>
              <p className="font-bold text-slate-800">{selectedTemplate.title}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Upload Area */}
        <div className="w-full">
          <div className={`
              bg-white border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-slate-200/50 transition-all duration-300
              ${error ? 'border-red-300 bg-red-50/10' : 'border-slate-300 hover:border-yellow-400 hover:shadow-yellow-200/50'}
            `}>
            {!preview ? (
              <div className="space-y-6">
                {/* Mobile-only context hint */}
                <div className="md:hidden flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 py-2 px-3 rounded-lg mb-4">
                  <span className="text-yellow-600 font-bold">Target:</span> {selectedTemplate.title}
                </div>

                <div className="w-20 h-20 bg-yellow-50 rounded-2xl mx-auto flex items-center justify-center border border-yellow-200 shadow-sm transform rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Upload Your Photo</h3>
                  <p className="text-slate-500 mt-2 text-sm">Use a well-lit photo of your face.</p>
                </div>

                <div className="relative inline-block w-full">
                  <Button variant="secondary" fullWidth className="relative overflow-hidden group border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                    <span className="relative z-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Choose from Library
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white ring-2 ring-yellow-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-lg">Looking good!</p>
                  <p className="text-slate-500 text-sm">Ready to merge this into the poster.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleConfirm} fullWidth className="shadow-lg shadow-yellow-500/20">
                    Generate Poster
                  </Button>
                  <Button variant="outline" onClick={() => setPreview(null)} fullWidth>
                    Use Different Photo
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium transition-colors text-sm">
          ← Back to Styles
        </button>
      </div>
    </div>
  );
};