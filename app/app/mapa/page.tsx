"use client";

import dynamic from "next/dynamic";

const MataroMap = dynamic(() => import("@/components/MataroMap"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm">Cargando mapa...</p>,
});

export default function MapaPage() {
  return (
    <main className="p-4">
      <MataroMap />
    </main>
  );
}
