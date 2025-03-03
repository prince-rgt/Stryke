'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

// Define slides with status instead of textClass
const slides = [
  {
    id: 1,
    placeholder: 'Epoch 1',
    status: 'starting',
  },
  {
    id: 2,
    placeholder: 'Epoch 2',
    status: 'live',
  },
  {
    id: 3,
    placeholder: 'Epoch 3',
    status: 'completed',
  },
];

// Function to determine color based on status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'live':
      return 'text-[#EBFF00]';
    case 'completed':
      return 'text-green-500';
    default:
      return 'text-muted-foreground';
  }
};

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex gap-2 items-center my-2">
      {/* Left Arrow */}
      <ChevronLeft
        size={18}
        className="mr-3 opacity-50 cursor-pointer hover:opacity-100 transition"
        onClick={prevSlide}
      />

      {/* Slide Container */}
      <div className="relative h-[2.5rem] w-[16rem] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentSlide].id}
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            exit={{ x: -40 }}
            transition={{ duration: 0.15 }} // Faster transition
            className="flex items-center gap-2">
            <div className="bg-[#3C3C3C] w-[9.75rem] rounded">
              <Input
                type="text"
                placeholder={slides[currentSlide].placeholder}
                className="w-full bg-transparent border-0 px-[5px] text-white"
                readOnly
              />
            </div>
            <p
              className={`bg-secondary px-2 py-1.5 font-medium font-mono text-sm rounded flex items-center ${getStatusClass(slides[currentSlide].status)}`}>
              {slides[currentSlide].status}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Arrow */}
      <ChevronRight
        size={18}
        className="ml-3 opacity-50 cursor-pointer hover:opacity-100 transition"
        onClick={nextSlide}
      />
    </div>
  );
};

export default Slider;
