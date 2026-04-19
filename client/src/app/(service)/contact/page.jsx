import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BrainCircuit, MessageSquare, Wrench } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Contact = () => {
  return (
   <div className="container mx-auto px-4 py-12 md:px-6 lg:py-24 2xl:max-w-[1400px]">
      {/* Title */}
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
        <p className="text-muted-foreground mt-3">
          We&apos;d love to talk about how we can help you.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-lg ">
        <Card className="p-0 border shadow-xs dark:bg-input/30 dark:border-input">
          <CardContent className="p-6">
            <h2 className="mb-8 text-xl font-semibold">Fill in the form</h2>
            <form>
              <div className="grid gap-4 lg:gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                  <div>
                    <Label htmlFor="firstname" className="mb-2">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="firstname"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname" className="mb-2">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lastname"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                  <div>
                    <Label htmlFor="email" className="mb-2">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-2">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="mb-2">
                    Details
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project"
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 grid">
                <Button type="submit" size="lg">
                  Send inquiry
                </Button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-muted-foreground text-sm">
                  We&apos;ll get back to you in 1-2 business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <Link
          href={"#"}
          className="group border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
        >
          <BrainCircuit className="text-muted-foreground mx-auto size-9" />
          <div className="mt-5">
            <h3 className="text-lg font-semibold">Knowledge Base</h3>
            <p className="text-muted-foreground mt-1">
              We&apos;re here to help with any questions or code.
            </p>
            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
              Contact support
              <svg
                className="size-4 transition ease-in-out group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </div>
        </Link>

        <Link
          href={"#"}
          className="group border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
        >
          <MessageSquare className="text-muted-foreground mx-auto size-9" />
          <div className="mt-5">
            <h3 className="text-lg font-semibold">FAQ</h3>
            <p className="text-muted-foreground mt-1">
              Search our FAQ for answers to anything you might ask.
            </p>
            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
              Visit FAQ
              <svg
                className="size-4 transition ease-in-out group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </div>
        </Link>

        <Link
          href={"#"}
          className="group border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex h-full flex-col rounded-lg p-4 text-center sm:p-6"
        >
          <Wrench className="text-muted-foreground mx-auto size-9" />
          <div className="mt-5">
            <h3 className="text-lg font-semibold">Developer APIs</h3>
            <p className="text-muted-foreground mt-1">
              Check out our development quickstart guide.
            </p>
            <p className="text-primary mt-5 inline-flex items-center gap-x-1 font-medium">
              Contact sales
              <svg
                className="size-4 transition ease-in-out group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Contact