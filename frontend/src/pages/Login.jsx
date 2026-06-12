import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/");

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100%{
            transform:translateY(0px);
          }
          50%{
            transform:translateY(-25px);
          }
        }

        @keyframes fadeUp {
          from{
            opacity:0;
            transform:translateY(30px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .animate-float{
          animation:float 8s ease-in-out infinite;
        }

        .animate-float-delay{
          animation:float 10s ease-in-out infinite;
        }

        .animate-fade-up{
          animation:fadeUp .8s ease forwards;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#FFF0E4] flex items-center justify-center px-4">

        {/* Background Blob 1 */}
        <div className="absolute -top-37.5 -left-30 w-96 h-96 bg-[#24B1B1]/20 rounded-full blur-3xl animate-float" />

        {/* Background Blob 2 */}
        <div className="absolute -bottom-37.5 -right-30 w-112.5 h-112.5 bg-[#007979]/15 rounded-full blur-3xl animate-float-delay" />

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Section */}
          <div className="hidden lg:block animate-fade-up">

            <span className="bg-[#FFE0C5] text-[#007979] px-4 py-2 rounded-full font-semibold">
              AI Powered Career Intelligence
            </span>

            <h1 className="mt-6 text-6xl font-black text-[#004A4A] leading-tight">
              Welcome
              <span className="block text-[#24B1B1]">
                Back
              </span>
            </h1>

            <p className="mt-6 text-xl text-[#006666] max-w-lg leading-relaxed">
              Login to continue your career growth journey,
              analyze your resume, discover skill gaps,
              and receive AI-powered recommendations.
            </p>

            <div className="mt-10 space-y-4">
              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                📄 Resume Analysis
              </div>

              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                🎯 ATS Optimization
              </div>

              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                🤖 AI Career Guidance
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="animate-fade-up">

            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-4xl p-8 md:p-10">

              <h2 className="text-4xl font-bold text-center text-[#007979] mb-2">
                Login
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Access your account
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-[#004A4A]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 bg-white focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20 focus:border-[#24B1B1] transition-all"
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 font-medium text-[#004A4A]"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 bg-white focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20 focus:border-[#24B1B1] transition-all"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#007979] font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#007979] hover:bg-[#006666] text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Signing In..."
                    : "Login"}
                </button>

                {/* Register Link */}
                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#007979] font-semibold hover:text-[#24B1B1]"
                  >
                    Register
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;