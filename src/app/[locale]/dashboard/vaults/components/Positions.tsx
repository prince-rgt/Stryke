import { ButtonV1 } from './Buttons';

const Positions = () => {
  const dummyData = [
    { epoch: 1, date: '15 Feb, 2025', amount: '0.31', status: 'active', pnl: 3.41, yield: 3.41, current: true },
    { epoch: 2, date: '8 Feb, 2025', amount: '0.31', status: 'closed', pnl: 3.41, yield: 3.41 },
  ];

  return (
    <div className="pb-12">
      <table className="w-full text-xs text-left">
        <thead className="bg-secondary border-2 border-black text-muted-foreground py-2 uppercase">
          <th className="py-1.5 pl-2">Epoch</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>PNL</th>
          <th>Yield</th>
          <th className="text-right pr-2">Action</th>
        </thead>
        <tbody className="bg-secondary border-2 border-black">
          {dummyData.map((data, index) => (
            <tr key={index} className="">
              <td className="py-3 pl-4 flex items-center">
                <span className="w-5">{data.epoch}</span>
                {data.current && (
                  <button className="ml-2 uppercase px-2 py-1.5 rounded bg-[#3C3C3C] text-muted-foreground">
                    Current
                  </button>
                )}
              </td>
              <td>{data.date}</td>
              <td className="flex gap-1">
                <span>{data.amount}</span>
                <span className="text-muted-foreground">WBTC</span>
              </td>
              <td className="">
                {data.status === 'active' ? (
                  <ButtonV1 label="ACTIVE" classes="bg-[#3C3C3C] text-[#EBFF00] w-16 text-center" />
                ) : (
                  <ButtonV1 label="CLOSED" classes="bg-[#3C3C3C] text-muted-foreground w-16 text-center" />
                )}
              </td>
              <td>
                <span
                  className={`underline ${true ? 'text-[#16EF94] decoration-[#16EF94]' : 'text-red-500 decoration-red-500'}`}>
                  {true ? '+' : '-'} {data.pnl}%
                </span>
              </td>
              <td>
                <span
                  className={`underline ${false ? 'text-[#16EF94] decoration-[#16EF94]' : 'text-red-500 decoration-red-500'}`}>
                  {false ? '+' : '-'} {data.yield}%
                </span>
              </td>
              <td className="text-right pr-2">
                {false ? (
                  <button className="bg-white rounded p-1 text-black">Queue Widthdrawal</button>
                ) : (
                  <button className="bg-[#3C3C3C] p-1 rounded">Withdrawn</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Positions;
