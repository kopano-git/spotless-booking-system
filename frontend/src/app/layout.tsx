
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar"; // <-- The new dynamic component
import ContactBubble from "@/components/ContactBubble"; // <-- Import it
import "leaflet/dist/leaflet.css";

// Body font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Heading font
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SPOTLESS | Auto Care",
  description: "Premium car cleaning, and mobile detailing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#F9F9F9] text-gray-900 min-h-screen flex flex-col`}>
        
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

               <footer className="bg-white border-t mt-auto py-8 text-center text-sm text-gray-500 font-light tracking-wide">
          © {new Date().getFullYear()} SPOTLESS. Payment collected upon arrival.
        </footer>
                <ContactBubble />

      </body>
    </html>
  );
}
