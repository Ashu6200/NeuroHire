import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HowItWorks = ({ howItWorks }) => {
  return (
    <section id='how-it-works' className='p-20 bg-muted/30 rounded-3xl my-12'>
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold mb-4'> {howItWorks.title}</h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            {howItWorks.subtitle}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            {howItWorks.steps.map((step, index) => (
              <div key={index} className='flex gap-4'>
                <div className='flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
                  {index + 1}
                </div>
                <div>
                  <h3 className='text-lg font-semibold mb-2'>{step.title}</h3>
                  <p className='text-muted-foreground'>{step.description}</p>
                </div>
              </div>
            ))}
            <Link href={howItWorks.link} className='pt-4'>
              <Button size='lg'>{howItWorks.cta}</Button>
            </Link>
          </div>

          <div className='relative h-[500px] w-full rounded-lg overflow-hidden shadow-xl'>
            <Image
              src={howItWorks.picture.image}
              alt={howItWorks.picture.alt}
              fill
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
