import Link from "next/link";

export default function Home() {
  return (
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
  );
}
