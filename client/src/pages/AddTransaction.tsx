import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isSameDay,
  subDays,
} from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Repeat,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import ReceiptScanner, {
  type ExtractedReceipt,
} from "@/components/custom/ReceiptScanner";
import TransactionImpact from "@/components/custom/TransactionImpact";
import {
  useCreateTransaction,
  useEditTransaction,
} from "@/services/transactions/mutation";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useGetAllAccounts } from "@/services/accounts/query";
import { AccountType, Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { formatMoney, toAmount } from "@/lib/money";
import { CATEGORIES } from "@/lib/categories";

const CATEGORY_VALUES = [
  "SALARY",
  "INVESTMENTS",
  "FOOD",
  "TRANSPORT",
  "HOUSING",
  "ENTERTAINMENT",
  "TRAVEL",
  "HEALTH",
  "SHOPPING",
  "MISCELLANEOUS",
] as const;

type CategoryValue = (typeof CATEGORY_VALUES)[number];
type IntervalValue = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

const formSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "Type is required",
    }),
    amount: z
      .string()
      .min(1, "Enter an amount")
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount, like 12.50")
      .refine((value) => Number(value) > 0, "Amount must be more than zero")
      .transform(Number),
    category: z.enum(CATEGORY_VALUES, {
      required_error: "Pick a category",
      invalid_type_error: "Pick a category",
    }),
    isRecurring: z.boolean(),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
    date: z.string().nonempty("Date is required"),
    description: z.string().optional(),
    accountId: z
      .string({ required_error: "Pick an account" })
      .min(1, "Pick an account"),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose how often it repeats",
        path: ["recurringInterval"],
      });
    }
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const INTERVALS: { value: IntervalValue; label: string; unit: string }[] = [
  { value: "DAILY", label: "Daily", unit: "day" },
  { value: "WEEKLY", label: "Weekly", unit: "week" },
  { value: "MONTHLY", label: "Monthly", unit: "month" },
  { value: "YEARLY", label: "Yearly", unit: "year" },
];

// Same rule as server/domains/transaction/transaction.helper.ts.
const nextOccurrence = (date: Date, interval: IntervalValue) =>
  interval === "DAILY"
    ? addDays(date, 1)
    : interval === "WEEKLY"
      ? addWeeks(date, 1)
      : interval === "MONTHLY"
        ? addMonths(date, 1)
        : addYears(date, 1);

const toFormDate = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`).toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

// Keep only digits and a single dot with at most two decimals.
const sanitizeAmount = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-4 border-t border-white/6 px-5 py-5 sm:px-6">
    <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {title}
    </h3>
    {children}
  </section>
);

const AddTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.state?.mode === "edit";
  const transaction: Transaction | undefined = location.state?.transaction;
  const { userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    // The schema turns the amount string into a number on submit.
    resolver: zodResolver(formSchema) as unknown as Resolver<FormInput>,
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      isRecurring: false,
      date: new Date().toISOString(),
      description: "",
      accountId: "",
    },
  });

  const {
    data: accounts,
    isPending: accountsLoading,
    isError,
  } = useGetAllAccounts(userId);
  const accountList = useMemo(
    () => (accounts?.data ?? []) as AccountType[],
    [accounts?.data],
  );

  const { mutate: createTransaction, isPending: creatingTransaction } =
    useCreateTransaction();
  const { mutate: editTransaction, isPending: editingTransaction } =
    useEditTransaction();
  const isSaving = creatingTransaction || editingTransaction;

  const [type, amountRaw, accountId, date, isRecurring, interval] = useWatch({
    control: form.control,
    name: [
      "type",
      "amount",
      "accountId",
      "date",
      "isRecurring",
      "recurringInterval",
    ],
  });
  const amount =
    /^\d+(\.\d{1,2})?$/.test(amountRaw ?? "") && Number(amountRaw) > 0
      ? Number(amountRaw)
      : null;
  const selectedAccount = accountList.find((item) => item.id === accountId);
  const selectedDate = date ? new Date(date) : undefined;

  // Prefill when editing or duplicating.
  useEffect(() => {
    if (!transaction) return;
    form.reset({
      type: transaction.type ?? "EXPENSE",
      amount: String(Math.abs(toAmount(transaction.amount))),
      category: transaction.category as CategoryValue,
      date: transaction.date
        ? new Date(transaction.date).toISOString()
        : new Date().toISOString(),
      description: transaction.description ?? "",
      isRecurring: Boolean(transaction.isRecurring),
      recurringInterval: transaction.recurringInterval,
      accountId: transaction.accountId ?? "",
    });
  }, [transaction, form]);

  // With a single account there is nothing to choose.
  useEffect(() => {
    if (accountList.length === 1 && !form.getValues("accountId")) {
      form.setValue("accountId", accountList[0].id, { shouldValidate: false });
    }
  }, [accountList, form]);

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard/transactions");
    }
  };

  const onSubmit = (data: FormOutput) => {
    const payload = {
      ...data,
      recurringInterval: data.isRecurring ? data.recurringInterval : undefined,
    };
    if (isEdit && transaction) {
      editTransaction(
        { ...payload, transactionId: transaction.id },
        { onSuccess: goBack },
      );
    } else {
      createTransaction(payload, { onSuccess: goBack });
    }
  };

  const setType = (next: "INCOME" | "EXPENSE") => {
    form.setValue("type", next, { shouldDirty: true });
  };

  const applyReceipt = (parsed: Record<string, unknown> | null) => {
    if (!parsed) {
      toast.error("Couldn't read that receipt. Try a clearer photo.");
      setExtracted(null);
      return;
    }
    const next: ExtractedReceipt = {};
    if (parsed.type === "INCOME" || parsed.type === "EXPENSE") {
      setType(parsed.type);
    }
    if (parsed.amount != null) {
      const value = sanitizeAmount(String(parsed.amount));
      form.setValue("amount", value, { shouldValidate: true });
      next.amount = value;
    }
    if (parsed.category) {
      const value = String(parsed.category).toUpperCase();
      if ((CATEGORY_VALUES as readonly string[]).includes(value)) {
        form.setValue("category", value as CategoryValue, {
          shouldValidate: true,
        });
        next.category = value;
      }
    }
    if (parsed.date) {
      const value = toFormDate(String(parsed.date));
      form.setValue("date", value, { shouldValidate: true });
      next.date = value;
    }
    if (parsed.description) {
      form.setValue("description", String(parsed.description));
      next.description = String(parsed.description);
    }
    setExtracted(Object.keys(next).length ? next : null);
  };

  const submitLabel = isEdit
    ? "Save changes"
    : `Add ${type === "INCOME" ? "income" : "expense"}${
        amount != null ? ` · ${formatMoney(amount)}` : ""
      }`;

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-6 lg:px-6">
        <header className="space-y-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {isEdit
                ? "Edit transaction"
                : transaction
                  ? "Duplicate transaction"
                  : "Add transaction"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEdit
                ? "Update the details. The account balance adjusts automatically."
                : "Record income or spending, or scan a receipt to fill this in."}
            </p>
          </div>
        </header>

        <div
          className={cn(
            "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]",
            isEdit ? "lg:grid-rows-[auto_1fr]" : "lg:grid-rows-[auto_auto_1fr]",
          )}
        >
          {!isEdit && (
            <div className="lg:col-start-2 lg:row-start-1">
              <ReceiptScanner extracted={extracted} onResult={applyReceipt} />
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className={cn(
                "overflow-hidden rounded-2xl border border-border bg-card lg:col-start-1 lg:row-start-1",
                isEdit ? "lg:row-span-2" : "lg:row-span-3",
              )}
            >
              {/* Type + amount */}
              <div className="space-y-5 px-5 py-6 sm:px-6">
                <div
                  role="radiogroup"
                  aria-label="Transaction type"
                  className="grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1"
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowLeft"
                    ) {
                      event.preventDefault();
                      setType(type === "EXPENSE" ? "INCOME" : "EXPENSE");
                    }
                  }}
                >
                  {(
                    [
                      {
                        value: "EXPENSE",
                        label: "Expense",
                        icon: TrendingDown,
                      },
                      { value: "INCOME", label: "Income", icon: TrendingUp },
                    ] as const
                  ).map((option) => {
                    const selected = type === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setType(option.value)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          selected
                            ? option.value === "INCOME"
                              ? "bg-success/15 text-success ring-1 ring-success/30"
                              : "bg-white/[0.12] text-foreground ring-1 ring-white/20"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <option.icon className="size-4" aria-hidden />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <div className="relative">
                        <span
                          className={cn(
                            "pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xl font-semibold",
                            type === "INCOME"
                              ? "text-success"
                              : "text-muted-foreground",
                          )}
                          aria-hidden
                        >
                          {type === "INCOME" ? "+$" : "$"}
                        </span>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) =>
                              field.onChange(sanitizeAmount(event.target.value))
                            }
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="0.00"
                            autoFocus={!isEdit && !transaction}
                            className={cn(
                              "h-14 pr-4 text-3xl font-semibold tracking-tight tabular-nums md:text-3xl",
                              type === "INCOME" ? "pl-12" : "pl-9",
                            )}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Section title="Details">
                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="h-10 w-full"
                              disabled={accountsLoading || isError || isEdit}
                            >
                              <SelectValue
                                placeholder={
                                  accountsLoading
                                    ? "Loading accounts..."
                                    : isError
                                      ? "Failed to load accounts"
                                      : accountList.length === 0
                                        ? "Create an account first"
                                        : "Select account"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountList.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <span className="flex w-full items-center justify-between gap-6">
                                  {item.name}
                                  <span
                                    className={cn(
                                      "text-xs tabular-nums",
                                      toAmount(item.balance) < 0
                                        ? "text-error"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {formatMoney(item.balance)}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isEdit && (
                          <p className="text-xs text-muted-foreground">
                            The account can't be changed on an existing
                            transaction.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <span className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "flex size-5 items-center justify-center rounded-md",
                                      item.badge,
                                    )}
                                  >
                                    <item.icon className="size-3" aria-hidden />
                                  </span>
                                  {item.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <div className="flex flex-wrap items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-10 min-w-0 flex-1 justify-start bg-transparent font-normal sm:max-w-xs"
                              >
                                <CalendarDays
                                  className="size-4 text-muted-foreground"
                                  aria-hidden
                                />
                                {selectedDate
                                  ? format(selectedDate, "EEE, MMM d, yyyy")
                                  : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              defaultMonth={selectedDate}
                              onSelect={(value) =>
                                value && field.onChange(value.toISOString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {[
                          { label: "Today", value: new Date() },
                          { label: "Yesterday", value: subDays(new Date(), 1) },
                        ].map((preset) => {
                          const active = Boolean(
                            selectedDate &&
                            isSameDay(selectedDate, preset.value),
                          );
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              aria-pressed={active}
                              onClick={() =>
                                field.onChange(preset.value.toISOString())
                              }
                              className={cn(
                                "h-10 rounded-lg border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                active
                                  ? "border-primary/50 bg-primary/10 text-foreground"
                                  : "border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground",
                              )}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            type === "INCOME"
                              ? "e.g. October salary"
                              : "e.g. Groceries at Whole Foods"
                          }
                          className="h-10"
                          maxLength={120}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section title="Schedule">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                            <Repeat className="size-4" aria-hidden />
                          </span>
                          <div>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Repeat this transaction
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Budgetly posts it for you on schedule, like rent
                              or a salary.
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (
                                checked &&
                                !form.getValues("recurringInterval")
                              ) {
                                form.setValue("recurringInterval", "MONTHLY");
                              }
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {isRecurring && (
                  <FormField
                    control={form.control}
                    name="recurringInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Frequency</FormLabel>
                        <FormControl>
                          <div
                            role="radiogroup"
                            aria-label="Frequency"
                            className="grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1 sm:grid-cols-4"
                          >
                            {INTERVALS.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={field.value === option.value}
                                onClick={() => field.onChange(option.value)}
                                className={cn(
                                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                  field.value === option.value
                                    ? "bg-white/10 text-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        {selectedDate && interval && (
                          <p className="text-xs text-muted-foreground">
                            Starts {format(selectedDate, "MMM d")}, next on{" "}
                            <span className="text-foreground">
                              {format(
                                nextOccurrence(selectedDate, interval),
                                "MMM d, yyyy",
                              )}
                            </span>
                            , then every{" "}
                            {
                              INTERVALS.find((item) => item.value === interval)
                                ?.unit
                            }
                            . Turn it off any time by editing it.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </Section>

              <div className="flex flex-col-reverse gap-3 border-t border-white/6 bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 min-w-44 px-5"
                >
                  {isSaving && (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  )}
                  {isSaving ? "Saving..." : submitLabel}
                </Button>
              </div>
            </form>
          </Form>

          <div
            className={cn(
              "lg:col-start-2",
              isEdit ? "lg:row-start-1" : "lg:row-start-2",
            )}
          >
            <TransactionImpact
              account={selectedAccount}
              type={type}
              amount={amount}
              original={isEdit ? transaction : null}
            />
          </div>

          {!isEdit && (
            <div className="self-start lg:col-start-2 lg:row-start-3">
              <button
                type="button"
                onClick={() => openAsk("Add a $20 food expense yesterday")}
                className="flex w-full items-start gap-3 rounded-2xl border border-white/8 p-4 text-left transition-colors hover:border-accent/30 hover:bg-accent/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Rather just say it?
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Tell Ask Budgetly "Add a $20 food expense yesterday" and it
                    drafts the transaction for you to confirm.
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
