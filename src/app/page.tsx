"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import AnimalCard from "@/components/AnimalCard";

interface Animal {
  _id: string;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  price: number;
  imageUrl: string;
  status: "available" | "sold";
}

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

const faqData = [
  {
    q: "How do I purchase a cow or buffalo?",
    a: "Browse our listings, pick an animal, and click \"Buy Now\". You'll need to be logged in. Payment is processed securely through Stripe.",
  },
  {
    q: "Do you deliver across Bangladesh?",
    a: "Yes, we deliver to all divisions in Bangladesh. Delivery fees depend on distance and are calculated at checkout.",
  },
  {
    q: "Can I visit the farm before buying?",
    a: "Absolutely. Contact us to schedule a farm visit. We encourage buyers to inspect animals in person before making a decision.",
  },
  {
    q: "What if the animal gets sick after purchase?",
    a: "All our animals come with a health certificate. We offer a 7-day health guarantee. Reach out to our support team for assistance.",
  },
  {
    q: "Are the animals vaccinated?",
    a: "Yes, every animal is vaccinated and dewormed before listing. Vaccination records are available on request.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<Animal[]>([]);
  const [cowCount, setCowCount] = useState(0);
  const [buffaloCount, setBuffaloCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [featuredRes, cowRes, buffaloRes, allRes] = await Promise.all([
          api.get("/api/animals", { params: { sort: "newest", limit: 4 } }),
          api.get("/api/animals", { params: { type: "cow", limit: 1 } }),
          api.get("/api/animals", { params: { type: "buffalo", limit: 1 } }),
          api.get("/api/animals", { params: { limit: 50 } }),
        ]);
        if (cancelled) return;
        setFeatured(featuredRes.data.animals);
        setCowCount(cowRes.data.total);
        setBuffaloCount(buffaloRes.data.total);
        setTotalCount(allRes.data.total);
        setSoldCount(allRes.data.animals.filter((a: Animal) => a.status === "sold").length);
      } catch {
        // keep defaults
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

      {/* Featured Animals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">
            Featured Animals
          </h2>
          {featured.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((animal) => (
                <AnimalCard key={animal._id} animal={animal} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              href="/all-cows"
              className="inline-block px-6 py-3 border-2 border-emerald-deep text-emerald-deep font-semibold rounded-lg hover:bg-emerald-deep hover:text-white transition"
            >
              View All Animals
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Certified Quality",
                desc: "Every animal is inspected and certified for health and breed quality before listing.",
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                title: "Healthy Animals",
                desc: "Vaccinated, dewormed, and comes with full health records and veterinary clearance.",
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
              {
                title: "Fair Prices",
                desc: "Transparent pricing with no hidden fees. Direct from farm to buyer, middlemen cut out.",
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Home Delivery",
                desc: "We deliver safely to your doorstep across all divisions in Bangladesh.",
                icon: (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-deep/10 text-emerald-deep mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-emerald-deep">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
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
          <div className="grid grid-cols-2 lg:grid-4 gap-8 text-center">
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

      {/* Testimonials */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">
            What Our Buyers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahim Uddin",
                location: "Dhaka",
                text: "Bought a Holstein Friesian cow last month. Healthy, well-fed, and producing 25+ liters daily. Great experience overall.",
                rating: 5,
              },
              {
                name: "Fatima Begum",
                location: "Comilla",
                text: "The Murrah buffalo I purchased was exactly as described. Delivery was smooth and the team was very helpful.",
                rating: 5,
              },
              {
                name: "Kamal Hossain",
                location: "Sylhet",
                text: "Fair prices and honest people. I visited the farm first, inspected the cow, and bought it on the spot. Highly recommend.",
                rating: 4,
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < t.rating ? "text-gold" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-bold text-emerald-deep text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqData.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="font-medium text-emerald-deep pr-4">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-emerald-deep">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-8">
            Get notified about new arrivals, farm updates, and exclusive offers.
          </p>
          {subscribed ? (
            <p className="text-gold font-semibold text-lg">
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  setSubscribed(true);
                  setEmail("");
                }
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold hover:bg-amber-600 text-white font-semibold rounded-lg transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
