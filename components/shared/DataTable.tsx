import { Table } from "@/components/ui/table";

export function DataTable({ columns, rows }: { columns: string[]; rows: Array<Array<string | number>> }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d6e2f0] bg-white shadow-[0_12px_30px_rgba(10,37,64,0.08)]">
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((value, cellIdx) => (
                <td key={cellIdx} className="text-[#425466]">{String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
