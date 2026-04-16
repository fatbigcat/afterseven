import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CreateEventInput } from "@/types";

interface CreateEventFormProps {
  onSubmit: (data: CreateEventInput) => Promise<void>;
  isLoading: boolean;
}

export function CreateEventForm({
  onSubmit,
  isLoading,
}: Readonly<CreateEventFormProps>) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const submitForm = async () => {
    await onSubmit({
      title,
      event_date: new Date(eventDate).toISOString(),
      capacity: Number.parseInt(capacity, 10),
      email_content: emailContent,
    });
    setTitle("");
    setEventDate("");
    setCapacity("");
    setEmailContent("");
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    void submitForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-white/10 p-6"
    >
      <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-alabaster mb-6">
        Create New Event
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="event-title">Title</Label>
          <Input
            id="event-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
        </div>

        <div>
          <Label htmlFor="event-date">Date & Time</Label>
          <input
            id="event-date"
            type="datetime-local"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-base text-alabaster focus:border-alabaster focus:outline-none transition-colors text-[16px] scheme-dark"
          />
        </div>

        <div>
          <Label htmlFor="event-capacity">Capacity</Label>
          <Input
            id="event-capacity"
            type="number"
            required
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Max attendees"
          />
        </div>

        <div>
          <Label htmlFor="event-email-content">Email Content (optional)</Label>
          <textarea
            id="event-email-content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Add a custom message to the booking confirmation email for this event."
            className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-base text-alabaster placeholder:text-white/40 focus:border-alabaster focus:outline-none transition-colors min-h-30 resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-alabaster text-black font-bold text-sm uppercase tracking-[0.15em] py-3 hover:bg-white transition-colors active:scale-[0.98] disabled:opacity-50 min-h-12"
        >
          {isLoading ? <LoadingSpinner /> : "Create Event"}
        </button>
      </form>
    </motion.div>
  );
}
