'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <span onClick={() => router.back()} className="mr-4 p-2 cursor-pointer">
      <ChevronLeft size={18} className="opacity-50 text-xl" />
    </span>
  );
};

export default BackButton;
