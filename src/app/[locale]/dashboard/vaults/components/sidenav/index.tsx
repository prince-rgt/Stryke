import DepositForm from './components/DepositForm';
import QuickLinks from './components/QuickLinks';

const SideNav = () => {
  return (
    <div className="bg-[#202020] text-muted-foreground flex flex-col text-sm border border-black">
      {/* Form */}
      <DepositForm />

      {/* Positions Data */}
      <div className="flex flex-col gap-3 p-3 mt-2 border-y border-black">
        <h1 className="text-md text-white font-bold">Your Position</h1>
        <div className="flex justify-between">
          <p>Current Position</p>
          <p className="flex gap-2">
            <span className="text-white"> {0.31} </span>
            <span>WBTC</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Earned</p>
          <p className="flex gap-2">
            <span className="text-white"> {0.03} </span>
            <span>WBTC</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Queued Withdrawal</p>
          <p className="flex gap-2">
            <span className="text-white"> {0} </span>
            <span>WBTC</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p>Unrealized PNL</p>
          <p className="flex gap-2 text-[#16EF94]">
            <span> ${593.38} </span>
            <span>({3.41}%)</span>
          </p>
        </div>
      </div>

      {/* Share Menu */}
      <QuickLinks />
    </div>
  );
};

export default SideNav;
