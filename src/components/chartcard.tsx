
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"
const ticketData = [
  { month: "Jan", openTickets: 120, closedTickets: 80 },
  { month: "Feb", openTickets: 200, closedTickets: 150 },
  { month: "Mar", openTickets: 170, closedTickets: 140 },
  { month: "Apr", openTickets: 90, closedTickets: 100 },
  { month: "May", openTickets: 230, closedTickets: 180 },
  { month: "Jun", openTickets: 250, closedTickets: 200 },
]

const chartConfig = {
  openTickets: {
    label: "Open Tickets",
    color: "#2563eb", 
  },
  closedTickets: {
    label: "Closed Tickets",
    color: "#60a5fa", 
  },
}

export function ChartCard() {
  return (
    <Card className="min-h-[300px] w-full bg-white shadow-md rounded-lg p-2">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-4">Tickets Overview</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={ticketData} barSize={50}>
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="openTickets" name={chartConfig.openTickets.label} fill={chartConfig.openTickets.color} radius={[4, 4, 0, 0]} />
          <Bar dataKey="closedTickets" name={chartConfig.closedTickets.label} fill={chartConfig.closedTickets.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
