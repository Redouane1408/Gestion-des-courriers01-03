"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (data: { firstName: string; lastName: string; username: string; email: string; password: string }) => void
}

export function AddUserDialog({ open, onOpenChange, onAdd }: AddUserDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")

  // Generate username from first and last name
  useEffect(() => {
    if (firstName && lastName) {
      const generatedUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/\s+/g, "")
      setUsername(generatedUsername)
    }
  }, [firstName, lastName])

  // Generate random password
  useEffect(() => {
    if (open) {
      generatePassword()
    }
  }, [open])

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let newPassword = ""
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(newPassword)
    setPassword(newPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd?.({ firstName, lastName, username, email, password })
    setFirstName("")
    setLastName("")
    setUsername("")
    setEmail("")
    setPassword("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription>Add a new user to the system. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username (auto-generated)</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username will be auto-generated"
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password (auto-generated)</Label>
              <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                Regenerate
              </Button>
            </div>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono bg-muted"
              readOnly
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

