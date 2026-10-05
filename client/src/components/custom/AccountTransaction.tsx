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
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import { useDeleteTransaction } from "@/services/transactions/mutation";
import { Checkbox } from "../ui/checkbox";
import { formatShortDate, formatSignedMoney } from "@/lib/money";
import {
  getCategory,
  getCategoryBadge,
  getCategoryLabel,
} from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type TransactionListFilters = {
  accountId?: string;
  description?: string;
  type?: "ALL" | "INCOME" | "EXPENSE";
  category?: string;
  isRecurring?: "ALL" | "true" | "false";
  startDate?: string;
  endDate?: string;
};

const PAGE_SIZE = 10;

const AccountTransaction = ({
  accounts,
  listFilters,
  enabled,
  selectedTransactions,
  setSelectedTransactions,
}: {
  accounts: AccountType[];
  listFilters: TransactionListFilters;
  enabled: boolean;
  // Selection is owned by the page so bulk actions can live in its toolbar.
  selectedTransactions: Set<string>;
  setSelectedTransactions: Dispatch<SetStateAction<Set<string>>>;
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const queryFilters = { ...listFilters, page, limit: PAGE_SIZE };
  const { mutate: deleteTransaction, isPending: deleting } =
    useDeleteTransaction();
  const { data: transactionData, isPending } = useFilteredTransactions(
    queryFilters,
    { enabled },
  );

  useEffect(() => {
    setPage(1);
    setSelectedTransactions(new Set());
  }, [
    listFilters.accountId,
    listFilters.category,
    listFilters.description,
    listFilters.endDate,
    listFilters.isRecurring,
    listFilters.startDate,
    listFilters.type,
    setSelectedTransactions,
  ]);

  const rows: Transaction[] = transactionData?.data ?? [];
  const pagination = transactionData?.pagination;
  const rangeStart = pagination
    ? (pagination.currentPage - 1) * pagination.pageSize + 1
    : 0;
  const rangeEnd = pagination ? rangeStart + rows.length - 1 : 0;
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
              <TableHead>Transaction</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              // Skeleton rows mirror the real columns so the table doesn't jump on load.
              [...Array(PAGE_SIZE)].map((_, index) => (
                <TableRow key={index} aria-hidden>
                  <TableCell>
                    <Skeleton className="size-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 shrink-0 rounded-lg" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto size-4 rounded" />
                  </TableCell>
                </TableRow>
              ))
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
                    <TableCell className="max-w-[320px]">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            getCategoryBadge(transaction.category),
                          )}
                          aria-hidden
                        >
                          {Icon && <Icon className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          {transaction.description ? (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="truncate text-sm font-medium text-foreground">
                                      {transaction.description}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-72 text-center">
                                    <p>{transaction.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <p className="truncate text-xs text-muted-foreground">
                                {getCategoryLabel(transaction.category)}
                              </p>
                            </>
                          ) : (
                            // No description: show the category once instead of repeating it.
                            <p className="truncate text-sm font-medium text-foreground">
                              {getCategoryLabel(transaction.category)}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {accountName(transaction.accountId)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-sm font-semibold whitespace-nowrap",
                        transaction.type === "INCOME"
                          ? "text-success"
                          : "text-foreground",
                      )}
                    >
                      {formatSignedMoney(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="text-right">
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
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalTransactions > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {scheduleHint(rows)}
            Showing {rangeStart}–{rangeEnd} of {pagination.totalTransactions}{" "}
            transaction{pagination.totalTransactions === 1 ? "" : "s"}
          </p>
          {pagination.totalPages > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    to="#"
                    aria-disabled={!pagination.hasPrevPage}
                    tabIndex={pagination.hasPrevPage ? undefined : -1}
                    className={
                      pagination.hasPrevPage
                        ? ""
                        : "pointer-events-none opacity-30"
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (pagination.hasPrevPage) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    to="#"
                    aria-disabled={!pagination.hasNextPage}
                    tabIndex={pagination.hasNextPage ? undefined : -1}
                    className={
                      pagination.hasNextPage
                        ? ""
                        : "pointer-events-none opacity-30"
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (pagination.hasNextPage) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

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
