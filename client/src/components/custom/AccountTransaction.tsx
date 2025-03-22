import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: "d78eb500-cf1f-5f2b-bc98-8d7dbf5cbd3",
    type: "INCOME",
    amount: "1500",
    description: "Freelance payment",
    date: "2024-03-12T00:00:00.000Z",
    category: "WORK",
    receiptUrl: null,
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
    accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
    createdAt: "2025-03-13T20:20:28.479Z",
    updatedAt: "2025-03-14T17:52:25.563Z",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "ENTERTAINMENT":
      return "🎭";
    case "WORK":
      return "💼";
    default:
      return "💰";
  }
};

const AccountTransaction = () => {
  return (
    <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Add Transaction
        </button>
      </div>

      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>
                {getCategoryIcon(transaction.category)} {transaction.category}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="text-right">
                ${transaction.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              $
              {transactions
                .reduce(
                  (total, transaction) => total + Number(transaction.amount),
                  0
                )
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default AccountTransaction;
