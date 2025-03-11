"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate login logic (replace this with your actual API call)
    if (email === "admin@example.com" && password === "password123") {
      console.log("Login successful!");
      navigate("/dashboard"); // Redirect to the dashboard
    } else {
      console.log("Invalid credentials");
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-screen">
      {/* Left side - Dark background with logo */}
      <div className="hidden w-1/2 bg-black flex-col items-center justify-center md:flex">
        <div className="max-w-[300px]">
          <img
            src="/Logo-MF.svg"
            alt="Ministry of Finance"
            width={300}
            height={100}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-1/2 flex items-center justify-start px-40">
        <Card className="w-screen max-w-md border-0 shadow-none">
          <CardHeader className="space-y-1 p-0 pb-4">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your username and password below</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-black hover:bg-black/90">
                Log in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
