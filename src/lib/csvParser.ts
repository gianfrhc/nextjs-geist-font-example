export interface CSVData {
  headers: string[];
  rows: string[][];
}

export function parseCSV(content: string): CSVData {
  if (!content.trim()) {
    throw new Error("El archivo está vacío");
  }

  const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) {
    throw new Error("No se encontraron datos");
  }

  const headers = lines[0]
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map(header => header.replace(/^"|"$/g, "").trim());

  const rows = lines.slice(1).map(line =>
    line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(value => value.replace(/^"|"$/g, "").trim())
  );

  return { headers, rows };
}
