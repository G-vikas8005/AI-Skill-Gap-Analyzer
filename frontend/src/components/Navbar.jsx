import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-[#FFF0E4]/80 backdrop-blur-md border-b border-[#24B1B1]/20 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-[#007979] text-white flex items-center justify-center font-bold shadow-md">
            S
          </div>

          <span className="text-xl font-bold text-[#004A4A]">
            SkillGap AI
          </span>

        </Link>

        {/* Center Links (optional system feel) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[#006666]">

          {user && (
            <>
              <Link to="/dashboard" className="hover:text-[#007979] transition">
                Dashboard
              </Link>

              <Link to="/ats-analysis" className="hover:text-[#007979] transition">
                ATS
              </Link>

              <Link to="/radar-analysis" className="hover:text-[#007979] transition">
                Radar
              </Link>

              <Link to="/ai-guidance" className="hover:text-[#007979] transition">
                AI
              </Link>
            </>
          )}

          <Link to="/" className="hover:text-[#007979] transition">
            Home
          </Link>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full border border-[#24B1B1]/20">
                <div className="w-7 h-7 rounded-full bg-[#007979] text-white flex items-center justify-center text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>

                <span className="text-[#004A4A] font-medium text-sm">
                  {user.name}
                </span>
              </div>

              <Link to="/dashboard">
                <button className="px-4 py-2 bg-[#007979] text-white rounded-lg hover:bg-[#006666] transition shadow-md">
                  Dashboard
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-[#007979] text-[#007979] rounded-lg hover:bg-[#007979] hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-[#007979] hover:bg-white/60 rounded-lg transition">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="px-4 py-2 bg-[#007979] text-white rounded-lg hover:bg-[#006666] transition">
                  Get Started
                </button>
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;