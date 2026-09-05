import { useEffect, useRef, useState, RefObject } from 'react';

interface UseInViewObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useInViewObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewObserverOptions = { threshold: 0.6 }
): [RefObject<T | null>, boolean] {
  const elementRef = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      setIsInView(isVisible);
      if (isVisible && options.freezeOnceVisible) {
        observer.unobserve(node);
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isInView];
}
