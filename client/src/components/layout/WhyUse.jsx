import React from "react";
import { Button } from "../ui/button";

const WhyUse = ({ whyUse }) => {
  return (
    <section className="">
      <div className="mx-auto px-4 py-16 lg:px-16 md:px-12 lg:py-24 2xl:max-w-[1400px]">
        <div className="flex justify-center mb-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {whyUse.sectionName}
          </Button>
        </div>
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            {whyUse.title}
          </h2>
          <p className="text-center text-lg mb-12">{whyUse.subTitle}</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {whyUse.reasons?.map((reason) => (
            <React.Fragment key={reason.title}>
              <div className="flex grow basis-0 flex-col rounded-md p-4 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                  {reason.icon}
                </div>
                <h3 className="mb-2 font-semibold">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUse;
