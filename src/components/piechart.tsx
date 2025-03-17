import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart"
const chartData = [
  { status: "open", count: 80, fill: "var(--color-open)" },
  { status: "Inprogress", count: 22, fill: "var(--color-Inprogress)" },
  { status: "Resolved", count: 25, fill: "var(--color-Resolved)" },
  { status: "closed", count: 50, fill: "var(--color-closed)" },
  { status: "other", count: 100, fill: "var(--color-other)" },
]

const chartConfig = {
  status: {
    label: "Tickets",
  },
  open: {
    label: "open",
    color: "#0E9F6E",
  },
  Inprogress: {
    label: "Inprogress",
    color: "#F8B4D9",
  },
  Resolved: {
    label: "Resolved",
    color: "#A4CAFE",
  },
  closed: {
    label: "closed",
    color: "#374151",
  },
  other: {
    label: "Other",
    color: "#FACA15",
  },
} satisfies ChartConfig

export function Component() {
  const totalTickets= React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    
    <Card className="min-h-[300px] w-full bg-white shadow-md rounded-lg p-2">

      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center text-xl font-bold text-gray-800 mb-4">Tickets Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTickets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tickets
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total Tickets for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}  