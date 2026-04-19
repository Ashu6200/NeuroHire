import Banner from "@/components/common/Banner";
import Carousel from "@/components/common/Carousel";
import HowItWorks from "@/components/common/How-its-work";
import { interviewGeneratorContent } from "@/constants";

const AiInterview = () => {
  const { hero, features, howItWorks } = interviewGeneratorContent;
  return (
    <section className="px-8 py-6 md:px-12 lg:px-16">
      <Banner hero={hero} features={features}/>
      <HowItWorks howItWorks={howItWorks} />
      <Carousel />
    </section>
  );
};

export default AiInterview;
