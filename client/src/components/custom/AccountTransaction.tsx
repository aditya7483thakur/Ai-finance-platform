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

import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { useParams } from "react-router-dom";
import { Transaction } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const { accountId } = useParams();

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
        <TransactionFilteration onSubmit={handleFilterSubmit} />
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
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              transactionData?.data?.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
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
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>

                  <TableCell>
                    {transaction.description &&
                    transaction.description.length > 20
                      ? `${transaction.description.slice(0, 20)}...`
                      : transaction.description}
                  </TableCell>
                  <TableCell>
                    {getCategoryIcon(transaction.category)}{" "}
                    {transaction.category}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    {transaction.isRecurring
                      ? transaction.recurringInterval
                      : "One time"}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-20 p-3">
                        <div className="text-center">Edit</div>
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <div className="text-center text-red-500 cursor-pointer">
                              Delete
                            </div>
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
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(transaction.id)}
                                disabled={deleting}
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
