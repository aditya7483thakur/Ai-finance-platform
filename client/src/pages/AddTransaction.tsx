import { Calendar } from "lucide-react";
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
import { TransactionSchema } from "@/lib/schema";

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isRecurring: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(data);
  };

  return (
    <div className=" flex justify-center p-4 px-20 bg-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-1/2"
        >
          <label className="w-full bg-pink-500 hover:bg-pink-600 mb-6 flex items-center justify-center gap-2 text-white py-2 rounded-md cursor-pointer">
            <Calendar className="h-4 w-4" />
            <span>Scan Receipt with AI</span>
            <input type="file" accept="image/*" className="hidden" />
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal ($152124.40)">
                        personal ($152124.40)
                      </SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="checking">Checking</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            >
              Create Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddTransaction;
