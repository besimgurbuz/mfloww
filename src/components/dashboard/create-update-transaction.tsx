"use client"

import { ReactNode, useContext, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  DefaultValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import * as z from "zod"

import {
  useCreateTransactionQuery,
  useUpdateTransactionQuery,
} from "@/lib/db/hooks"
import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from "@/lib/definitions"
import { Transaction } from "@/lib/transaction"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardStateContext } from "@/components/dashboard/dashboard-state-context"

const [firstCurrencyCode, ...otherCurrencyCodes] = SUPPORTED_CURRENCY_CODES

const formSchema = z.object({
  name: z.string().min(2).max(100),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  isRegular: z.boolean(),
  category: z.string().min(2).max(50).optional(),
  currency: z.enum([firstCurrencyCode, ...otherCurrencyCodes]),
})

type CreateUpdateTransactionProps = {
  enableShortcut?: boolean
  isDesktop: boolean
  open: boolean
  onOpenChange: (state: boolean) => void
} & (
  | { mode: "create"; transaction?: never }
  | { mode: "edit"; transaction: Transaction }
)

export function CreateUpdateTransaction({
  enableShortcut,
  isDesktop,
  open,
  onOpenChange,
  mode,
  transaction,
}: CreateUpdateTransactionProps) {
  const { createTransaction } = useCreateTransactionQuery()
  const { updateTransaction } = useUpdateTransactionQuery()
  const { selectedEntry } = useContext(DashboardStateContext)
  const defaultValues: DefaultValues<z.infer<typeof formSchema>> =
    mode === "create"
      ? {
          type: "income",
          isRegular: false,
        }
      : {
          name: transaction.name,
          amount: Math.abs(transaction.amount),
          category: transaction.category,
          currency: transaction.currency,
          isRegular: transaction.isRegular,
          type: transaction.type,
        }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!enableShortcut) {
      return
    }
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newTransaction = {
      ...values,
      amount:
        values.type === "expense" && values.amount > 0
          ? values.amount * -1
          : values.amount,
      date: values.isRegular ? "" : selectedEntry?.date,
      exchangeRate: {} as Record<SupportedCurrencyCode, number>,
    } as Transaction

    if (mode === "create") {
      createTransaction(newTransaction)
    } else {
      newTransaction.id = transaction.id
      updateTransaction(newTransaction)
    }
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="px-0">
            <DialogTitle>
              {mode === "create"
                ? "Create a new transaction"
                : `Edit ${transaction.name}`}
            </DialogTitle>
            {mode === "create" && (
              <DialogDescription>
                Create a transaction in the selected entry.
              </DialogDescription>
            )}
          </DialogHeader>
          <TransactionForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="flex self-center w-full">
              <Button type="submit">
                {mode === "create" ? "Create" : "Save"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </TransactionForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl px-4">
          <DrawerHeader className="px-0">
            <DrawerTitle>
              {mode === "create"
                ? "Create a new transaction"
                : `Edit ${transaction.name}`}
            </DrawerTitle>
            {mode === "create" && (
              <DrawerDescription>
                Create a transaction in the selected entry.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <TransactionForm form={form} onSubmit={onSubmit}>
            <DrawerFooter className="flex self-center w-full">
              <Button type="submit">
                {mode === "create" ? "Create" : "Save"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </TransactionForm>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function TransactionForm({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>
  children: ReactNode
}) {
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Passive Income, Groceries" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="font-medium">
                    {SUPPORTED_CURRENCY_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4"
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel>Income</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel>Expense</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRegular"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal space-y-1">
                      Regular
                    </FormLabel>
                    <FormDescription>
                      Regular transaction will occur on every entry
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        {children}
      </form>
    </Form>
  )
}
