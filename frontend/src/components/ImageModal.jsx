import { useEffect } from "react";

export default function ImageModal({ src, alt = "Complaint attachment", onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  if (!src) return null;
  return <div className="image-modal" role="dialog" aria-modal="true" aria-label="Attachment preview" onMouseDown={onClose}><div className="image-modal-content" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Close image preview" onClick={onClose}>×</button><img src={src} alt={alt} /></div></div>;
}
