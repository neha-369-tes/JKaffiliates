"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function StoreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "5000");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0");

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    
    // params.set("minPrice", minPrice);
    params.set("maxPrice", maxPrice);
    
    router.push("/?" + params.toString());
  };

  return (
    <form onSubmit={applyFilters} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-end">
      <div className="w-full md:w-1/2 relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search Store</label>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search dresses, bags, jewelry..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>
      
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
          <span>Max Price</span>
          <span className="text-indigo-600">₹{maxPrice}</span>
        </label>
        <div className="flex items-center h-12">
           <input 
             type="range" 
             min="0" 
             max="10000" 
             step="100"
             value={maxPrice}
             onChange={(e) => setMaxPrice(e.target.value)}
             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
           />
        </div>
      </div>

      <div className="w-full md:w-auto h-12">
        <button 
          type="submit" 
          className="w-full md:w-auto h-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md active:scale-95"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter
        </button>
      </div>
    </form>
  );
}