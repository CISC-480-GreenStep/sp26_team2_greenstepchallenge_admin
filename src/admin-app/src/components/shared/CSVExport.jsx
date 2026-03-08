import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

/**
 * Converts an array of objects to a CSV string and triggers a download.
 * Usage: <CSVExport data={rows} filename="events.csv" />
 */
export default function CSVExport({ data, filename = 'export.csv', label = 'Export CSV' }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h] ?? '';
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(','),
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
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
