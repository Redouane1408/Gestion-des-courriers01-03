"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, Archive, Trash2, Scan, Plus } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  num: number
  sujet: string
  type: "received(Extr)" | "sent(Extr)" | "sent(Inter)" | "received(Inter)" | "Ministre"
  dateArrive: string
  dateEnregistrer: string
  dateRetour?: string
  status: "En cours" | "archivé" | "En attente"
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      num: 1,
      id: "1",
      sujet: "Invoice_001.pdf",
      type: "received(Extr)",
      dateArrive: "2023-05-15",
      dateEnregistrer: "2023-05-16",
      status: "En cours",
    },
    {
      num: 2,
      id: "2",
      sujet: "Contract_ABC.pdf",
      type: "sent(Extr)",
      dateArrive: "2023-05-10",
      dateEnregistrer: "2023-05-11",
      dateRetour: "2023-05-20",
      status: "archivé",
    },
    {
      num: 3,
      id: "3",
      sujet: "Report_Q1.pdf",
      type: "sent(Inter)",
      dateArrive: "2023-04-01",
      dateEnregistrer: "2023-04-02",
      status: "En attente",
    },
    {
      num: 4,
      id: "4",
      sujet: "OldRecord_2022.pdf",
      type: "Ministre",
      dateArrive: "2022-12-31",
      dateEnregistrer: "2023-01-02",
      status: "archivé",
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newDocument, setNewDocument] = useState<Omit<Document, "id" | "num">>({
    sujet: "",
    type: "received(Extr)",
    dateArrive: "",
    dateEnregistrer: "",
    dateRetour: "",
    status: "En cours",
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewDocument((prev) => ({
        ...prev,
        sujet: file.name,
        dateArrive: new Date().toISOString().split("T")[0],
        dateEnregistrer: new Date().toISOString().split("T")[0],
      }))
      toast.success("File selected successfully")
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleScan = async () => {
    try {
      // @ts-ignore: Ignoring type check as the Scanner API is not widely supported yet
      const scanner = await navigator.scanner.getScanner()
      const result = await scanner.scan()
      setNewDocument((prev) => ({
        ...prev,
        sujet: `Scanned_Document_${new Date().toISOString().split("T")[0]}.pdf`,
        dateArrive: new Date().toISOString().split("T")[0],
        dateEnregistrer: new Date().toISOString().split("T")[0],
      }))
      toast.success("Document scanned successfully")
    } catch (error) {
      console.error("Scanning failed:", error)
      toast.error("Unable to access the scanner. This feature may not be supported by your browser.")
    }
  }

  const handleAddDocument = () => {
    const newDoc: Document = {
      ...newDocument,
      id: (documents.length + 1).toString(),
      num: documents.length + 1,
    }
    setDocuments([...documents, newDoc])
    setNewDocument({
      sujet: "",
      type: "received(Extr)",
      dateArrive: "",
      dateEnregistrer: "",
      dateRetour: "",
      status: "En cours",
    })
    toast.success("Document added successfully")
  }

  const handleDownload = (document: Document) => {
    console.log(`Downloading ${document.sujet}`)
    toast.success(`Downloading ${document.sujet}`)
  }

  const handleArchive = (document: Document) => {
    setDocuments(documents.map((doc) => (doc.id === document.id ? { ...doc, status: "archivé" } : doc)))
    toast.success(`${document.sujet} has been archived`)
  }

  const handleDelete = (document: Document) => {
    setDocuments(documents.filter((doc) => doc.id !== document.id))
    toast.success(`${document.sujet} has been deleted`)
  }

  return (
    <div className="p-6 w-full">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold mb-6">Document Management</h1>

      <div className="space-y-8">
        {/* Add Document Section */}
        <section>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sujet" className="text-right">
                    Sujet
                  </Label>
                  <Input
                    id="sujet"
                    value={newDocument.sujet}
                    onChange={(e) => setNewDocument({ ...newDocument, sujet: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newDocument.type}
                    onValueChange={(value: Document["type"]) => setNewDocument({ ...newDocument, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateArrive" className="text-right">
                    Date Arrivé
                  </Label>
                  <Input
                    id="dateArrive"
                    type="date"
                    value={newDocument.dateArrive}
                    onChange={(e) => setNewDocument({ ...newDocument, dateArrive: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateEnregistrer" className="text-right">
                    Date Enregistrer
                  </Label>
                  <Input
                    id="dateEnregistrer"
                    type="date"
                    value={newDocument.dateEnregistrer}
                    onChange={(e) => setNewDocument({ ...newDocument, dateEnregistrer: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateRetour" className="text-right">
                    Date de Retour
                  </Label>
                  <Input
                    id="dateRetour"
                    type="date"
                    value={newDocument.dateRetour}
                    onChange={(e) => setNewDocument({ ...newDocument, dateRetour: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newDocument.status}
                    onValueChange={(value: Document["status"]) => setNewDocument({ ...newDocument, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="archivé">Archivé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button variant="outline" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Button variant="outline" onClick={handleScan}>
                  <Scan className="mr-2 h-4 w-4" /> Scanner
                </Button>
                <Button onClick={handleAddDocument}>Ajouter</Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Document List Section */}
        <section>
          <h2 className="text-lg font-medium mb-4">Liste des Documents</h2>
          <Table>
            <TableHeader>
              <TableRow>
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
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.num}</TableCell>
                  <TableCell className="font-medium">{doc.sujet}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.dateArrive}</TableCell>
                  <TableCell>{doc.dateEnregistrer}</TableCell>
                  <TableCell>{doc.dateRetour || "-"}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {doc.status !== "archivé" && (
                        <Button variant="ghost" size="icon" onClick={() => handleArchive(doc)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  )
}

