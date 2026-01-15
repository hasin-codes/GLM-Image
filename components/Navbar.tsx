import React from 'react';
import { Home, Compass, Sparkles, Hexagon } from 'lucide-react';
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { View } from '../types';

interface NavbarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    onSearch?: (prompt: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
    return (
        <>
            {/* Mobile Header (Logo & Auth) */}
            <div className="lg:hidden flex items-center justify-between py-2 px-2">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setCurrentView(View.HOME)}
                >
                    <div className="w-10 h-10 bg-[#0A0A0A] border border-[#222] rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                        <img src="/Logo.svg" alt="GLM-Image Logo" className="w-full h-full object-cover p-2" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent font-ariom">
                        GLM-Image
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Dynamic Mobile Nav Button */}
                    {currentView === View.DISCOVER && (
                        <button
                            onClick={() => setCurrentView(View.GENERATE)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors"
                        >
                            <Sparkles size={14} />
                            <span>Generate</span>
                        </button>
                    )}

                    {currentView === View.GENERATE && (
                        <button
                            onClick={() => setCurrentView(View.DISCOVER)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors"
                        >
                            <Compass size={14} />
                            <span>Discover</span>
                        </button>
                    )}

                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-800 text-white border border-zinc-700">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-blue-500/50"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </div>



            {/* Desktop Navigation (Original) */}
            <nav className="hidden lg:flex items-center justify-between gap-4 py-6 px-2 lg:px-0 select-none">

                {/* Brand Identity - Left */}
                <div className="flex items-center gap-3 lg:w-[200px]">
                    <div
                        className="flex items-center justify-center cursor-pointer gap-3"
                        onClick={() => setCurrentView(View.HOME)}
                    >
                        {/* Logo Image */}
                        <div className="w-11 h-11 bg-[#0A0A0A] border border-[#222] rounded-xl flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors overflow-hidden">
                            <img src="/Logo.svg" alt="GLM-Image Logo" className="w-full h-full object-cover p-2" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent font-ariom">
                            GLM-Image
                        </span>
                    </div>
                </div>

                {/* Center Navigation Group */}
                <div className="bg-[#0A0A0A] border border-[#222] rounded-full p-1.5 flex items-center shadow-2xl">
                    {/* Home */}
                    <button
                        onClick={() => setCurrentView(View.HOME)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${currentView === View.HOME
                            ? 'bg-[#1A1A1A] text-white border border-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <Home size={18} className={currentView === View.HOME ? "text-blue-400" : ""} />
                        <span>Home</span>
                    </button>

                    {/* Discover */}
                    <button
                        onClick={() => setCurrentView(View.DISCOVER)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${currentView === View.DISCOVER
                            ? 'bg-[#1A1A1A] text-white border border-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <Compass size={18} className={currentView === View.DISCOVER ? "text-blue-400" : ""} />
                        <span>Discover</span>
                    </button>

                    {/* Generate */}
                    <button
                        onClick={() => setCurrentView(View.GENERATE)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${currentView === View.GENERATE
                            ? 'bg-[#1A1A1A] text-white border border-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                            : 'text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <Sparkles size={18} className={currentView === View.GENERATE ? "text-blue-400" : ""} />
                        <span>Generate</span>
                    </button>
                </div>

                {/* Auth - Right Side */}
                <div className="flex items-center justify-end lg:w-[200px] gap-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2.5 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#333] transition-all">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/25">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 rounded-full ring-2 ring-blue-500/50 hover:ring-blue-500 transition-all"
                                }
                            }}
                        />
                    </SignedIn>
                </div>

            </nav>
        </>
    );
};
