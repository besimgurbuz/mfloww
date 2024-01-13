import { Button } from "@/components/ui/button"
import { FAQAccordion } from "@/components/home/faq-accordion"
import { LandingIllustration } from "@/components/home/landing-illustration"
import { LearnMore } from "@/components/home/learn-more"
import { LearnMoreButton } from "@/components/home/learn-more-button"
import { Icons } from "@/components/icons"

export default function Home() {
  return (
    <div className="flex flex-col relative custom-min-h">
      <main className="custom-container flex-1">
        <section className="mx-auto py-6 max-w-[980px] flex flex-col items-center w-full">
          <LandingIllustration className="w-[280px] md:w-[500px] lg:w-[600px] my-2" />
          <h1 className="text-center text-3xl md:text-5xl lg:text-6xl text-foreground font-bold font-sans">
            Visualize your money flow
          </h1>
          <p className="pt-2 max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
            View your money flow in beautifully designed charts. Keep your data
            in your device. Encrypted. +25 Currency. Open Source.
          </p>
          <div className="flex gap-2 pt-4">
            <LearnMoreButton />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/besimgurbuz/mfloww"
            >
              <Button className="flex gap-2" variant="outline">
                <Icons.gitHub className="w-6 h-6" /> GitHub
              </Button>
            </a>
          </div>
        </section>
        <section
          id="learn-more-section"
          className="py-6 flex w-full justify-center"
        >
          <LearnMore />
        </section>
        <section className="py-6 flex w-full justify-center">
          <FAQAccordion />
        </section>
      </main>
    </div>
  )
}
