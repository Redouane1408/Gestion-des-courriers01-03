import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Define the type for the data
interface ChartData {
  browser: string;
  visitors: number;
  fill: string;
}

// Define the type for the props
interface BarChartMixedProps {
  data: ChartData[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Reçus (Extr)",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Reçus (Inter)",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Envoyés (Extr)",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Envoyés (inter)",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Ministre",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

// Export the component with the correct props
export default function BarChartMixed({ data }: BarChartMixedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}