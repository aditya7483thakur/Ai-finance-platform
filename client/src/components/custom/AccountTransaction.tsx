import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { useNavigate } from "react-router-dom";
import { AccountType, Transaction } from "@/types";
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
import { Checkbox } from "../ui/checkbox";
import { formatShortDate, formatSignedMoney } from "@/lib/money";
import {
  getCategory,
  getCategoryBadge,
  getCategoryLabel,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

export type TransactionListFilters = {
  accountId?: string;
  description?: string;
  type?: "ALL" | "INCOME" | "EXPENSE";
  category?: string;
  isRecurring?: "ALL" | "true" | "false";
};

const AccountTransaction = ({
  accounts,
  listFilters,
  enabled,
}: {
  accounts: AccountType[];
  listFilters: TransactionListFilters;
  enabled: boolean;
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const queryFilters = { ...listFilters, page, limit: 10 };
  const { mutate: deleteTransaction, isPending: deleting } =
    useDeleteTransaction();
  const { data: transactionData, isPending } = useFilteredTransactions(
    queryFilters,
    { enabled },
  );
  const { mutate: bulkDelete, isPending: bulkDeleting } =
    useDeleteBulkTransactions();

  useEffect(() => {
    setPage(1);
    setSelectedTransactions(new Set());
  }, [
    listFilters.accountId,
    listFilters.category,
    listFilters.description,
    listFilters.isRecurring,
    listFilters.type,
  ]);

  const rows: Transaction[] = transactionData?.data ?? [];
  const accountName = (id: string) =>
    accounts.find((account) => account.id === id)?.name ?? "Account";
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedTransactions.has(row.id));

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

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedTransactions((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedTransactions((prev) => {
      const next = new Set(prev);
      rows.forEach((row) => {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      });
      return next;
    });
  };

  return (
    <section>
      {selectedTransactions.size > 0 && (
        <div className="mb-3 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            {bulkDeleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete selected ({selectedTransactions.size})
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) =>
                    toggleSelectAll(checked === true)
                  }
                  aria-label="Select all transactions on this page"
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((transaction) => {
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
                            checked === true,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatShortDate(transaction.date)}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm font-medium text-foreground">
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
                    <TableCell className="text-sm text-muted-foreground">
                      {accountName(transaction.accountId)}
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
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          transaction.type === "INCOME"
                            ? "bg-success/15 text-success"
                            : "bg-error/15 text-error",
                        )}
                      >
                        {transaction.type === "INCOME" ? "Income" : "Expense"}
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
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {scheduleHint(rows)}
          {transactionData?.pagination
            ? `Showing page ${transactionData.pagination.currentPage} of ${transactionData.pagination.totalPages || 1}`
            : null}
        </p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to="#"
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  if (page === 1) return;
                  setPage(page - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                to="#"
                className={
                  page === transactionData?.pagination?.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (page === transactionData?.pagination?.totalPages) {
                    return;
                  }
                  setPage(page + 1);
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

const scheduleHint = (rows: Transaction[]) => {
  if (!rows.length) {
    return "";
  }
  const recurring = rows.filter((row) => row.isRecurring).length;
  return recurring
    ? `${recurring} recurring on this page. `
    : "";
};

export default AccountTransaction;
