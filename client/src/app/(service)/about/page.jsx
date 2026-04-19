"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  ArrowUpRightIcon,
  Globe,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const companyValues = [
  {
    id: "integrity",
    name: "Integrity",
    description:
      "We believe in doing what's right—always. Our commitment to honesty, accountability, and ethical behavior is the cornerstone of the trust we build with customers, partners, and each other.",
    icon: ShieldCheck,
    color: "text-blue-500",
    principles: [
      "Be transparent and honest in all communications",
      "Take ownership of your actions and decisions",
      "Hold yourself and others to high ethical standards",
      "Honor commitments and admit mistakes without fear",
    ],
    testimonial: {
      quote:
        "Integrity here isn't a buzzword—it's baked into every decision we make. I've seen us walk away from profitable deals because they didn't align with our values, and that made me proud to be part of this team.",
      author: "Monica Reyes",
      role: "Compliance & Ethics Officer",
      image:
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=400",
    },
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800",
  },
  {
    id: "collaboration",
    name: "Collaboration",
    description:
      "We succeed together. By fostering open communication and respect across diverse perspectives, we build stronger teams and better outcomes than any individual could achieve alone.",
    icon: Users,
    color: "text-indigo-500",
    principles: [
      "Actively listen and value every voice",
      "Share knowledge and support others generously",
      "Give credit where it's due",
      "Make decisions that prioritize team goals over personal gain",
    ],
    testimonial: {
      quote:
        "Even as a remote team member, I never feel isolated. The collaboration tools are there, but more importantly, the mindset of mutual support and shared success is real across the company.",
      author: "Derrick Tan",
      role: "Remote Frontend Developer",
       image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400",
    },
 image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400",
  },
  {
    id: "customer-focus",
    name: "Customer Focus",
    description:
      "Our customers are at the heart of every decision we make. We listen deeply, deliver thoughtfully, and build solutions that exceed expectations and foster lasting relationships.",
    icon: Heart,
    color: "text-red-500",
    principles: [
      "Understand and anticipate customer needs",
      "Design with empathy and feedback in mind",
      "Prioritize outcomes that provide long-term value",
      "Respond quickly and genuinely to concerns",
    ],
    testimonial: {
      quote:
        "We don't just ask for customer feedback—we act on it. I've seen entire features fast-tracked and reworked based on real conversations with users, which is incredibly validating.",
      author: "Leah Brooks",
      role: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1603415526960-f9e3a2646a1a?q=80&w=400",
    },
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800",
  },
  {
    id: "excellence",
    name: "Excellence",
    description:
      "We pursue excellence not as a destination, but as a habit. Every product, service, and interaction reflects our commitment to high standards, continuous learning, and outstanding quality.",
    icon: AreaChart,
    color: "text-emerald-500",
    principles: [
      "Strive for quality in every detail",
      "Seek feedback and act on it rigorously",
      "Balance ambition with pragmatism",
      "Continuously improve processes and skills",
    ],
    testimonial: {
      quote:
        "From code reviews to customer support, there's a shared pride in doing things right. That pursuit of excellence isn’t competitive—it’s collaborative, and it raises everyone’s game.",
      author: "Raj Mehta",
      role: "Engineering Manager",
        image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
        image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
  },
  {
    id: "sustainability",
    name: "Sustainability",
    description:
      "We take responsibility for our impact. From the environment to our communities, we strive to make decisions that ensure long-term health, equity, and resilience for generations to come.",
    icon: Globe,
    color: "text-green-500",
    principles: [
      "Design for durability and energy efficiency",
      "Reduce waste and carbon footprint across operations",
      "Partner with vendors who align with our sustainability goals",
      "Support local and global initiatives that make a difference",
    ],
    testimonial: {
      quote:
        "It’s one thing to talk about sustainability—it’s another to measure and act on it. Our team has implemented real changes, from supply chain audits to zero-waste packaging, and it’s empowering to be part of that mission.",
      author: "Talia Nguyen",
      role: "Sustainability Lead",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    },
    image:
      "https://images.unsplash.com/photo-1593642634443-44adaa06623a?q=80&w=800",
  },
];


export default function AboutSectionCompanyValues() {
  const [activeValue, setActiveValue] = useState(companyValues[0].id);

  // Get active value object
  const currentValue =
    companyValues.find((value) => value.id === activeValue) || companyValues[0];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">
            Core Values
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Shaping the Future of Interview Preparation
          </h2>
          <p className="text-muted-foreground">
            At InterviewMaster AI, we're building more than a tool—we're creating a smart interview coach that empowers every candidate to shine.
            Our AI-driven platform blends personalized feedback, real-time voice interactions, and job-role matching to make interview prep
            accessible, effective, and confidence-boosting for everyone.
          </p>
        </div>

        <Tabs
          value={activeValue}
          onValueChange={setActiveValue}
          className="space-y-8"
        >
          {/* Value selection - Tabs for md+ screens, Dropdown for smaller screens */}
          <div className="mb-8 flex justify-center">
            {/* Dropdown for small screens */}
            <div className="w-full md:hidden">
              <Select value={activeValue} onValueChange={setActiveValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  {companyValues.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                      <div className="flex items-center gap-2">
                        <value.icon className={cn("h-4 w-4", value.color)} />
                        <span>{value.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabs for medium screens and above */}
            <TabsList className="hidden h-auto bg-transparent p-1 md:flex">
              {companyValues.map((value) => (
                <TabsTrigger
                  key={value.id}
                  value={value.id}
                  className={cn(
                    "data-[state=active]:bg-muted gap-2",
                    "data-[state=active]:border-border border border-transparent",
                  )}
                >
                  <value.icon className={cn("h-4 w-4", value.color)} />
                  <span>{value.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Value content */}
          <div className="grid items-center gap-8 md:grid-cols-12">
            {/* Left column: Value details */}
            <div className="space-y-6 md:col-span-6">
              <div className="mb-4 flex items-center gap-4">
                <div className={cn("rounded-xl p-2.5", "bg-muted")}>
                  <currentValue.icon
                    className={cn("h-7 w-7", currentValue.color)}
                  />
                </div>
                <h3 className="text-2xl font-bold">{currentValue.name}</h3>
              </div>

              <p className="text-muted-foreground text-lg">
                {currentValue.description}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="font-medium">Key Principles:</h4>
                <ul className="space-y-2">
                  {currentValue.principles.map((principle, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowUpRightIcon
                        className={cn("mt-0.5 h-5 w-5", currentValue.color)}
                      />
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentValue.testimonial && (
                <Card className="bg-muted/30 mt-6 p-0">
                  <CardContent className="p-6">
                    <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={currentValue.testimonial.image}
                          alt={currentValue.testimonial.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {currentValue.testimonial.author}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {currentValue.testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">
                      &quot;{currentValue.testimonial.quote}&quot;
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column: Value image */}
            <div className="md:col-span-6">
              {currentValue.image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={currentValue.image}
                    alt={`Illustration of our ${currentValue.name} value`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <div
                      className={cn(
                        "inline-block rounded-lg px-3 py-1 text-sm text-white",
                        "bg-black/30 backdrop-blur-sm",
                      )}
                    >
                      {currentValue.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted flex aspect-[4/3] items-center justify-center rounded-xl">
                  <currentValue.icon
                    className={cn(
                      "h-24 w-24",
                      currentValue.color,
                      "opacity-25",
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </Tabs>

        {/* Call-to-action */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
            These values guide every aspect of our work. Want to be part of a
            team that lives these values every day?
          </p>
          <Button asChild size="lg">
            <Link href="/careers">Join Our Team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
