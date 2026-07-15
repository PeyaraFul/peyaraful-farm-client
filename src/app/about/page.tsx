"use client";

import Link from "next/link";

const team = [
  {
    name: "Abdur Rahim",
    role: "Founder & Head Farmer",
    bio: "Third-generation livestock farmer with 20+ years of experience in cattle breeding and management across Bangladesh.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Sabina Akter",
    role: "Veterinary Consultant",
    bio: "Licensed veterinarian ensuring every animal meets the highest health and welfare standards before listing.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Kamal Hossain",
    role: "Operations Manager",
    bio: "Manages logistics, deliveries, and customer relations to ensure a smooth buying experience for every customer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

const values = [
  {
    title: "Quality First",
    desc: "Every animal is handpicked, inspected, and certified for health and breed quality before it appears on our platform.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Transparency",
    desc: "No hidden fees, no surprises. Every listing shows real photos, honest descriptions, and clear pricing.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Fair Pricing",
    desc: "Direct from farm to buyer. We cut out middlemen so you get the best value for your money.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Customer Care",
    desc: "From your first inquiry to post-purchase support, our team is here to help every step of the way.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center bg-emerald-deep overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80"
            alt="Green pasture with cattle"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">About Peyaraful Farm</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Trusted Bangladeshi livestock since 2016. Healthy animals, honest deals.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-emerald-deep mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Peyaraful Farm started in 2016 in the lush green heartlands of Dhaka, Bangladesh. What began as a
                small family cattle farm quickly grew into one of the most trusted names in livestock trading across
                the country.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our founder, Abdur Rahim, grew up watching his grandfather raise healthy Sahiwal cows on the same
                land. That generational knowledge — combined with modern veterinary practices and transparent business
                ethics — became the foundation of Peyaraful Farm.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we connect farmers directly with buyers, eliminating exploitative middlemen. Every animal on
                our platform is vaccinated, health-certified, and honestly described. We believe buying livestock
                should be as straightforward as buying anything else online.
              </p>
            </div>
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&q=80"
                alt="Healthy cow in pasture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-emerald-deep mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            To make healthy, certified livestock accessible to every household and farm in Bangladesh. We are
            committed to fair pricing, full transparency, and the welfare of every animal we trade. By bridging
            the gap between trusted farmers and informed buyers, we aim to uplift the livestock industry across
            the nation.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-sand rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-deep/10 text-emerald-deep mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-emerald-deep">{v.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-emerald-deep text-center mb-10">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-emerald-deep">{member.name}</h3>
                  <p className="text-sm font-medium text-gold mt-1">{member.role}</p>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-deep">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Animal?</h2>
          <p className="text-gray-300 mb-8">
            Browse our certified collection and experience the Peyaraful difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/all-cows"
              className="px-8 py-3 bg-gold hover:bg-amber-600 text-white font-semibold rounded-lg transition"
            >
              Browse Animals
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-emerald-deep font-semibold rounded-lg transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
