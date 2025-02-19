import Header from './header';
import Summary from './summary';
import Tables from './tables';

const Body = () => {
  return (
    <div className="divide-y divide-background">
      <Header />
      <Summary />
      <Tables />
    </div>
  );
};

export default Body;
