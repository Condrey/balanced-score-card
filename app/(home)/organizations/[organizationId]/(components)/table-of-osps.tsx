import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OspData } from "@/lib/types";

interface TableOfOSPsProps {
  osps: OspData[];
}

export default function TableOfOSPs({ osps }: TableOfOSPsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Strategic Objectives</TableHead>
          <TableHead>Strategies</TableHead>
          <TableHead>Programmes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {osps.map((value, index) => (
          <TableRow key={value.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{value.strategicObjective}</TableCell>
            <TableCell>
              <ol className="list-disc list-inside">
                {value.strategies.map((str, _count) => (
                  <li key={_count}>{str}</li>
                ))}
              </ol>
            </TableCell>
            <TableCell>
              {" "}
              <ol className="list-disc list-inside">
                {value.programmes.map((programme, _count) => (
                  <li key={_count}>{programme}</li>
                ))}
              </ol>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
