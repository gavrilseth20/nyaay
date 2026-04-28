import { useEffect, useState } from "react";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function greetingFor(hour) {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function useGreeting() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const hour = now.getHours();
  const minute = now.getMinutes();
  return {
    greeting: greetingFor(hour),
    time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    dateLine: `${dayLabels[now.getDay()]} · ${now.getDate()} ${monthLabels[now.getMonth()]} ${now.getFullYear()}`,
    now
  };
}
