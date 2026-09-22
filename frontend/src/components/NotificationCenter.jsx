import { useEffect, useState } from "react";

export const notify = ({ type = "info", message = "" }) => {
  window.dispatchEvent(
    new CustomEvent("app:toast", {
      detail: { type, message }
    })
  );
};

const icons = {
  success: "✓",
  error: "!",
  warning: "⚠",
  info: "i"
};

export default function NotificationCenter() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { type, message } = event.detail || {};
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const entry = { id, type, message };

      setItems((current) => [...current, entry]);

      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 3200);
    };

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {items.map((item) => (
        <div key={item.id} className={`toast toast-${item.type || "info"}`}>
          <span className="toast-icon">{icons[item.type] || icons.info}</span>
          <span className="toast-message">{item.message}</span>
        </div>
      ))}
    </div>
  );
}
