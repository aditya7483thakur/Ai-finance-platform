import { Loader2, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ExpenseBreakdown from "@/components/custom/ExpenseBreakdown";
import Accounts from "@/components/custom/Accounts";
import { useUserContext } from "@/contexts/userContext";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useState } from "react";
import { AccountType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useUpdateAccount } from "@/services/accounts/mutation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Account name must be at least 3 characters.",
  }),
  budget: z.string().optional(),
});

const Dashboard = () => {
  const { userId } = useUserContext();
  const { data: accounts, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const { mutate: updateAccount, isPending: updatingAccount } =
    useUpdateAccount();
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      budget: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("VALUE", values);
    updateAccount(
      { ...values, id: selectedAccount?.id as string },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Budget Section */}
        <div className="bg-white mb-6 p-3 shadow-md rounded-md">
          <span className="block text-lg font-medium">
            {selectedAccount && `Account name: ${selectedAccount.name}`}
          </span>
          {selectedAccount ? (
            <>
              <div className="flex gap-2 items-center mb-2">
                <span className="text-gray-400">
                  ${selectedAccount.usedAmount}/
                  {selectedAccount.budget ?? "Not Set"} spent
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Pencil size={18} className="hover:cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                          <Button type="submit" disabled={updatingAccount}>
                            {updatingAccount && (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            )}
                            {updatingAccount
                              ? "Creating..."
                              : " Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </div>
                    <DialogFooter>
                      {/* <Button type="submit">Save changes</Button> */}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Progress
                value={
                  selectedAccount.budget
                    ? (selectedAccount.usedAmount / selectedAccount.budget) *
                      100
                    : 0
                }
                className="h-2.5"
              />
              <div className="text-end text-gray-400">
                {selectedAccount.budget
                  ? `${Math.round(
                      (selectedAccount.usedAmount / selectedAccount.budget) *
                        100
                    )}% used`
                  : "Budget not set"}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">
              Click on an account to see budget details
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseBreakdown />
          <RecentTransactions
            accounts={accounts?.data}
            accountsLoading={accountsLoading}
          />
        </div>
        <Accounts
          accounts={accounts?.data}
          accountsLoading={accountsLoading}
          onAccountClick={setSelectedAccount}
        />
      </div>
    </div>
  );
};

export default Dashboard;
