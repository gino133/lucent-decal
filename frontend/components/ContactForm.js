"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contacts", form);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <input
        required
        name="name"
        placeholder="Họ và tên"
        value={form.name}
        onChange={handleChange}
        className="border border-on-background/20 rounded-lg px-4 py-3 bg-white outline-none focus:border-secondary"
      />
      <input
        required
        name="phone"
        placeholder="Số điện thoại"
        value={form.phone}
        onChange={handleChange}
        className="border border-on-background/20 rounded-lg px-4 py-3 bg-white outline-none focus:border-secondary"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border border-on-background/20 rounded-lg px-4 py-3 bg-white outline-none focus:border-secondary md:col-span-2"
      />
      <input
        name="subject"
        placeholder="Chủ đề"
        value={form.subject}
        onChange={handleChange}
        className="border border-on-background/20 rounded-lg px-4 py-3 bg-white outline-none focus:border-secondary md:col-span-2"
      />
      <textarea
        required
        name="message"
        placeholder="Nội dung cần tư vấn..."
        rows={5}
        value={form.message}
        onChange={handleChange}
        className="border border-on-background/20 rounded-lg px-4 py-3 bg-white outline-none focus:border-secondary md:col-span-2"
      />
      <button
        disabled={status === "sending"}
        className="btn-primary rounded-lg px-8 py-4 md:col-span-2 lemon-glow disabled:opacity-50"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>
      {status === "success" && <p className="text-green-600 md:col-span-2">Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</p>}
      {status === "error" && <p className="text-red-600 md:col-span-2">Có lỗi xảy ra, vui lòng thử lại.</p>}
    </form>
  );
}
