import { cn } from '@/utils/styles';

interface LoaderPinwheelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const LoaderPinwheel: React.FC<LoaderPinwheelProps> = ({ size = 24, className, ...props }) => {
  return (
    <div
      className={cn('border-1 animate-spin rounded-full border-b-2 border-t-2 border-foreground', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      {...props}
    />
  );
};
