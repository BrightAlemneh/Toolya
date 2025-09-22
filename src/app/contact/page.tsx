"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open default mail client with prefilled email
    window.location.href = `mailto:brightalemneh@gmail.com?subject=Contact from ${name}&body=${encodeURIComponent(
      message + "\n\nFrom: " + name + " (" + email + ")"
    )}`;
    setSubmitted(true);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      {submitted ? (
        <p className="text-green-600 font-semibold">
          Your message has been initiated in your email client. Thank you!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Your message"
              rows={5}
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      )}
      <p className="mt-6">
        Or email us directly at:{" "}
        <a
          href="mailto:brightalemneh@gmail.com"
          className="text-blue-600 underline"
        >
          brightalemneh@gmail.com
        </a>
      </p>
    </main>
  );
}
