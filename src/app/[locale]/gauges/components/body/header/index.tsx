import { Typography } from '@/components/ui/typography';

const Header = () => {
  return (
    <div className="w-full flex flex-col gap-md">
      <Typography as="h1" variant="h4-bold">
        Gauges
      </Typography>
      <Typography as="p" variant="p-medium" className="text-muted-foreground">
        Vote for gauges with your <span className="text-highlight">xSYK.</span> Your votes will determine the reward
        payout for each market.
      </Typography>
    </div>
  );
};

export default Header;
