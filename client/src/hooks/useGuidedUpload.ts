import { useCallback, useMemo, useState } from 'react';

export interface GuidedStep {
  id: string;
  title: string;
  body: string;
}

export function useGuidedUpload<T>(
  steps: GuidedStep[],
  initialData: T,
  canAdvanceFromStep: (stepIndex: number, data: T) => boolean,
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<T>(initialData);

  const updateData = useCallback((partial: Partial<T>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const canAdvance = useMemo(
    () => canAdvanceFromStep(currentIndex, data),
    [canAdvanceFromStep, currentIndex, data],
  );

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const goNext = useCallback(() => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, steps.length]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setData(initialData);
  }, [initialData]);

  const getStepState = useCallback(
    (index: number): 'active' | 'done' | 'upcoming' => {
      if (index < currentIndex) return 'done';
      if (index === currentIndex) return 'active';
      return 'upcoming';
    },
    [currentIndex],
  );

  return {
    steps,
    currentIndex,
    currentStep: steps[currentIndex],
    data,
    updateData,
    canAdvance,
    isFirst,
    isLast,
    goNext,
    goBack,
    reset,
    getStepState,
  };
}
