'use client';
import { useDispatch } from 'react-redux';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { triggerUpgradeModal } from '@/store/uiFeature/uiSlice';
import { useSession } from '@/lib/auth-client';

const PLAN_RANK = { free: 0, pro: 1, max: 2 };
const ADMIN_ROLES = ['admin', 'super_admin', 'support', 'billing_admin'];

/**
 * Wraps children with a lock overlay when the user's plan is below the required plan.
 * @param {string} requiredPlan - 'pro' | 'max'
 * @param {string} featureName - Human-readable feature name for the upgrade message
 * @param {React.ReactNode} children
 */
const FeatureLock = ({ requiredPlan = 'pro', featureName = 'this feature', children }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const currentPlan = user?.plan || 'free';
  const isAdmin = String(user?.role || 'user')
    .split(',')
    .some((r) => ADMIN_ROLES.includes(r.trim()));
  const isLocked = !isAdmin && PLAN_RANK[currentPlan] < PLAN_RANK[requiredPlan];

  if (!isLocked) return children;

  const planLabel = requiredPlan === 'max' ? 'Max' : 'Pro';

  return (
    <div className='relative'>
      <div className='pointer-events-none select-none opacity-40 blur-[2px]'>
        {children}
      </div>
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 rounded-lg backdrop-blur-sm z-10'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Lock className='h-5 w-5' />
          <span className='text-sm font-medium'>{planLabel} feature</span>
        </div>
        <p className='text-xs text-muted-foreground text-center px-4'>
          Upgrade to {planLabel} to unlock {featureName}.
        </p>
        <Button
          size='sm'
          onClick={() =>
            dispatch(
              triggerUpgradeModal({
                message: `Upgrade to ${planLabel} to unlock ${featureName}.`,
                feature: featureName,
              })
            )
          }
        >
          Upgrade to {planLabel}
        </Button>
      </div>
    </div>
  );
};

export default FeatureLock;
