"use client";

import React from 'react';
import CardSwap, { Card } from './card-swap';
import { Circle, Lightbulb, Activity } from 'lucide-react';

export function AnimatedFeatures() {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <CardSwap
        cardDistance={60}
        verticalDistance={70}
        delay={5000}
        pauseOnHover={true}
        width={450}
        height={350}
      >

        {/* Card 1 */}
        <Card>
          <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">

            {/* Header (centered vertically) */}
            <div className="flex items-center gap-3 px-6 h-10">
              <Circle className="h-6 w-6 text-white fill-white" />
              <h3 className="text-lg font-normal text-white/90">
Deep Analysis</h3>
            </div>

            {/* Divider */}
            <div className="h-0.5 w-full bg-white" />

            {/* Image Background Section */}
            <div className="relative flex-1">

              <img
                src="/rays.jpg"
                alt="feature visual"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="relative p-6 text-white/70">
                We analyze ALL your videos, comments, and patterns to understand what truly works for YOUR channel.
              </div>

            </div>

          </div>
        </Card>

        {/* Card 2 */}
        <Card>
          <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">

            <div className="flex items-center gap-3 px-6 h-10">
              <Lightbulb className="h-5 w-5 text-white" />
              <h3 className="text-lg font-normal text-white/90">
Top 5 Ideas Weekly</h3>
            </div>

            <div className="h-0.5 w-full bg-white" />

            <div className="relative flex-1">

              <img
                src="/rays.jpg"
                alt="feature visual"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="relative p-6 text-white/70">
                Every week, get 5 video ideas backed by evidence from your own audience and performance data.
              </div>

            </div>

          </div>
        </Card>

        {/* Card 3 */}
        <Card>
          <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">

            <div className="flex items-center gap-3 px-6 h-10">
              <Activity className="h-5 w-5 text-white" />
              <h3 className="text-lg font-normal text-white/90">Predict Performance</h3>
            </div>

            <div className="h-0.5 w-full bg-white" />

            <div className="relative flex-1">

              <img
                src="/rays.jpg"
                alt="feature visual"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="relative p-6 text-white/70">
                See predicted engagement for each idea with confidence scores based on your historical data.
              </div>

            </div>

          </div>
        </Card>

      </CardSwap>
    </div>
  );
}
