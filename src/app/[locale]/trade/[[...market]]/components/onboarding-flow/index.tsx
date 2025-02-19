import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Lightbulb, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/styles';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { ONBOARDING_STEPS } from './consts';

interface OnboardingFlowProps {
  onClose: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, side: 'bottom' });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ONBOARDING_STEPS[currentStep].target;
    if (currentStep === 0) {
      centerTooltip();
    } else if (target) {
      const element = document.querySelector(target) as HTMLElement;
      setTargetElement(element);
      if (element) {
        positionTooltip(element);
      }
    } else {
      setTargetElement(null);
      centerTooltip();
    }
  }, [currentStep]);

  const positionTooltip = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    if (!tooltipRect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 10;
    let left = rect.left + window.scrollX + rect.width / 2 - tooltipRect.width / 2;
    let side = 'bottom';

    // Check if there's enough space below
    if (top + tooltipRect.height > viewportHeight - 10) {
      // Try positioning above
      top = rect.top + window.scrollY - tooltipRect.height - 10;
      side = 'top';

      // If not enough space above or below, try right or left
      if (top < 10) {
        // Reset top position
        top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;

        // Try right
        left = rect.right + window.scrollX + 10;
        side = 'right';

        // If not enough space on right, try left
        if (left + tooltipRect.width > viewportWidth - 10) {
          left = rect.left + window.scrollX - tooltipRect.width - 10;
          side = 'left';
        }
      }
    }

    // Adjust horizontal position if it goes off-screen for top/bottom positioning
    if (side === 'top' || side === 'bottom') {
      if (left < 10) {
        left = 10;
      } else if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }
    }

    // Ensure the tooltip stays within the viewport
    top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10));
    left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10));

    setTooltipPosition({ top, left, side });
  };

  const centerTooltip = () => {
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    if (!tooltipRect) return;

    const top = (window.innerHeight - tooltipRect.height) / 2;
    const left = (window.innerWidth - tooltipRect.width) / 2;

    setTooltipPosition({ top, left, side: 'bottom' });
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background bg-opacity-50">
        {targetElement && currentStep !== 0 && (
          <div
            className="absolute bg-transparent transition-all duration-300 ease-in-out"
            style={{
              top: targetElement.offsetTop,
              left: targetElement.offsetLeft,
              width: targetElement.offsetWidth,
              height: targetElement.offsetHeight,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              border: '2px solid',
            }}
          />
        )}
      </div>
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-50 w-80 rounded-sm bg-foreground p-4 font-mono text-background shadow-md duration-300 animate-in fade-in-0 zoom-in-95',
          tooltipPosition.side === 'top' && 'slide-in-from-bottom-2',
          tooltipPosition.side === 'bottom' && 'slide-in-from-top-2',
          tooltipPosition.side === 'left' && 'slide-in-from-right-2',
          tooltipPosition.side === 'right' && 'slide-in-from-left-2',
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}>
        <Button
          variant="ghost"
          className="absolute right-0 top-0 text-muted-foreground hover:bg-transparent hover:text-background"
          onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <Typography className="mb-2" variant={'h4-bold'}>
          {ONBOARDING_STEPS[currentStep].title}
        </Typography>
        <Typography className="mb-4" variant={'small-regular'}>
          {ONBOARDING_STEPS[currentStep].content}
        </Typography>
        {ONBOARDING_STEPS[currentStep]?.tip && (
          <div className="mb-4 flex items-center">
            <Lightbulb className="h-4 w-4 flex-shrink-0" />
            <Typography className="ml-2" variant={'small-regular'}>
              {ONBOARDING_STEPS[currentStep].tip}
            </Typography>
          </div>
        )}
        {currentStep === 0 ? (
          <Button className="w-full" onClick={handleNext} variant={'secondary'}>
            Start
          </Button>
        ) : (
          <div className="flex justify-between">
            <Button onClick={handlePrevious} variant={'secondary'}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleNext} variant={'secondary'}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish' : ''}
              {currentStep !== ONBOARDING_STEPS.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <div
          className={cn(
            { hidden: currentStep === 0 },
            'absolute h-2 w-2 rotate-45 bg-foreground',
            tooltipPosition.side === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
            tooltipPosition.side === 'bottom' && 'left-1/2 top-[-4px] -translate-x-1/2',
            tooltipPosition.side === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
            tooltipPosition.side === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
          )}
        />
      </div>
    </>
  );
};

export default OnboardingFlow;
