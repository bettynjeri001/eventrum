// import { i, image } from "motion/react-client";

import React, {useState, useEffect } from "react";
import { FiGrid, FiClipboard, FiBarChart2, FiEdit, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function EventRegistrations({ event }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); 
    fetch(`http://localhost:8000/api/registrations/?event=${event.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [event.id]);

  return (
    <div className="mb-8 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-2 text-orange-700">{event.title}</h2>
      {loading ? (
        <p>Loading registrations...</p>
      ) : registrations.length === 0 ? (
        <p className="text-gray-500">No registrations for this event.</p>
      ) : (
        <table className="w-full text-left mb-2">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} className="border-t">
                <td className="py-2">{reg.name}</td>
                <td className="py-2">{reg.email}</td>
                <td className="py-2">{new Date(reg.registered_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


function formatTime12h(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = ((+hour % 12) || 12);
  const ampm = +hour < 12 ? "AM" : "PM";
  return `${h}:${minute} ${ampm}`;
}
const initialEvents = [
  {
    id: 1,
    title: "Investors Summit Nairobi",
    date: "2025-07-10",
    time: "09:00",
    location: "Villa Rosa Kempinski, Nairobi",
    description: "Meet top investors and entrepreneurs.",
    ticket: 1500,
    image: "https://example.com/event1.jpg",
  },
  {
    id: 2,
    title: "AI Machine Learning Tech Expo",
    date: "2025-08-15",
    time: "12:00",
    location: "KICC ,Nairobi",
    description: "Explore the latest advancements in AI and machine learning.",
    ticket: 1000,
    image: "https://example.com/event2.jpg",
  },
];

const sideMenu = [
  { key: "event", label: "Event Management", icon: <FiGrid /> },
  { key: "ticket", label: "Ticketing & Registration", icon: <FiClipboard /> },
  
  
  
];

export default function OrganizerDashboard() {
  const { currentUser } = useAuth();
 const [events, setEvents] = useState([]);
   const fetchEvents = async () => {
  const res = await fetch("http://localhost:8000/api/events/");
  const data = await res.json();
  setEvents(data);
};

  useEffect(() => {
    fetchEvents();
}, []);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    ticket: "",
    image: "",
    description: "",
  });
  const [activeMenu, setActiveMenu] = useState("event");

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
   const payload = {
    title: form.title,
    description: form.description,
    date: form.date,
    time: form.time,
    location: form.location,
    ticket: form.ticket,
    image: form.image,
    user: currentUser.id, // or however you identify the user
  };

  const response = await fetch("http://localhost:8000/api/events/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authentication header if needed
      // "Authorization": "Token YOUR_TOKEN"
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    setForm({ title: "", date: "", time: "", location: "", ticket: "", image: "", description: "" });
    setShowForm(false);
    fetchEvents(); // Refresh the event list
  } else {
    // Handle error
    alert("Failed to add event");
  }
};

  const handleEditEvent = (event) => {
    setEditId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      time: event.time || "",
      location: event.location,
      ticket: event.ticket || "",
      image: event.image || "",
      description: event.description,
    });
    setShowForm(true);
  };

  const handleUpdateEvent = async (e) => {
  e.preventDefault();
  const payload = {
    title: form.title,
    description: form.description,
    date: form.date,
    time: form.time,
    location: form.location,
    ticket: form.ticket,
    image: form.image,
    user: currentUser.id,
  };

  const response = await fetch(`http://localhost:8000/api/events/${editId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Token YOUR_TOKEN" // if needed
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    setEditId(null);
    setForm({ title: "", date: "", time: "", location: "", ticket: "", image: "", description: "" });
    setShowForm(false);
    fetchEvents(); // Refresh the event list
  } else {
    alert("Failed to update event");
  }
};

  const handleDelete = async (id) => {
  const res = await fetch(`http://localhost:8000/api/events/${id}/`, { method: "DELETE" });
  if (res.ok) fetchEvents();
};

  // Content for each menu
  const renderContent = () => {
    switch (activeMenu) {
      case "event":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-cyan-900">Event Management</h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditId(null);
                  setForm({ title: "", date: "", location: "", description: "" });
                }}
                className="bg-orange-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {showForm && !editId ? "Cancel" : editId ? "Cancel Edit" : "Add New Event"}
              </button>
            </div>
            {showForm && (
              <form onSubmit={editId ? handleUpdateEvent : handleAddEvent} className="mb-8 flex flex-col gap-3 bg-gray-100 p-4 rounded-lg">
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={form.time || ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                 
               />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                    type="text"
                 name="ticket"
                placeholder="Ticket Price or 'Free..'"
                value={form.ticket || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
                 required
            />
                  <input
                  type="text"
                 name="image"
                 placeholder="Image URL"
                 value={form.image || ""}
                 onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
             />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-cyan-900 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  {editId ? "Update Event" : "Add Event"}
                </button>
              </form>
            )}
            <h2 className="text-xl font-bold mb-4 text-cyan-900">Your Events</h2>
            {events.length === 0 ? (
              <p className="text-gray-500">No events yet.</p>
            ) : (
              <ul className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="bg-stone-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                     {event.image && (
                     <img
                     src={event.image}
                     alt={event.title}
                     className="w-24 h-24 object-cover rounded-lg border"
                  />
       )}
                    <div>
                      <h3 className="font-bold text-lg text-orange-700">{event.title}</h3>
                      <p className="text-gray-700 text-sm">
                         {event.date} {event.time && <>at {formatTime12h(event.time)}</>} &middot; {event.location}
                      </p>
                      <p className="text-gray-600">{event.description}</p>
                      <p className="text-sm text-cyan-900 font-semibold">
                       Ticket: Ksh {event.ticket}
                      </p>
                    </div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => handleEditEvent(event)}
                       className="p-2 rounded-full bg-cyan-900 hover:bg-cyan-700 text-white"
                     title="Edit"
                    >
                  <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 rounded-full bg-orange-700 hover:bg-orange-300 text-white"
                     title="Delete"
              >
                   <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      case "ticket":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-cyan-900">Ticketing & Registration</h1>
      <p className="text-gray-700 mb-6">Manage ticket sales and attendee registrations here.</p>
      {events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        events.map(event => (
          <EventRegistrations key={event.id} event={event} />
        ))
      )}
    </div>
  ); 
        
      // case "analytics":
      //   return (
        
      //     <div>
      //       <h1 className="text-3xl font-bold mb-4 text-cyan-900">Analytics</h1>
      //       <p className="text-gray-700">View event analytics and reports here.</p>
      //     </div>
        // );
      // case "attendee":
      //   return (
      //     <div>
      //       <h1 className="text-3xl font-bold mb-4 text-cyan-900">Attendee Management</h1>
      //       <p className="text-gray-700">Manage your event attendees here.</p>
      //     </div>
      //   );
      // case "finance":
      //   return (
      //     <div>
      //       <h1 className="text-3xl font-bold mb-4 text-cyan-900">Financial Tools</h1>
      //       <p className="text-gray-700">Access financial tools and reports here.</p>
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Side Navigation */}
      <aside className="w-64 bg-white shadow-lg rounded-r-xl p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cyan-900 mb-6">Dashboard</h2>
        {sideMenu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveMenu(item.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
              activeMenu === item.key
                ? "bg-orange-700 text-white"
                : "text-cyan-900 hover:bg-orange-100"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}