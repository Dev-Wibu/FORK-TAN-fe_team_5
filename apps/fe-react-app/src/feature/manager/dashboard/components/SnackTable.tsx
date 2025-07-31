import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";

export interface SnackSalesData {
  id: number;
  name: string;
  quantitySold: number;
  revenue: number;
}

interface SnackTableProps {
  data: SnackSalesData[];
  caption?: string;
}

export function SnackTable({ data, caption = "Top snacks this month" }: SnackTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Snack</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((snack, idx) => (
          <TableRow key={snack.id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="font-medium">{snack.name}</TableCell>
            <TableCell className="text-right">{snack.quantitySold}</TableCell>
            <TableCell className="text-right">{snack.revenue.toLocaleString()} đ</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>{caption}</TableCaption>
    </Table>
  );
}

export default SnackTable;