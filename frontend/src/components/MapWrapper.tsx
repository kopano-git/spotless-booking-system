"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./CoverageMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

export default function MapWrapper() {
  return <Map />;
}