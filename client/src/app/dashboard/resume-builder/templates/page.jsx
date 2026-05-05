'use client';
import { useState } from 'react';
import { useGetPublicTemplatesQuery, useUseTemplateMutation } from '@/store/resumeFeature/resumeService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'management', label: 'Management' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const TemplateCard = ({ template }) => {
  const router = useRouter();
  const [useTemplate, { isLoading }] = useUseTemplateMutation();

  const handleUse = async () => {
    try {
      const result = await useTemplate(template._id).unwrap();
      const newId = result?.data?.resume?._id;
      toast.success('Template cloned to your resumes');
      if (newId) {
        router.push(`/dashboard/resume-builder/${newId}`);
      } else {
        router.push('/dashboard/resume-builder');
      }
    } catch {
      // 402 errors handled globally by UpgradeModal
    }
  };

  return (
    <Card className='flex flex-col hover:shadow-md transition-shadow'>
      <CardContent className='flex-1 pt-4'>
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.title}
            className='w-full h-32 object-cover rounded-md mb-3 bg-muted'
          />
        ) : (
          <div className='w-full h-32 rounded-md mb-3 bg-muted flex items-center justify-center'>
            <FileText className='h-8 w-8 text-muted-foreground opacity-40' />
          </div>
        )}

        <h3 className='font-medium text-sm truncate'>{template.title}</h3>

        <div className='mt-2 flex flex-wrap gap-1.5'>
          {template.templateCategory && template.templateCategory !== 'other' && (
            <Badge variant='outline' className='text-[10px] capitalize'>
              {template.templateCategory}
            </Badge>
          )}
          {template.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant='secondary' className='text-[10px]'>
              {tag}
            </Badge>
          ))}
        </div>

        {template.templateUsageCount > 0 && (
          <p className='text-xs text-muted-foreground mt-2'>
            {template.templateUsageCount} {template.templateUsageCount === 1 ? 'use' : 'uses'}
          </p>
        )}
      </CardContent>

      <CardFooter className='pt-0 pb-3'>
        <Button
          size='sm'
          className='w-full'
          onClick={handleUse}
          disabled={isLoading}
        >
          <Copy className='h-3.5 w-3.5 mr-2' />
          {isLoading ? 'Cloning…' : 'Use Template'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const TemplatesPage = () => {
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPublicTemplatesQuery({ category: category || undefined, page });
  const templates = data?.data?.templates || [];
  const totalPages = data?.data?.pages || 1;

  const handleCategoryChange = (val) => {
    setCategory(val === 'all' ? '' : val);
    setPage(1);
  };

  return (
    <section className='p-4 space-y-4'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Button asChild variant='ghost' size='sm' className='h-7 px-2'>
              <Link href='/dashboard/resume-builder'>
                <ArrowLeft className='h-4 w-4 mr-1' /> Back
              </Link>
            </Button>
          </div>
          <h1 className='text-xl font-semibold'>Resume Templates</h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Community-created resume templates. Clone any template to start editing.
          </p>
        </div>

        <Select onValueChange={handleCategoryChange} value={category || 'all'}>
          <SelectTrigger className='w-44'>
            <SelectValue placeholder='Filter by category' />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value || 'all'} value={c.value || 'all'}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className='text-sm text-muted-foreground py-8 text-center'>Loading templates…</div>
      ) : templates.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <FileText className='h-10 w-10 mx-auto mb-3 opacity-40' />
          <p className='text-sm'>No public templates yet.</p>
          <p className='text-xs mt-1'>
            Create a resume and publish it to share with the community.
          </p>
          <Button asChild size='sm' className='mt-4'>
            <Link href='/dashboard/resume-builder/new'>Create Resume</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {templates.map((t) => (
              <TemplateCard key={t._id} template={t} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className='flex justify-center gap-2 pt-4'>
              <Button
                variant='outline'
                size='sm'
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className='flex items-center text-sm text-muted-foreground px-3'>
                Page {page} of {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TemplatesPage;
