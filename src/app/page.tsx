import { Button } from "@/components/ui/button"
import { AppShowcase } from "@/components/home/app-showcase"
import { FAQAccordion } from "@/components/home/faq-accordion"
import { LandingIllustration } from "@/components/home/landing-illustration"
import { LearnMore } from "@/components/home/learn-more"
import { LearnMoreButton } from "@/components/home/learn-more-button"
import { Icons } from "@/components/icons"

export default function Home() {
  return (
    <>
      <div className="flex flex-col relative custom-min-h">
        <main className="custom-container flex-1">
          <section className="mx-auto py-6 max-w-[980px] flex flex-col items-center w-full">
            <LandingIllustration className="w-[280px] md:w-[500px] lg:w-[600px] my-2" />
            <h1 className="text-center text-3xl md:text-5xl lg:text-6xl text-foreground font-bold font-sans">
              Visualize your money flow
            </h1>
            <p className="pt-2 max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
              Experience your financial data through elegantly designed charts.
              Secure your information locally with encryption. Supporting over
              25 currencies. Proudly open-source.
            </p>
            <div className="flex gap-2 pt-4">
              <LearnMoreButton />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/besimgurbuz/mfloww"
              >
                <Button className="flex gap-2" variant="outline">
                  <Icons.github className="w-6 h-6" /> GitHub
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
          <section className="py-12">
            <AppShowcase />
          </section>
          <section className="py-6 flex w-full justify-center">
            <FAQAccordion />
          </section>
        </main>
      </div>
      <footer className="py-6 md:px-8 md:py-0 mt-4">
        <div className="custom-container flex flex-col items-center text-center gap-1 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://besimgurbuz.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Besim Gürbüz
            </a>{" "}
            with beautiful{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </a>{" "}
            components.
          </p>{" "}
          <p className="text-sm text-muted-foreground">
            The source code is available on{" "}
            <a
              href="https://github.com/besimgurbuz/mfloww"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
