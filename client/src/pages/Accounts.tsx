import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowUpRight,
  LayoutGrid,
  List,
  Loader2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { useUserContext } from "@/contexts/userContext";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useCreateAccount, useUpdateAccount } from "@/services/accounts/mutation";
import { AccountType } from "@/types";
import { cn } from "@/lib/utils";
import { formatMoney, toAmount } from "@/lib/money";
import { getAccountHealth } from "@/lib/account-health";
import { dashControl } from "@/lib/dashboard-chrome";
import { transactionsHref } from "@/lib/dashboard-chrome";

import AccountCard, {
  ACCOUNT_ROW_GRID,
  AccountListItem,
} from "@/components/custom/AccountCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TabKey = "all" | "healthy" | "risk";
type SortKey = "name" | "balance" | "budget";
type ViewMode = "grid" | "list";

const createSchema = z.object({
  name: z.string().min(3, { message: "Account name must be at least 3 characters." }),
  balance: z.string().min(1, { message: "Balance can't be empty." }),
  budget: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(3, { message: "Account name must be at least 3 characters." }),
  budget: z.string().optional(),
});

const StatCard = ({
  icon: Icon,
  tone,
  label,
  value,
  hint,
  hintTone,
}: {
  icon: LucideIcon;
  tone: string;
  label: string;
  value: string;
  hint: string;
  hintTone?: string;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          tone,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className={cn("mt-1 text-xs text-muted-foreground", hintTone)}>{hint}</p>
      </div>
    </div>
  </div>
);

const AccountsPage = () => {
  const navigate = useNavigate();
  const { userId } = useUserContext();
  const { data: accounts, isPending: accountsLoading } = useGetAllAccounts(userId);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(null);

  const { mutate: createAccount, isPending: creatingAccount } = useCreateAccount();
  const { mutate: updateAccount, isPending: updatingAccount } = useUpdateAccount();

  const accountList: AccountType[] = (accounts?.data ?? []) as AccountType[];

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", balance: "", budget: "" },
  });

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { name: "", budget: "" },
  });

  useEffect(() => {
    if (!editingAccount) return;
    updateForm.setValue("name", editingAccount.name);
    updateForm.setValue(
      "budget",
      editingAccount.budget == null ? "" : String(editingAccount.budget),
    );
  }, [editingAccount, updateForm]);

  const totals = useMemo(() => {
    return accountList.reduce(
      (summary, account) => {
        const budget = toAmount(account.budget);
        const used = toAmount(account.usedAmount);
        return {
          balance: summary.balance + toAmount(account.balance),
          budget: summary.budget + budget,
          spent: summary.spent + used,
        };
      },
      { balance: 0, budget: 0, spent: 0 },
    );
  }, [accountList]);

  const healthyCount = accountList.filter(
    (account) => getAccountHealth(account).tone === "healthy",
  ).length;
  const riskCount = accountList.length - healthyCount;

  const visibleAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = accountList.filter((account) => {
      const health = getAccountHealth(account).tone;
      if (activeTab === "healthy" && health !== "healthy") return false;
      if (activeTab === "risk" && health === "healthy") return false;
      if (query && !account.name.toLowerCase().includes(query)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === "balance") return toAmount(b.balance) - toAmount(a.balance);
      if (sortKey === "budget") return toAmount(b.budget) - toAmount(a.budget);
      return a.name.localeCompare(b.name);
    });
  }, [accountList, activeTab, search, sortKey]);

  const onSubmitCreate = (values: z.infer<typeof createSchema>) => {
    createAccount(values, {
      onSuccess: () => {
        createForm.reset();
        setCreateOpen(false);
      },
    });
  };

  const onSubmitUpdate = (values: z.infer<typeof updateSchema>) => {
    if (!editingAccount) return;
    updateAccount(
      { ...values, id: editingAccount.id },
      { onSuccess: () => setEditingAccount(null) },
    );
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All Accounts", count: accountList.length },
    { key: "healthy", label: "Healthy", count: healthyCount },
    { key: "risk", label: "At Risk", count: riskCount },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 lg:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Accounts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your accounts, track balances, and stay on top of your budgets.
            </p>
          </div>
          <Button size="sm" className="cursor-pointer" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden />
            Add Account
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Wallet}
            tone="bg-primary/15 text-primary"
            label="Total Balance"
            value={formatMoney(totals.balance)}
            hint={`Across ${accountList.length} account${accountList.length === 1 ? "" : "s"}`}
          />
          <StatCard
            icon={LayoutGrid}
            tone="bg-accent/15 text-accent"
            label="Total Accounts"
            value={String(accountList.length)}
            hint={`${healthyCount} healthy • ${riskCount} at risk`}
          />
          <StatCard
            icon={TrendingUp}
            tone="bg-violet-400/15 text-violet-400"
            label="Total Monthly Budget"
            value={formatMoney(totals.budget)}
            hint={
              totals.budget > 0
                ? `${Math.round((totals.spent / totals.budget) * 100)}% remaining`
                : "No budgets set yet"
            }
          />
          <StatCard
            icon={TriangleAlert}
            tone="bg-error/15 text-error"
            label="Total Spent This Month"
            value={formatMoney(totals.spent)}
            hint={
              totals.budget > 0
                ? `${Math.round((totals.spent / totals.budget) * 100)}% of budget`
                : "No budgets set yet"
            }
          />
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search accounts..."
                className={cn(dashControl, "w-full pl-8 lg:w-56")}
              />
            </div>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
              <SelectTrigger className={cn(dashControl, "w-[150px]")}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by: Name</SelectItem>
                <SelectItem value="balance">Sort by: Balance</SelectItem>
                <SelectItem value="budget">Sort by: Budget</SelectItem>
              </SelectContent>
            </Select>
            <div
              role="group"
              aria-label="Account view"
              className="hidden h-10 items-stretch gap-1 rounded-lg border border-white/10 p-1 sm:flex"
            >
              {(
                [
                  { mode: "grid", icon: LayoutGrid, label: "Card view" },
                  { mode: "list", icon: List, label: "List view" },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-label={label}
                  aria-pressed={viewMode === mode}
                  title={label}
                  className={cn(
                    "flex h-full w-8 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    viewMode === mode
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </section>

        {accountsLoading ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <Skeleton className="mb-4 h-10 w-40" />
                <Skeleton className="mb-3 h-8 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </section>
        ) : viewMode === "list" ? (
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div
              className={cn(
                "hidden border-b border-border px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
                ACCOUNT_ROW_GRID,
              )}
              aria-hidden
            >
              <span>Account</span>
              <span>Status</span>
              <span>Balance</span>
              <span>Budget</span>
              <span>Spent</span>
              <span>Remaining</span>
              <span>Usage</span>
              <span />
            </div>
            <div className="divide-y divide-border">
              {visibleAccounts.map((account) => (
                <AccountListItem
                  key={account.id}
                  account={account}
                  onEdit={setEditingAccount}
                  onViewTransactions={(item) => navigate(transactionsHref(item.id))}
                />
              ))}
              {visibleAccounts.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No accounts match your filters.
                </p>
              )}
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 px-5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.02] hover:text-foreground"
              >
                <Plus className="size-4" aria-hidden />
                Add New Account
              </button>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={setEditingAccount}
                onViewTransactions={(item) => navigate(transactionsHref(item.id))}
              />
            ))}

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 p-5 text-center transition-colors hover:border-primary/40 hover:bg-card"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Plus className="size-5" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-foreground">
                Add New Account
              </span>
              <span className="max-w-[220px] text-xs text-muted-foreground">
                Create a new account to track your spending and budget.
              </span>
              <span className="mt-1 inline-flex h-10 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs font-medium text-foreground">
                <Plus className="size-3.5" aria-hidden />
                Add Account
              </span>
            </button>
          </section>
        )}

        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Pro Tip from Budgetly
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use separate accounts for different goals (e.g., Savings, Travel,
                Shopping) to get more accurate insights and better budget control.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(dashControl, "shrink-0")}
            onClick={() => navigate("/dashboard/ask")}
          >
            Learn more
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Button>
        </section>
      </div>

      <Drawer open={createOpen} onOpenChange={setCreateOpen}>
        <DrawerContent className="px-6 backdrop-blur-0">
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmitCreate)}
              className="space-y-3"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening balance</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your account balance"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your budget"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter className="flex px-0">
                <Button
                  type="submit"
                  disabled={creatingAccount}
                  className="cursor-pointer"
                >
                  {creatingAccount && (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  )}
                  {creatingAccount ? "Creating..." : "Create Account"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>

      <Dialog
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) setEditingAccount(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update account</DialogTitle>
            <DialogDescription>
              Change the name or monthly budget. Opening balance is not edited here.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onSubmitUpdate)}
              className="space-y-3"
            >
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your budget"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updatingAccount} className="cursor-pointer">
                {updatingAccount && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {updatingAccount ? "Updating..." : "Update account"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsPage;
