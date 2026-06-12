import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));


  // Logout
  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/">

        <h1 className="text-3xl font-bold text-blue-600">

          SkillGap AI

        </h1>

      </Link>


      {/* Right Side */}
      <div className="flex items-center gap-4">

        {

          user ? (

            <>

              <p className="font-semibold text-gray-700">

                Hi, {user.name}

              </p>


              <Link to="/dashboard">

                <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg">

                  Dashboard

                </button>

              </Link>


              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-lg"
              >

                Logout

              </button>

            </>

          ) : (

            <>

              <Link to="/login">

                <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg">

                  Login

                </button>

              </Link>


              <Link to="/register">

                <button className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-lg">

                  Register

                </button>

              </Link>

            </>

          )

        }

      </div>

    </nav>

  );

}

export default Navbar;