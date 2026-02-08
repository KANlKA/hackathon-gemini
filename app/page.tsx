"use client";

import { CTA } from "@/components/ui/cta";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { HeroSection } from "@/components/ui/hero-section";
import { TestimonialSection } from "@/components/ui/testimonial";
import { ContactUs } from "@/components/ui/contact-us";
import { AnimatedFeatures } from "@/components/ui/animated-features";

export default function HomePage() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div className="h-[400vh] bg-black w-full relative overflow-clip" ref={ref}>
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />

      <main className="absolute top-0 left-0 right-0 pt-28 pb-20 z-10 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="pointer-events-auto">
            <HeroSection />
          </div>

          {/* Animated Feature Cards Section */}
          <div className="mt-80 max-w-6xl mx-auto pointer-events-auto">
            <AnimatedFeatures />
          </div>

          <div className="mt-64 text-center max-w-6xl mx-auto pointer-events-auto">
            <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Step number={1} title="Connect" description="Link your YouTube channel in one click" />
              <Step number={2} title="Analyze" description="We study all your videos and comments" />
              <Step number={3} title="Discover" description="See what's working and what's not" />
              <Step number={4} title="Create" description="Get weekly ideas with proven potential" />
            </div>
          </div>

          <div className="mt-48 max-w-6xl mx-auto pointer-events-auto">
            <TestimonialSection
              testimonials={[
                {
                  name: "Sarah Johnson",
                  role: "Tech YouTuber • 250K Subscribers",
                  content: "CreatorMind helped me identify what my audience really wanted. My engagement increased by 40% in just two months!",
                  rating: 5,
                },
                {
                  name: "Mike Chen",
                  role: "Gaming Creator • 180K Subscribers",
                  content: "The weekly video ideas are spot-on. It's like having a data analyst on my team who actually understands my niche.",
                  rating: 5,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Lifestyle Vlogger • 120K Subscribers",
                  content: "I used to spend hours brainstorming. Now I just check CreatorMind and create content I know will perform well.",
                  rating: 5,
                },
              ]}
            />
          </div>

          <div className="mt-32 max-w-6xl mx-auto pointer-events-auto">
            <CTA
              variant="solid"
              title="Ready to stop guessing?"
              description="Join creators who know exactly what their audience wants."
              primaryAction={{
                label: "Get Started Free",
                href: "/auth/signin"
              }}
            />
          </div>

          <div className="mt-48 max-w-6xl mx-auto pointer-events-auto">
            <ContactUs />
          </div>

          <footer className="py-8 mt-20 border-t border-white/10 max-w-6xl mx-auto pointer-events-auto">
            <div className="text-center text-gray-400">
              <p>&copy; 2025 CreatorMind. Built for creators, by creators.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}