"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CustomerTestimonialsMasonry({ testimonials }) {
  const containerRef = useRef(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getColumnTestimonials = () => {
    const columnTestimonials = Array.from({ length: columns }, () => []);

    testimonials.testimony?.forEach((testimonial, index) => {
      const columnIndex = index % columns;
      columnTestimonials[columnIndex].push(testimonial);
    });

    return columnTestimonials;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disable="true"
        >
          {testimonials.sectionName}
        </Button>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
        {testimonials.title}
      </h1>

      <p className="text-center text-lg mb-12">{testimonials.subTitle}</p>

      <div ref={containerRef} className="flex gap-2">
        {getColumnTestimonials().map((columnItems, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-2">
            {columnItems.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex grow basis-0 flex-col rounded-3xl p-4 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
              >
                <div className="flex items-center mb-4">
                  <Avatar className="mr-3">
                    <AvatarImage
                      src="/layout/user-avatar.png?height=32&width=32"
                      alt="Profile"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <svg
                          className="ml-1 h-4 w-4 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <p className="dark:text-white  text-sm">
                      {testimonial.username}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: testimonial.testimonial,
                    }}
                  />
                </div>

                {testimonial.date && (
                  <div className="flex items-center dark:text-white text-sm">
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {new Date(testimonial.date)
                      .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\//g, "-")}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
