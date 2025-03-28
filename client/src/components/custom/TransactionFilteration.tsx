import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Search } from "lucide-react";

const TransactionCategory = [
  "ALL",
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

export const formSchema = z.object({
  description: z.string().optional(),
  type: z.enum(["ALL", "INCOME", "EXPENSE"]),
  category: z.enum(TransactionCategory),
  isRecurring: z.enum(["ALL", "true", "false"]),
});

type TransactionFilterData = z.infer<typeof formSchema>;

const TransactionFilteration = ({
  onSubmit,
  searching,
}: {
  onSubmit: (data: TransactionFilterData) => void;
  searching: boolean;
}) => {
  const form = useForm<TransactionFilterData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "", // Matches schema
      type: "ALL", // Ensure it matches `z.enum`
      category: "ALL", // Must be a valid category
      isRecurring: "ALL",
    },
  });
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="gap-2 flex justify-between flex-wrap"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-96 relative">
                <FormControl>
                  <div className="relative">
                    {/* Search Icon */}
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

                    {/* Input Field */}
                    <Input
                      placeholder="Search here..."
                      {...field}
                      className="pl-10" // Add left padding for icon
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">BOTH</SelectItem>
                    <SelectItem value="INCOME">INCOME</SelectItem>
                    <SelectItem value="EXPENSE">EXPENSE</SelectItem>
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
                {/* <FormLabel>Email</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TransactionCategory.map((item: string) => (
                      <SelectItem key={item} value={item}>
                        {item}
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
            name="isRecurring"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Select Recurrence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">BOTH</SelectItem>
                    <SelectItem value="true">RECURRING</SelectItem>
                    <SelectItem value="false">NON-RECURRING</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={searching}>
            {searching && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Search
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TransactionFilteration;
