"use client";

import React from "react";
import { Button, Card } from "@nextui-org/react";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import DocumentGraph from "@/components/documentGraph";

export default function Documents() {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  // Function to create a new note
  const onCreate = () => {
    const promise = create({ title: "Untitled" });
    // Shows a toast with the status
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <div className="relative h-screen bg-background text-foreground ">
        {/* Main content area */}
        <div
          className={`fixed right-0 h-screen flex-grow bg-background text-foreground transition-all duration-300 w-[calc(100%-18rem)]`}
        >
          <div className="flex flex-col items-center justify-center mt-72">
            <h1 className="select-none ">
              Hey {user?.username}, Welcome to Memoir
            </h1>
            {/* <h2 className="select-none mt-2 ">start by creating a new note</h2> */}
            <Button // Create note button
              onClick={onCreate} // Calls the onCreate function when pressed
              variant="light"
              color="secondary"
              className="mt-2"
            >
              <PlusCircle />
              Create Note
            </Button>
          </div>
          <Card isFooterBlurred radius="lg" className="border-none">
            <div className="object-cover">
              <DocumentGraph />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
