import { Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ExpenseBreakdown from "@/components/custom/ExpenseBreakdown";
import Accounts from "@/components/custom/Accounts";

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white mb-6 p-3 shadow-md rounded-md">
          <span className="block text-lg font-medium">Account budget</span>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-gray-400">$5000/$7000 spent</span>

            <Pencil size={18} />
          </div>
          <Progress value={33} className="h-2.5" />
          <div className="text-end text-gray-400">70% used</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseBreakdown />
          <RecentTransactions />
        </div>
        <Accounts />
      </div>
    </div>
  );
};

export default Dashboard;
