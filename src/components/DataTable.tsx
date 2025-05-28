"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Settings, ChevronUp, ChevronDown } from "lucide-react";

interface DataTableProps {
  headers: string[];
  rows: string[][];
}

// Default visible columns (Own Reference at the end)
const DEFAULT_VISIBLE_COLUMNS = [
  "ICC Id",
  "Master MSISDN",
  "Status",
  "Prepaid Balance",
  "Prepaid Expiry Date",
  "Own Reference"
];

const PAGE_SIZE_OPTIONS = [20, 50, 100, 250];

type SortConfig = {
  column: number;
  direction: 'asc' | 'desc';
} | null;

const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Sort function
  const sortData = (data: string[][], columnIndex: number, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];
      
      // Try to parse as numbers if possible
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Try to parse as dates
      const aDate = new Date(aVal);
      const bDate = new Date(bVal);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }
      
      // Default string comparison
      return direction === 'asc' ? 
        aVal.localeCompare(bVal) : 
        bVal.localeCompare(aVal);
    });
  };

  // Handle column sort
  const handleSort = (columnIndex: number) => {
    setSortConfig(current => {
      if (current?.column === columnIndex) {
        return current.direction === 'asc' 
          ? { column: columnIndex, direction: 'desc' }
          : null;
      }
      return { column: columnIndex, direction: 'asc' };
    });
  };

  // Filter rows based on search term
  const filteredRows = rows.filter(row =>
    row.some(cell =>
      cell.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply sorting if configured
  const sortedRows = sortConfig 
    ? sortData(filteredRows, sortConfig.column, sortConfig.direction)
    : filteredRows;

  // Calculate pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + pageSize);

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Search and Page Size Controls */}
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {pageSize} filas por página
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <DropdownMenuItem 
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size} filas
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings className="h-4 w-4 mr-2" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {headers.map((header) => (
              <DropdownMenuCheckboxItem
                key={header}
                checked={visibleColumns.includes(header)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setVisibleColumns([...visibleColumns, header]);
                  } else {
                    setVisibleColumns(visibleColumns.filter(col => col !== header));
                  }
                }}
              >
                {header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                visibleColumns.includes(header) && (
                  <TableHead 
                    key={index} 
                    className="font-semibold cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort(index)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      {sortConfig?.column === index && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                )
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  visibleColumns.includes(headers[cellIndex]) && (
                    <TableCell key={cellIndex}>
                      {cell}
                    </TableCell>
                  )
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sortedRows.length)} de {sortedRows.length} registros
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
