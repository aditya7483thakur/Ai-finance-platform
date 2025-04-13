import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { RefreshCcw, CheckCircle } from "lucide-react";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { useNavigate, useParams } from "react-router-dom";
import { Transaction } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useDeleteBulkTransactions,
  useDeleteTransaction,
} from "@/services/transactions/mutation";
import TransactionFilteration, { formSchema } from "./TransactionFilteration";
import { Checkbox } from "../ui/checkbox";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryColour = (category: string): string => {
  switch (category) {
    case "SALARY":
      return "bg-green-100 text-green-800"; // Softer green
    case "INVESTMENTS":
      return "bg-teal-200 text-teal-900";
    case "FOOD":
      return "bg-orange-200 text-orange-900";
    case "TRANSPORT":
      return "bg-blue-200 text-blue-900";
    case "HOUSING":
      return "bg-indigo-200 text-indigo-900";
    case "ENTERTAINMENT":
      return "bg-purple-200 text-purple-900";
    case "TRAVEL":
      return "bg-cyan-200 text-cyan-900";
    case "HEALTH":
      return "bg-red-200 text-red-900";
    case "SHOPPING":
      return "bg-pink-200 text-pink-900";
    case "MISCELLANEOUS":
      return "bg-gray-200 text-gray-900";
    default:
      return "bg-yellow-200 text-yellow-900";
  }
};

const getRecurringBadgeColor = (interval: string) => {
  switch (interval.toLowerCase()) {
    case "daily":
      return "bg-blue-100 text-blue-700";
    case "weekly":
      return "bg-green-100 text-green-700";
    case "monthly":
      return "bg-yellow-100 text-yellow-800";
    case "yearly":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700"; // One-time
  }
};

const AccountTransaction = ({
  setTotalTransactions,
}: {
  setTotalTransactions: (count: number) => void;
}) => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({ accountId, page: 1 });
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set()
  );

  const { mutate: deleteTransaction, isPending: deleting } =
    useDeleteTransaction();
  const { data: transactionData, isPending } = useFilteredTransactions(filters);
  const { mutate: bulkDelete, isPending: bulkDeleting } =
    useDeleteBulkTransactions();

  useEffect(() => {
    if (transactionData?.pagination.totalTransactions) {
      setTotalTransactions(transactionData?.pagination.totalTransactions);
    }
  }, [transactionData]);

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleBulkDelete = () => {
    if (selectedTransactions.size === 0) return;
    bulkDelete(Array.from(selectedTransactions), {
      onSuccess: () => {
        setSelectedTransactions(new Set());
      },
    });
  };

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedTransactions((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  };

  function handleFilterSubmit(values: z.infer<typeof formSchema>) {
    console.log("search", values);
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className=" mb-3">
        <TransactionFilteration
          searching={isPending}
          onSubmit={handleFilterSubmit}
        />
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            className={`items-center ${
              selectedTransactions.size > 0 ? "flex" : "hidden"
            } mt-3`}
            disabled={bulkDeleting}
          >
            {bulkDeleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected Transactions
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right pr-10">Amount</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : transactionData?.data?.length > 0 ? (
              transactionData.data.map((transaction: Transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-100">
                  <TableCell className="font-medium">
                    <Checkbox
                      className="border-black/70"
                      id={transaction.id}
                      checked={selectedTransactions.has(transaction.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(transaction.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {formatDate(transaction.date)}
                  </TableCell>

                  <TableCell className="text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            {transaction.description &&
                            transaction.description.length > 20
                              ? `${transaction.description.slice(0, 20)}...`
                              : transaction.description}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-72 text-center">
                          <p>{transaction.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-medium ${getCategoryColour(
                        transaction.category
                      )}`}
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    } text-right  pr-10`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}$
                    {transaction.amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-0.5 inline-flex items-center rounded-sm font-medium ${getRecurringBadgeColor(
                        transaction.isRecurring
                          ? transaction.recurringInterval ?? "one-time"
                          : "one-time"
                      )}`}
                    >
                      {transaction.isRecurring ? (
                        <RefreshCcw className="w-3 h-3 mr-1 inline-block" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-1 inline-block" />
                      )}
                      {transaction.isRecurring
                        ? transaction.recurringInterval ?? "One Time"
                        : "One Time"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-20 p-0">
                        <button
                          onClick={() =>
                            navigate("/dashboard/add-transaction", {
                              state: { mode: "edit", transaction },
                            })
                          }
                          className="px-2 text-center focus:outline-none focus:ring-0 py-1 text-gray-700 rounded-t-md hover:bg-gray-100  w-full "
                        >
                          Edit
                        </button>

                        <div className="h-px bg-gray-300" />
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <button className="px-2 py-1  text-red-500 rounded-b-md hover:bg-red-100 transition-colors w-full text-center">
                              Delete
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete the transaction.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="hover:cursor-pointer"
                                >
                                  Close
                                </Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(transaction.id)}
                                disabled={deleting}
                                className="hover:cursor-pointer hover:bg-destructive/80"
                              >
                                {deleting && (
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-500"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Component */}
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  to={`?page=${filters.page - 1}`}
                  className={
                    filters.page === 1 ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={(e) => {
                    if (filters.page === 1) e.preventDefault();
                    else handlePageChange(filters.page - 1);
                  }}
                />
              </PaginationItem>
              {/* Page Numbers */}
              {`${filters.page}/${transactionData?.pagination?.totalPages}`}
              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  to={`?page=${filters.page + 1}`}
                  className={
                    filters.page === transactionData?.pagination?.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={(e) => {
                    if (
                      filters.page === transactionData?.pagination?.totalPages
                    )
                      e.preventDefault();
                    else handlePageChange(filters.page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>{" "}
    </div>
  );
};

export default AccountTransaction;
