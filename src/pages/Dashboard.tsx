import { AppSidebar } from "@/components/app-sidebar"
import BarChartMixed from "@/components/chart-bar-mixed"
import { ThemeSwitch } from "@/components/ui/ThemeSwitch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full" style={{ alignItems: 'stretch' }}>
            {/* Grid Section */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {/* Chart */}
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
                <BarChartMixed data={chartData} />
              </div>

              {/* Stats Card 1 */}
              <StatsCard
                title="Total Revenue"
                value="$12,345"
                description="+20% from last month"
              />

              {/* Stats Card 2 */}
              <StatsCard
                title="Active Users"
                value="1,234"
                description="+5% from last month"
              />
            </div>

            {/* Table Section */}
            <div className="rounded-xl bg-muted/50 p-4 w-full">
              <h2 className="text-xl font-semibold mb-4">Courier Management</h2>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro du courriers</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead>Etat de courriers</TableHead>
                      <TableHead>Dates Range</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>...</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>0001</TableCell>
                      <TableCell>DGB-Vérification des courriers</TableCell>
                      <TableCell>Courriers reçus (extérieur)</TableCell>
                      <TableCell>2025-02-26 to 2025-03-26</TableCell>
                      <TableCell>En cours de traitement</TableCell>
                      <TableCell>icon</TableCell>
                      <TableCell>Modifier</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>0002</TableCell>
                      <TableCell>Control Financier</TableCell>
                      <TableCell>Courriers envoyés</TableCell>
                      <TableCell>2025-02-12 to 2025-08-01</TableCell>
                      <TableCell>En attente</TableCell>
                      <TableCell>icon</TableCell>
                      <TableCell>Modifier</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>0003</TableCell>
                      <TableCell>Portail electronique </TableCell>
                      <TableCell>Courriers envoyés</TableCell>
                      <TableCell>2025-02-12 to 2025-08-01</TableCell>
                      <TableCell>En attente</TableCell>
                      <TableCell>icon</TableCell>
                      <TableCell>Modifier</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>0004</TableCell>
                      <TableCell>Portail electronique </TableCell>
                      <TableCell>Courriers avec le Ministère</TableCell>
                      <TableCell>2025-02-12 to 2025-08-01</TableCell>
                      <TableCell>En attente</TableCell>
                      <TableCell>icon</TableCell>
                      <TableCell>Modifier</TableCell>
                    </TableRow>
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