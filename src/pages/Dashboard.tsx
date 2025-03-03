"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import BarChartMixed from "@/components/chart-bar-mixed"
import { ThemeSwitch } from "@/components/ui/ThemeSwitch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Download, Archive, Trash2, Pencil } from "lucide-react"

// Chart Data
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string
  description: string
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

// Document interface
interface Document {
  id: string
  num: number
  name: string
  type: "received(Extr)" | "sent(Extr)" | "sent(Inter)" | "received(Inter)" | "Ministre"
  dateArrive: string
  dateEnregistrer: string
  dateRetour?: string
  status: "En cours" | "archivé" | "En attente"
}

export default function Page() {
  // Sample document data
  const [documents, setDocuments] = useState<Document[]>([
    {
      num: 1,
      id: "1",
      name: "Invoice_001.pdf",
      type: "received(Extr)",
      dateArrive: "2023-05-15",
      dateEnregistrer: "2023-05-16",
      status: "En cours",
    },
    {
      num: 2,
      id: "2",
      name: "Contract_ABC.pdf",
      type: "sent(Extr)",
      dateArrive: "2023-05-10",
      dateEnregistrer: "2023-05-11",
      dateRetour: "2023-05-20",
      status: "archivé",
    },
    {
      num: 3,
      id: "3",
      name: "Report_Q1.pdf",
      type: "sent(Inter)",
      dateArrive: "2023-04-01",
      dateEnregistrer: "2023-04-02",
      status: "En attente",
    },
    {
      num: 4,
      id: "4",
      name: "OldRecord_2022.pdf",
      type: "Ministre",
      dateArrive: "2022-12-31",
      dateEnregistrer: "2023-01-02",
      status: "archivé",
    },
  ])

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterDateStart, setFilterDateStart] = useState<string>("")
  const [filterDateEnd, setFilterDateEnd] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-green-500"
      case "archivé":
        return "bg-blue-500"
      case "En attente":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const toggleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id))
    }
  }

  const toggleSelectDocument = (id: string) => {
    setSelectedDocuments((prev) => (prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]))
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      (searchTerm === "" || doc.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterType || doc.type === filterType) &&
      (!filterStatus || doc.status === filterStatus) &&
      (!filterDateStart || doc.dateArrive >= filterDateStart) &&
      (!filterDateEnd || doc.dateArrive <= filterDateEnd),
  )

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc)
  }

  const handleSaveEdit = (editedDoc: Document) => {
    setDocuments(documents.map((doc) => (doc.id === editedDoc.id ? editedDoc : doc)))
    setEditingDocument(null)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col w-full">
          {/* Header */}
          <header className="flex h-16 w-full items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem className="fixed top-4 right-4 inline-flex items-center">
                  <ThemeSwitch />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full" style={{ alignItems: "stretch" }}>
            {/* Grid Section */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {/* Chart */}
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                <BarChartMixed data={chartData} />
              </div>

              {/* Stats Card 1 */}
              <StatsCard title="Total Revenue" value="$12,345" description="+20% from last month" />

              {/* Stats Card 2 */}
              <StatsCard title="Active Users" value="1,234" description="+5% from last month" />
            </div>

            {/* Table Section */}
            <div className="rounded-xl bg-muted/50 p-4 w-full">
              <h2 className="text-xl font-semibold mb-4">Courier Management</h2>

              {/* Filter Section */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Input
                  placeholder="Search by subject"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px]"
                />
                <Select onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="received(Extr)">Received (External)</SelectItem>
                    <SelectItem value="sent(Extr)">Sent (External)</SelectItem>
                    <SelectItem value="sent(Inter)">Sent (Internal)</SelectItem>
                    <SelectItem value="received(Inter)">Received (Internal)</SelectItem>
                    <SelectItem value="Ministre">Ministre</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="archivé">Archivé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Start Date"
                  onChange={(e) => setFilterDateStart(e.target.value)}
                  className="w-[180px]"
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  onChange={(e) => setFilterDateEnd(e.target.value)}
                  className="w-[180px]"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("")
                    setFilterStatus("")
                    setFilterDateStart("")
                    setFilterDateEnd("")
                    setSearchTerm("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedDocuments.length === documents.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>N°de courriers</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Arrivé</TableHead>
                      <TableHead>Date Enregistrer</TableHead>
                      <TableHead>Date de Retour</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => toggleSelectDocument(doc.id)}
                          />
                        </TableCell>
                        <TableCell>{doc.num}</TableCell>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.dateArrive}</TableCell>
                        <TableCell>{doc.dateEnregistrer}</TableCell>
                        <TableCell>{doc.dateRetour || "-"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-white ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Modifier le courriers</DialogTitle>
                                </DialogHeader>
                                <EditDocumentForm document={doc} onSave={handleSaveEdit} />
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            {doc.status !== "archivé" && (
                              <Button variant="ghost" size="icon">
                                <Archive className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

interface EditDocumentFormProps {
  document: Document
  onSave: (editedDoc: Document) => void
}

function EditDocumentForm({ document, onSave }: EditDocumentFormProps) {
  const [editedDoc, setEditedDoc] = useState<Document>(document)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedDoc((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedDoc)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Sujet</Label>
        <Input id="name" name="name" value={editedDoc.name} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          name="type"
          value={editedDoc.type}
          onValueChange={(value) => handleChange({ target: { name: "type", value } } as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="received(Extr)">Received (External)</SelectItem>
            <SelectItem value="sent(Extr)">Sent (External)</SelectItem>
            <SelectItem value="sent(Inter)">Sent (Internal)</SelectItem>
            <SelectItem value="received(Inter)">Received (Internal)</SelectItem>
            <SelectItem value="Ministre">Ministre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateArrive">Date Arrivé</Label>
        <Input id="dateArrive" name="dateArrive" type="date" value={editedDoc.dateArrive} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateEnregistrer">Date Enregistrer</Label>
        <Input
          id="dateEnregistrer"
          name="dateEnregistrer"
          type="date"
          value={editedDoc.dateEnregistrer}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateRetour">Date de Retour</Label>
        <Input
          id="dateRetour"
          name="dateRetour"
          type="date"
          value={editedDoc.dateRetour || ""}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={editedDoc.status}
          onValueChange={(value) => handleChange({ target: { name: "status", value } } as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="archivé">Archivé</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}

