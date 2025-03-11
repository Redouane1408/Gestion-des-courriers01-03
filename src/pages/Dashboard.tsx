"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
import {
  Download,
  Archive,
  Trash2,
  Pencil,
  Upload,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Filter,
  X,
  Search,
  Calendar,
  Tag,
  Building2,
  Building,
  FileType,
  AlertCircle,
  Layers3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast, Toaster } from "sonner"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/date-picker-with-range"

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

// Document interface
interface Document {
  id: string
  num: string // Changed to string for manual input
  name: string
  type: "received(Extr)" | "sent(Extr)" | "sent(Inter)" | "received(Inter)" | "Ministre"
  dateArrive: string
  dateEnregistrer: string
  dateRetour?: string
  status: "En cours" | "archivé" | "En attente"
  priority: "high" | "medium" | "low"
  directionGenerale: string
  division: string
  sousDirection: string
  from: string
  to: string
}

// Filter interface
interface FilterState {
  searchTerm: string
  searchNum: string
  type: string
  status: string
  dateArriveRange: DateRange | undefined
  dateEnregistrerRange: DateRange | undefined
  dateRetourRange: DateRange | undefined
  direction: string
  division: string
  sousDirection: string
  priority: string
  from: string
  to: string
}

export default function Page() {
  // Sample document data
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
      directionGenerale: "Direction Générale des Finances",
      division: "Division Comptabilité",
      sousDirection: "Sous-Direction Trésorerie",
      from: "Ministère des Finances",
      to: "Direction Générale des Finances",
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
      directionGenerale: "Direction Générale de l'Administration",
      division: "Division Logistique",
      sousDirection: "Sous-Direction Achats",
      from: "Direction Générale de l'Administration",
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
      directionGenerale: "Direction Générale des Ressources Humaines",
      division: "Division Formation",
      sousDirection: "Sous-Direction Formation Continue",
      from: "Direction Générale des Ressources Humaines",
      to: "Direction Générale des Finances",
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
      directionGenerale: "Direction Générale des Finances",
      division: "Division Audit",
      sousDirection: "Sous-Direction Conformité",
      from: "Ministère de la Justice",
      to: "Direction Générale des Finances",
    },
  ])

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    searchNum: "",
    type: "",
    status: "",
    dateArriveRange: undefined,
    dateEnregistrerRange: undefined,
    dateRetourRange: undefined,
    direction: "",
    division: "",
    sousDirection: "",
    priority: "",
    from: "",
    to: "",
  })
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
      case "archivé":
        return "bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400"
      case "En attente":
        return "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400"
    }
  }

  // Update the getPriorityIcon function to match the exact requirements
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
      (filters.searchTerm === "" || doc.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.searchNum === "" || doc.num.toLowerCase().includes(filters.searchNum.toLowerCase())) &&
      (!filters.type || filters.type === "all" || doc.type === filters.type) &&
      (!filters.status || filters.status === "all" || doc.status === filters.status) &&
      (!filters.priority || filters.priority === "all" || doc.priority === filters.priority) &&
      (!filters.dateArriveRange?.from || new Date(doc.dateArrive) >= filters.dateArriveRange.from) &&
      (!filters.dateArriveRange?.to || new Date(doc.dateArrive) <= filters.dateArriveRange.to) &&
      (!filters.dateEnregistrerRange?.from || new Date(doc.dateEnregistrer) >= filters.dateEnregistrerRange.from) &&
      (!filters.dateEnregistrerRange?.to || new Date(doc.dateEnregistrer) <= filters.dateEnregistrerRange.to) &&
      (!filters.dateRetourRange?.from || !doc.dateRetour || new Date(doc.dateRetour) >= filters.dateRetourRange.from) &&
      (!filters.dateRetourRange?.to || !doc.dateRetour || new Date(doc.dateRetour) <= filters.dateRetourRange.to) &&
      (!filters.direction || filters.direction === "all" || doc.directionGenerale === filters.direction) &&
      (!filters.division || filters.division === "all" || doc.division === filters.division) &&
      (!filters.sousDirection || filters.sousDirection === "all" || doc.sousDirection === filters.sousDirection) &&
      (!filters.from || filters.from === "all" || doc.from.toLowerCase().includes(filters.from.toLowerCase())) &&
      (!filters.to || filters.to === "all" || doc.to.toLowerCase().includes(filters.to.toLowerCase())),
  )

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc)
  }

  const handleSaveEdit = (editedDoc: Document) => {
    setDocuments(documents.map((doc) => (doc.id === editedDoc.id ? editedDoc : doc)))
    setEditingDocument(null)
    toast.success(`${editedDoc.name} has been updated`)
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

  // Get date field label based on document type
  const getDateArriveLabel = (type: string) => {
    if (type.startsWith("sent")) {
      return "Date d'envois"
    }
    return "Date Arrivé"
  }

  // Handle filter change for date ranges
  const handleDateRangeChange = (key: keyof FilterState, range: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: range }))
  }

  // Handle filter change
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))

    // Reset dependent filters if needed
    if (key === "direction") {
      setFilters((prev) => ({ ...prev, division: "", sousDirection: "" }))
    } else if (key === "division") {
      setFilters((prev) => ({ ...prev, sousDirection: "" }))
    } else if (key === "type") {
      // Reset from/to fields when type changes to ensure proper configuration
      setFilters((prev) => ({ ...prev, from: "", to: "" }))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      searchNum: "",
      type: "",
      status: "",
      dateArriveRange: undefined,
      dateEnregistrerRange: undefined,
      dateRetourRange: undefined,
      direction: "",
      division: "",
      sousDirection: "",
      priority: "",
      from: "",
      to: "",
    })
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).filter((value) => {
    if (value === undefined || value === "") return false
    if (typeof value === "object" && value !== null) {
      // For DateRange objects
      return value.from !== undefined || value.to !== undefined
    }
    return true
  }).length

  // Fix the overflow issue that causes the band at the bottom of the page
  // Add CSS animation for the popover
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const style = document.createElement("style")
    style.textContent = `
      @keyframes popover-content-show {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col w-full overflow-hidden">
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
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full overflow-auto" style={{ alignItems: "stretch" }}>
            <Toaster position="top-right" />
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Courier Management</h2>

                {/* Filter Section */}
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="relative">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                      {activeFilterCount > 0 && (
                        <Badge
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                          variant="destructive"
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[850px] p-0 transform origin-top shadow-lg"
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    alignOffset={0}
                    forceMount
                    style={{
                      animation: "popover-content-show 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-medium text-lg">Filtres</h3>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                          <X className="h-4 w-4 mr-1" /> Effacer tout
                        </Button>
                      </div>
                      <div className="p-4 grid grid-cols-4 gap-x-6 gap-y-4 max-h-[600px] overflow-y-auto">
                        {/* Search fields in their own section */}
                        <div className="col-span-4 mb-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <Search className="h-4 w-4 mr-2" /> Recherche par sujet
                              </Label>
                              <Input
                                placeholder="Rechercher par sujet..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <Search className="h-4 w-4 mr-2" /> Recherche par N° de courrier
                              </Label>
                              <Input
                                placeholder="Rechercher par N° de courrier..."
                                value={filters.searchNum}
                                onChange={(e) => handleFilterChange("searchNum", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Main filters in a 4-column grid */}
                        <div className="space-y-2">
                          <Label className="flex items-center">
                            <FileType className="h-4 w-4 mr-2" /> Type
                          </Label>
                          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les types</SelectItem>
                              <SelectItem value="received(Extr)">Received (External)</SelectItem>
                              <SelectItem value="sent(Extr)">Sent (External)</SelectItem>
                              <SelectItem value="sent(Inter)">Sent (Internal)</SelectItem>
                              <SelectItem value="received(Inter)">Received (Internal)</SelectItem>
                              <SelectItem value="Ministre">Ministre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" /> Status
                          </Label>
                          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les statuts</SelectItem>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="archivé">Archivé</SelectItem>
                              <SelectItem value="En attente">En attente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center">
                            <Tag className="h-4 w-4 mr-2" /> Priorité
                          </Label>
                          <Select
                            value={filters.priority}
                            onValueChange={(value) => handleFilterChange("priority", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Toutes les priorités" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les priorités</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" /> Direction Générale
                          </Label>
                          <Select
                            value={filters.direction}
                            onValueChange={(value) => handleFilterChange("direction", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Toutes les directions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Toutes les directions</SelectItem>
                              {directionGenerales.map((dir) => (
                                <SelectItem key={dir} value={dir}>
                                  {dir}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {filters.direction && (
                          <div className="space-y-2">
                            <Label className="flex items-center">
                              <Building className="h-4 w-4 mr-2" /> Division
                            </Label>
                            <Select
                              value={filters.division}
                              onValueChange={(value) => handleFilterChange("division", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Toutes les divisions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Toutes les divisions</SelectItem>
                                {divisions[filters.direction as keyof typeof divisions]?.map((div) => (
                                  <SelectItem key={div} value={div}>
                                    {div}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {filters.division && (
                          <div className="space-y-2">
                            <Label className="flex items-center">
                              <Layers3 className="h-4 w-4 mr-2" /> Sous-Direction
                            </Label>
                            <Select
                              value={filters.sousDirection}
                              onValueChange={(value) => handleFilterChange("sousDirection", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Toutes les sous-directions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Toutes les sous-directions</SelectItem>
                                {sousDirections[filters.division as keyof typeof sousDirections]?.map((sousDir) => (
                                  <SelectItem key={sousDir} value={sousDir}>
                                    {sousDir}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Date Range Pickers */}
                        <div className="col-span-4 mb-4">
                          <Label className="flex items-center mb-4">
                            <Calendar className="h-4 w-4 mr-2" /> Plages de dates
                          </Label>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label>Date Arrivé/Envois</Label>
                              <DateRangePicker
                                dateRange={filters.dateArriveRange}
                                onDateRangeChange={(range) => handleDateRangeChange("dateArriveRange", range)}
                                placeholder="Sélectionner une plage de dates"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Date Enregistrer</Label>
                              <DateRangePicker
                                dateRange={filters.dateEnregistrerRange}
                                onDateRangeChange={(range) => handleDateRangeChange("dateEnregistrerRange", range)}
                                placeholder="Sélectionner une plage de dates"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Date de Retour</Label>
                              <DateRangePicker
                                dateRange={filters.dateRetourRange}
                                onDateRangeChange={(range) => handleDateRangeChange("dateRetourRange", range)}
                                placeholder="Sélectionner une plage de dates"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-4 mt-4">
                          <div className="flex justify-end border-t pt-4">
                            <Button onClick={() => setIsFilterOpen(false)}>Appliquer les filtres</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                        <TableCell>{doc.from}</TableCell>
                        <TableCell>{doc.to}</TableCell>
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
                              className={cn("px-3 py-1.5 rounded-full text-xs font-medium", getStatusColor(doc.status))}
                            >
                              {doc.status}
                            </span>
                            {doc.status === "En cours" && (
                              <span className="text-xs text-muted-foreground">
                                En traitement depuis{" "}
                                {formatDistanceToNow(new Date(doc.dateEnregistrer), { locale: fr })}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Select
            name="from"
            value={editedDoc.from}
            onValueChange={(value) => handleChange({ target: { name: "from", value } } as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fromOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Select
            name="to"
            value={editedDoc.to}
            onValueChange={(value) => handleChange({ target: { name: "to", value } } as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {toOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

