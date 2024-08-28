"use client";
import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const signInState = useSignIn(); // Get the full state from the hook
  const { isLoaded, signIn, setActive } = signInState || {}; // Destructure safely
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("identifier"); // Initial step is to collect identifier (email)
  const [verificationCode, setVerificationCode] = useState(""); // For email code verification
  const router = useRouter();
  const [error, setError] = useState("");

  // Handle initial identifier submission (e.g., email)
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signIn) {
      setError("Sign-in is not available. Please try again later.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      if (signInAttempt.status === "needs_first_factor") {
        const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
          factor => factor.strategy === "email_code"
        );

        if (emailCodeFactor) {
          setStep("email_code"); // Move to email code verification step
        } else if (
          signInAttempt.supportedFirstFactors?.some(
            factor => factor.strategy === "oauth_google"
          )
        ) {
          // Handle OAuth Google (can trigger Google sign-in flow)
          setError("Google sign-in is not yet implemented. Please use email.");
        } else {
          setError("Unsupported sign-in strategy. Please contact support.");
        }
      } else {
        setError("Unexpected sign-in status. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to start sign-in. Please try again.");
      console.error(err);
    }
  };

  // Handle email code verification
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signIn) {
      setError("Sign-in is not available. Please try again later.");
      return;
    }

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: verificationCode,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/");
      } else {
        setError("Failed to complete sign-in. Please try again.");
      }
    } catch (err: any) {
      setError("Invalid code. Please check your email and try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <h1 className="text-center text-xl mb-4">Sign in</h1>
          {step === "identifier" ? (
            <form className="flex flex-col gap-4" onSubmit={handleIdentifierSubmit}>
              <Input
                isRequired
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit" fullWidth color="primary">
                  Next
                </Button>
              </div>
            </form>
          ) : step === "email_code" ? (
            <form className="flex flex-col gap-4" onSubmit={handleCodeSubmit}>
              <Input
                isRequired
                label="Verification Code"
                placeholder="Enter the code sent to your email"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit" fullWidth color="primary">
                  Sign in
                </Button>
              </div>
            </form>
          ) : null}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </CardBody>
      </Card>
    </div>
  );
}
