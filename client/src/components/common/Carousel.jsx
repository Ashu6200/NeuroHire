'use client'
import React from 'react'
import AiInterviewCard from "@/components/AiInterviewCard";
import { Button } from "@/components/ui/button";

import { aiInterview, } from "@/constants";
import {  ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const visibleItems = screenSize.isDesktop ? 3 : screenSize.isTablet ? 2 : 1;
  const maxIndex = Math.max(0, aiInterview.length - visibleItems);
  useEffect(() => {
    const updateScreenSize = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        setScreenSize({
          isMobile: width < 640,
          isTablet: width >= 640 && width < 1024,
          isDesktop: width >= 1024,
        });
      }
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [screenSize, maxIndex]);

  function handlePrevious() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }

  useEffect(() => {
    if (sliderRef.current) {
      const scrollToIndex = () => {
        if (sliderRef.current) {
          const cardWidth =
            sliderRef.current.querySelector(".carousel-item")?.clientWidth || 0;
          const scrollLeft = cardWidth * currentIndex;

          sliderRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      };
      const timeoutId = setTimeout(scrollToIndex, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, screenSize]);

  const handleTouchStart = (e) => {
    setIsSwiping(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 5) {
      e.preventDefault();
    }
  };
  const handleTouchEnd = (e) => {
    if (!isSwiping) return;

    const currentX = e.changedTouches[0].clientX;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < maxIndex) {
        handleNext();
      } else if (diff < 0 && currentIndex > 0) {
        handlePrevious();
      }
    }

    setIsSwiping(false);
  };

  // Progress indicators
  const renderProgressIndicators = () => {
    return (
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${i === currentIndex ? "bg-primary w-6" : "bg-primary/30 w-2"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    );
  };
  return (
    <div
        ref={containerRef}
        className="mt-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-md space-y-1">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Latest Marketing Articles
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Stay updated with our most recent insights
            </p>
          </div>
          <div className="md:flex hidden items-center space-x-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              aria-label="Next slide"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden">
          <div
            ref={sliderRef}
            className="scrollbar-hide -mx-4 flex touch-pan-x snap-x snap-mandatory overflow-x-auto px-4 pt-1 pb-2 md:pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {aiInterview.map((post) => (
              <div
                key={post.id}
                className="carousel-item w-full flex-none snap-start px-2 sm:w-1/2 sm:px-4 lg:w-1/3"
              >
                <AiInterviewCard post={post} />
              </div>
            ))}
          </div>

          {/* Progress indicators for mobile */}
          <div className="sm:hidden">{renderProgressIndicators()}</div>

          {/* Mobile navigation buttons - only shown on very small screens */}
          <div className="mt-6 flex items-center justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="mr-2 h-9 flex-1 text-xs"
            >
              <ChevronLeftIcon className="mr-1 h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              className="ml-2 h-9 flex-1 text-xs"
            >
              Next
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex justify-center sm:mt-8">
          <Button variant="outline" className="w-full max-w-sm" asChild>
            <Link href="#">Browse All Articles</Link>
          </Button>
        </div>
      </div>
  )
}

export default Carousel