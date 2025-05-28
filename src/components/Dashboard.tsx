"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Activity, Clock, Wallet, XCircle } from "lucide-react";

interface DashboardProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Calculate metrics
  const calculateMetrics = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Define time thresholds
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(now.getDate() + 1);
    
    const twoWeeksFromNow = new Date(now);
    twoWeeksFromNow.setDate(now.getDate() + 14);

    let activeLines = 0;
    let suspendedLines = 0;
    let expiredLines = 0;
    let expiringIn24h = 0;
    let expiringIn2Weeks = 0;
    let lowBalanceUnder30 = 0;
    let lowBalanceUnder50 = 0;

    // Get column indexes
    const statusIndex = data.headers.findIndex(header => header === "Status");
    const expiryIndex = data.headers.findIndex(header => header === "Prepaid Expiry Date");
    const balanceIndex = data.headers.findIndex(header => header === "Prepaid Balance");

    data.rows.forEach(row => {
      // Get status first
      const status = statusIndex !== -1 ? row[statusIndex].toUpperCase() : "";
      const isActive = status === "ACTIVE";
      const isSuspended = status === "SUSPENDED";

      // Count active/suspended lines
      if (isActive) activeLines++;
      if (isSuspended) suspendedLines++;

      // Check expiry status
      if (expiryIndex !== -1) {
        try {
          const expiryDateStr = row[expiryIndex];
          const expiryDate = new Date(expiryDateStr.split('.')[0]);

          if (!isNaN(expiryDate.getTime())) {
            if (expiryDate < now) {
              expiredLines++;
            } else {
              if (expiryDate <= oneDayFromNow) {
                expiringIn24h++;
              }
              if (expiryDate <= twoWeeksFromNow) {
                expiringIn2Weeks++;
              }
            }
          }
        } catch {
          console.warn("Invalid date format:", row[expiryIndex]);
        }
      }

      // Check low balance lines (only for active lines)
      if (balanceIndex !== -1 && isActive) {
        const balance = parseFloat(row[balanceIndex]);
        if (!isNaN(balance)) {
          if (balance < 30) lowBalanceUnder30++;
          if (balance < 50) lowBalanceUnder50++;
        }
      }
    });

    return {
      activeLines,
      suspendedLines,
      expiredLines,
      expiringIn24h,
      expiringIn2Weeks,
      lowBalanceUnder30,
      lowBalanceUnder50
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líneas Activas</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeLines}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líneas Suspendidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.suspendedLines}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bajo {'<'} $50</CardTitle>
            <Wallet className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.lowBalanceUnder50}</div>
            <p className="text-xs text-muted-foreground">
              Solo líneas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Crítico {'<'} $30</CardTitle>
            <Wallet className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.lowBalanceUnder30}</div>
            <p className="text-xs text-muted-foreground">
              Solo líneas activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Timeline Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.expiredLines}</div>
            <p className="text-xs text-muted-foreground">
              Fecha de expiración pasada
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiran en 24h</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.expiringIn24h}</div>
            <p className="text-xs text-muted-foreground">
              Próximas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Expirar</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.expiringIn2Weeks}</div>
            <p className="text-xs text-muted-foreground">
              Próximas 2 semanas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-2">
        {metrics.expiredLines > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {metrics.expiredLines} línea{metrics.expiredLines !== 1 ? 's' : ''} con fecha de expiración vencida
            </AlertDescription>
          </Alert>
        )}
        {metrics.expiringIn24h > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {metrics.expiringIn24h} línea{metrics.expiringIn24h !== 1 ? 's' : ''} por expirar en las próximas 24 horas
            </AlertDescription>
          </Alert>
        )}
        {metrics.lowBalanceUnder50 > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="ml-2">
              {metrics.lowBalanceUnder50} línea{metrics.lowBalanceUnder50 !== 1 ? 's' : ''} activa{metrics.lowBalanceUnder50 !== 1 ? 's' : ''} con saldo menor a $50
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
