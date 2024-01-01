"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQAccordion() {
  return (
    <div className="flex flex-col min-h-[400px] w-[800px]">
      <h2 className="self-center text-xl font-medium">FAQ</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-start">
            What is it?
          </AccordionTrigger>
          <AccordionContent>
            mfloww is an open source money flow visualization application that
            stores user data encrypted on the user&apos;s device.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-start">
            Who is this for?
          </AccordionTrigger>
          <AccordionContent>
            mfloww has been created for every person or organization that wants
            to gain knowledge over their financial situation with privacy and
            freedom.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-start">
            Why do I need this?
          </AccordionTrigger>
          <AccordionContent>
            mfloww provides a powerful tool to gain knowledge over your
            finances, helps you to make informed decisions, and work towards
            your financial goals.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-start">
            Can I import transactions from my bank accounts?
          </AccordionTrigger>
          <AccordionContent>
            You can only manually enter your incomes and expenses.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-start">
            Can I sync my data across multiple devices?
          </AccordionTrigger>
          <AccordionContent>
            You can sync your data between your devices. When you triggered the
            sync, the device&apos;s encrypted data is sent to the server and you
            can download that data to another device. The data will be deleted
            from the server within 30 minutes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
