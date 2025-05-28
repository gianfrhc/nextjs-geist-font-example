"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Clock, XCircle } from "lucide-react";

interface DetailedAlertsProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

const DetailedAlerts: React.FC<DetailedAlertsProps> = ({ data }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const oneDayFromNow = new Date(now);
  oneDayFromNow.setDate(now.getDate() + 1);

  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(now.getDate() + 14);

  // Get column indexes
  const statusIndex = data.headers.findIndex(header => header === "Status");
  const expiryIndex = data.headers.findIndex(header => header === "Prepaid Expiry Date");
  const balanceIndex = data.headers.findIndex(header => header === "Prepaid Balance");

  // Filter rows for low balance and expiring soon
  const filteredRows = data.rows.filter(row => {
    const status = statusIndex !== -1 ? row[statusIndex].toUpperCase() : "";
    const balance = balanceIndex !== -1 ? parseFloat(row[balanceIndex]) : null;
    let expiryDate = null;

    try {
      if (expiryIndex !== -1) {
        expiryDate = new Date(row[expiryIndex].split('.')[0]);
      }
    } catch {
      console.warn("Invalid date format:", row[expiryIndex]);
      return false;
    }

    const hasLowBalance = status === "ACTIVE" && balance !== null && balance < 50;
    const isExpired = expiryDate !== null && expiryDate < now;
    const isExpiringSoon = expiryDate !== null && expiryDate >= now && expiryDate <= twoWeeksFromNow;

    return hasLowBalance || isExpired || isExpiringSoon;
  });

  // Function to get expiry status
  const getExpiryStatus = (dateStr: string) => {
    const expiryDate = new Date(dateStr.split('.')[0]);
    if (expiryDate < now) return "expired";
    if (expiryDate <= oneDayFromNow) return "critical";
    if (expiryDate <= twoWeeksFromNow) return "warning";
    return "normal";
  };

  // Function to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr.split('.')[0]);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Important columns to display
  const displayColumns = [
    "ICC Id",
    "Master MSISDN",
    "Status",
    "Prepaid Balance",
    "Prepaid Expiry Date",
    "Own Reference"
  ];

  const columnIndexes = displayColumns.map(col => data.headers.indexOf(col));

  // Sort rows by expiry date and status
  const sortedRows = [...filteredRows].sort((a, b) => {
    const dateA = new Date(a[expiryIndex].split('.')[0]);
    const dateB = new Date(b[expiryIndex].split('.')[0]);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Líneas que Requieren Atención
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {displayColumns.map((header, idx) => (
                  <TableHead key={idx} className="font-semibold">
                    {header}
                  </TableHead>
                ))}
                <TableHead className="font-semibold">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row, rowIndex) => {
                const balance = parseFloat(row[balanceIndex]);
                const expiryDate = row[expiryIndex];
                const expiryStatus = getExpiryStatus(expiryDate);
                const status = row[statusIndex].toUpperCase();

                return (
                  <TableRow key={rowIndex}>
                    {columnIndexes.map((colIndex, idx) => (
                      <TableCell key={idx}>
                        {colIndex === expiryIndex 
                          ? formatDate(row[colIndex])
                          : row[colIndex]
                        }
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {expiryStatus === "expired" && (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs">Expirado</span>
                          </div>
                        )}
                        {expiryStatus === "critical" && (
                          <div className="flex items-center gap-1 text-red-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Expira en 24h</span>
                          </div>
                        )}
                        {expiryStatus === "warning" && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Por expirar</span>
                          </div>
                        )}
                        {status === "ACTIVE" && balance < 50 && (
                          <div className={`flex items-center gap-1 ${
                            balance < 30 ? "text-red-600" : "text-orange-500"
                          }`}>
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs">Saldo bajo</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedAlerts;
