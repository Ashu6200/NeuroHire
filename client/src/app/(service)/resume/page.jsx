import Banner from "@/components/common/Banner";
import HowItWorks from "@/components/common/How-its-work";
import { resumeBuilderContent } from "@/constants";
import React from "react";

const ResumePage = () => {
  const { hero, features, howItWorks } = resumeBuilderContent;
  return (
    <section className="px-8 py-6 md:px-12 lg:px-16">
      <Banner hero={hero} features={features} />
      <HowItWorks howItWorks={howItWorks} />
    </section>
  );
};

export default ResumePage;
