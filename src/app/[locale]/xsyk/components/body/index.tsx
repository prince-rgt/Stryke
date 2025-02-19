import Header from './header';
import InputPanel from './input-panel';
import Summary from './summary';
import Tables from './tables';

const Body = () => {
  return (
    <div className="w-1/2 divide-y divide-background">
      <Header />
      <Summary />
      <InputPanel />
      <Tables />
    </div>
  );
};

export default Body;
