import React from 'react';
import { Button } from './Button';

export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
}

interface PricingPlansProps {
  onPlanSelect: (plan: Plan) => void;
  onBack: () => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onPlanSelect, onBack }) => {
  const plans: Plan[] = [
    { id: 'single', name: 'Single Shot', price: 29, credits: 1 },
    { id: 'pack_5', name: 'Star Pack', price: 99, credits: 5, popular: true },
    { id: 'pack_15', name: 'Studio Pass', price: 249, credits: 15 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Unlock Your Posters</h2>
        <p className="text-slate-500">Choose a plan to start generating high-quality cinematic images.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative flex flex-col p-6 rounded-3xl bg-white border transition-all duration-300
              ${plan.popular 
                ? 'border-yellow-400 shadow-2xl shadow-yellow-400/20 ring-4 ring-yellow-400/10 scale-105 z-10' 
                : 'border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1'
              }
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Best Value
              </div>
            )}
            
            <div className="text-center mb-6 pt-2">
              <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-2xl font-medium text-slate-900 align-top">₹</span>
                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {plan.credits} {plan.credits === 1 ? 'Image' : 'Images'}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                High Quality Output
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                No Watermark
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Fast Processing
              </li>
            </ul>

            <Button 
              onClick={() => onPlanSelect(plan)} 
              fullWidth 
              variant={plan.popular ? 'primary' : 'secondary'}
              className={plan.popular ? 'shadow-yellow-400/40' : ''}
            >
              Pay ₹{plan.price}
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={onBack} 
          className="text-slate-400 hover:text-slate-600 font-medium transition-colors text-sm flex items-center justify-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Upload
        </button>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
         <p className="text-xs text-slate-400">Secured by Razorpay</p>
      </div>
    </div>
  );
};