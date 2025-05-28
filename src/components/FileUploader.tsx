"use client";

import React, { useState, ChangeEvent } from "react";
import { parseCSV, CSVData } from "@/lib/csvParser";
import DataTable from "./DataTable";
import Dashboard from "./Dashboard";
import DetailedAlerts from "./DetailedAlerts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface FileUploaderError extends Error {
  message: string;
}

const FileUploader = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setCsvData(null);
    const file = e.target.files && e.target.files[0];
    processFile(file);
  };

  const processFile = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".csv")) {
      setError("Por favor, sube un archivo TXT o CSV válido.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== "string") {
          throw new Error("Contenido de archivo inválido");
        }
        const parsed = parseCSV(content);
        setCsvData(parsed);
      } catch (err) {
        const error = err as FileUploaderError;
        setError(error.message || "Error al parsear el archivo");
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo");
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardContent>
          <div 
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="w-full">
              <div className="flex flex-col items-center gap-4 cursor-pointer">
                <div className="p-4 rounded-full bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    {fileName ? `Archivo seleccionado: ${fileName}` : 'Arrastra y suelta tu archivo aquí o'}
                  </p>
                  {!fileName && (
                    <Button variant="outline" className="mt-2">
                      Seleccionar Archivo
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Formatos soportados: TXT, CSV
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {csvData && (
        <>
          <Card className="w-full">
            <CardContent className="pt-6">
              <Dashboard data={csvData} />
            </CardContent>
          </Card>

          <DetailedAlerts data={csvData} />

          <Card className="w-full">
            <CardContent className="p-6">
              <DataTable headers={csvData.headers} rows={csvData.rows} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FileUploader;
