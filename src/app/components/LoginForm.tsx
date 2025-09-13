"use client";

import { useState } from "react";
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
import { Loader2Icon, LogIn } from "lucide-react";
import supabaseClient from "../../../lib/supabaseClient";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOnLoginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      await supabaseClient.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      window.location.href = "/";
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Login To Your Account</DialogTitle>
          <DialogDescription>
            Enter your credentials to make a plan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleOnLoginUser} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter email"
              onChange={handleOnInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              placeholder="Enter password"
              onChange={handleOnInputChange}
              required
            />
          </div>

          <DialogFooter className="mt-5">
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
                "Login"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
