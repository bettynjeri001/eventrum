import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "organizer" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/eventsapp/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      alert("Registration failed! User arleady exists.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-900">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <select name="role" onChange={handleChange}>
            <option value="attendee">Attendee</option>
            <option value="organizer">Event Organizer</option>
          </select>
          <button type="submit" className="bg-orange-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}