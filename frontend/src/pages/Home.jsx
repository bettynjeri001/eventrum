import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion'
// import Navbar from '../components/Navbar'
import hero1 from '../assets/hero1.jpg'
//import Search from '../components/Search'
import { FiSearch } from "react-icons/fi";
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";


const sampleEvents = [
  { id: 1, name: "AI Tech Conference", location: "Raddison, Nairobi", category: "tech" },
 
];



function formatTime12h(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = ((+hour % 12) || 12);
  const ampm = +hour < 12 ? "AM" : "PM";
  return `${h}:${minute} ${ampm}`;
}

function Search({ onSearch }) {
  const [location, setLocation] = React.useState('');
 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch({ location, /* category */ });
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
       {/* <input
        type="text"
        placeholder="Category.."
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border border-gray-600 rounded-lg px-4 py-2 w-64 bg-gray-100 text-gray-800"
      /> */}
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
  const navigate = useNavigate(); 

  const userRole = localStorage.getItem("role");
   console.log("userRole:", userRole);

  useEffect(() => {
    fetch("http://localhost:8000/api/events/")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading events...</p>;


   const handleSearch = ({location}) => {
     setSearchLocation(location);
   };

    const filteredEvents = events.filter(event =>
    searchLocation
      ? event.location.toLowerCase().includes(searchLocation.toLowerCase())
      : true
  );

   return ( 
    <>
      <div className="min-h-screen bg-stone-600">
        {/* Hero Banner */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <img className="w-full h-full" src={hero1} alt="logo" />
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
          <div className="container mx-auto px-4 ">
            <h2 className="text-3xl font-bold text-center mb-8 text-cyan-950">Find Your Perfect Event</h2>
            <p className="text-center text-orange-600 mb-18">
              Explore a wide range of events happening near you.
            </p>
            <br />
            <Search onSearch={handleSearch} />

            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
              {filteredEvents.length === 0 ? (
                <p className="text-gray-700">No events available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h2 className="font-bold text-xl text-orange-700 mb-2">{event.title}</h2>
                      <p className="text-gray-700 text-sm mb-1">
                        {event.date} {event.time && <>at {formatTime12h(event.time)}</>} &middot; {event.location}
                      </p>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <p className="text-sm text-cyan-900 font-semibold mb-2">
                        Ticket: Ksh {event.ticket}
                      </p>
                      {userRole !== "organizer" && (
                      <button
                        className="mt-2 bg-cyan-900 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold"
                        onClick={() => navigate(`/tickets/${event.id}`)}
                       >              
                        Proceed to Get Tickets
                      </button>
                      )}
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
                 
           

