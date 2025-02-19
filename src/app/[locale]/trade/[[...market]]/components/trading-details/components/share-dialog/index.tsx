import { CopyIcon, DownloadIcon, Share2Icon } from '@radix-ui/react-icons';
import { toPng } from 'html-to-image';
import React, { useCallback, useRef, useState } from 'react';

import { imageUpload } from './utils';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/app/[locale]/components/logo';
import TextLogo from '@/app/[locale]/components/logo/text';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import { CLOUDINARY_API_KEY } from '@/consts/env';

export interface ShareDialogProps {
  pnl: {
    pnlUsdValue: number;
    pnlInQuoteAsset: number;
  };
  premiumUsdValue: number;
  premiumInQuoteAsset: number;
  optionsAmount: number;
  type: string;
  strikePriceUsd: number;
  exercisePriceUsd?: number;
}

const ShareDialog = ({
  strikePriceUsd,
  type,
  optionsAmount,
  pnl,
  premiumInQuoteAsset,
  exercisePriceUsd,
}: ShareDialogProps) => {
  const { markPriceUsd, selectedMarket } = useStrikesStore();
  const { pairLabel, isMemePair } = selectedMarket;

  const percentage = (pnl.pnlInQuoteAsset / premiumInQuoteAsset) * 100;
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const generateAndUploadImage = useCallback(async () => {
    if (ref.current === null) {
      return null;
    }

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true });
      const uploadedUrl = await imageUpload({
        file: dataUrl,
        api_key: CLOUDINARY_API_KEY,
        upload_preset: 'jjdwjcl8',
      });
      setImageUrl(uploadedUrl);

      return uploadedUrl;
    } catch (err) {
      console.error(err);
      toast({
        title: 'Upload failed',
        description: 'Failed to generate and upload image. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [ref, toast]);

  const handleCopyImageUrl = useCallback(async () => {
    setLoading(true);
    try {
      let url = imageUrl;
      if (!url) {
        url = await generateAndUploadImage();
      }
      if (url) {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'URL copied',
          description: 'Image URL has been copied to clipboard.',
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Copy failed',
        description: 'Failed to copy image URL. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [imageUrl, generateAndUploadImage, toast]);

  const handleDownload = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'stryke-pnl-share.png';
        link.href = dataUrl;
        link.click();
        toast({
          title: 'Image downloaded',
          description: 'Your image has been successfully downloaded.',
        });
      })
      .catch((err: Error) => {
        console.error(err);
        toast({
          title: 'Download failed',
          description: 'Failed to download image. Please try again.',
          variant: 'destructive',
        });
      });
  }, [ref, toast]);

  return (
    <Dialog>
      <DialogTrigger className="items-center">
        <Button variant="ghost" size="sm">
          <Share2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[366px] flex-col p-0">
        <Typography variant="p-bold">Share</Typography>
        <Typography>Preview</Typography>
        <div ref={ref} className="bg-secondary">
          <div className="flex w-full flex-col space-y-md bg-opacity-25 bg-[url('/images/share_bg.png')] bg-contain p-md">
            <div className="flex space-x-1">
              <Logo /> <TextLogo />
            </div>
            <div className="flex space-x-2 uppercase text-muted-foreground">
              <Typography variant="small-bold">{type}</Typography>
              <Typography variant="small-bold">
                <NumberDisplay precision={4} value={optionsAmount} format="tokenAmount" /> x
              </Typography>
              <Typography variant="small-bold">{pairLabel}</Typography>
            </div>
            <Typography variant="h3-medium" className={percentage > 0 ? 'text-success' : 'text-destructive'}>
              {percentage.toFixed(2)}%
            </Typography>
            <div className="flex space-x-3">
              <div className="flex flex-col space-y-sm">
                <Typography variant="small-bold" className="text-muted-foreground">
                  Strike
                </Typography>
                <Typography>
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={isMemePair ? 7 : 4}
                    value={strikePriceUsd}
                    format="usd"
                  />
                </Typography>
              </div>
              <div className="flex flex-col space-y-sm">
                <Typography variant="small-bold" className="text-muted-foreground">
                  {exercisePriceUsd ? 'Exercise Price' : 'Mark Price'}
                </Typography>
                <Typography>
                  <NumberDisplay
                    showDecimalZerosSubscript
                    precision={isMemePair ? 7 : 4}
                    value={exercisePriceUsd || markPriceUsd}
                    format="usd"
                  />
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 flex w-full space-x-2">
          <Button onClick={handleDownload} className="w-1/2" variant="secondary">
            <DownloadIcon className="mr-2" /> Download Image
          </Button>
          <Button onClick={handleCopyImageUrl} className="w-1/2" variant="secondary" disabled={loading}>
            <CopyIcon className="mr-2" /> {loading ? 'Processing...' : 'Copy Image URL'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
