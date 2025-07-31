import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBookingsByDateRange } from "@/services/bookingService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { format, startOfMonth, eachDayOfInterval } from "date-fns";
import { useMemo } from "react";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";
import ComboSnackPieChart, { type ComboSnackData } from "./components/ComboSnackPieChart";
import ComboTable, { type ComboSalesData } from "./components/ComboTable";
import SnackTable, { type SnackSalesData } from "./components/SnackTable";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const bookingsQuery = useBookingsByDateRange(startDate, endDate);

  const bookings = bookingsQuery.data?.result ?? [];

  // Only consider successful bookings for revenue and statistics
  const successfulBookings = bookings.filter((b) => b.status === "SUCCESS");

  const totalRevenue = successfulBookings.reduce(
    (sum, b) => sum + (b.totalPrice ?? 0),
    0,
  );

  const totalBookings = successfulBookings.length;

  const customers = new Set(successfulBookings.map((b) => b.user?.id)).size;
  const trendingMovies = trendingQuery.data?.result ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  successfulBookings.forEach((b) => {
    const date = format(
      b.bookingDate ? new Date(b.bookingDate) : new Date(),
      "yyyy-MM-dd",
    );
    revenueMap.set(date, (revenueMap.get(date) || 0) + (b.totalPrice ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Mock combo and snack data for demonstration
  const { comboData, snackData, pieChartData } = useMemo(() => {
    // Mock data - in real implementation this would come from receipts
    const mockComboData: ComboSalesData[] = [
      { id: 1, name: "Combo Pop & Nachos", quantitySold: 45, revenue: 1350000 },
      { id: 2, name: "Combo Movie Special", quantitySold: 32, revenue: 960000 },
      { id: 3, name: "Combo Sweet & Salty", quantitySold: 28, revenue: 840000 },
      { id: 4, name: "Combo Family Size", quantitySold: 18, revenue: 720000 },
      { id: 5, name: "Combo Date Night", quantitySold: 15, revenue: 450000 },
    ];

    const mockSnackData: SnackSalesData[] = [
      { id: 1, name: "Caramel Popcorn", quantitySold: 67, revenue: 670000 },
      { id: 2, name: "Classic Nachos", quantitySold: 54, revenue: 540000 },
      { id: 3, name: "Soft Drinks", quantitySold: 89, revenue: 445000 },
      { id: 4, name: "Ice Cream", quantitySold: 23, revenue: 345000 },
      { id: 5, name: "Candy Mix", quantitySold: 34, revenue: 170000 },
    ];

    const totalComboQuantity = mockComboData.reduce((sum, combo) => sum + combo.quantitySold, 0);
    const totalSnackQuantity = mockSnackData.reduce((sum, snack) => sum + snack.quantitySold, 0);

    const pieData: ComboSnackData[] = [];
    if (totalComboQuantity > 0) {
      pieData.push({
        name: "Combos",
        value: totalComboQuantity,
        type: "COMBO",
        color: "#0088FE",
      });
    }
    if (totalSnackQuantity > 0) {
      pieData.push({
        name: "Snacks",
        value: totalSnackQuantity,
        type: "SNACK",
        color: "#00C49F",
      });
    }

    return {
      comboData: mockComboData,
      snackData: mockSnackData,
      pieChartData: pieData,
    };
  }, []);

  if (trendingQuery.isLoading || bookingsQuery.isLoading) {
    return <LoadingSpinner name="dashboard" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminStatCards revenue={totalRevenue} bookings={totalBookings} customers={customers} />
          <div className="px-4 lg:px-6">
            <RevenueAreaChart data={chartData} />
          </div>
          
          {/* New Layout: Tables on left, Pie chart on right */}
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side: Tables */}
            <div className="space-y-6">
              {/* Top Movies Table */}
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Movie</TableHead>
                      <TableHead className="text-right">Tickets</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trendingMovies.slice(0, 5).map((m, idx) => (
                      <TableRow key={m.movieId ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{m.movieName}</TableCell>
                        <TableCell className="text-right">{m.ticketCount}</TableCell>
                        <TableCell className="text-right">{m.totalRevenue?.toLocaleString()} đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Top movies this month</TableCaption>
                </Table>
              </div>

              {/* Combo Table */}
              <div>
                <ComboTable data={comboData.slice(0, 5)} />
              </div>

              {/* Snack Table */}
              <div>
                <SnackTable data={snackData.slice(0, 5)} />
              </div>
            </div>

            {/* Right side: Pie Chart */}
            <div className="flex items-center justify-center">
              <ComboSnackPieChart 
                data={pieChartData}
                title="Combo & Snack Sales"
                description="Quantity sold by category"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
