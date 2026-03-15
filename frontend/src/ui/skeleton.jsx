import { cn } from "../utils/cn";

/**
 * Skeleton component for loading states
 * Provides animated placeholder shapes while content loads
 */
export function Skeleton({ className, variant = "default", ...props }) {
  const baseClasses = "animate-pulse bg-muted-foreground/10 rounded-lg";

  const variants = {
    default: "",
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
    card: "h-32 w-full",
    badge: "h-5 w-16 rounded-full",
    icon: "h-9 w-9 rounded-xl",
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    />
  );
}

/**
 * Skeleton for KPI cards on dashboard
 */
export function KPICardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton variant="icon" />
      </div>
    </div>
  );
}

/**
 * Skeleton for weather/info cards
 */
export function InfoCardSkeleton({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton variant="button" className="w-20" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${85 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for land/item cards in grid
 */
export function LandCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Map placeholder */}
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton variant="badge" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="badge" className="w-20" />
          <Skeleton variant="badge" className="w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for sensor cards
 */
export function SensorCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="icon" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton variant="badge" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for alert items
 */
export function AlertSkeleton() {
  return (
    <div className="rounded-xl border border-border/15 p-4 flex items-start justify-between gap-3">
      <div className="space-y-2 flex-1">
        <div className="flex gap-2">
          <Skeleton variant="badge" />
          <Skeleton variant="badge" className="w-24" />
        </div>
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="icon" className="hidden sm:block" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for charts
 */
export function ChartSkeleton({ height = "h-64" }) {
  return (
    <div className={`${height} w-full relative`}>
      <div className="absolute inset-0 flex items-end justify-around gap-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="button" />
            <Skeleton variant="button" />
            <Skeleton variant="button" className="w-16" />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </div>

          {/* Quick actions */}
          <InfoCardSkeleton lines={2} />

          {/* Alerts */}
          <div className="card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton variant="button" className="w-24" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <AlertSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <InfoCardSkeleton lines={4} />
          <InfoCardSkeleton lines={3} />
        </div>
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Lands list
 */
export function LandsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton variant="button" className="w-32" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LandCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Sensors
 */
export function SensorsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" className="w-28" />
          <Skeleton variant="button" className="w-24" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SensorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Analytics
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" className="w-32" />
          <Skeleton variant="button" className="w-24" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <ChartSkeleton />
        </div>
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <ChartSkeleton />
        </div>
      </div>

      {/* Table */}
      <div className="card p-5 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Alerts
 */
export function AlertsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="badge" className="w-20" />
            <Skeleton variant="button" className="w-24" />
            <Skeleton variant="icon" className="hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AlertSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page skeleton for Economics
 */
export function EconomicsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="button" />
            <Skeleton variant="button" />
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <ChartSkeleton />
        </div>
        <div className="card p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/15">
                <div className="flex items-center gap-3">
                  <Skeleton variant="icon" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
