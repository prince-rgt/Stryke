import { Typography } from '@/components/ui/typography';

const Title = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Typography variant="h4-bold">Leaderboard</Typography>
      <Typography variant="p-medium" className="text-muted-foreground">
        Track Stryke’s best performing traders at different points in time.
      </Typography>
    </div>
  );
};

export default Title;
