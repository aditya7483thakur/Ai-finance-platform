import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";

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
  const [showFilters, setShowFilters] = useState(false);
  const form = useForm<TransactionFilterData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      type: "ALL",
      category: "ALL",
      isRecurring: "ALL",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className="space-y-3"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="min-w-0 flex-1">
                <FormLabel>Search transactions</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions"
                      {...field}
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters((open) => !open)}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
          </Button>
          <Button type="submit" disabled={searching} className="hidden md:inline-flex">
            {searching && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Search
          </Button>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-3 sm:grid-cols-3",
            !showFilters && "max-md:hidden",
          )}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
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
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {CATEGORIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
                <FormLabel>Schedule</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All Transactions</SelectItem>
                    <SelectItem value="true">Recurring</SelectItem>
                    <SelectItem value="false">One-time</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={searching} className="md:hidden">
          {searching && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Search
        </Button>
      </form>
    </Form>
  );
};

export default TransactionFilteration;
