import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateTransaction,
  useEditTransaction,
  useScanReceipt,
} from "@/services/transactions/mutation";
import { useUserContext } from "@/contexts/userContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllAccounts } from "@/services/accounts/query";
import { AccountType } from "@/types";
import { useEffect, useRef } from "react";

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
      { required_error: "Category is required" }
    ),

    isRecurring: z.boolean(),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
    date: z.string().nonempty("Date is required"),
    description: z.string().optional(),
    accountId: z.string({
      required_error: "Please select an email to display.",
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

const AddTransaction = () => {
  const location = useLocation();
  const isEdit = location.state?.mode === "edit";
  const transaction = location.state?.transaction;
  const { userId } = useUserContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isRecurring: false,
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

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    if (isEdit) {
      console.log({ ...data, userId });
      editTransaction(
        { ...data, userId, transactionId: transaction.id },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
        }
      );
    } else {
      createTransaction(
        { ...data, userId },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
        }
      );
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    scanReceipt(file, {
      onSuccess: (data) => {
        console.log("Parsed receipt data:", data);
        if (data.amount) form.setValue("amount", data.amount);
        if (data.type) form.setValue("type", data.type);
        if (data.category) form.setValue("category", data.category);
        if (data.date) form.setValue("date", data.date);
        if (data.description) form.setValue("description", data.description);
      },
    });
  };

  useEffect(() => {
    if (!transaction) return;

    // Wait for form to initialize fully before setting
    setTimeout(() => {
      form.setValue("amount", transaction.amount || "");
      form.setValue("type", transaction.type || "");
      form.setValue("category", transaction.category || "");
      form.setValue("date", transaction.date || "");
      form.setValue("description", transaction.description || "");
      if (transaction.recurringInterval)
        form.setValue("recurringInterval", transaction.recurringInterval);
      form.setValue("isRecurring", transaction.isRecurring || false);
      form.setValue("accountId", transaction.accountId || "");
    }, 0);
  }, [isEdit, transaction]);

  return (
    <div className=" flex justify-center p-4 px-20 bg-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-1/2"
        >
          <label
            className={`w-full mb-6 flex items-center justify-center gap-2 text-white py-2 rounded-md transition-colors duration-200
    ${
      isScanning || isEdit
        ? "bg-pink-400 cursor-not-allowed"
        : "bg-pink-500 hover:bg-pink-600 cursor-pointer"
    }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scanning Receipt...</span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                <span>Scan Receipt with AI</span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={isScanning || isEdit}
            />
          </label>

          {/* Amount and Account (2-column layout) */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} type="number" />
                  </FormControl>
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        disabled={accountsLoading || isError || isEdit}
                        value={field.value}
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
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
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
                      ].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">INCOME</SelectItem>
                      <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "MMMM do, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined} // Convert string to Date for `selected`
                      onSelect={(date) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Recurring Interval */}
          {form.watch("isRecurring") && (
            <FormField
              control={form.control}
              name="recurringInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Interval</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        disabled={!form.watch("isRecurring")}
                      >
                        <SelectValue placeholder="Select recurring interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAILY">DAILY</SelectItem>
                      <SelectItem value="WEEKLY">WEEKLY</SelectItem>
                      <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                      <SelectItem value="YEARLY">YEARLY</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          {/* Recurring Transaction */}
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Recurring Transaction
                  </FormLabel>
                  <FormDescription>
                    Set up a recurring schedule for this transaction
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-between pt-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={creatingTransaction || editingTransaction}
            >
              {creatingTransaction ||
                (editingTransaction && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ))}
              {isEdit ? "Update" : "Create"} Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddTransaction;
