import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const passwordStrength =
    getPasswordStrength(formData.password);

  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";

    if (!formData.password)
      newErrors.password = "Password is required";

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Registration Failed"
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

        {/* Background Blobs */}
        <div className="absolute -top-37.5 -left-30 w-96 h-96 bg-[#24B1B1]/20 rounded-full blur-3xl animate-float" />

        <div className="absolute -bottom-37.5 -right-30 w-112.5 h-112.5 bg-[#007979]/15 rounded-full blur-3xl animate-float-delay" />

        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Section */}
          <div className="hidden lg:block animate-fade-up">

            <span className="bg-[#FFE0C5] text-[#007979] px-4 py-2 rounded-full font-semibold">
              Join CareerAI Today
            </span>

            <h1 className="mt-6 text-6xl font-black text-[#004A4A] leading-tight">
              Create Your
              <span className="block text-[#24B1B1]">
                Future
              </span>
            </h1>

            <p className="mt-6 text-xl text-[#006666] max-w-lg leading-relaxed">
              Build a stronger resume, discover
              missing skills, improve ATS scores,
              and get AI-powered career guidance.
            </p>

            <div className="mt-10 space-y-4">
              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                🚀 Personalized Career Roadmaps
              </div>

              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                📊 Advanced Skill Gap Analysis
              </div>

              <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl">
                🎯 ATS Resume Optimization
              </div>
            </div>
          </div>

          {/* Register Card */}
          <div className="animate-fade-up">

            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-4xl p-8 md:p-10">

              <h2 className="text-4xl font-bold text-center text-[#007979] mb-2">
                Create Account
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Start your career journey today
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>
                  <label className="block mb-2 font-medium text-[#004A4A]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20"
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 font-medium text-[#004A4A]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20"
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-2 font-medium text-[#004A4A]">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20"
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#007979]"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  {/* Strength Meter */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">

                        <div
                          className="h-full bg-[#24B1B1] transition-all duration-500"
                          style={{
                            width: `${
                              (passwordStrength /
                                4) *
                              100
                            }%`,
                          }}
                        />

                      </div>

                      <p className="text-sm mt-1 text-[#007979]">
                        {
                          strengthLabels[
                            passwordStrength
                          ]
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-2 font-medium text-[#004A4A]">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full px-5 py-4 rounded-2xl border border-[#24B1B1]/20 focus:outline-none focus:ring-4 focus:ring-[#24B1B1]/20"
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#007979]"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#007979] hover:bg-[#006666] text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <p className="text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#007979] font-semibold hover:text-[#24B1B1]"
                  >
                    Login
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

export default Register;