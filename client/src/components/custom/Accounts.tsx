import { balanceToneClass, formatMoney, toAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { AccountType } from "@/types";
import { Loader2, Pencil, Plus, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "../ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { dashControl } from "@/lib/dashboard-chrome";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useCreateAccount, useUpdateAccount } from "@/services/accounts/mutation";
import { useEffect, useState } from "react";

interface props {
  accounts: AccountType[];
  accountsLoading: boolean;
  selectedAccountId?: string | null;
  onAccountClick: (account: AccountType) => void;
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Account name must be at least 3 characters.",
  }),
  balance: z.string().min(1, {
    message: "Balance can't be empty.",
  }),
  budget: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(3, {
    message: "Account name must be at least 3 characters.",
  }),
  budget: z.string().optional(),
});

const Accounts = ({
  accounts,
  accountsLoading,
  selectedAccountId,
  onAccountClick,
  createOpen,
  onCreateOpenChange,
}: props) => {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isOpen = createOpen ?? internalOpen;
  const setIsOpen = onCreateOpenChange ?? setInternalOpen;
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(
    null,
  );
  const { mutate: createAccount, isPending: creatingAccount } =
    useCreateAccount();
  const { mutate: updateAccount, isPending: updatingAccount } =
    useUpdateAccount();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      balance: "",
      budget: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAccount(
      { ...values },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      },
    );
  }

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: "",
      budget: "",
    },
  });

  useEffect(() => {
    if (!editingAccount) {
      return;
    }

    updateForm.setValue("name", editingAccount.name);
    updateForm.setValue(
      "budget",
      editingAccount.budget == null ? "" : String(editingAccount.budget),
    );
  }, [editingAccount, updateForm]);

  function onUpdate(values: z.infer<typeof updateSchema>) {
    if (!editingAccount) {
      return;
    }

    updateAccount(
      { ...values, id: editingAccount.id },
      {
        onSuccess: () => {
          setEditingAccount(null);
        },
      },
    );
  }

  const accountForm = (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="px-6 backdrop-blur-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
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
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening balance</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your account balance"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your budget"
                      {...field}
                      type="number"
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
                className="hover:cursor-pointer"
              >
                {creatingAccount && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {creatingAccount ? "Creating..." : " Create Account"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="hover:cursor-pointer">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );

  if (accountsLoading) {
    return (
      <>
        <section id="accounts" className="scroll-mt-24">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Your Accounts
              </h2>
              <p className="text-xs text-muted-foreground">Loading accounts</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="min-w-[220px] rounded-xl border border-border bg-background p-4"
              >
                <Skeleton className="mb-4 h-4 w-24" />
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </section>
        {accountForm}
      </>
    );
  }

  return (
    <>
      <section id="accounts" className="scroll-mt-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Your Accounts
            </h2>
            <p className="text-xs text-muted-foreground">
              {accounts.length} account{accounts.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={dashControl}
            onClick={() => setIsOpen(true)}
          >
            <Plus className="size-4" aria-hidden />
            Add Account
          </Button>
        </div>
        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
            <p className="font-medium text-foreground">No accounts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a financial workspace to start tracking balances and
              budgets.
            </p>
            <Button
              type="button"
              size="sm"
              className="mt-4"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="size-4" aria-hidden />
              Add Account
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {accounts?.map((account) => {
              const balance = toAmount(account.balance);
              const budget = toAmount(account.budget);
              const used = toAmount(account.usedAmount);
              const hasBudget = Boolean(account.budget);
              const budgetPercent = hasBudget
                ? Math.min(100, (used / budget) * 100)
                : 0;
              const isSelected = selectedAccountId === account.id;

              return (
                <div
                  key={account.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onAccountClick(account)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onAccountClick(account);
                    }
                  }}
                  className={cn(
                    "flex min-w-[220px] flex-1 cursor-pointer flex-col rounded-xl border bg-background p-4 transition-colors",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="shrink-0 rounded-lg bg-primary/10 p-2">
                        <Wallet className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                          {account.name}
                        </h3>
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            balance < 0 ? "text-error" : "text-success",
                          )}
                        >
                          {balance < 0 ? "Overdrawn" : "Healthy"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Edit ${account.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingAccount(account);
                      }}
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>

                  <p
                    className={cn(
                      "mt-4 text-xl font-semibold leading-none",
                      balanceToneClass(balance),
                    )}
                  >
                    {formatMoney(balance)}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs text-muted-foreground">
                      {hasBudget
                        ? `${formatMoney(used)} of ${formatMoney(budget)} used`
                        : "No budget set"}
                    </p>
                    {hasBudget && (
                      <Progress value={budgetPercent} className="h-1.5" />
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-3 text-left text-sm text-primary hover:text-primary/80"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/dashboard/transactions?accountId=${account.id}`);
                    }}
                  >
                    Transactions →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {accountForm}

      <Dialog
        open={Boolean(editingAccount)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAccount(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update account</DialogTitle>
            <DialogDescription>
              Change the name or monthly budget. Opening balance is not edited
              here.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdate)}
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
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updatingAccount}>
                {updatingAccount && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {updatingAccount ? "Updating..." : "Update account"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Accounts;
