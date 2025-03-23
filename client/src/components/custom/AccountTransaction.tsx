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
import { MoreVertical, Search } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
});

const transactions = [
  {
    id: "d78eb500-cf1f-5f2b-bjlkjc98-8d7dbf5cbd3",
    type: "INCOME",
    amount: "1500",
    description: "Freelance payment",
    date: "2024-03-12T00:00:00.000Z",
    category: "WORK",
    receiptUrl: null,
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
    accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
    createdAt: "2025-03-13T20:20:28.479Z",
    updatedAt: "2025-03-14T17:52:25.563Z",
  },
  {
    id: "d78eb500-cf1f--bc98-d7dbf5cbd3",
    type: "INCOME",
    amount: "1500",
    description: "Freelance payment",
    date: "2024-03-12T00:00:00.000Z",
    category: "WORK",
    receiptUrl: null,
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
    accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
    createdAt: "2025-03-13T20:20:28.479Z",
    updatedAt: "2025-03-14T17:52:25.563Z",
  },
  {
    id: "d78500-cf1f-5f2b--8d7dbf5cbd3",
    type: "INCOME",
    amount: "1500",
    description: "Freelance payment",
    date: "2024-03-12T00:00:00.000Z",
    category: "WORK",
    receiptUrl: null,
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
    accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
    createdAt: "2025-03-13T20:20:28.479Z",
    updatedAt: "2025-03-14T17:52:25.563Z",
  },
];

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
];

const AccountTransaction = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
              name="username"
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
              name="email"
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
              name="email"
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
              name="email"
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Recurring</TableHead>
            {/* <TableHead>Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell>
                {transaction.description.length > 20
                  ? `${transaction.description.slice(0, 20)}...`
                  : transaction.description}
              </TableCell>

              <TableCell>
                {getCategoryIcon(transaction.category)} {transaction.category}
              </TableCell>
              <TableCell>${transaction.amount}</TableCell>
              <TableCell>
                {transaction.isRecurring
                  ? transaction.recurringInterval
                  : "One time"}
              </TableCell>

              <TableCell className="flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-20 p-3">
                    <div className="text-center">Edit</div>
                    <div className="text-center">Delete</div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountTransaction;
