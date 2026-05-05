'use client';
import { useDispatch, useSelector } from 'react-redux';
import { closeUpgradeModal } from '@/store/uiFeature/uiSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    code: 'pro',
    name: 'Pro',
    price: '₹499/mo',
    highlights: [
      '50 mock interviews/month',
      '10 resume exports/month',
      'Enhanced AI feedback',
      'PDF export',
      'JD matching',
    ],
  },
  {
    code: 'max',
    name: 'Max',
    price: '₹999/mo',
    highlights: [
      '500 mock interviews/month',
      '100 resume exports/month',
      'Skill gap analysis',
      'Priority AI model',
      'Detailed analytics',
    ],
  },
];

const UpgradeModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { open, message } = useSelector((state) => state.uiStore.upgradeModal);

  const handleUpgrade = () => {
    dispatch(closeUpgradeModal());
    router.push('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeUpgradeModal())}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5 text-yellow-500' />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-3 mt-2'>
          {plans.map((plan) => (
            <div
              key={plan.code}
              className='border rounded-lg p-4 flex flex-col gap-2'
            >
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-sm'>{plan.name}</span>
                <Badge variant='secondary'>{plan.price}</Badge>
              </div>
              <ul className='text-xs text-muted-foreground space-y-1'>
                {plan.highlights.map((item) => (
                  <li key={item} className='flex items-center gap-1'>
                    <Check className='h-3 w-3 text-green-500 shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='flex gap-2 mt-2'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => dispatch(closeUpgradeModal())}
          >
            Maybe later
          </Button>
          <Button className='flex-1' onClick={handleUpgrade}>
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
