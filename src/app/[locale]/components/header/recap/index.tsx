import { Sparkles } from 'lucide-react';

import { Link } from '@/navigation';

import { STRYKE_COLORS } from '@/styles/themes/consts';

const RecapButton = () => {
  return (
    <Link href="/recap">
      <button
        className="flex items-center gap-2 px-2 py-0.5 mx-2 rounded transition-all duration-200
              hover:scale-105 active:scale-95"
        style={{
          background: STRYKE_COLORS['secondary-panel'],
          border: `1px solid ${STRYKE_COLORS['dark-grey']}`,
        }}>
        <Sparkles className="w-4 h-4" style={{ color: STRYKE_COLORS['light-stryke'] }} />
        <span style={{ color: STRYKE_COLORS['light-stryke'] }}>2024 Recap</span>
      </button>
    </Link>
  );
};

export default RecapButton;
