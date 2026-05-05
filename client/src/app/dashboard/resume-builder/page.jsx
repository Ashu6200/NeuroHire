'use client';
import CommonHeader from '@/components/dashboard/CommonHeader';
import { useGetMyResumesQuery, useDeleteResumeMutation, usePublishResumeMutation, useUnpublishResumeMutation, useLazyExportResumePdfQuery } from '@/store/resumeFeature/resumeService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Globe, Lock, MoreVertical, Trash2, Edit, Download, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import FeatureLock from '@/components/FeatureLock';

const ResumeCard = ({ resume }) => {
  const [deleteResume] = useDeleteResumeMutation();
  const [publishResume] = usePublishResumeMutation();
  const [unpublishResume] = useUnpublishResumeMutation();
  const [triggerExport] = useLazyExportResumePdfQuery();

  const isPublic = resume.visibility === 'public';

  const handleDelete = async () => {
    if (!confirm('Delete this resume?')) return;
    await deleteResume(resume._id);
    toast.success('Resume deleted');
  };

  const handleToggleVisibility = async () => {
    if (isPublic) {
      await unpublishResume(resume._id);
      toast.success('Resume set to private');
    } else {
      await publishResume(resume._id);
      toast.success('Resume published to templates gallery');
    }
  };

  const handleExport = async () => {
    try {
      const result = await triggerExport(resume._id);
      if (result.data) {
        const url = URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.title}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <Card className='group flex flex-col'>
      <CardContent className='flex-1 pt-4'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <FileText className='h-5 w-5 shrink-0 text-muted-foreground' />
            <span className='font-medium text-sm truncate'>{resume.title}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-7 w-7 shrink-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/resume-builder/${resume._id}`}>
                  <Edit className='mr-2 h-4 w-4' /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleVisibility}>
                {isPublic ? (
                  <><Lock className='mr-2 h-4 w-4' /> Make Private</>
                ) : (
                  <><Globe className='mr-2 h-4 w-4' /> Publish as Template</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className='mr-2 h-4 w-4' /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='mt-3 flex items-center gap-2'>
          <Badge variant={isPublic ? 'default' : 'secondary'} className='text-[10px]'>
            {isPublic ? <><Globe className='h-3 w-3 mr-1' />Public</> : <><Lock className='h-3 w-3 mr-1' />Private</>}
          </Badge>
          {resume.templateCategory && resume.templateCategory !== 'other' && (
            <Badge variant='outline' className='text-[10px] capitalize'>{resume.templateCategory}</Badge>
          )}
          {isPublic && resume.templateUsageCount > 0 && (
            <span className='text-xs text-muted-foreground'>{resume.templateUsageCount} uses</span>
          )}
        </div>
      </CardContent>

      <CardFooter className='pt-0 pb-3 gap-2'>
        <Button asChild size='sm' variant='outline' className='flex-1'>
          <Link href={`/dashboard/resume-builder/${resume._id}`}>
            <Edit className='h-3 w-3 mr-1' /> Edit
          </Link>
        </Button>
        <FeatureLock requiredPlan='pro' featureName='PDF export'>
          <Button size='sm' variant='ghost' onClick={handleExport}>
            <Download className='h-3 w-3 mr-1' /> PDF
          </Button>
        </FeatureLock>
      </CardFooter>
    </Card>
  );
};

const ResumeBuilderPage = () => {
  const { data, isLoading } = useGetMyResumesQuery();
  const resumes = data?.data?.resumes || [];

  return (
    <section className='p-4 space-y-4'>
      <CommonHeader
        title='Resume Builder'
        subtitle='Build, save, and share your resumes. Public resumes appear in the community template gallery.'
        link='/dashboard/resume-builder/new'
        buttonText='New Resume'
      />

      <div className='flex justify-end'>
        <Button asChild variant='outline' size='sm'>
          <Link href='/dashboard/resume-builder/templates'>
            <LayoutTemplate className='h-4 w-4 mr-2' /> Browse Templates
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className='text-sm text-muted-foreground'>Loading your resumes…</div>
      ) : resumes.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <FileText className='h-10 w-10 mx-auto mb-3 opacity-40' />
          <p className='text-sm'>No resumes yet.</p>
          <p className='text-xs mt-1'>Create your first resume or browse community templates.</p>
          <div className='flex justify-center gap-3 mt-4'>
            <Button asChild size='sm'>
              <Link href='/dashboard/resume-builder/new'>New Resume</Link>
            </Button>
            <Button asChild size='sm' variant='outline'>
              <Link href='/dashboard/resume-builder/templates'>Browse Templates</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {resumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ResumeBuilderPage;
