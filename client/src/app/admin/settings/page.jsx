const AdminSettingsPage = () => {
  return (
    <section className='flex flex-col gap-3 p-4'>
      <h1 className='text-3xl font-bold'>Settings</h1>
      <p className='text-sm text-muted-foreground'>
        Plan limits are configured in the server plan catalog for this first
        SaaS version.
      </p>
    </section>
  );
};

export default AdminSettingsPage;
