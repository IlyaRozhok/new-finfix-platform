"use client";
import dollars from "@/public/images/dollars-login.jpeg";
import Image from "next/image";
import { Landmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LoginForm } from "@/components/login-form";
import { OnboardingDemo } from "@/components/onboarding-demo";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setShowDemo(false)}
            variant="outline"
            size="sm"
          >
            Back to Login
          </Button>
        </div>
        <OnboardingDemo />
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Landmark className="size-4" />
            </div>
            FinFix Inc.
          </a>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowDemo(true)}
              variant="outline"
              size="sm"
            >
              Onboarding Demo
            </Button>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                Test Wizard
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={dollars}
          alt="Picture of the author"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
