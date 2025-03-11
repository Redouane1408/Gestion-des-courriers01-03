"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, Archive, Trash2, Scan, Plus, ArrowUp, ArrowRight, ArrowDown, Pencil } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, formatDistanceToNow, isBefore, isAfter } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Date validation functions
const isValidDateSequence = (dateArrive: string, dateEnregistrer: string, dateRetour?: string) => {
  const arriveDate = new Date(dateArrive)
  const enregistrerDate = new Date(dateEnregistrer)
  const retourDate = dateRetour ? new Date(dateRetour) : null

  if (isAfter(enregistrerDate, new Date()) || (retourDate && isAfter(retourDate, new Date()))) {
    return false // Future dates not allowed for enregistrer
  }

  if (!isBefore(arriveDate, enregistrerDate)) {
    return false // Arrival must be before registration
  }

  if (retourDate && !isBefore(enregistrerDate, retourDate)) {
    return false // Registration must be before return
  }

  return true
}

// List of ministers and external entities
const externalEntities = [
  "Ministère de l'Intérieur",
  "Ministère des Finances",
  "Ministère de l'Éducation",
  "Ministère de la Santé",
  "Ministère de la Justice",
  "Ministère des Affaires Étrangères",
  "Ministère de la Défense",
  "Ministère de l'Agriculture",
  "Ministère du Commerce",
  "Ministère de l'Industrie",
  "Entreprise Nationale Sonatrach",
  "Entreprise Nationale Sonelgaz",
  "Banque d'Algérie",
  "Office National des Statistiques",
]

// Placeholder data for hierarchical structure
// These will be replaced with actual data provided by the client
const directionGenerales = [
  "Direction Générale des Finances",
  "Direction Générale de l'Administration",
  "Direction Générale des Ressources Humaines",
]

const divisions = {
  "Direction Générale des Finances": ["Division Comptabilité", "Division Budget", "Division Audit"],
  "Direction Générale de l'Administration": ["Division Logistique", "Division Informatique", "Division Juridique"],
  "Direction Générale des Ressources Humaines": ["Division Recrutement", "Division Formation", "Division Paie"],
}

const sousDirections = {
  "Division Comptabilité": ["Sous-Direction Trésorerie", "Sous-Direction Fiscalité"],
  "Division Budget": ["Sous-Direction Planification", "Sous-Direction Contrôle"],
  "Division Audit": ["Sous-Direction Audit Interne", "Sous-Direction Conformité"],
  "Division Logistique": ["Sous-Direction Achats", "Sous-Direction Maintenance"],
  "Division Informatique": ["Sous-Direction Développement", "Sous-Direction Infrastructure"],
  "Division Juridique": ["Sous-Direction Contentieux", "Sous-Direction Contrats"],
  "Division Recrutement": ["Sous-Direction Sélection", "Sous-Direction Intégration"],
  "Division Formation": ["Sous-Direction Formation Continue", "Sous-Direction Développement des Compétences"],
  "Division Paie": ["Sous-Direction Rémunération", "Sous-Direction Avantages Sociaux"],
}

interface HierarchyInfo {
  directionGenerale: string
  division: string
  sousDirection: string
}

interface Document {
  id: string
  num: string
  name: string
  type: "received(Extr)" | "sent(Extr)" | "sent(Inter)" | "received(Inter)" | "Ministre"
  dateArrive: string
  dateEnregistrer: string
  dateRetour?: string
  status: "En cours" | "archivé" | "En attente"
  priority: "high" | "medium" | "low"
  from: string | HierarchyInfo
  to: string | HierarchyInfo
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      num: "001",
      id: "1",
      name: "Invoice_001.pdf",
      type: "received(Extr)",
      dateArrive: "2023-05-15",
      dateEnregistrer: "2023-05-16",
      status: "En cours",
      priority: "medium",
      from: "Ministère des Finances",
      to: {
        directionGenerale: "Direction Générale des Finances",
        division: "Division Comptabilité",
        sousDirection: "Sous-Direction Trésorerie",
      },
    },
    {
      num: "002",
      id: "2",
      name: "Contract_ABC.pdf",
      type: "sent(Extr)",
      dateArrive: "2023-05-10",
      dateEnregistrer: "2023-05-11",
      dateRetour: "2023-05-20",
      status: "archivé",
      priority: "low",
      from: {
        directionGenerale: "Direction Générale de l'Administration",
        division: "Division Logistique",
        sousDirection: "Sous-Direction Achats",
      },
      to: "Ministère de l'Intérieur",
    },
    {
      num: "003",
      id: "3",
      name: "Report_Q1.pdf",
      type: "sent(Inter)",
      dateArrive: "2023-04-01",
      dateEnregistrer: "2023-04-02",
      status: "archivé",
      priority: "high",
      from: {
        directionGenerale: "Direction Générale des Ressources Humaines",
        division: "Division Formation",
        sousDirection: "Sous-Direction Formation Continue",
      },
      to: {
        directionGenerale: "Direction Générale des Finances",
        division: "Division Comptabilité",
        sousDirection: "Sous-Direction Trésorerie",
      },
    },
    {
      num: "004",
      id: "4",
      name: "OldRecord_2022.pdf",
      type: "Ministre",
      dateArrive: "2022-12-31",
      dateEnregistrer: "2023-01-02",
      status: "archivé",
      priority: "low",
      from: "Ministère de la Justice",
      to: {
        directionGenerale: "Direction Générale des Finances",
        division: "Division Audit",
        sousDirection: "Sous-Direction Conformité",
      },
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newDocument, setNewDocument] = useState<Omit<Document, "id">>({
    num: "",
    name: "",
    type: "received(Extr)",
    dateArrive: "",
    dateEnregistrer: "",
    dateRetour: "",
    status: "En cours",
    priority: "medium",
    from: "",
    to: "",
  })

  const [selectedDirection, setSelectedDirection] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [fromOptions, setFromOptions] = useState<string[]>([])
  const [toOptions, setToOptions] = useState<string[]>([])

  // Update from/to options based on document type
  useEffect(() => {
    if (newDocument.type.startsWith("received")) {
      // For received documents, "from" is external, "to" is internal
      setFromOptions(externalEntities)
      setToOptions(directionGenerales)
    } else if (newDocument.type.startsWith("sent")) {
      // For sent documents, "from" is internal, "to" is external
      setFromOptions(directionGenerales)
      setToOptions(externalEntities)
    } else {
      // For other types, both can be any
      setFromOptions([...externalEntities, ...directionGenerales])
      setToOptions([...externalEntities, ...directionGenerales])
    }
  }, [newDocument.type])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Don't change the name/subject based on the file name
      setNewDocument((prev) => ({
        ...prev,
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
    if (!isValidDateSequence(newDocument.dateArrive, newDocument.dateEnregistrer, newDocument.dateRetour)) {
      toast.error("Dates invalides. Veuillez vérifier que les dates suivent un ordre logique.")
      return
    }

    const newDoc: Document = {
      ...newDocument,
      id: (documents.length + 1).toString(),
    }
    setDocuments([...documents, newDoc])
    setNewDocument({
      num: "",
      name: "",
      type: "received(Extr)",
      dateArrive: "",
      dateEnregistrer: "",
      dateRetour: "",
      status: "En cours",
      priority: "medium",
      from: "",
      to: "",
    })
    setSelectedDirection("")
    setSelectedDivision("")
    toast.success("Document added successfully")
  }

  const handleDownload = (document: Document) => {
    console.log(`Downloading ${document.name}`)
    toast.success(`Downloading ${document.name}`)
  }

  const handleArchive = (document: Document) => {
    setDocuments(documents.map((doc) => (doc.id === document.id ? { ...doc, status: "archivé" } : doc)))
    toast.success(`${document.name} has been archived`)
  }

  const handleDelete = (document: Document) => {
    setDocuments(documents.filter((doc) => doc.id !== document.id))
    toast.success(`${document.name} has been deleted`)
  }

  const getPriorityIcon = (priority: string, type: string, status: string) => {
    // Case 3: Both type is sent and status is "En cours"
    if ((type === "sent(Extr)" || type === "sent(Inter)") && status === "En cours") {
      return <ArrowUp className="h-4 w-4 text-red-500" />
    }

    // Case 1: Type is sent
    if (type === "sent(Extr)" || type === "sent(Inter)") {
      return <ArrowUp className="h-4 w-4 text-red-500" />
    }

    // Case 2: Status is "En cours"
    if (status === "En cours") {
      return <ArrowUp className="h-4 w-4 text-red-500" />
    }

    // Default cases based on priority
    switch (priority) {
      case "high":
        return <ArrowUp className="h-4 w-4 text-red-500" />
      case "medium":
        return <ArrowRight className="h-4 w-4 text-yellow-500" />
      case "low":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  // Get date field label based on document type
  const getDateArriveLabel = (type: string) => {
    if (type.startsWith("sent")) {
      return "Date d'envois"
    }
    return "Date Arrivé"
  }

  // Handle direction change
  const handleDirectionChange = (value: string) => {
    setSelectedDirection(value)
    setSelectedDivision("")
    setNewDocument((prev) => ({
      ...prev,
      directionGenerale: value,
      division: "",
      sousDirection: "",
    }))
  }

  // Handle division change
  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value)
    setNewDocument((prev) => ({
      ...prev,
      division: value,
      sousDirection: "",
    }))
  }

  // Handle type change
  const handleTypeChange = (value: string) => {
    const newType = value as Document["type"]
    let newStatus = newDocument.status

    // For sent documents, remove "En cours" status option
    if (newType.startsWith("sent") && newStatus === "En cours") {
      newStatus = "archivé"
    }

    setNewDocument((prev) => ({
      ...prev,
      type: newType,
      status: newStatus,
      from: "",
      to: "",
    }))
  }

  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc)
  }

  const handleSaveEdit = (editedDoc: Document) => {
    setDocuments(documents.map((doc) => (doc.id === editedDoc.id ? editedDoc : doc)))
    setEditingDocument(null)
  }

  const handleFromDirectionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      from: {
        directionGenerale: value,
        division: "",
        sousDirection: "",
      },
    }))
  }

  const handleFromDivisionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      from: {
        ...(prev.from as HierarchyInfo),
        division: value,
        sousDirection: "",
      },
    }))
  }

  const handleFromSousDirectionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      from: {
        ...(prev.from as HierarchyInfo),
        sousDirection: value,
      },
    }))
  }

  const handleToDirectionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      to: {
        directionGenerale: value,
        division: "",
        sousDirection: "",
      },
    }))
  }

  const handleToDivisionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      to: {
        ...(prev.to as HierarchyInfo),
        division: value,
        sousDirection: "",
      },
    }))
  }

  const handleToSousDirectionChange = (value: string) => {
    setNewDocument((prev) => ({
      ...prev,
      to: {
        ...(prev.to as HierarchyInfo),
        sousDirection: value,
      },
    }))
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
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="num">N° de courriers</Label>
                    <Input
                      id="num"
                      value={newDocument.num}
                      onChange={(e) => setNewDocument({ ...newDocument, num: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Sujet</Label>
                    <Input
                      id="name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newDocument.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newDocument.priority}
                      onValueChange={(value: Document["priority"]) =>
                        setNewDocument({ ...newDocument, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateArrive">{getDateArriveLabel(newDocument.type)}</Label>
                    <Input
                      id="dateArrive"
                      type="date"
                      value={newDocument.dateArrive}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setNewDocument({ ...newDocument, dateArrive: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateEnregistrer">Date Enregistrer</Label>
                    <Input
                      id="dateEnregistrer"
                      type="date"
                      value={newDocument.dateEnregistrer}
                      min={newDocument.dateArrive}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setNewDocument({ ...newDocument, dateEnregistrer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateRetour">Date de Retour</Label>
                    <Input
                      id="dateRetour"
                      type="date"
                      value={newDocument.dateRetour || ""}
                      min={newDocument.dateEnregistrer}
                      onChange={(e) => setNewDocument({ ...newDocument, dateRetour: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Type selection remains the same */}

                  {/* From section */}
                  <div className="space-y-2">
                    <Label>From</Label>
                    {newDocument.type.startsWith("sent") || newDocument.type === "received(Inter)" ? (
                      // Show full hierarchy for sent documents and received internal
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Direction Générale</Label>
                          <Select
                            value={
                              typeof newDocument.from === "object" && newDocument.from !== null
                                ? newDocument.from.directionGenerale
                                : ""
                            }
                            onValueChange={(value) => handleFromDirectionChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {directionGenerales.map((dir) => (
                                <SelectItem key={dir} value={dir}>
                                  {dir}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Division</Label>
                          <Select
                            value={
                              typeof newDocument.from === "object" && newDocument.from !== null
                                ? newDocument.from.division
                                : ""
                            }
                            onValueChange={(value) => handleFromDivisionChange(value)}
                            disabled={
                              !(
                                typeof newDocument.from === "object" &&
                                newDocument.from !== null &&
                                newDocument.from.directionGenerale
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeof newDocument.from === "object" &&
                                newDocument.from !== null &&
                                newDocument.from.directionGenerale &&
                                divisions[newDocument.from.directionGenerale]?.map((div) => (
                                  <SelectItem key={div} value={div}>
                                    {div}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Sous-Direction</Label>
                          <Select
                            value={
                              typeof newDocument.from === "object" && newDocument.from !== null
                                ? newDocument.from.sousDirection
                                : ""
                            }
                            onValueChange={(value) => handleFromSousDirectionChange(value)}
                            disabled={
                              !(
                                typeof newDocument.from === "object" &&
                                newDocument.from !== null &&
                                newDocument.from.division
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sous-direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeof newDocument.from === "object" &&
                                newDocument.from !== null &&
                                newDocument.from.division &&
                                sousDirections[newDocument.from.division]?.map((sousDir) => (
                                  <SelectItem key={sousDir} value={sousDir}>
                                    {sousDir}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      // Show external entities for received external
                      <Select
                        value={typeof newDocument.from === "string" ? newDocument.from : ""}
                        onValueChange={(value) => setNewDocument({ ...newDocument, from: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {externalEntities.map((entity) => (
                            <SelectItem key={entity} value={entity}>
                              {entity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* To section */}
                  <div className="space-y-2">
                    <Label>To</Label>
                    {newDocument.type === "sent(Inter)" ||
                    newDocument.type === "received(Inter)" ||
                    newDocument.type === "received(Extr)" ? (
                      // Show full hierarchy for internal documents and received external
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Direction Générale</Label>
                          <Select
                            value={
                              typeof newDocument.to === "object" && newDocument.to !== null
                                ? newDocument.to.directionGenerale
                                : ""
                            }
                            onValueChange={(value) => handleToDirectionChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {directionGenerales.map((dir) => (
                                <SelectItem key={dir} value={dir}>
                                  {dir}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Division</Label>
                          <Select
                            value={
                              typeof newDocument.to === "object" && newDocument.to !== null
                                ? newDocument.to.division
                                : ""
                            }
                            onValueChange={(value) => handleToDivisionChange(value)}
                            disabled={
                              !(
                                typeof newDocument.to === "object" &&
                                newDocument.to !== null &&
                                newDocument.to.directionGenerale
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeof newDocument.to === "object" &&
                                newDocument.to !== null &&
                                newDocument.to.directionGenerale &&
                                divisions[newDocument.to.directionGenerale]?.map((div) => (
                                  <SelectItem key={div} value={div}>
                                    {div}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Sous-Direction</Label>
                          <Select
                            value={
                              typeof newDocument.to === "object" && newDocument.to !== null
                                ? newDocument.to.sousDirection
                                : ""
                            }
                            onValueChange={(value) => handleToSousDirectionChange(value)}
                            disabled={
                              !(
                                typeof newDocument.to === "object" &&
                                newDocument.to !== null &&
                                newDocument.to.division
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sous-direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeof newDocument.to === "object" &&
                                newDocument.to !== null &&
                                newDocument.to.division &&
                                sousDirections[newDocument.to.division]?.map((sousDir) => (
                                  <SelectItem key={sousDir} value={sousDir}>
                                    {sousDir}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      // Show external entities for sent external
                      <Select
                        value={typeof newDocument.to === "string" ? newDocument.to : ""}
                        onValueChange={(value) => setNewDocument({ ...newDocument, to: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {externalEntities.map((entity) => (
                            <SelectItem key={entity} value={entity}>
                              {entity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newDocument.status}
                    onValueChange={(value: Document["status"]) => setNewDocument({ ...newDocument, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {!newDocument.type.startsWith("sent") && <SelectItem value="En cours">En cours</SelectItem>}
                      <SelectItem value="archivé">Archivé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                  <Button variant="outline" onClick={handleScan}>
                    <Scan className="mr-2 h-4 w-4" /> Scanner
                  </Button>
                </div>
                <Button onClick={handleAddDocument}>Add Document</Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Document List Section */}
        <section>
          <h2 className="text-lg font-medium mb-4">Document List</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°de courriers</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Date Arrivé/Envois</TableHead>
                  <TableHead>Date Enregistrer</TableHead>
                  <TableHead>Date de Retour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.num}</TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      {typeof doc.from === "string"
                        ? doc.from
                        : `${doc.from.directionGenerale} - ${doc.from.division} - ${doc.from.sousDirection}`}
                    </TableCell>
                    <TableCell>
                      {typeof doc.to === "string"
                        ? doc.to
                        : `${doc.to.directionGenerale} - ${doc.to.division} - ${doc.to.sousDirection}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{getDateArriveLabel(doc.type)}</span>
                        {doc.dateArrive}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Date Enregistrer</span>
                        {doc.dateEnregistrer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Date de Retour</span>
                        {doc.dateRetour || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium",
                            doc.status === "En cours"
                              ? "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                              : doc.status === "archivé"
                                ? "bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400"
                                : "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400",
                          )}
                        >
                          {doc.status}
                        </span>
                        {doc.status === "En cours" && (
                          <span className="text-xs text-muted-foreground">
                            En traitement depuis {formatDistanceToNow(new Date(doc.dateEnregistrer), { locale: fr })}
                          </span>
                        )}
                        {doc.status === "archivé" && doc.dateRetour && (
                          <span className="text-xs text-muted-foreground">
                            Archivé le {format(new Date(doc.dateRetour), "dd/MM/yyyy")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getPriorityIcon(doc.priority, doc.type, doc.status)}
                        <span className="ml-1">{doc.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Modifier le courriers</DialogTitle>
                            </DialogHeader>
                            <EditDocumentForm
                              document={doc}
                              onSave={handleSaveEdit}
                              directionGenerales={directionGenerales}
                              divisions={divisions}
                              sousDirections={sousDirections}
                              externalEntities={externalEntities}
                            />
                          </DialogContent>
                        </Dialog>
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
          </div>
        </section>
      </div>
    </div>
  )
}

interface EditDocumentFormProps {
  document: Document
  onSave: (editedDoc: Document) => void
  directionGenerales: string[]
  divisions: Record<string, string[]>
  sousDirections: Record<string, string[]>
  externalEntities: string[]
}

function EditDocumentForm({
  document,
  onSave,
  directionGenerales,
  divisions,
  sousDirections,
  externalEntities,
}: EditDocumentFormProps) {
  const [editedDoc, setEditedDoc] = useState<Document>(document)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fromOptions, setFromOptions] = useState<string[]>([])
  const [toOptions, setToOptions] = useState<string[]>([])

  // Update from/to options based on document type
  useEffect(() => {
    if (editedDoc.type.startsWith("received")) {
      // For received documents, "from" is external, "to" is internal
      setFromOptions(externalEntities)
      setToOptions(directionGenerales)
    } else if (editedDoc.type.startsWith("sent")) {
      // For sent documents, "from" is internal, "to" is external
      setFromOptions(directionGenerales)
      setToOptions(externalEntities)
    } else {
      // For other types, both can be any
      setFromOptions([...externalEntities, ...directionGenerales])
      setToOptions([...externalEntities, ...directionGenerales])
    }
  }, [editedDoc.type, externalEntities, directionGenerales])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedDoc((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate dates
    const arriveDate = new Date(editedDoc.dateArrive)
    const enregistrerDate = new Date(editedDoc.dateEnregistrer)
    const retourDate = editedDoc.dateRetour ? new Date(editedDoc.dateRetour) : null

    if (enregistrerDate < arriveDate) {
      alert("La date d'enregistrement ne peut pas être antérieure à la date d'arrivée/envoi")
      return
    }

    onSave(editedDoc)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Get date field label based on document type
  const getDateArriveLabel = () => {
    if (editedDoc.type.startsWith("sent")) {
      return "Date d'envois"
    }
    return "Date Arrivé"
  }

  // Handle direction change to update available divisions
  const handleDirectionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      directionGenerale: value,
      division: "", // Reset division when direction changes
      sousDirection: "", // Reset sous-direction when direction changes
    }))
  }

  // Handle division change to update available sous-directions
  const handleDivisionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      division: value,
      sousDirection: "", // Reset sous-direction when division changes
    }))
  }

  // Handle type change to update status options and from/to fields
  const handleTypeChange = (value: string) => {
    const newType = value as Document["type"]
    let newStatus = editedDoc.status

    // For sent documents, remove "En cours" status option
    if (newType.startsWith("sent") && newStatus === "En cours") {
      newStatus = "archivé"
    }

    setEditedDoc((prev) => ({
      ...prev,
      type: newType,
      status: newStatus,
      from: "",
      to: "",
    }))
  }

  const handleFromDirectionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      from: {
        directionGenerale: value,
        division: "",
        sousDirection: "",
      },
    }))
  }

  const handleFromDivisionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      from: {
        ...(prev.from as HierarchyInfo),
        division: value,
        sousDirection: "",
      },
    }))
  }

  const handleFromSousDirectionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      from: {
        ...(prev.from as HierarchyInfo),
        sousDirection: value,
      },
    }))
  }

  const handleToDirectionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      to: {
        directionGenerale: value,
        division: "",
        sousDirection: "",
      },
    }))
  }

  const handleToDivisionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      to: {
        ...(prev.to as HierarchyInfo),
        division: value,
        sousDirection: "",
      },
    }))
  }

  const handleToSousDirectionChange = (value: string) => {
    setEditedDoc((prev) => ({
      ...prev,
      to: {
        ...(prev.to as HierarchyInfo),
        sousDirection: value,
      },
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-16 relative">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="num">N° de courriers</Label>
          <Input id="num" name="num" value={editedDoc.num} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Sujet</Label>
          <Input id="name" name="name" value={editedDoc.name} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" value={editedDoc.type} onValueChange={handleTypeChange}>
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
          <Label htmlFor="priority">Priority</Label>
          <Select
            name="priority"
            value={editedDoc.priority}
            onValueChange={(value) => handleChange({ target: { name: "priority", value } } as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* From section */}
      <div className="space-y-2">
        <Label>From</Label>
        {editedDoc.type.startsWith("sent") || editedDoc.type === "received(Inter)" ? (
          // Show full hierarchy for sent documents and received internal
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Direction Générale</Label>
              <Select
                value={
                  typeof editedDoc.from === "object" && editedDoc.from !== null
                    ? (editedDoc.from as HierarchyInfo).directionGenerale
                    : ""
                }
                onValueChange={(value) => handleFromDirectionChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {directionGenerales.map((dir) => (
                    <SelectItem key={dir} value={dir}>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Division</Label>
              <Select
                value={
                  typeof editedDoc.from === "object" && editedDoc.from !== null
                    ? (editedDoc.from as HierarchyInfo).division
                    : ""
                }
                onValueChange={(value) => handleFromDivisionChange(value)}
                disabled={
                  !(
                    typeof editedDoc.from === "object" &&
                    editedDoc.from !== null &&
                    (editedDoc.from as HierarchyInfo).directionGenerale
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {typeof editedDoc.from === "object" &&
                    editedDoc.from !== null &&
                    (editedDoc.from as HierarchyInfo).directionGenerale &&
                    divisions[(editedDoc.from as HierarchyInfo).directionGenerale]?.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sous-Direction</Label>
              <Select
                value={
                  typeof editedDoc.from === "object" && editedDoc.from !== null
                    ? (editedDoc.from as HierarchyInfo).sousDirection
                    : ""
                }
                onValueChange={(value) => handleFromSousDirectionChange(value)}
                disabled={
                  !(
                    typeof editedDoc.from === "object" &&
                    editedDoc.from !== null &&
                    (editedDoc.from as HierarchyInfo).division
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sous-direction" />
                </SelectTrigger>
                <SelectContent>
                  {typeof editedDoc.from === "object" &&
                    editedDoc.from !== null &&
                    (editedDoc.from as HierarchyInfo).division &&
                    sousDirections[(editedDoc.from as HierarchyInfo).division]?.map((sousDir) => (
                      <SelectItem key={sousDir} value={sousDir}>
                        {sousDir}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          // Show external entities for received external
          <Select
            value={typeof editedDoc.from === "string" ? editedDoc.from : ""}
            onValueChange={(value) => setEditedDoc({ ...editedDoc, from: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {externalEntities.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* To section */}
      <div className="space-y-2">
        <Label>To</Label>
        {editedDoc.type === "sent(Inter)" ||
        editedDoc.type === "received(Inter)" ||
        editedDoc.type === "received(Extr)" ? (
          // Show full hierarchy for internal documents and received external
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Direction Générale</Label>
              <Select
                value={
                  typeof editedDoc.to === "object" && editedDoc.to !== null
                    ? (editedDoc.to as HierarchyInfo).directionGenerale
                    : ""
                }
                onValueChange={(value) => handleToDirectionChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {directionGenerales.map((dir) => (
                    <SelectItem key={dir} value={dir}>
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Division</Label>
              <Select
                value={
                  typeof editedDoc.to === "object" && editedDoc.to !== null
                    ? (editedDoc.to as HierarchyInfo).division
                    : ""
                }
                onValueChange={(value) => handleToDivisionChange(value)}
                disabled={
                  !(
                    typeof editedDoc.to === "object" &&
                    editedDoc.to !== null &&
                    (editedDoc.to as HierarchyInfo).directionGenerale
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {typeof editedDoc.to === "object" &&
                    editedDoc.to !== null &&
                    (editedDoc.to as HierarchyInfo).directionGenerale &&
                    divisions[(editedDoc.to as HierarchyInfo).directionGenerale]?.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sous-Direction</Label>
              <Select
                value={
                  typeof editedDoc.to === "object" && editedDoc.to !== null
                    ? (editedDoc.to as HierarchyInfo).sousDirection
                    : ""
                }
                onValueChange={(value) => handleToSousDirectionChange(value)}
                disabled={
                  !(
                    typeof editedDoc.to === "object" &&
                    editedDoc.to !== null &&
                    (editedDoc.to as HierarchyInfo).division
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sous-direction" />
                </SelectTrigger>
                <SelectContent>
                  {typeof editedDoc.to === "object" &&
                    editedDoc.to !== null &&
                    (editedDoc.to as HierarchyInfo).division &&
                    sousDirections[(editedDoc.to as HierarchyInfo).division]?.map((sousDir) => (
                      <SelectItem key={sousDir} value={sousDir}>
                        {sousDir}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          // Show external entities for sent external
          <Select
            value={typeof editedDoc.to === "string" ? editedDoc.to : ""}
            onValueChange={(value) => setEditedDoc({ ...editedDoc, to: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {externalEntities.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateArrive">{getDateArriveLabel()}</Label>
          <Input
            id="dateArrive"
            name="dateArrive"
            type="date"
            value={editedDoc.dateArrive}
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateEnregistrer">Date Enregistrer</Label>
          <Input
            id="dateEnregistrer"
            name="dateEnregistrer"
            type="date"
            value={editedDoc.dateEnregistrer}
            min={editedDoc.dateArrive}
            max={new Date().toISOString().split("T")[0]}
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
            min={editedDoc.dateEnregistrer}
            onChange={handleChange}
          />
        </div>
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
            {!editedDoc.type.startsWith("sent") && <SelectItem value="En cours">En cours</SelectItem>}
            <SelectItem value="archivé">Archivé</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center pt-4 sticky bottom-0 bg-background pb-2 border-t mt-6">
        <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <Button type="button" variant="outline" onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}

