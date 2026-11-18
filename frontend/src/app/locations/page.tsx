// import CoverageMap from "@/components/CoverageMap";
import MapWrapper from "@/components/MapWrapper";


export default function Locations() {
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-black">
          Our Coverage Area
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto font-light">
          We bring the premium care directly to your driveway across the Cape Town Metropole. 
          Click the zones on the map to see what we cover.
        </p>
      </div>

      {/* Map Section */}
      {/* <div className="mb-16">
        <CoverageMap />
      </div> */}

      <div className="mb-16">
  <MapWrapper />
</div>

      {/* Zones Grid (Text version of the map) */}
            {/* Zones Grid */}
      <div className="grid gap-6 sm:grid-cols-3 mb-16">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-heading font-bold text-xl text-black mb-2">Kraaifontein</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Servicing all residential estates including Buh-Rein Estate, Graanendal, Pinehurst, and surrounding areas.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-heading font-bold text-xl text-black mb-2">Brackenfell</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Covering Protea Hoogte, Vredekloof, and the surrounding Brackenfell central areas.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-heading font-bold text-xl text-black mb-2">Durbanville</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Reaching out to Durbanville central and bordering Kraaifontein estates within a 15-minute drive.
          </p>
        </div>
      </div>

      {/* Call to Action for other areas */}
      <div className="text-center bg-black text-white p-12 rounded-3xl shadow-xl">
        <h3 className="font-heading text-3xl font-bold mb-4">Just outside the lines?</h3>
        <p className="text-gray-300 mb-8 font-light max-w-md mx-auto">
          We love a challenge. Contact us to see if we can accommodate your location for a small travel fee.
        </p>
        <a 
          href="https://wa.me/27821234567" // Update with your WhatsApp link
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-transform active:scale-95"
        >
          Inquire on WhatsApp
        </a>
      </div>

    </main>
  );
}