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
            What is mfloww?
          </AccordionTrigger>
          <AccordionContent>
            mfloww is an open-source money flow visualization application that
            securely stores user data with encryption on the user&apos;s device.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-start">
            Who can benefit from using mfloww?
          </AccordionTrigger>
          <AccordionContent>
            mfloww is designed for individuals and organizations seeking to gain
            comprehensive insights into their financial situation while
            prioritizing privacy and flexibility.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-start">
            How can mfloww benefit me?
          </AccordionTrigger>
          <AccordionContent>
            mfloww offers a robust tool for analyzing your finances, enabling
            you to make well-informed decisions and progress towards your
            financial objectives.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-start">
            Is it possible to import transactions from my bank accounts?
          </AccordionTrigger>
          <AccordionContent>
            Currently, mfloww supports manual entry of income and expenses.
            Automated bank transaction imports are not available at this time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-start">
            Can I synchronize my data across multiple devices?
          </AccordionTrigger>
          <AccordionContent>
            Yes, mfloww supports data synchronization between your devices. When
            you initiate a sync, your device&apos;s encrypted data is
            temporarily stored on our secure server. You can then download this
            data to another device. For your privacy, all synced data is
            automatically deleted from our servers after 30 minutes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
