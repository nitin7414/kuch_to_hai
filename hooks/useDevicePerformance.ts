import { useEffect, useState } from 'react';
import { PerformanceTier } from '../types/experience';

export function useDevicePerformance(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('high');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const concurrency = navigator.hardwareConcurrency || 4;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const dpr = window.devicePixelRatio || 1;

    if (concurrency <= 2 || (isMobile && dpr > 2.5)) {
      setTier('low');
    } else if (concurrency <= 4 || isMobile) {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, []);

  return tier;
}
