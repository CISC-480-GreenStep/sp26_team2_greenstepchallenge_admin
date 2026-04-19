/**
 * @file CSVExport.jsx
 * @summary "Export CSV" button for any table-like array of plain objects.
 *
 * Converts `data` (array of `{ column: value }` rows) into a CSV string
 * client-side, then triggers a browser download. Header row comes from
 * the keys of the first object, so callers should pass already-shaped
 * rows (no nested objects) and use stable, human-readable keys.
 *
 * Disabled (and renders the button as such) when `data` is empty so
 * users can't export blank files.
 */

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button } from "@mui/material";

/**
 * @param {object} props
 * @param {object[]} props.data - Rows to export. Object keys become column headers.
 * @param {string} [props.filename]
 * @param {string} [props.label]
 */
export default function CSVExport({ data, filename = "export.csv", label = "Export CSV" }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? "";
            // Escape embedded quotes per RFC 4180; wrap every cell to make
            // commas, newlines, and leading whitespace safe.
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<FileDownloadIcon />}
      onClick={handleExport}
      disabled={!data || data.length === 0}
      aria-label="Export data as CSV"
    >
      {label}
    </Button>
  );
}
