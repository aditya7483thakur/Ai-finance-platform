import AccountTransaction from "@/components/custom/AccountTransaction";
import TransactionGraph from "@/components/custom/TransactionGraph";

const Transaction = () => {
  return (
    <div className="bg-gray-50  px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="bg-white max-w-7xl p-6 mx-auto shadow-sm rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary">Personal</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">$152124.40</p>
            <p className="text-gray-500">187 transactions</p>
          </div>
        </div>
      </div>
      <TransactionGraph />

      <AccountTransaction />
    </div>
  );
};

export default Transaction;
