import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { FiSearch } from "react-icons/fi";
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import hero1 from '../assets/hero1.jpg'; 

function formatTime12h(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = ((+hour % 12) || 12);
  const ampm = +hour < 12 ? "AM" : "PM";
  return `${h}:${minute} ${ampm}`;
}

function Search({ onSearch }) {
  const [location, setLocation] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch({ location });
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
      <input
        type="text"
        placeholder="Location.."
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="border border-gray-600 rounded-lg px-4 py-2 w-64 bg-gray-100 text-gray-800"
      />
      <button
        type="submit"
        className="bg-orange-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
        aria-label="Search"
      >
        <FiSearch className="w-6 h-5 text-bold" />
      </button>
    </form>
  );
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate(); 

  // Check authentication status on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  // Fetch events
  useEffect(() => {
    fetch("http://localhost:8000/api/events/")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = ({ location }) => {
    setSearchLocation(location);
  };

  const filteredEvents = events.filter(event =>
    searchLocation
      ? event.location.toLowerCase().includes(searchLocation.toLowerCase())
      : true
  );

  if (loading) return <p className="text-center py-8">Loading events...</p>;

  return ( 
    <>
      <div className="min-h-screen bg-stone-600">
        {/* Hero Banner */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <img className="w-full h-full object-cover" src={hero1} alt="Event banner" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center text-white px-4"
          >
            <h1 className="text-2xl md:text-6xl font-bold mb-6">
              Looking for best events in Kenya?
              <br />
              We got you 
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Streamline Your Next Event!
            </p>
            <button
              onClick={() => document.querySelector('#searchSection').scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-700 hover:bg-amber-800 text-white px-8 py-4 rounded-lg text-lg font-medium"
            >
              Search Events
            </button>
          </motion.div>
        </div>

        {/* Search Section */}
        <div id="searchSection" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-cyan-950">Find Your Perfect Event</h2>
            <p className="text-center text-orange-600 mb-8">
              Explore a wide range of events happening near you.
            </p>
            <Search onSearch={handleSearch} />

            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
              {filteredEvents.length === 0 ? (
                <p className="text-gray-700 text-center">No events found. Try a different search.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h2 className="font-bold text-xl text-orange-700 mb-2">{event.title}</h2>
                        <p className="text-gray-700 text-sm mb-1">
                          {event.date} {event.time && <>at {formatTime12h(event.time)}</>}
                        </p>
                        <p className="text-gray-700 text-sm mb-2">{event.location}</p>
                        <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <p className="text-sm text-cyan-900 font-semibold mb-3">
                          Ticket: Ksh {event.ticket || 'N/A'}
                        </p>
                        
                        {/* Authentication-based buttons */}
                        {isLoggedIn && userRole !== "organizer" ? (
                          <div className="flex flex-col gap-2">
                            <button
                              className="bg-cyan-900 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              onClick={() => navigate(`/tickets/${event.id}`)}
                            >              
                              Get Tickets
                            </button>
                            {event.ticket_price > 0 && (
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                onClick={() => navigate(`/checkout/${event.id}`)}
                              >
                                Checkout Now
                              </button>
                            )}
                          </div>
                        ) : !isLoggedIn ? (
                          <div className="flex flex-col gap-2">
                            <button
                              className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                              disabled
                            >
                              Get Tickets (Login Required)
                            </button>
                            <p className="text-sm text-gray-500 text-center">
                              Please <span 
                                className="text-orange-600 cursor-pointer underline"
                                onClick={() => navigate('/login')}
                              >
                                log in
                              </span> to purchase tickets
                            </p>
                          </div>
                        ) : userRole === "organizer" && (
                          <p className="text-sm text-gray-500">
                            Organizers cannot purchase tickets
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}