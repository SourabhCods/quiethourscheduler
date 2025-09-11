"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import supabaseClient from "../../../lib/supabaseClient";
import { Loader2Icon } from "lucide-react";
import { DateAndTimePicker } from "./DateAndTimePicker";

interface Block {
  title: string;
  description: string;
  startDateAndTime: string;
  endDateAndTime: string;
  status: "scheduled" | "upcoming" | "ongoing" | "completed";
}

export default function BlockFormDialog() {
  const [formData, setFormData] = useState<Block>({
    title: "",
    description: "",
    startDateAndTime: "",
    endDateAndTime: "",
    status: "completed",
  });
  const router = useRouter();

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOnSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/newBlock", formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Quiet Block</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Fill in your details to register a new account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleOnSignUp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="What Block's For"
              onChange={handleOnInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="What's your goal ? Please write it here"
              onChange={handleOnInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startDate&Time">Start Date & Time</Label>
            {/* <Input
              id="startDate&Time"
              type="text"
              placeholder="Enter Start Date & Time"
              onChange={handleOnInputChange}
              required
            /> */}
            <DateAndTimePicker />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate&Time">End Date & Time</Label>
            {/* <Input
              id="endDate&Time"
              type="text"
              placeholder="Enter End Date & Time"
              onChange={handleOnInputChange}
              required
            /> */}
            <DateAndTimePicker />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="outline" size="lg">
              <Loader2Icon className="animate-spin" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
