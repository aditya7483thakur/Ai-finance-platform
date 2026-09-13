import { Calendar, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import { format, isSameDay, subDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateTransaction,
  useEditTransaction,
  useScanReceipt,
} from "@/services/transactions/mutation";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllAccounts } from "@/services/accounts/query";
import { AccountType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";

export const formSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "Type is required",
    }),
    amount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount")
      .transform(Number),

    category: z.enum(
      [
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
      ],
      { required_error: "Category is required" },
    ),

    isRecurring: z.boolean(),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
    date: z.string().nonempty("Date is required"),
    description: z.string().optional(),
    accountId: z.string({
      required_error: "Please select an account.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
  });

type ExtractedReceipt = {
  amount?: string;
  category?: string;
  date?: string;
};

const toFormDate = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`).toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

const formatDateButton = (value: string) => {
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) {
    return "Select date";
  }

  if (isSameDay(selected, new Date())) {
    return `Today · ${format(selected, "MMM d")}`;
  }

  if (isSameDay(selected, subDays(new Date(), 1))) {
    return `Yesterday · ${format(selected, "MMM d")}`;
  }

  return format(selected, "MMM d, yyyy");
};

const AddTransaction = () => {
  const location = useLocation();
  const isEdit = location.state?.mode === "edit";
  const transaction = location.state?.transaction;
  const { userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isRecurring: false,
      type: "EXPENSE",
      date: new Date().toISOString(),
      description: "",
    },
  });
  const {
    data: accounts,
    isPending: accountsLoading,
    isError,
  } = useGetAllAccounts(userId);

  const { mutate: scanReceipt, isPending: isScanning } = useScanReceipt();
  const { mutate: createTransaction, isPending: creatingTransaction } =
    useCreateTransaction();
  const { mutate: editTransaction, isPending: editingTransaction } =
    useEditTransaction();
  const isSaving = creatingTransaction || editingTransaction;
  const isRecurring = form.watch("isRecurring");
  const selectedDate = form.watch("date");

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    if (isEdit) {
      editTransaction(
        { ...data, userId, transactionId: transaction.id },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
        },
      );
    } else {
      createTransaction(
        { ...data, userId },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
        },
      );
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    scanReceipt(file, {
      onSuccess: (response) => {
        const parsed = response?.data ?? response;
        if (!parsed || typeof parsed !== "object") {
          return;
        }

        const nextExtracted: ExtractedReceipt = {};

        if (parsed.amount != null) {
          const amount = String(parsed.amount);
          form.setValue("amount", amount as never, { shouldValidate: true });
          nextExtracted.amount = amount;
        }
        if (parsed.type) {
          form.setValue("type", parsed.type, { shouldValidate: true });
        }
        if (parsed.category) {
          const category = String(parsed.category).toUpperCase();
          form.setValue("category", category as never, { shouldValidate: true });
          nextExtracted.category = category;
        }
        if (parsed.date) {
          const date = toFormDate(String(parsed.date));
          form.setValue("date", date, { shouldValidate: true });
          nextExtracted.date = date;
        }
        if (parsed.description) {
          form.setValue("description", parsed.description, {
            shouldValidate: true,
          });
        }

        setExtracted(
          nextExtracted.amount || nextExtracted.category || nextExtracted.date
            ? nextExtracted
            : null,
        );
      },
    });

    e.target.value = "";
  };

  useEffect(() => {
    if (!transaction) return;

    setTimeout(() => {
      form.setValue("amount", transaction.amount || "");
      form.setValue("type", transaction.type || "EXPENSE");
      form.setValue("category", transaction.category || "");
      form.setValue("date", transaction.date || new Date().toISOString());
      form.setValue("description", transaction.description || "");
      if (transaction.recurringInterval) {
        form.setValue("recurringInterval", transaction.recurringInterval);
      }
      form.setValue("isRecurring", transaction.isRecurring || false);
      form.setValue("accountId", transaction.accountId || "");
    }, 0);
  }, [isEdit, transaction, form]);

  return (
    <div className="flex justify-center bg-slate-50 px-4 py-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-8"
        >
          <header>
            <h2 className="text-2xl font-semibold text-slate-900">
              {isEdit ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Update the details for this income or expense."
                : "Record an income or expense for one of your accounts."}
            </p>
          </header>

          {!isEdit && (
            <section className="rounded-xl border border-accent/20 bg-accent/10 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 text-accent" aria-hidden />
                  <div>
                    <h3 className="text-sm font-semibold text-accent">
                      Scan Receipt with AI
                    </h3>
                    <p className="mt-1 text-xs text-accent/80">
                      Upload or scan a receipt and Budgetly will extract the
                      transaction details for you.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isScanning}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isScanning ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="size-4" aria-hidden />
                  )}
                  {isScanning ? "Scanning receipt..." : "Scan Receipt"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={isScanning}
                />
              </div>
            </section>
          )}

          {extracted && (
            <div className="rounded-xl border border-accent/20 bg-white px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
                <Sparkles className="size-3.5" aria-hidden />
                Extracted from receipt
              </p>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                {extracted.amount && (
                  <div>
                    <dt className="text-xs text-slate-500">Amount</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">
                      {formatMoney(extracted.amount)}
                    </dd>
                  </div>
                )}
                {extracted.category && (
                  <div>
                    <dt className="text-xs text-slate-500">Category</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">
                      {getCategoryLabel(extracted.category)}
                    </dd>
                  </div>
                )}
                {extracted.date && (
                  <div>
                    <dt className="text-xs text-slate-500">Date</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">
                      {format(new Date(extracted.date), "MMM d")}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-slate-500">
                Review and edit these values before you submit.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                        $
                      </span>
                      <Input
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        className="h-14 pl-8 text-3xl font-semibold tracking-tight"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        disabled={accountsLoading || isError || isEdit}
                      >
                        <SelectValue
                          placeholder={
                            accountsLoading
                              ? "Loading accounts..."
                              : isError
                                ? "Failed to load accounts"
                                : "Select account"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.data?.map((item: AccountType) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <span className="flex items-center gap-2">
                            <item.icon className="size-4 text-slate-500" />
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <div
                      role="radiogroup"
                      aria-label="Transaction type"
                      className="grid grid-cols-2 gap-2"
                      onKeyDown={(event) => {
                        if (
                          event.key === "ArrowRight" ||
                          event.key === "ArrowLeft"
                        ) {
                          event.preventDefault();
                          field.onChange(
                            field.value === "EXPENSE" ? "INCOME" : "EXPENSE",
                          );
                        }
                      }}
                    >
                      {(
                        [
                          { value: "EXPENSE", label: "Expense" },
                          { value: "INCOME", label: "Income" },
                        ] as const
                      ).map((option) => {
                        const selected = field.value === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              option.value === "EXPENSE" &&
                                selected &&
                                "border-error/40 bg-error/10 text-error",
                              option.value === "INCOME" &&
                                selected &&
                                "border-success/40 bg-success/10 text-success",
                              !selected &&
                                "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal sm:max-w-xs"
                        >
                          {field.value
                            ? formatDateButton(field.value)
                            : "Select date"}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.onChange(new Date().toISOString())}
                    >
                      Today
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        field.onChange(subDays(new Date(), 1).toISOString())
                      }
                    >
                      Yesterday
                    </Button>
                  </div>
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
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  Add a note to help identify this transaction later.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="What was this transaction for?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-medium text-slate-900">
                      Recurring Transaction
                    </FormLabel>
                    <FormDescription>
                      Automatically repeat this transaction on a schedule.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked && !form.getValues("recurringInterval")) {
                          form.setValue("recurringInterval", "MONTHLY");
                        }
                      }}
                    />
                  </FormControl>
                </div>

                {isRecurring && (
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="recurringInterval"
                      render={({ field: intervalField }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={intervalField.onChange}
                            value={intervalField.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DAILY">Daily</SelectItem>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                              <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Starts
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {selectedDate
                          ? formatDateButton(selectedDate)
                          : "Transaction date"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Ends</p>
                      <p className="mt-2 text-sm text-slate-600">Never</p>
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden />
              )}
              {isSaving
                ? isEdit
                  ? "Updating transaction..."
                  : "Creating transaction..."
                : isEdit
                  ? "Update Transaction"
                  : "Create Transaction"}
            </Button>
          </div>

          {!isEdit && (
            <p className="text-sm text-slate-500">
              Need help?{" "}
              <button
                type="button"
                onClick={() =>
                  openAsk("Add a $200 food expense yesterday")
                }
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Sparkles className="size-3.5" aria-hidden />
                Ask Budgetly to create this transaction
              </button>
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddTransaction;
