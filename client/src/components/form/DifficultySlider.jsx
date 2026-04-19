import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const difficultyLevels = [
  {
    id: 'very-easy',
    label: 'Very Easy',
    description: 'Basic questions for entry-level or first-time interviews.',
    value: 10,
  },
  {
    id: 'easy',
    label: 'Easy',
    description: 'Simple concepts and light behavioral questions.',
    value: 30,
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'A balanced mix of technical and situational questions.',
    value: 50,
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'Challenging questions that require in-depth knowledge.',
    value: 70,
  },
  {
    id: 'very-hard',
    label: 'Very Hard',
    description: 'Expert-level questions designed to test top-tier candidates.',
    value: 90,
  },
];

const difficultyToValue = {
  'very-easy': 10,
  easy: 30,
  medium: 50,
  hard: 70,
  'very-hard': 90,
};

const valueToDifficulty = (val) => {
  if (val < 20) return 'very-easy';
  if (val < 40) return 'easy';
  if (val < 60) return 'medium';
  if (val < 80) return 'hard';
  return 'very-hard';
};

const getDifficultyInfo = (difficulty) =>
  difficultyLevels.find((d) => d.id === difficulty) || difficultyLevels[2];

const DifficultySlider = ({
  id,
  label,
  value = 'medium',
  setValue,
  register,
}) => {
  const [sliderValue, setSliderValue] = useState(
    difficultyToValue[value] ?? 50,
  );

  useEffect(() => {
    setSliderValue(difficultyToValue[value] ?? 50);
  }, [value]);

  const info = getDifficultyInfo(value);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center'>
          <Label htmlFor={id}>{label}</Label>
          <span className='text-sm font-medium text-muted-foreground'>
            {info.label}
          </span>
        </div>
        <p className='text-xs text-muted-foreground italic'>
          {info.description}
        </p>
      </div>

      <Slider
        id={id}
        min={0}
        max={100}
        step={1}
        value={[sliderValue]}
        onValueChange={(val) => {
          const newDifficulty = valueToDifficulty(val[0]);
          setSliderValue(val[0]);
          setValue(id, newDifficulty);
        }}
      />
      <input type='hidden' {...register(id)} value={value} readOnly />
    </div>
  );
};

export default DifficultySlider;
