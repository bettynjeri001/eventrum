import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Admin shortcut (optional)
    if (formData.username === "admin" && formData.password === "123456") {
      login({ username: "admin", role: "admin" });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      navigate("/admin-dashboard");
      return;
    }
    const response = await fetch("http://127.0.0.1:8000/api/eventsapp/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      login(data); // update context
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", data.role);
      if (data.role === "attendee") navigate("/home");
      else if (data.role === "organizer") navigate("/organizer-dashboard");
      else navigate("/admin-dashboard");
    } else {
      alert("Login failed! Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-900">Welcome back!</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}