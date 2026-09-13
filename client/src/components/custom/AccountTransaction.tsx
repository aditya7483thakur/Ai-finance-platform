import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Copy, Loader2, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteBulkTransactions,
  useDeleteTransaction,
} from "@/services/transactions/mutation";
import TransactionFilteration, { formSchema } from "./TransactionFilteration";
import { Checkbox } from "../ui/checkbox";
import { formatShortDate, formatSignedMoney } from "@/lib/money";
import { getCategory, getCategoryBadge, getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";

const scheduleLabel = (transaction: Transaction) => {
  if (!transaction.isRecurring) {
    return "One-time";
  }

  switch (transaction.recurringInterval) {
    case "DAILY":
      return "Daily";
    case "WEEKLY":
      return "Weekly";
    case "MONTHLY":
      return "Monthly";
    case "YEARLY":
      return "Yearly";
    default:
      return "Recurring";
  }
};

const AccountTransaction = ({
  setTotalTransactions,
}: {
  setTotalTransactions: (count: number) => void;
}) => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ accountId, page: 1 });
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const { mutate: deleteTransaction, isPending: deleting } =
    useDeleteTransaction();
  const { data: transactionData, isPending } = useFilteredTransactions(filters);
  const { mutate: bulkDelete, isPending: bulkDeleting } =
    useDeleteBulkTransactions();

  useEffect(() => {
    if (transactionData?.pagination) {
      setTotalTransactions(transactionData.pagination.totalTransactions);
    }
  }, [transactionData, setTotalTransactions]);

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteTransaction(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
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

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedTransactions((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  function handleFilterSubmit(values: z.infer<typeof formSchema>) {
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Transaction History
        </h2>
        <Button size="sm" variant="outline" asChild>
          <Link to="/dashboard/add-transaction">
            <Plus className="size-4" aria-hidden />
            Add Transaction
          </Link>
        </Button>
      </div>

      <TransactionFilteration
        searching={isPending}
        onSubmit={handleFilterSubmit}
      />

      {selectedTransactions.size > 0 && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            {bulkDeleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete selected ({selectedTransactions.size})
          </Button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-slate-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : transactionData?.data?.length > 0 ? (
              transactionData.data.map((transaction: Transaction) => {
                const category = getCategory(transaction.category);
                const Icon = category?.icon;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Checkbox
                        id={transaction.id}
                        checked={selectedTransactions.has(transaction.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            transaction.id,
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                      {formatShortDate(transaction.date)}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm font-medium text-slate-900">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="truncate">
                              {transaction.description ||
                                getCategoryLabel(transaction.category)}
                            </p>
                          </TooltipTrigger>
                          {transaction.description && (
                            <TooltipContent className="max-w-72 text-center">
                              <p>{transaction.description}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                          getCategoryBadge(transaction.category),
                        )}
                      >
                        {Icon && <Icon className="size-3" aria-hidden />}
                        {getCategoryLabel(transaction.category)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-sm font-semibold whitespace-nowrap",
                        transaction.type === "INCOME"
                          ? "text-success"
                          : "text-error",
                      )}
                    >
                      {formatSignedMoney(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {scheduleLabel(transaction)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={`Actions for ${transaction.description || transaction.category}`}
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/dashboard/add-transaction", {
                                state: { mode: "edit", transaction },
                              })
                            }
                          >
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/dashboard/add-transaction", {
                                state: { transaction },
                              })
                            }
                          >
                            <Copy className="size-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-error focus:text-error"
                            onClick={() => setDeleteTarget(transaction)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-slate-500"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
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
            <span className="px-2 text-sm text-slate-500">
              {`${filters.page}/${transactionData?.pagination?.totalPages || 1}`}
            </span>
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
                  ) {
                    e.preventDefault();
                  } else {
                    handlePageChange(filters.page + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this transaction?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The account balance will update after the
              transaction is removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AccountTransaction;
