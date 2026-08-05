'use client';

import clsx from 'classnames';
import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

const TABLET_MQ = '(min-width: 767px)';

type PanelWorkspaceSlideProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

function PanelWorkspaceSlide({ children }: PanelWorkspaceSlideProps) {
  return children;
}

function isSlideElement(
  child: ReactNode,
): child is ReactElement<PanelWorkspaceSlideProps> {
  return (
    isValidElement(child) &&
    typeof (child.props as PanelWorkspaceSlideProps).ariaLabel === 'string'
  );
}

type PanelWorkspaceProps = {
  children: ReactNode;
};

export function PanelWorkspace({ children }: PanelWorkspaceProps) {
  const slides = Children.toArray(children).filter(isSlideElement);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const desktopQuery = window.matchMedia(TABLET_MQ);

    function syncActiveSlide() {
      const root = scrollerRef.current;
      if (!root) {
        return;
      }

      // side-by-side layout: dots are hidden, keep the first slide as active
      if (desktopQuery.matches) {
        setActiveSlide(0);
        return;
      }

      // how much we scrolled
      const slideWidth = root.clientWidth;
      if (slideWidth === 0) {
        return;
      }

      const index = Math.round(root.scrollLeft / slideWidth);
      setActiveSlide(Math.min(slides.length - 1, Math.max(0, index)));
    }

    function onBreakpointChange() {
      const root = scrollerRef.current;
      if (!root) {
        return;
      }

      setActiveSlide(0);
      root.scrollTo({ left: 0, behavior: 'instant' });
    }

    scroller.addEventListener('scroll', syncActiveSlide, { passive: true });
    desktopQuery.addEventListener('change', onBreakpointChange);
    syncActiveSlide();

    return () => {
      scroller.removeEventListener('scroll', syncActiveSlide);
      desktopQuery.removeEventListener('change', onBreakpointChange);
    };
  }, [slides.length]);

  function goToSlide(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: 'smooth',
    });
    setActiveSlide(index);
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col tablet:flex-row tablet:justify-center">
      <div
        className="mb-3 flex shrink-0 justify-center gap-3 tablet:hidden"
        role="tablist"
        aria-label="Panels"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.props.ariaLabel}
            type="button"
            role="tab"
            aria-label={slide.props.ariaLabel}
            aria-selected={activeSlide === index}
            onClick={() => goToSlide(index)}
            className={clsx(
              'size-3 rounded-full transition-colors',
              activeSlide === index
                ? 'bg-(--page-fg)'
                : 'bg-neutral-300 dark:bg-neutral-600',
            )}
          />
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="flex min-h-0 flex-1 max-tablet:snap-x max-tablet:snap-mandatory max-tablet:overflow-x-auto max-tablet:scroll-smooth max-tablet:scrollbar-none tablet:overflow-visible tablet:justify-center"
      >
        {slides.map((slide, index) => (
          <div key={slide.props.ariaLabel} className="contents">
            {index > 0 && (
              <div
                role="separator"
                aria-orientation="vertical"
                className="mx-4 hidden w-px shrink-0 self-stretch bg-neutral-300 tablet:block"
              />
            )}
            <div
              id={`slide-${index}`}
              className={clsx(
                'h-full w-full max-tablet:shrink-0 max-tablet:snap-center tablet:max-w-xl',
                slide.props.className,
              )}
            >
              {slide.props.children}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PanelWorkspace.Slide = PanelWorkspaceSlide;
