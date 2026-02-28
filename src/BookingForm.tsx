import { useState } from 'react';

export default function BookingForm({ onBack }: { onBack: () => void }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        industry: '',
        teamSize: '',
        fullName: '',
        phone: '',
        email: '',
        company: ''
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 4));
    const handleBack = () => {
        if (step === 1) onBack();
        else setStep(s => Math.max(s - 1, 1));
    };

    const isStepValid = () => {
        if (step === 1) return formData.industry !== '';
        if (step === 2) return formData.teamSize !== '';
        if (step === 3) return formData.fullName && formData.phone && formData.email && formData.company;
        return true;
    };

    return (
        <div className="flex-1 w-full max-w-[850px] px-4 py-8 md:py-16 flex flex-col items-center justify-start space-y-10 relative z-10 mt-10">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-xl border border-[#131628]/10 p-6 md:p-10">

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-[#131628]/60">Step {Math.min(step, 3)} of 3</span>
                        <span className="text-sm font-semibold text-[#6f00ff]">{Math.round((Math.min(step, 3) / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#6f00ff] h-2 rounded-full transition-all duration-300" style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}></div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2.5xl font-bold text-[#131628]">What industry are you in?</h2>
                        <div className="space-y-3">
                            {['Home Services', 'Real Estate', 'Service Based', 'Brick & Mortar', 'Other'].map(option => (
                                <label key={option} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${formData.industry === option ? 'border-[#6f00ff] bg-[#6f00ff]/5' : 'border-gray-200 hover:border-[#6f00ff]/50'}`}>
                                    <input type="radio" name="industry" value={option} checked={formData.industry === option} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-5 h-5 accent-[#6f00ff]" />
                                    <span className="ml-3 font-medium text-[#131628]">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2.5xl font-bold text-[#131628]">What is your team size?</h2>
                        <div className="space-y-3">
                            {['1-5', '5-10', '10-15', '20+'].map(option => (
                                <label key={option} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${formData.teamSize === option ? 'border-[#6f00ff] bg-[#6f00ff]/5' : 'border-gray-200 hover:border-[#6f00ff]/50'}`}>
                                    <input type="radio" name="teamSize" value={option} checked={formData.teamSize === option} onChange={e => setFormData({ ...formData, teamSize: e.target.value })} className="w-5 h-5 accent-[#6f00ff]" />
                                    <span className="ml-3 font-medium text-[#131628]">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2.5xl font-bold text-[#131628]">Contact Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#131628] mb-1">Full Name</label>
                                <input type="text" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f00ff] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#131628] mb-1">Phone Number</label>
                                <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f00ff] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#131628] mb-1">Email Address</label>
                                <input type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f00ff] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#131628] mb-1">Company Name</label>
                                <input type="text" placeholder="Acme Inc." value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f00ff] focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-16 h-16 bg-[#6f00ff] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#131628]">Request Submitted!</h2>
                        <p className="text-[#131628]/70">We'll be in touch shortly to schedule your strategy call.</p>
                        <button onClick={onBack} className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-[#131628] font-semibold rounded-lg transition-colors">Return to Home</button>
                    </div>
                )}

                {step < 4 && (
                    <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                        <button onClick={handleBack} className="px-6 py-3 font-semibold text-[#131628]/60 hover:text-[#131628] transition-colors rounded-lg hover:bg-gray-50">
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button onClick={handleNext} disabled={!isStepValid()} className={`px-8 py-3 font-bold text-white rounded-lg transition-all ${isStepValid() ? 'bg-[#6f00ff] hover:bg-[#5a00cc] hover:shadow-md' : 'bg-gray-300 cursor-not-allowed'}`}>
                            {step === 3 ? 'Submit Request' : 'Continue'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
