"use client";

import { useState, useEffect } from "react";

export default function ContactBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Handle the unmounting delay so the exit animation can play
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300); // Matches duration-300
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- UPDATE YOUR BUSINESS DETAILS HERE ---
  const phoneNumber = "078 079 3135"; 
  const displayPhone = "+27 78 079 3135";
  const email = "hello@spotless.co.za";
  const instagram = "@spotlessrides.cpt";
  // -----------------------------------------

  const whatsappLink = `https://wa.me/${phoneNumber}?text=Hi%20Spotless,%20I'd%20like%20to%20inquire%20about%20a%20booking.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Expanded Contact Card */}
      {isRendered && (
        <div 
          className={`bg-white rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.12)] border border-gray-100 p-6 w-80 mb-4 pointer-events-auto origin-bottom-right transition-all duration-300 ease-out ${
            isOpen 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg text-black">Get in touch</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-6 font-light">
            Questions about our mobile detailing? We&apos;re here to help.
          </p>

          <div className="space-y-3">
            {/* WhatsApp */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="bg-green-100 text-green-600 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black">WhatsApp Us</div>
                <div className="text-xs text-gray-500">{displayPhone}</div>
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${email}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black">Email Us</div>
                <div className="text-xs text-gray-500">{email}</div>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="bg-pink-100 text-pink-600 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path></svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black">Instagram</div>
                <div className="text-xs text-gray-500">{instagram}</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto"
        aria-label="Contact us"
      >
        <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}