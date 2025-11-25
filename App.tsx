import React, { useState, useMemo, useEffect } from 'react';
import { AppStep, MoviePoster } from './types';
import { Gallery } from './components/Gallery';
import { CategoryTabs } from './components/GenreTabs';
import { StepIndicator } from './components/StepIndicator';
import { Button } from './components/Button';
import { ImageUploader } from './components/ImageUploader';
import { PricingPlans, Plan } from './components/PricingPlans';
import { generateMoviePoster } from './services/geminiService';
import { fetchCategories, fetchPosters } from './services/dataService';
import { STATIC_POSTERS } from './constants';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// REPLACE THIS WITH YOUR ACTUAL RAZORPAY KEY ID
const RAZORPAY_KEY_ID = "rzp_test_REn9qgtg9VAbZX";
// ------------------------------------------------------------------

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECT_TEMPLATE);

  // Data State
  const [categories, setCategories] = useState<string[]>([]);
  const [posters, setPosters] = useState<MoviePoster[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<MoviePoster | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  // Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data on Mount
  useEffect(() => {
    async function initData() {
      console.log('[App] 🚀 Starting data initialization...');
      setLoadingData(true);

      try {
        console.log('[App] 📡 Fetching data from Supabase...');

        // Attempt fetch from Supabase
        const [fetchedCategories, fetchedPosters] = await Promise.all([
          fetchCategories(),
          fetchPosters()
        ]);

        console.log('[App] 📊 Fetched Categories:', fetchedCategories);
        console.log('[App] 📊 Fetched Posters:', fetchedPosters);

        // Validate results are not null and are valid arrays with data
        if (
          Array.isArray(fetchedCategories) &&
          Array.isArray(fetchedPosters) &&
          fetchedCategories.length > 0 &&
          fetchedPosters.length > 0
        ) {
          console.log('[App] ✅ Supabase data is valid, using it!');
          console.log(`[App] ✅ Loaded ${fetchedCategories.length} categories and ${fetchedPosters.length} posters`);

          setCategories(fetchedCategories);
          setPosters(fetchedPosters);
          setSelectedCategory(fetchedCategories[0]);
          setUsingFallback(false);
        } else {
          throw new Error(`Invalid or empty data: categories=${fetchedCategories?.length || 0}, posters=${fetchedPosters?.length || 0}`);
        }
      } catch (err) {
        console.error("[App] ❌ Error loading data from Supabase:", err);
        console.warn("[App] ⚠️ Falling back to static data");

        // Fallback to static data
        const uniqueCategories = [...new Set(STATIC_POSTERS.map(p => p.category))].sort();
        setCategories(uniqueCategories);
        setPosters(STATIC_POSTERS);
        setSelectedCategory(uniqueCategories[0]);
        setUsingFallback(true);
      } finally {
        setLoadingData(false);
        console.log('[App] 🏁 Data initialization complete');
      }
    }

    initData();
  }, []);

  const filteredPosters = useMemo(() => {
    if (!selectedCategory || !Array.isArray(posters)) return [];
    const filtered = posters.filter(p => p.category === selectedCategory);
    console.log(`[App] Filtered ${filtered.length} posters for category: ${selectedCategory}`);
    return filtered;
  }, [selectedCategory, posters]);

  const handleCategorySelect = (category: string) => {
    console.log('[App] Category selected:', category);
    setSelectedCategory(category);
    setSelectedPoster(null);
  };

  const handlePosterSelect = (poster: MoviePoster) => {
    console.log('[App] Poster selected:', poster.title);
    setSelectedPoster(poster);
  };

  const confirmTemplate = () => {
    if (selectedPoster) {
      console.log('[App] Confirming poster and moving to photo upload');
      setCurrentStep(AppStep.UPLOAD_PHOTO);
      window.scrollTo(0, 0);
    }
  };

  const handleImageUpload = (base64: string) => {
    if (!selectedPoster) return;
    setPendingPhoto(base64);
    setCurrentStep(AppStep.PAYMENT);
    window.scrollTo(0, 0);
  };

  const handlePlanSelect = (plan: Plan) => {
    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    // Validate Key
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes("YOUR_KEY_HERE")) {
      alert("Please paste your Razorpay Live Key in App.tsx (Line 17)");
      return;
    }

    try {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Amount in paise
        currency: "INR",
        name: "CineStar AI",
        description: `Purchase ${plan.credits} Credits`,
        handler: function (response: any) {
          console.log("Payment Successful", response);
          // Here you would typically verify the payment signature on backend
          // For this demo, we proceed directly
          proceedToGeneration();
        },
        prefill: {
          name: "Studio User",
          email: "guest@cinestar.ai",
          contact: "9999999999"
        },
        theme: {
          color: "#FACC15" // Yellow-400
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        console.error("Payment Failed:", response.error);
        alert("Payment Failed: " + (response.error.description || "Please try again."));
      });
      rzp1.open();
    } catch (err) {
      console.error("Razorpay Initialization Error:", err);
      alert("Failed to initialize payment. Please check console for details.");
    }
  };

  const proceedToGeneration = async () => {
    if (!selectedPoster || !pendingPhoto) {
      console.error('[App] Missing poster or photo for generation');
      return;
    }

    console.log('[App] 🎬 Starting poster generation...');
    console.log('[App] Poster:', selectedPoster.title);
    console.log('[App] Using prompt:', selectedPoster.prompts);

    setCurrentStep(AppStep.PROCESSING);
    setError(null);

    try {
      const result = await generateMoviePoster(
        selectedPoster.imageUrl,
        pendingPhoto,
        selectedPoster.prompts  // ✅ Using custom prompts from database
      ); setGeneratedImage(result);
      setCurrentStep(AppStep.RESULT);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate the image. Please check your API Key and try again.");
      setCurrentStep(AppStep.ERROR);
    }
  };

  const resetApp = () => {
    console.log('[App] 🔄 Resetting app to initial state');
    setCurrentStep(AppStep.SELECT_TEMPLATE);
    setSelectedPoster(null);
    setGeneratedImage(null);
    setPendingPhoto(null);
    setError(null);
    window.scrollTo(0, 0);
  };

  // Loading Screen for Initial Data
  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold text-white mb-2">Loading Studio</h1>
        <p className="text-slate-400">Connecting to database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200 selection:text-slate-900 relative overflow-hidden">

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-amber-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-orange-100/40 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={resetApp}>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-lg text-slate-900 shadow-lg shadow-yellow-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                CineStar<span className="font-light text-slate-500">AI</span>
              </span>
              {usingFallback && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 rounded w-fit mt-0.5">
                  Offline Mode
                </span>
              )}
            </div>
          </div>
          {currentStep !== AppStep.SELECT_TEMPLATE && (
            <button
              onClick={resetApp}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <StepIndicator currentStep={currentStep} />

        {/* Step 1: Select Template */}
        {currentStep === AppStep.SELECT_TEMPLATE && (
          <div className="space-y-8 animate-fade-in">

            {categories.length > 0 ? (
              <>
                <CategoryTabs
                  categories={categories}
                  selectedCategory={selectedCategory || (categories[0] ? categories[0] : '')}
                  onSelect={handleCategorySelect}
                />

                <Gallery
                  posters={filteredPosters}
                  onSelect={handlePosterSelect}
                  selectedId={selectedPoster?.id}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No styles found in database.</p>
                <p className="text-sm text-slate-400 mt-2">Please run the SQL seed script in your Supabase dashboard.</p>
              </div>
            )}

            {/* Sticky Action Bar */}
            <div className={`fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 w-auto sm:w-[400px] z-40 transition-all duration-500 transform ${selectedPoster ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="p-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-yellow-500/20">
                <Button
                  disabled={!selectedPoster}
                  onClick={confirmTemplate}
                  fullWidth
                  className="shadow-lg shadow-yellow-500/30"
                >
                  Continue with Selection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Photo */}
        {currentStep === AppStep.UPLOAD_PHOTO && selectedPoster && (
          <div className="animate-fade-in py-4">
            <ImageUploader
              selectedTemplate={selectedPoster}
              onImageSelected={handleImageUpload}
              onBack={() => setCurrentStep(AppStep.SELECT_TEMPLATE)}
            />
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === AppStep.PAYMENT && (
          <div className="animate-fade-in py-4">
            <PricingPlans
              onPlanSelect={handlePlanSelect}
              onBack={() => setCurrentStep(AppStep.UPLOAD_PHOTO)}
            />
          </div>
        )}

        {/* Step 4: Processing */}
        {currentStep === AppStep.PROCESSING && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
              <div className="relative z-10 w-32 h-32 border-4 border-slate-100 rounded-full flex items-center justify-center bg-white shadow-xl">
                <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Casting You...
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
              Our AI Director is placing you into <span className="text-yellow-600 font-bold">"{selectedPoster?.title}"</span>. <br /> This usually takes about 5-10 seconds.
            </p>
          </div>
        )}

        {/* Step 5: Result */}
        {currentStep === AppStep.RESULT && generatedImage && (
          <div className="animate-fade-in max-w-4xl mx-auto py-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 mb-4 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Generated Successfully
              </span>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">The Final Cut</h2>
              <p className="text-slate-500 text-lg">You look amazing! Download your poster below.</p>
            </div>

            <div className="group relative bg-white p-4 rounded-3xl shadow-2xl shadow-slate-300/50 transition-all duration-500 hover:shadow-yellow-500/20 border border-slate-100 mb-10 rotate-1 hover:rotate-0">
              <img
                src={generatedImage}
                alt="Generated Result"
                className="w-full rounded-2xl shadow-inner bg-slate-100"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none"></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 pb-20 sm:pb-0">
              <a
                href={generatedImage}
                download={`cinestar-${selectedPoster?.id}.png`}
                className="w-full sm:w-auto"
              >
                <Button fullWidth className="shadow-yellow-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Original
                </Button>
              </a>
              <Button variant="secondary" onClick={resetApp} fullWidth className="sm:w-auto">
                Try Another Style
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {currentStep === AppStep.ERROR && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <div className="inline-block p-6 bg-red-50 rounded-3xl mb-6 border border-red-100 shadow-lg shadow-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Cut! Something went wrong.</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Button onClick={() => setCurrentStep(AppStep.UPLOAD_PHOTO)} fullWidth>Try Again</Button>
              <Button variant="outline" onClick={resetApp} fullWidth>Return Home</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
