import Link from "next/link";
import { getServices, Service } from "@/lib/api";
import FadeIn from "@/components/FadeIn";
import Typewriter from "@/components/Typewriter";

export const dynamic = 'force-dynamic';

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

export default async function Home() {
  const services = await getServices();
  
  // Group services by category
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
            <span className="italic font-light">kicks & rides.</span>
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
      <div className="space-y-20">
        {Object.entries(grouped).map(([category, items]) => {
          // Grab the description from the first item in the group
          const mainDescription = items[0]?.description;
          
          return (
            <section key={category} className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
              
              {/* Category Header */}
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="font-heading text-3xl font-bold text-black mb-4">
                  {category}
                </h2>
                {mainDescription && (
                  <p className="text-gray-500 leading-relaxed">
                    {mainDescription}
                  </p>
                )}
              </div>

              {/* Pricing Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((s) => (
                  <div key={s.id} className="flex flex-col items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                    
                    <div className="mb-4">
                      <h3 className="font-heading font-semibold text-xl text-black mb-1">
                        {s.name}
                      </h3>
                      <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {formatDuration(s.duration_minutes)}
                      </div>
                    </div>

                    <div className="w-full pt-4 mt-auto border-t border-gray-200">
                      <div className="text-2xl font-medium text-black mb-4">
                        R {s.price}
                      </div>
                      <Link
                        href={`/booking/${s.id}`}
                        className="block w-full bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-transform active:scale-95"
                      >
                        Book {s.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          );
        })}
      </div>
      </FadeIn>
    </main>
  );
}