import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Search } from "lucide-react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { useParams } from "react-router-dom";
import { Transaction } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

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

const formSchema = z.object({
  description: z.string().optional(),
  type: z.enum(["ALL", "INCOME", "EXPENSE"]),
  category: z.enum(TransactionCategory),
  isRecurring: z.enum(["ALL", "true", "false"]),
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "ENTERTAINMENT":
      return "🎭";
    case "WORK":
      return "💼";
    default:
      return "💰";
  }
};

const AccountTransaction = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "", // Matches schema
      type: "ALL", // Ensure it matches `z.enum`
      category: "ALL", // Must be a valid category
      isRecurring: "ALL",
    },
  });

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const { accountId } = useParams();

  const [filters, setFilters] = useState({ accountId, page: 1 });

  const { data: transactionData, isPending } = useFilteredTransactions(filters);

  console.log(transactionData);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("search", values);

    // Update the filters to trigger a new fetch
    setFilters((prev) => ({
      ...prev,
      ...values, // Merge form values into filters
      page: 1, // Reset to first page when applying filters
    }));
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className=" mb-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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

            <Button type="submit">Search</Button>
          </form>
        </Form>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Recurring</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              transactionData?.data?.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    {transaction.description &&
                    transaction.description.length > 20
                      ? `${transaction.description.slice(0, 20)}...`
                      : transaction.description}
                  </TableCell>
                  <TableCell>
                    {getCategoryIcon(transaction.category)}{" "}
                    {transaction.category}
                  </TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    {transaction.isRecurring
                      ? transaction.recurringInterval
                      : "One time"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Component */}
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  to={`?page=${filters.page - 1}`}
                  className={
                    filters.page === 1 ? "pointer-events-none opacity-50" : ""
                  }
                  onClick={(e) => {
                    if (filters.page === 1) e.preventDefault();
                    else handlePageChange(filters.page - 1);
                  }}
                />
              </PaginationItem>
              {/* Page Numbers */}
              {`${filters.page}/${transactionData?.pagination?.totalPages}`}
              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  to={`?page=${filters.page + 1}`}
                  className={
                    filters.page === transactionData?.pagination?.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                  onClick={(e) => {
                    if (
                      filters.page === transactionData?.pagination?.totalPages
                    )
                      e.preventDefault();
                    else handlePageChange(filters.page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>{" "}
    </div>
  );
};

export default AccountTransaction;
