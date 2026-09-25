import React from "react";
import { getSirahEvents } from "@/data/sirahEvents";
import ClientScrollytelling from "@/components/ClientScrollytelling";

export default async function Home() {
  const events = await getSirahEvents();

  return (
    <main className="w-full h-screen overflow-hidden bg-deep-obsidian">
      <ClientScrollytelling events={events} />
    </main>
  );
}
