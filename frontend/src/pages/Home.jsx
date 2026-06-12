import React, { useEffect, useState } from "react";

// Safe localStorage parser
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function Home() {
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FFF0E4] text-[#004A4A] overflow-hidden selection:bg-[#24B1B1] selection:text-white">
      {/* 🔹 Animation Styles */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite 2s; }
        .fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      {/* 🔹 Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#24B1B1]/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute top-32 right-[-15%] w-125 h-125 bg-[#007979]/10 rounded-full blur-3xl animate-float-delay pointer-events-none" />

      {/* 🔹 Hero Section */}
      <section className={`relative min-h-screen flex items-center px-4 md:px-6 lg:px-12 ${isVisible ? "" : "opacity-0"}`}>
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT */}
            <div className={`fade-up delay-100 ${isVisible ? "" : "opacity-0"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-md mb-8 hover:scale-105 transition-transform duration-300 cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#24B1B1] animate-pulse" />
                <span className="text-sm md:text-base font-semibold text-[#007979]">
                  AI Powered Career Intelligence
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-[1.1] text-[#004A4A]">
                Build The
                <span className="block text-[#24B1B1] mt-1">Perfect Resume</span>
              </h1>

              <p className="mt-6 md:mt-8 text-base md:text-xl text-[#006666]/90 max-w-xl leading-relaxed">
                Upload your resume, uncover skill gaps, improve ATS compatibility, and receive AI-generated career guidance tailored to your dream role.
              </p>

              <div className="flex flex-wrap gap-4 mt-8 md:mt-10">
                {user ? (
                  <a href="/dashboard" aria-label="Go to dashboard">
                    <button className="group relative bg-[#007979] text-[#FFF0E4] px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-[#005F5F] hover:scale-[1.03] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/50">
                      Open Dashboard
                      <span className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#24B1B1]/40 transition-all duration-300" />
                    </button>
                  </a>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <a href="/register" aria-label="Register for free">
                      <button className="group bg-[#007979] text-[#FFF0E4] px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-[#005F5F] hover:scale-[1.03] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/50">
                        Get Started Free
                      </button>
                    </a>
                    <a href="/login" aria-label="Login to account">
                      <button className="group bg-white border-2 border-[#007979] text-[#007979] px-8 py-4 rounded-2xl font-semibold hover:bg-[#FFE0C5] hover:scale-[1.03] hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/50">
                        Login
                      </button>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className={`fade-up delay-300 ${isVisible ? "" : "opacity-0"}`}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-[#24B1B1] to-[#007979] rounded-[36px] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative bg-white/85 backdrop-blur-xl rounded-4xl p-6 md:p-8 shadow-2xl border border-white/50 hover:-translate-y-2 transition-all duration-500">
                  <div className="space-y-5">
                    {["📄 Resume Uploaded", "🎯 ATS Analysis", "📊 Skill Gap Detection", "🤖 AI Career Guidance"].map((step, i) => (
                      <React.Fragment key={i}>
                        <div className="bg-[#FFE0C5] p-4 md:p-5 rounded-2xl border border-[#FFE0C5]/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <h3 className="font-bold text-[#004A4A]">{step}</h3>
                        </div>
                        {i < 3 && <div className="flex justify-center text-2xl md:text-3xl text-[#24B1B1] animate-pulse">↓</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🔹 Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12 bg-[#FFF0E4]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 fade-up delay-200">
            <h2 className="text-3xl md:text-5xl font-black text-[#004A4A]">
              Everything You Need
            </h2>
            <p className="mt-4 text-[#006666] text-base md:text-lg max-w-2xl mx-auto">
              A complete AI-powered career development platform designed for modern job seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: "📄", title: "Resume Parsing", text: "Extract information automatically with 99% accuracy." },
              { icon: "🎯", title: "ATS Score", text: "Measure resume compatibility against top company filters." },
              { icon: "📊", title: "Skill Analysis", text: "Find missing skills instantly based on your target role." },
              { icon: "🤖", title: "AI Guidance", text: "Personalized career roadmap and interview prep tips." },
            ].map((item, index) => (
              <div
                key={index}
                className={`fade-up delay-${index * 100} bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-[#24B1B1]/30 border border-transparent transition-all duration-300 cursor-default group`}
              >
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#004A4A] mb-2 group-hover:text-[#007979] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#006666]/80 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Footer Hint */}
      <footer className="py-8 text-center text-[#006666]/60 text-sm md:text-base">
        © {new Date().getFullYear()} CareerAI. Built for performance & accessibility.
      </footer>
    </div>
  );
}

export default Home;