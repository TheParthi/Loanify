import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Gauge, FileText, BrainCircuit } from 'lucide-react';
import { CustomerEligibilityChecker } from '@/components/customer-eligibility-checker';
import { Logo } from '@/components/common/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link>
        </nav>
        <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="#check-eligibility">
                    Check Eligibility
                </Link>
            </Button>
            <Button asChild variant="ghost" className="md:hidden">
              <Link href="/dashboard">
                Dashboard <ArrowRight className="ml-2" />
              </Link>
            </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-primary/5 text-center">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Intelligent Loan Processing, Simplified
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                LoanPilot AI revolutionizes the lending landscape with AI-powered eligibility scoring and automated reporting, providing fast, fair, and transparent decisions.
              </p>
              <div className="space-x-4">
                <Button size="lg" asChild>
                    <Link href="#check-eligibility">
                        Get Started <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">
                        Go to Dashboard
                    </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="check-eligibility" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
             <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Instant Results</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Find Out Where You Stand</h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                        Our AI-driven eligibility checker gives you a clear, instant snapshot of your loan potential. Just fill in a few details to receive your personalized eligibility score and insights.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-md">
                    <CustomerEligibilityChecker />
                </div>
            </div>
          </div>
        </section>
        
        <section id="about" className="py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How LoanPilot AI Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform leverages cutting-edge AI to streamline the loan application process for both customers and financial institutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Gauge className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">Eligibility Scoring</h3>
                <p className="text-sm text-muted-foreground">AI-powered scoring based on credit history, income, and more for an instant eligibility snapshot.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">Automated Reports</h3>
                <p className="text-sm text-muted-foreground">Instantly generate detailed Loan Evaluation Reports, including decision rationale.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h3 className="text-lg font-bold">Smart Dashboards</h3>
                <p className="text-sm text-muted-foreground">Admin and staff dashboards provide real-time insights, application tracking, and management tools.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-primary/10">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
            LoanPilot AI &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
