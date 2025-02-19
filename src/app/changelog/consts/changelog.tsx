import Image from 'next/image';

import { FeatureItem, Logs, LogSection } from '../components';
import InfoChart from '@/app/[locale]/gauges/components/info-chart';

const CHANGELOG_DATA = [
  {
    title: 'Oct 25, 2024',
    content: (
      <div>
        <FeatureItem
          title="Never miss another trade with Limit Exercise"
          content={
            <div>
              <Image
                src="/images/changelog/oct-25-2024/limit-exercise.gif"
                height={300}
                width={600}
                alt="Limit Exercise Feature"
                className="mb-8"
                unoptimized
              />
              <p>
                We&apos;ve shipped limit exercise feature for options, giving you more control over your exercise
                strategy.
              </p>
            </div>
          }
        />
        <FeatureItem
          title="Strive for the top spot on Stryke trading leaderboard"
          content={
            <div>
              <Image
                src="/images/changelog/oct-25-2024/leaderboard.png"
                height={300}
                width={600}
                alt="New Leaderboard Feature"
                className="mb-8"
              />
              <p>
                This competitive element allows you to see how your trading performance stacks up against other users on
                the platform. Climb the ranks and showcase your trading skills!
              </p>
            </div>
          }
        />
        <FeatureItem
          title="Reward Gauges"
          content={
            <div>
              <InfoChart className="mb-4" />
              <p>
                Holding xSYK? Now you can vote and decide rewards allocations towards our liquidity pools and vaults!
              </p>
            </div>
          }
        />
        <FeatureItem
          title="Breakeven PnL Chart"
          content={
            <div>
              <Image
                src="/images/changelog/oct-25-2024/pnl-chart.png"
                height={200}
                width={400}
                alt="Breakeven PnL Chart"
                className="mb-8"
              />
              <p>Select your strike(s) and enter the amount you&apos;d like to purchase to view your PNL estimation.</p>
            </div>
          }
        />
        <LogSection>
          <Logs
            type="Improvements"
            data={[
              'UI settings for collapsible sections now persists across sessions',
              'Optimized fonts for better performance',
              'Introduced action filter in trade history',
              'Add zooming functionality to the range selector',
              'Show % on range selector',
            ]}
          />
          <Logs
            type="Fixes"
            data={[
              'Issue with filter ranges carrying over to other markets',
              'Addressed un-selectable toggle group options in filter settings',
              'xSYK image not showing on redeem tab',
              'Deposits and withdrawals in trade history not showing across all pools',
            ]}
          />
          <Logs
            type="API"
            data={[
              'Add Limit Exercise endpoints',
              'Add Gauges endpoint',
              'Add OpenOcean aggregator for exercise',
              'Fix slippage parameter in exercise',
              'Fix PnL endpoint',
            ]}
          />
        </LogSection>
      </div>
    ),
  },
  {
    title: 'Sep 19, 2024',
    content: (
      <div>
        <FeatureItem
          title="User onboarding flow on Trade Page"
          content={
            <div>
              <Image
                src="/images/changelog/sep-19-2024/trade-onboarding-flow-demo.gif"
                height={300}
                width={600}
                alt="Trade Onboarding Flow Demo"
                className="mb-8"
                unoptimized
              />
              <p>
                We have added a new onboarding flow for users on the trade page helping them get accustomed to the
                interface enhancing their experience while trading.
              </p>
            </div>
          }
        />
        <FeatureItem
          title="Toggelable columns on strikes chain"
          content={
            <div>
              <Image
                src="/images/changelog/sep-19-2024/toggelable-columns.png"
                height={300}
                width={400}
                alt="Toggleable Columns"
                className="mb-8"
              />
              <p>
                Toggle columns as per your need to de-clutter the strikes chain for a better viewing experience.
                <br />
                <br />
                Navigate to the Options Chain tab on the trade page, you should see a a layout icon right next to the
                CALL/PUT selector, clicking on that icon reveals a select menu allowing you to toggle off/on certain
                columns on the Options Chain.
              </p>
            </div>
          }
        />
        <LogSection>
          <Logs
            type="Improvements"
            data={[
              'Optimize image and price fetching for better performance',
              'Add un-exercised options in trade history',
              'New blocked page for better clarity for users accessing from restricted countries',
              'Update banners on dashboard to better reflect current updates on Stryke',
              'Add a toast on for un-exercisable options for better UX',
              'Reset exercise transaction preparation on successful exercise',
              `TradingView chart settings are now saved locally on your browser which means they don't reset on reload`,
              `More time intervals for viewing the TradingView price chart`,
              'Add better UX feedback on transaction failure',
              'Sharing PnL now supports copying the image URL',
            ]}
          />
          <Logs
            type="Fixes"
            data={[
              'PnL % not showing correctly on share card from trade history',
              'DApp crashes on entering amount while LPing when user wallet is not connected',
              'Merkl reward claiming functionality',
              'Minor issues while LPing in non-uniswap pools on Arbitrum',
              'Dune dashboard link',
            ]}
          />
          <Logs
            type="API"
            data={[
              <span key="typescript-library">
                Introduce new{' '}
                <a
                  href="https://www.npmjs.com/package/@stryke-xyz/shared-types"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline">
                  typescript library
                </a>{' '}
                on npm for API types
              </span>,
              'Fix incorrect protocol stat (TVL, volume etc.) calculations on all endpoints',
              'Introduce new endpoint for settlements history',
              'Return purchase price data on purchase and exercise endpoints',
            ]}
          />
        </LogSection>
      </div>
    ),
  },
];

export default CHANGELOG_DATA;
