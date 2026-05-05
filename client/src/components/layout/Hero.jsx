import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Hero = ({hero, features}) => {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="mx-auto px-4 py-12 sm:px-6 md:px-12 lg:py-24 2xl:max-w-[1400px]">
          {/* Title */}
          <div className="mx-auto mt-5 max-w-2xl text-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
             {hero.title}
            </h1>
          </div>
          {/* End Title */}
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <p className="text-muted-foreground text-lg sm:text-xl">
             {hero.description}
            </p>
          </div>
          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size={"lg"} className="w-full sm:w-auto">{hero.firstCTA}</Button>
            <Button size={"lg"} variant={"outline"} className="w-full sm:w-auto">
             {hero.secondCTA}
            </Button>
          </div>
          {/* End Buttons */}
          <div className="mx-auto mt-10 flex max-w-screen-lg flex-col md:flex-row gap-4">
            {features.map((feature, index) => (
              <React.Fragment key={feature.title}>
                {index > 0 && (
                  <Separator
                    orientation="vertical"
                    className="mx-6 hidden h-auto w-[2px] bg-gradient-to-b from-muted via-transparent to-muted md:block"
                  />
                )}
                <div
                  key={index}
                  className="flex grow basis-0 flex-col rounded-md p-4 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                >
                  <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
};

export default Hero;
