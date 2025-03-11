import { AppSidebar } from "@/components/app-sidebar"
//import UsersSection from "@/components/users-section"
import DocumentManagement from "@/components/document-management"

//import BarChartMixed from "@/components/chart-bar-mixed"
import { ThemeSwitch } from "@/components/ui/ThemeSwitch"
//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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
  title: string;
  value: string;
  description: string;
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

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col w-full">
        
          {/* Header */}
          <header className="flex py-2 w-full items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
              
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Importer des Fichiers</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Scanner</BreadcrumbPage>
                  <ThemeSwitch />
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem className="fixed top-4 right-4 inline-flex items-center">
                
                </BreadcrumbItem>

              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full" style={{ alignItems: 'stretch' }}>

            {/* Grid Section */}
            <div className="min-h-screen bg-background">
              <DocumentManagement />
            </div>

          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}