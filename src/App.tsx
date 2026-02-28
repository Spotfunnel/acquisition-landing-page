import { useState } from 'react';
import BookingForm from './BookingForm';
import './index.css';

function App() {
  const [isBooking, setIsBooking] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start font-sans tracking-tight relative overflow-hidden bg-[#ffffff]">
      {/* Navbar */}
      <nav className="w-full bg-[#131628] py-4 px-6 flex items-center justify-center sticky top-0 z-50">
        <div className="flex items-center justify-center space-x-3 w-full">
          <img src="/logo-white.svg" alt="Spotfunnel Logo" className="h-8 w-auto" />
          <span className="text-white font-[700] text-xl tracking-tight">Spotfunnel</span>
        </div>
      </nav>

      {/* Clean Flat Background */}
      {!isBooking ? (
        <main className="flex-1 w-full max-w-[850px] px-4 py-8 md:py-12 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] relative z-10 text-[#131628]">
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-10 md:space-y-16">
            <div className="text-center space-y-5 w-full max-w-[800px]">
              <h1 className="text-[32px] md:text-[48px] font-[800] leading-[1.12]">
                Increase Profit by Removing Operational Drag (in 7 Days)
              </h1>
              <p className="text-[17px] md:text-[20px] text-gray-600 leading-[1.5] font-[500] mx-auto max-w-[750px] px-2">
                We identify the constraints slowing execution—then deploy tailored AI workflows to eliminate admin, speed up onboarding, and improve throughput across your team.
              </p>
            </div>

            <div className="w-full max-w-[600px] space-y-4 font-semibold text-[15px] md:text-[17px] mx-auto flex flex-col items-center">
              <div className="w-auto">
                {[
                  "Cut repetitive admin and coordination work",
                  "Faster onboarding for customers + new hires",
                  "Clear workflows your team actually uses (no “AI experiments”)"
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center space-x-3 justify-start mb-2">
                    <svg className="w-5 h-5 text-[#6f00ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="leading-tight text-left">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => setIsBooking(true)}
                className="bg-[#6f00ff] hover:bg-[#5a00cc] text-white flex items-center justify-center text-[20px] md:text-[22px] font-[800] px-12 py-4 md:py-5 rounded-[50px] transition-colors duration-200 w-full max-w-[380px] md:max-w-[420px]"
              >
                Book a Free Strategy Call
              </button>

              <div className="mt-5 flex items-center justify-center space-x-2 text-center">
                <svg className="w-5 h-5 text-[#6f00ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <p className="leading-tight text-[13px] md:text-[15px] font-bold">
                  No pitch. No credit card. If we’re not a fit, we’ll still point you in the right direction.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[700px] bg-gray-50/50 border-l-[3px] border-[#6f00ff] p-5 md:p-6 rounded-r-xl text-left z-10 mx-auto mt-12 md:mt-16 mb-4">
            <h3 className="text-[16px] font-black mb-2">P.S.</h3>
            <p className="text-[14px] md:text-[15px] text-gray-600 leading-relaxed font-medium">
              If you’re already investing $500K–$2M/year in payroll, this call shows where AI can create leverage without months of trial and error.
            </p>
          </div>
        </main>
      ) : (
        <BookingForm onBack={() => setIsBooking(false)} />
      )}

      <footer className="w-full py-6 text-center text-[#131628]/40 text-sm font-medium border-t border-[#131628]/5 bg-white relative z-10 w-full mt-auto">
        © 2026 SpotFunnel. All rights reserved.
      </footer>
    </div>
  )
}

export default App;
