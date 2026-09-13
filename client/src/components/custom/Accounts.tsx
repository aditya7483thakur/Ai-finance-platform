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

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useUserContext } from "@/contexts/userContext";
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
  const { userId } = useUserContext();
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createAccount(
      { ...values, userId: userId as string },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      }
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your account name"
                            {...field}
                            className="border border-black/40"
                          />
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
                            className="border border-black/40"
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
                            className="border border-black/40"
                            type="number"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DrawerFooter className="px-0 flex">
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
                      <Button
                        variant="outline"
                        className="hover:cursor-pointer"
                      >
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
            <h2 className="text-lg font-semibold text-slate-900">Accounts</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-md mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
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
          <h2 className="text-lg font-semibold text-slate-900">Accounts</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="size-4" aria-hidden />
            Add Account
          </Button>
        </div>
        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
            <p className="font-medium text-slate-800">No accounts yet</p>
            <p className="mt-1 text-sm text-slate-500">
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
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                  "flex flex-col rounded-xl border bg-white p-4 cursor-pointer transition-colors",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-slate-200 hover:border-primary/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="truncate font-semibold text-slate-900">
                      {account.name}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        balance < 0
                          ? "bg-error/10 text-error"
                          : "bg-success/10 text-success",
                      )}
                    >
                      {balance < 0 ? "Overdrawn" : "Healthy"}
                    </span>
                    <button
                      type="button"
                      className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Edit ${account.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingAccount(account);
                      }}
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Current balance
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-2xl font-semibold leading-none",
                      balanceToneClass(balance),
                    )}
                  >
                    {formatMoney(balance)}
                  </p>
                </div>

                <div className="mt-4 space-y-1.5">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Monthly budget
                  </p>
                  <p className="text-sm text-slate-700">
                    {hasBudget
                      ? `${formatMoney(used)} spent of ${formatMoney(budget)}`
                      : "No budget set"}
                  </p>
                  {hasBudget && (
                    <>
                      <Progress value={budgetPercent} className="h-1.5" />
                      <p className="text-xs text-slate-500">
                        {Math.round(budgetPercent)}% used
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-3 text-left text-sm text-primary hover:text-primary/80"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/dashboard/transactions/${account.id}`);
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
