import * as React from "react";

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full border-collapse">{children}</table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b">{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-2 text-left font-semibold">{children}</th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-2">{children}</td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
