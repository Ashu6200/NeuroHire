'use client';

import React from 'react';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SubscriptionPlanCard = ({ 
  plan, 
  isCurrentPlan, 
  onSelect, 
  isLoading,
  className 
}) => {
  const isPro = plan.code === 'pro';
  const isMax = plan.code === 'max';
  const isFree = plan.code === 'free';

  const getIcon = () => {
    if (isMax) return <Sparkles className="h-6 w-6 text-amber-500" />;
    if (isPro) return <Zap className="h-6 w-6 text-indigo-500" />;
    return <Shield className="h-6 w-6 text-slate-500" />;
  };

  const getThemeColor = () => {
    if (isMax) return 'from-amber-500/10 to-orange-500/10 border-amber-500/20';
    if (isPro) return 'from-indigo-500/10 to-blue-500/10 border-indigo-500/20';
    return 'from-slate-500/5 to-slate-500/10 border-slate-200';
  };

  const getButtonVariant = () => {
    if (isCurrentPlan) return 'secondary';
    if (isMax) return 'default';
    if (isPro) return 'default';
    return 'outline';
  };

  return (
    <Card className={cn(
      "relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      "bg-gradient-to-br border-2",
      getThemeColor(),
      isPro && "scale-105 z-10 shadow-indigo-500/10",
      className
    )}>
      {isPro && (
        <div className="absolute top-0 right-0">
          <div className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          {getIcon()}
          <CardTitle className="text-xl font-bold tracking-tight">
            {plan.name}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground min-h-[40px]">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col gap-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight">
            {plan.amount === 0 ? 'Free' : plan.displayAmount}
          </span>
          {plan.amount > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              /month
            </span>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            What's included:
          </p>
          <ul className="grid gap-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-sm group">
                <div className={cn(
                  "mt-0.5 rounded-full p-0.5 flex-shrink-0",
                  isMax ? "bg-amber-100 text-amber-600" : 
                  isPro ? "bg-indigo-100 text-indigo-600" : 
                  "bg-slate-100 text-slate-600"
                )}>
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-slate-600 dark:text-slate-300 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className={cn(
            "w-full font-semibold transition-all duration-300",
            isMax && "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
            isPro && "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          )}
          variant={getButtonVariant()}
          disabled={isLoading || isCurrentPlan}
          onClick={() => onSelect(plan.code)}
        >
          {isCurrentPlan ? 'Active on your account' : isFree ? 'Get Started' : `Upgrade to ${plan.name}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlanCard;
