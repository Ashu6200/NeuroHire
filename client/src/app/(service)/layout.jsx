import Footer from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/navbar';
import React from 'react';

const ServiceLayout = ({ children }) => {
  return (
    <>
      <main className='min-h-screen relative isolate'>
        <div className={'carteingrid'}></div>
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default ServiceLayout;
