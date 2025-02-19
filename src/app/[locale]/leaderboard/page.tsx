'use server';

import Body from '@/app/[locale]/leaderboard/components/body';
import Header from '@/app/[locale]/leaderboard/components/header';

const Leaderboard = () => {
  return (
    <div className="bg-primary flex flex-col flex-grow overflow-hidden my-[1px]">
      <Header />
      <Body />
    </div>
  );
};

export default Leaderboard;
