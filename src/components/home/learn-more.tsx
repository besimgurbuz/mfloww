"use client"

import { TabsContent } from "@radix-ui/react-tabs"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LearnMore() {
  return (
    <Tabs
      defaultValue="your-data"
      className="flex flex-col items-center gap-2 max-w-full"
    >
      <ScrollArea className="w-full text-center">
        <TabsList>
          <TabsTrigger value="your-data">Your data</TabsTrigger>
          <TabsTrigger value="encrypted">Encrypted</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="open-source">Open Source</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="your-data" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>Your data belongs exclusively to you</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              All data you create is securely stored on your device. You have
              the option to synchronize your data across your personal devices.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="encrypted" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>
              Every transaction is encrypted with your unique key
            </CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              Upon initializing your account, you&apos;ll receive a unique
              encryption key. All your entries are securely encrypted using this
              key.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="currencies" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>Support for Over 25 Currencies</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              We support more than 25 different currencies. You can record
              entries in any supported currency. Additionally, you can set a
              base currency, and all transactions will be automatically
              converted and displayed in your chosen base currency.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="open-source" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>Open Source Software</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              Our source code is publicly available on GitHub. We welcome
              contributions to the application. You&apos;re also free to fork
              the repository, customize it to your needs, and deploy your own
              version.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
