"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import {
  useCreateTransactionQuery,
  useUpdateTransactionQuery,
} from "@/lib/local-db/hooks"
import { fetchExchangeRates } from "@/lib/rates"
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
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardStateContext } from "@/app/dashboard/dashboard-context"

import { AmountInput } from "../amount-input"
import { CategorySelect } from "../category-select"
import { Icons } from "../icons"
import { BaseInput } from "../ui/input"

type TransactionFormValues = {
  name: string
  amount: number
  category?: string
  currency: SupportedCurrencyCode
  isRegular: boolean
  type: "income" | "expense"
}

type CreateUpdateTransactionProps = {
  enableShortcut?: boolean
  isDesktop: boolean
  open: boolean
  fillData?: Transaction
  onOpenChange: (state: boolean) => void
}

export function CreateUpdateTransaction({
  enableShortcut,
  isDesktop,
  open,
  fillData,
  onOpenChange,
}: CreateUpdateTransactionProps) {
  const { createTransaction } = useCreateTransactionQuery()
  const { updateTransaction } = useUpdateTransactionQuery()
  const { selectedDate, ratesStore } = useContext(DashboardStateContext)
  const [isFetchingRates, setFetchingRates] = useState(false)

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
  }, [enableShortcut, onOpenChange, open])

  const onSubmit = async (values: TransactionFormValues) => {
    let exchangeRate = ratesStore[values.currency]
    if (!exchangeRate) {
      setFetchingRates(true)
      exchangeRate = await fetchExchangeRates(values.currency)
      setFetchingRates(false)
    }

    const newTransaction = {
      ...values,
      amount:
        values.type === "expense" && values.amount > 0
          ? values.amount * -1
          : values.amount,
      date: selectedDate,
      exchangeRate,
    } as Transaction

    if (!fillData) {
      createTransaction(newTransaction)
    } else {
      newTransaction.id = fillData.id
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
              {!fillData ? "Create transaction" : `Edit ${fillData.name}`}
            </DialogTitle>
            {!fillData && (
              <DialogDescription>
                Create a transaction in the selected date.
              </DialogDescription>
            )}
          </DialogHeader>
          <TransactionForm fillData={fillData} onSubmit={onSubmit}>
            <DialogFooter className="flex self-center w-full">
              <Button
                type="submit"
                className="flex  gap-2"
                disabled={isFetchingRates}
              >
                {isFetchingRates && (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                )}
                {!fillData ? "Create" : "Save"}
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
              {!fillData ? "Create a new transaction" : `Edit ${fillData.name}`}
            </DrawerTitle>
            {!fillData && (
              <DrawerDescription>
                Create a transaction in the selected entry.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <TransactionForm fillData={fillData} onSubmit={onSubmit}>
            <DrawerFooter className="flex self-center w-full">
              <Button type="submit">{!fillData ? "Create" : "Save"}</Button>
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

const [firstCurr, ...otherCurrs] = SUPPORTED_CURRENCY_CODES

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  currency: z.enum([firstCurr, ...otherCurrs]),
  amount: z.number().min(1, { message: "Amount is required" }),
  category: z.string().optional(),
  type: z.enum(["income", "expense"]),
  isRegular: z.boolean(),
})

type TransactionFormProps = {
  fillData?: Transaction
  children: ReactNode
  onSubmit: SubmitHandler<TransactionFormValues>
}

function TransactionForm({
  fillData,
  children,
  onSubmit,
}: TransactionFormProps) {
  const [baseCurrency] = useStorage<SupportedCurrencyCode>(
    "SELECTED_BASE_CURRENCY",
    "localStorage",
    "USD"
  )
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: fillData?.name || "",
      currency: baseCurrency,
      amount: Math.abs(fillData?.amount || 0),
      category: fillData?.category || "",
      isRegular: fillData?.isRegular || false,
      type: fillData?.type || "income",
    },
    resolver: zodResolver(formSchema),
  })

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
                  <BaseInput placeholder="Name" {...field} />
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
                  <AmountInput
                    ref={field.ref}
                    name="amount"
                    defaultValue={field.value}
                    onChange={field.onChange}
                    prefix={
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <Select
                            onValueChange={(event) => {
                              field.onChange(event)
                              setTimeout(() => form.setFocus("amount"))
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl className="outline-none  rounded-none border-none focus:ring-0">
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
                        )}
                      />
                    }
                  />
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
                  <CategorySelect
                    defaultValue={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
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
                      Regular transaction will occur on month
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
