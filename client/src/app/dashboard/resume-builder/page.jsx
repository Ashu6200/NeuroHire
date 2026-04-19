import CommonHeader from '@/components/dashboard/CommonHeader';
import React from 'react';

const ResumeBuilderPage = () => {
  return (
    <section className='p-4'>
      <CommonHeader
        title={'Resume Builder'}
        subtitle={
          'Manage your created Mock Interview template for interview practice.'
        }
        link={'/dashboard/resume-builder/new'}
        buttonText={'New Resume'}
      />
    </section>
  );
};

export default ResumeBuilderPage;
