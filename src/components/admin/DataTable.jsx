"use client";

/**
 * DataTable — generic table component for admin lists.
 * @param {{ columns: { key: string, label: string, render?: (row) => React.ReactNode }[], data: any[], actions?: (row) => React.ReactNode, emptyMessage?: string }} props
 */
export default function DataTable({ columns, data, actions, emptyMessage = "No data found." }) {
  if (!data || data.length === 0) {
    return <div className="admin-empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th className="admin-table-actions-header">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key] ?? "—"}
                </td>
              ))}
              {actions && <td className="admin-table-actions-cell">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
