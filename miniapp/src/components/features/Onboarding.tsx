import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Coins, Target, ShieldCheck, ArrowRight } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Coins className="w-12 h-12 text-brand-500" />,
            title: "Automated Savings",
            description: "Set up recurring saves and watch your stack grow automatically on Base."
        },
        {
            icon: <Target className="w-12 h-12 text-brand-500" />,
            title: "Reach Your Goals",
            description: "Create custom stacks for a new car, holiday, or just a rainy day fund."
        },
        {
            icon: <ShieldCheck className="w-12 h-12 text-brand-500" />,
            title: "Secure & Flexible",
            description: "Your funds are always yours. Break a stack anytime if you need liquidity."
        }
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6 gap-8">
            <div className="w-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-8 duration-300" key={step}>
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-bubbly transform -rotate-3 transition-transform hover:rotate-0">
                    {currentStep.icon}
                </div>
                <h1 className="font-display font-bold text-2xl text-slate-800 mb-2">{currentStep.title}</h1>
                <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed px-4">
                    {currentStep.description}
                </p>
            </div>

            <div className="w-full pb-2">
                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mb-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-brand-500' : 'w-2 bg-slate-200'
                                }`}
                        />
                    ))}
                </div>

                <Button className="w-full flex items-center justify-center gap-2 group" size="md" onClick={handleNext}>
                    {step === steps.length - 1 ? 'Start Stacking' : 'Next'}
                    {step !== steps.length - 1 && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>

                {step < steps.length - 1 && (
                    <button onClick={onComplete} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                        Skip
                    </button>
                )}
            </div>
        </div>
    );
};
