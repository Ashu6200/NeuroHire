import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";

const Banner = ({ hero, features }) => {
  return (
    <>
      <div className="grid items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="my-4 text-4xl font-bold text-pretty lg:text-3xl">
            {hero.title}
          </h1>
          <p className="mb-6 max-w-4xl text-muted-foreground lg:text-base">
            <strong>{hero.subtitle}</strong>
            <br />
            {hero.description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            <Button asChild className="w-full sm:w-auto">
              <Link href={hero.link}>{hero.cta}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex flex-col md:flex-row gap-4">
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
    </>
  );
};

export default Banner;
