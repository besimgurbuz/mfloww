"use client"

import { ReactNode, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import * as z from "zod"

import { useCreateEntryQuery } from "@/lib/db/hooks"
import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from "@/lib/definitions"
import { useMediaQuery } from "@/lib/hooks"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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

const [firstCurrencyCode, ...otherCurrencyCodes] = SUPPORTED_CURRENCY_CODES

const formSchema = z.object({
  name: z.string().min(2).max(100),
  amount: z.preprocess(
    (amount) => Number(z.string().parse(amount)),
    z.number().positive().min(1)
  ),
  type: z.enum(["income", "expense"]),
  isRegular: z.boolean(),
  category: z.string().min(2).max(50).optional(),
  currency: z.enum([firstCurrencyCode, ...otherCurrencyCodes]),
})

export function CreateEntry({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { createEntry } = useCreateEntryQuery()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "income",
      isRegular: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEntry({
      ...values,
      date: "",
      exchangeRate: {} as Record<SupportedCurrencyCode, number>,
    })
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={triggerClassName}>Create entry</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="px-0">
            <DialogTitle>Create a new entry</DialogTitle>
            <DialogDescription>
              Create an entry in the selected month.
            </DialogDescription>
          </DialogHeader>
          <CreateForm form={form} onSubmit={onSubmit}>
            <DialogFooter className="flex self-center w-full">
              <Button type="submit">Create</Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </CreateForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className={triggerClassName}>Create Entry</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="px-0">
            <DrawerTitle>Create a new entry</DrawerTitle>
            <DrawerDescription>
              Create an entry in the selected month.
            </DrawerDescription>
          </DrawerHeader>
          <CreateForm form={form} onSubmit={onSubmit}>
            <DrawerFooter className="flex self-center w-full">
              <Button type="submit">Create</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </CreateForm>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CreateForm({
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
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
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
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
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
                      Regular entries will repeat on every month
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
