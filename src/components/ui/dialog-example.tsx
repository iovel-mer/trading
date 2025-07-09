"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Example 1: Dialog with visible title
export function DialogWithTitle() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog with Title</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* Dialog content goes here */}
      </DialogContent>
    </Dialog>
  );
}

// Example 2: Dialog with hidden title (for accessibility)
export function DialogWithHiddenTitle() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog with Hidden Title</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
          </VisuallyHidden>
          <DialogDescription>
            This dialog has a hidden title for screen readers but visible
            content.
          </DialogDescription>
        </DialogHeader>
        {/* Dialog content goes here */}
      </DialogContent>
    </Dialog>
  );
}
