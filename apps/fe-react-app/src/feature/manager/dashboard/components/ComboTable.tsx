import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";

export interface ComboSalesData {
  id: number;
  name: string;
  quantitySold: number;
  revenue: number;
}

interface ComboTableProps {
  data: ComboSalesData[];
  caption?: string;
}

export function ComboTable({ data, caption = "Top combos this month" }: ComboTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Combo</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((combo, idx) => (
          <TableRow key={combo.id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="font-medium">{combo.name}</TableCell>
            <TableCell className="text-right">{combo.quantitySold}</TableCell>
            <TableCell className="text-right">{combo.revenue.toLocaleString()} đ</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>{caption}</TableCaption>
    </Table>
  );
}

export default ComboTable;