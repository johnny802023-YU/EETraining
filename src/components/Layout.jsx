import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function Layout({ progress, trainingRecords }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        progress={progress}
      />
      <main className="mx-auto min-h-screen w-full max-w-[1500px] px-4 py-5 md:pl-[18.5rem] md:pr-6 lg:py-7">
        <Outlet context={{ searchQuery, setSearchQuery, progress, trainingRecords }} />
      </main>
    </div>
  );
}
