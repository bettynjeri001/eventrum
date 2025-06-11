import { Link, NavLink } from "react-router-dom";
import { motion } from 'framer-motion';
import { FiUser, FiLogOut, FiHome, FiMail, FiBookmark} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function Navbar() { 
  const userRole = localStorage.getItem("role");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

 const handleSignOut = () => {
    logout();
    navigate("/");
  };

  let navLinks = [
    { path: "/", name: "Home", icon: <FiHome className="mr-2 text-orange-500" /> },
    { path: "/contact", name: "Contact", icon: <FiMail className="mr-2 text-orange-500" /> },
  ];

  if (currentUser && currentUser.role === "organizer") {
    navLinks.push({
      path: "/organizer-dashboard",
      name: "Organizer Dashboard",
      icon: <FiBookmark className="mr-2 text-orange-500" />,
    });
      navLinks = navLinks.filter(link => link.name !== "Home" && link.name !== "Contact");
  }
  

   if (currentUser && currentUser.role === "attendee") {
    navLinks.push({
      path: "/attendee-dashboard",
      name: "My Dashboard",
      icon: <FiBookmark className="mr-2 text-orange-500" />,
    });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-cyan-950 shadow-sm"
    >
     
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">Eventrum</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-orange-600'
                      : 'text-orange-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-gray-100">
                    <FiUser className="w-6 h-6" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl shadow-lg bg-white transform scale-0 group-hover:scale-100 transition-transform">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-orange-100">
                        <FiUser className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {currentUser.username || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser.email || ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 text-sm rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg text-white hover:bg-orange-700 transition-colors"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg border border-orange-600 text-orange-600 font-bold hover:bg-orange-100 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-blue-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}