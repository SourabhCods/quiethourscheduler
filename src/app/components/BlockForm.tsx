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
import { Loader2Icon, PlusSquare } from "lucide-react";
import supabaseClient from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Block {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

export default function BlockFormDialog() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Block>({
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      const { data } = await supabaseClient.auth.getUser();
      if (isMounted) setAuthUserId(data.user?.id ?? null);
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createSilentBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUserId) return;
    setLoading(true);

    try {
      const startsAtUTC = new Date(formData.startsAt).toISOString();
      const endsAtUTC = new Date(formData.endsAt).toISOString();

      await axios.post("/api/newBlock", {
        blockData: { ...formData, startsAt: startsAtUTC, endsAt: endsAtUTC },
        userId: authUserId,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating block:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <PlusSquare className="h-5 w-5" />
          Create Quiet Block
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Quiet Block</DialogTitle>
          <DialogDescription>
            Fill in details to create a new block.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={createSilentBlock} className="grid gap-4">
          {["title", "description", "startsAt", "endsAt"].map((field) => (
            <div className="grid gap-2" key={field}>
              <Label htmlFor={field}>
                {field === "startsAt"
                  ? "Start Date & Time"
                  : field === "endsAt"
                  ? "End Date & Time"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                name={field}
                type={
                  field === "startsAt" || field === "endsAt"
                    ? "datetime-local"
                    : "text"
                }
                placeholder={`Enter ${field}`}
                value={(formData as any)[field]}
                onChange={handleOnInputChange}
                required={field !== "description"}
              />
            </div>
          ))}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon className="animate-spin h-5 w-5" />
              ) : (
                "Create Quiet Block"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
