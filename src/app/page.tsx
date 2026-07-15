"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) return;
    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

export default function Home() {
  const [cowCount, setCowCount] = useState(0);
  const [buffaloCount, setBuffaloCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [cowRes, buffaloRes, allRes, soldRes] = await Promise.all([
          api.get("/api/animals", { params: { type: "cow", limit: 1 } }),
          api.get("/api/animals", { params: { type: "buffalo", limit: 1 } }),
          api.get("/api/animals", { params: { limit: 1 } }),
          api.get("/api/animals", { params: { type: "cow", limit: 50 } }),
        ]);
        if (cancelled) return;
        setCowCount(cowRes.data.total);
        setBuffaloCount(buffaloRes.data.total);
        setTotalCount(allRes.data.total);
        setSoldCount(soldRes.data.animals.filter((a: { status: string }) => a.status === "sold").length);
      } catch {
        // keep counts at 0
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const animTotal = useCountUp(totalCount);
  const animSold = useCountUp(soldCount);
  const animBuyers = useCountUp(120);
  const animYears = useCountUp(8);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[65vh] flex items-center bg-emerald-deep overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80"
            alt="Healthy cow on green pasture"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Premium Cows &amp; Buffaloes
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-lg">
              Healthy, certified livestock from trusted Bangladeshi farms.
              Fair prices, transparent deals.
            </p>
            <Link
              href="/all-cows"
              className="mt-8 inline-block px-8 py-3 bg-gold hover:bg-amber-600 text-white font-semibold rounded-lg transition"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Link href="/all-cows?type=cow" className="group">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&q=80"
                  alt="Cow category"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Cows</h3>
                  <p className="text-sm mt-1 opacity-90">
                    {cowCount} {cowCount === 1 ? "animal" : "animals"} available
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/all-cows?type=buffalo" className="group">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80"
                  alt="Buffalo category"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Buffaloes</h3>
                  <p className="text-sm mt-1 opacity-90">
                    {buffaloCount} {buffaloCount === 1 ? "animal" : "animals"} available
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-emerald-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Numbers Speak
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-gold">{animTotal}+</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">Total Animals</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-gold">{animSold}+</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">Animals Sold</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-gold">{animBuyers}+</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">Happy Buyers</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-gold">{animYears}+</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
