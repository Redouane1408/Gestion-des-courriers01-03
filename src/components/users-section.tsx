"use client"

import { Pencil, Trash2, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddUserDialog } from "./add-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { UserDetailsDialog } from "./user-details-dialog"

interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([
    { id: "1", firstName: "Soumia", lastName: "Benali", username: "soumia.benali", email: "soumia@example.com" },
    { id: "2", firstName: "Ali", lastName: "Mansouri", username: "ali.mansouri", email: "ali@example.com" },
    { id: "3", firstName: "Farouk", lastName: "Hadj", username: "farouk.hadj", email: "farouk@example.com" },
    { id: "4", firstName: "Nesrine", lastName: "Amrani", username: "nesrine.amrani", email: "nesrine@example.com" },
  ])

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleAddUser = (data: {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
  }) => {
    const newUser = {
      id: (users.length + 1).toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
    }
    setUsers([...users, newUser])
  }

  const handleEditUser = (data: {
    firstName: string
    lastName: string
    username: string
    email: string
    password?: string
  }) => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
              }
            : user,
        ),
      )
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setDetailsDialogOpen(true)
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-1">Users</h1>

      <div className="mt-6">
        <h2 className="text-lg font-medium">Our Users</h2>
        <p className="text-sm text-muted-foreground mb-4">Anyone with the link can view this document.</p>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">People with access</h3>
            <Button variant="default" size="sm" className="gap-1" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center text-xs">
                    {user.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(user)}>
                    <Info className="h-4 w-4" />
                    <span className="sr-only">View user details</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedUser(user)
                      setEditDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit user</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddUser} />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser || undefined}
        onSave={handleEditUser}
      />

      <UserDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        user={selectedUser || undefined}
      />
    </div>
  )
}

