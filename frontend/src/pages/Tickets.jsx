import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RiicCRuBsEYlDQIvsfFAM6p1zGkJ7NcwUQbzucwahlQM7JUVerNAMs6WjOq1BiVhgvjsxDWnu0nv8LnKJ0B9dJQ00ym9tQQRN"); // Your Stripe public key

export default function Tickets() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/events/${eventId}/`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => setError("Failed to load event."));
  }, [eventId]);

  const handleStripePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const stripe = await stripePromise;

      // If you use JWT authentication, include the token in headers
      const accessToken = localStorage.getItem("access_token");

      const res = await fetch("http://localhost:8000/api/stripe/create-checkout-session/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ event_id: eventId }),
        credentials: "include", // if your backend uses session authentication
      });

      const data = await res.json();

      if (data.id) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        setError(data.error || "Payment session failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("Stripe payment failed.");
      setLoading(false);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pay for {event.title}</h1>
      <p className="mb-2">{event.date} at {event.time} &middot; {event.location}</p>
      <p className="mb-4">{event.description}</p>
      <p className="mb-4 font-bold text-cyan-900">
        Ticket Price: {event.ticket > 0 ? `Ksh ${event.ticket}` : "Free"}
      </p>

      {event.ticket > 0 ? (
        <button
          onClick={handleStripePayment}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Pay with Card (Stripe)"}
        </button>
      ) : (
        <div className="text-green-700 font-semibold">
          This event is free. No payment required!
        </div>
      )}

      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}