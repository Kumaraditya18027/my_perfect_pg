"use client";
import Link from "next/link";
import React from "react";

const CirclePattern = () => (
  <svg
    className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="pattern-circles"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
        patternTransform="translate(-10 -10)"
      >
        <circle r="3" fill="none" />
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      strokeWidth="0"
      fill="url(#pattern-circles)"
    />
  </svg>
);

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Aaquib Ahmad",
      role: "Founder & CEO",
      image: "/images/team/aaqib.jpg",
      description: "",
    },
    {
      name: "Abhay Raj",
      role: "Co-Founder and CMO",
      image: "/Abhay.jpg",
      description: "",
    },
    {
      name: "Manash Goyal",
      role: "Co-Founder and CFO",
      image: "/images/team/Manash-Goyal.jpg",
      description: "",
    },
    {
      name: "Harshankit Raj",
      role: "Co-Founder and CTO",
      image: "/images/team/harshankit.jpg",
      description: "",
    },
  ];

  const stats = [
    { label: "PGs Listed", value: "20+" },
    { label: "Happy Residents", value: "100+" },
    { label: "Cities", value: "10+" },
    { label: "Months Experience", value: "5+" },
  ];

  return (
    <>
      <CirclePattern />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16 relative">
          <h1 className="p-5 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            About My Perfect PG
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re revolutionizing the way people find their perfect paying
            guest accommodations, making it easier than ever to discover your
            next home away from home.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 mb-20 shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At My Perfect PG, we believe everyone deserves to find their
                perfect living space without the hassle. We&apos;re committed to
                bringing transparency, efficiency, and reliability to the PG
                accommodation sector.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform connects property owners with potential residents,
                ensuring a smooth and trustworthy experience for both parties.
                We verify all listings and maintain high standards of quality
                and service.
              </p>
            </div>
            <div className="relative group">
              <img
                src="/images/team/mission.jpg"
                alt="Our Mission"
                className="rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <div className="text-blue-600 mb-3">{member.role}</div>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-8 text-lg">
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/#app"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/#app"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 My Perfect PG. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;
