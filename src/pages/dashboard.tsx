import  Sidebar  from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {ChartCard} from "../components/chartcard";
import {Component} from "../components/piechart";


const Dashboard: React.FC = () => {
  return (
    <div className="flex h-full bg-gradient-to-r from-blue-200 to-purple-300 p-6">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="w-full max-w-md shadow-xl rounded-lg border bg-white p-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg">80</p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-md shadow-xl rounded-lg border bg-white p-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Closed Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg">50</p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-md shadow-xl rounded-lg border bg-white p-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg">22</p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs shadow-xl rounded-lg border bg-white p-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg">25</p>
            </CardContent>
          </Card>
          <div className="p-6">
          <ChartCard/>
        </div>
        <div className="p-6">
          <Component/>
        </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
