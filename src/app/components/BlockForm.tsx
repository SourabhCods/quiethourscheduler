"use client";

import { useEffect, useState } from "react";
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
import { Loader2Icon } from "lucide-react";
import supabaseClient from "../../../lib/supabaseClient";

interface Block {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

export default function BlockFormDialog() {
  const [authUserId, setAuthUserId] = useState<string>();
  const [formData, setFormData] = useState<Block>({
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabaseClient.auth.getUser();
      setAuthUserId(data.user?.id);
    };

    fetchUser();
  }, []);

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const createSilentBlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUserId) return;

    try {
      // Convert local datetime-local (string) -> UTC ISO string
      const startsAtUTC = new Date(formData.startsAt).toISOString();
      const endsAtUTC = new Date(formData.endsAt).toISOString();

      const response = await axios.post("/api/newBlock", {
        blockData: {
          ...formData,
          startsAt: startsAtUTC,
          endsAt: endsAtUTC,
        },
        userId: authUserId,
      });

      console.log(response.data);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Quiet Block</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Quiet Block</DialogTitle>
          <DialogDescription>
            Fill up details to create a new block.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={createSilentBlock} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              name="title"
              value={formData.title}
              type="text"
              placeholder="What Block's For"
              onChange={handleOnInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              name="description"
              value={formData.description}
              type="text"
              placeholder="What's your goal ? Please write it here"
              onChange={handleOnInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startsAt">Start Date & Time</Label>
            <Input
              name="startsAt"
              value={formData.startsAt}
              type="datetime-local"
              placeholder="Enter Start Date & Time"
              onChange={handleOnInputChange}
              required
            />
            {/* <DateAndTimePicker /> */}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endsAt">End Date & Time</Label>
            <Input
              name="endsAt"
              value={formData.endsAt}
              type="datetime-local"
              placeholder="Enter End Date & Time"
              onChange={handleOnInputChange}
              required
            />
            {/* <DateAndTimePicker /> */}
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
