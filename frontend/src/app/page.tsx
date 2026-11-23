import Link from "next/link";
import { getServices, Service } from "@/lib/api";
import FadeIn from "@/components/FadeIn"; // <-- Import the component
import Typewriter from "@/components/Typewriter"; // <-- Import the new component



export const dynamic = 'force-dynamic';

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}


export default async function Home() {
  const services = await getServices();
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category_display] ||= []).push(s);
    return acc;
  }, {});

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-20 mt-16">
        <FadeIn delay={100}>
          <h1 className="font-heading text-5xl sm:text-7xl font-bold tracking-tighter mb-6 text-black">
            Premium care for <br className="hidden sm:block" />
            <span className="italic font-light">rides.</span>
          </h1>
        </FadeIn>
        <FadeIn delay={400}>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-light min-h-[3rem]">
          <Typewriter text="Premium car cleaning, and mobile detailing. 
          Book online. Pay in person upon arrival." speed={30} />
        </p>
        </FadeIn>
      </div>

      {/* Services Grid */}
      <FadeIn delay={500}>
      <div className="space-y-16">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="font-heading text-3xl font-semibold mb-8 text-black border-b border-gray-200 pb-4">
              {category}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <div key={s.id} className="bg-white rounded-3xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  
                  <div className="flex-grow">
                    <div className="font-heading font-semibold text-xl text-black mb-2">{s.name}</div>
                    
                    {s.description && (
  <p className="text-sm text-gray-500 mb-4 leading-relaxed whitespace-pre-line line-clamp-5">
    {s.description}
  </p>
)}

                    <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 mt-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {/* APPLIED FORMATTER HERE */}
                      {formatDuration(s.duration_minutes)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-2xl font-medium text-black">R {s.price}</div>
                    <Link
                      href={`/booking/${s.id}`}
                      className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-transform active:scale-95"
                    >
                      Book now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      </FadeIn>
    </main>
  );
}