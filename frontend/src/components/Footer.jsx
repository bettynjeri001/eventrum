
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import logo from '../assets/logo.png';
//import { motion } from 'framer-motion';


const Footer = () => {
  return (
    <footer 
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
    className="sticky top-0 z-50 bg-cyan-950 shadow-sm text-gray-300 "
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              {/* <img src={logo} alt="Evergreen Estate" className="w-12 h-12" /> */}
              <span className="text-2xl font-bold text-white">
              <span className="text-2xl font-bold text-orange-600">Eventrum</span>
              </span>
            </Link>
            <p className="text-sm">
             Streamline Your Next Event!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-orange-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/allProperties" className="hover:text-orange-500 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <span> Hackney Ave</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-gray-500" />
                <span>+254 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                <a href="./pages/ContactPage" className="hover:text-orange-500 transition-colors">
                  eventrum.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Follow Us On:</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-gray-500 hover:bg-amber-700 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-500 hover:bg-amber-700 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-500 hover:bg-amber-700 transition-colors">
                <FaInstagram size={20} />
              </a>
              <br />
              <br/>
              <h2 className="font-bold flex gap-3 text=amber-700" >@Eventrum</h2>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 pt-8 mt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Eventrum. All rights reserved. | 
            <a href="#" className="hover:text-gray-600 px-2 transition-colors">Privacy Policy</a> • 
            <a href="#" className="hover:text-gray-600 px-2 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;