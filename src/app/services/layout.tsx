"use client";

import Navbar from "@/components/Navbar";

export default function Layout({ children }: any) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
