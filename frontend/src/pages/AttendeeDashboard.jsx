import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function AttendeeDashboard() {
 
    const { currentUser } = useAuth();
    const [registrations, setRegistrations] = useState([]);

  // If user is not loaded yet, show nothing or a loading indicator
  if (!currentUser) {
    return <div className="text-center py-8">Please log in to view your dashboard.</div>;
  }
useEffect(() => {
  fetch(`http://localhost:8000/api/registrations/?attendee=${currentUser.id}`, {
    headers: {
      
    },
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => setRegistrations(data))
    .catch(err => {
      setRegistrations([]);
      // Optionally show an error message
      console.error("Failed to fetch registrations:", err);
    });
}, [currentUser]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
      {registrations.length === 0 ? (
        <p className="text-gray-500">You have not registered for any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {registrations.map(reg => (
            <li key={reg.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold text-xl text-orange-700 mb-2">{reg.event_title || reg.event?.title}</h2>
              <p className="text-gray-700">{reg.event_date || reg.event?.date} &middot; {reg.event_location || reg.event?.location}</p>
              <p className="text-gray-600">{reg.event_description || reg.event?.description}</p>
              <p className="text-sm text-cyan-900 font-semibold">
                Ticket: Ksh {reg.event_ticket || reg.event?.ticket}
              </p>
              <p className="text-green-700 font-semibold">
                Status: {reg.paid ? "Paid" : "Pending Payment"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}