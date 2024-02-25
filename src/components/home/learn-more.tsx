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
            <CardTitle>Your data belongs to you and you alone!</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              Any sort of data you create is stored in your device. But
              Don&apos;t worry you can still send your data to your other
              devices.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="encrypted" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>
              Every transaction you create is encrypted by your unique key
            </CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              When you start using the application, you&apos;ll get a unique
              key. This key will be generated even you decided to use as
              anonymous. Your entries will be encrypted by your key.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="currencies" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>+25 Currencies</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              +25 different currencies are supported. You can create your
              entries in any of them. You will be able to define a base
              currency. And every transaction you make will be converted and
              displayed in your base currency.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="open-source" className="w-full md:w-fit">
        <Card>
          <CardHeader>
            <CardTitle>Open Source</CardTitle>
            <p className="max-w-[800px] text-muted-foreground">
              The source code is available on GitHub. You can contribute to the
              app or even fork it, customize it and use it by yourself.
            </p>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
