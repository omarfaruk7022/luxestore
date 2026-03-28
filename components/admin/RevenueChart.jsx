"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
// import { formatPrice } from "@/lib/utils";
import Chart from "react-apexcharts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const PERIODS = [
  { label: "Today", value: "daily" },
  { label: "7 Days", value: "weekly" },
  { label: "30 Days", value: "monthly" },
  { label: "12 Months", value: "yearly" },
];

const formatLabel = (key, period) => {
  if (period === "daily") return `${key}:00`; // hour
  if (period === "weekly" || period === "monthly") return key.slice(5); // MM-DD
  if (period === "yearly") {
    const [y, m] = key.split("-");
    return (
      new Date(y, m - 1).toLocaleString("default", { month: "short" }) + ` ${y}`
    );
  }
  return key;
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border rounded-xl p-3 text-xs space-y-1 shadow-lg">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{formatPrice(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  const [period, setPeriod] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customActive, setCustomActive] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-revenue", period, fromDate, toDate],
    queryFn: () => {
      let url = `/api/admin/stats/revenue?period=${period}`;
      if (customActive && fromDate && toDate) {
        url += `&from=${fromDate}&to=${toDate}`;
      }
      return fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((r) => r.json());
    },
  });

  const chartData = (data?.data || []).map((d) => ({
    label: formatLabel(d._id, period),
    Revenue: d.revenue,
    Cost: d.cost,
    Profit: d.profit,
  }));

  const totals = chartData.reduce(
    (acc, d) => ({
      revenue: acc.revenue + d.Revenue,
      cost: acc.cost + d.Cost,
      profit: acc.profit + d.Profit,
    }),
    { revenue: 0, cost: 0, profit: 0 },
  );
  const stats = [
    {
      label: "Revenue",
      value: totals.revenue,
      icon: TrendingUp,
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      iconBg: "bg-blue-500/20",
    },
    {
      label: "Cost",
      value: totals.cost,
      icon: TrendingDown,
      bg: "bg-red-500/10",
      text: "text-red-600",
      iconBg: "bg-red-500/20",
    },
    {
      label: "Profit",
      value: totals.profit,
      icon: Wallet,
      bg: "bg-green-500/10",
      text: "text-green-600",
      iconBg: "bg-green-500/20",
    },
  ];
  const formatDateLabel = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPeriodLabel = () => {
    if (customActive && fromDate && toDate) {
      return `${formatDateLabel(fromDate)} to ${formatDateLabel(toDate)}`;
    }
    const labels = {
      daily: "Today",
      weekly: "Last 7 Days",
      monthly: "Last 30 Days",
      yearly: "Last 12 Months",
    };
    return labels[period] || period;
  };

  const handleExportCSV = () => {
    const periodLabel = getPeriodLabel();
    const headers = ["Period", "Date", "Revenue", "Cost", "Profit"];
    const rows = chartData.map((d) => [
      periodLabel,
      d.label,
      d.Revenue,
      d.Cost,
      d.Profit,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${periodLabel.replace(/\s+/g, "-")}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const periodLabel = getPeriodLabel();
    const exportData = {
      period: periodLabel,
      generatedAt: new Date().toISOString(),
      data: data?.data,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${periodLabel.replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },

   
    tooltip: {
      theme: isDark ? "dark" : "light", // ✅ fix tooltip
      style: {
        fontSize: "12px",
      },
    },

    xaxis: {
      categories: ["Revenue", "Cost", "Profit"],
    },

    colors: ["#3b82f6", "#ef4444", "#22c55e"],

    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
      },
    },
  };

  const chartSeries = [
    {
      name: "Amount",
      data: [totals.revenue, totals.cost, totals.profit],
    },
  ];

  return (
    <div className="p-6 rounded-2xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Revenue / Cost / Profit</h3>
          <p className="text-xs text-muted-foreground">Financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs hover:bg-secondary transition-colors"
          >
            <Download size={12} /> CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs hover:bg-secondary transition-colors"
          >
            <FileText size={12} /> JSON
          </button>
        </div>
      </div>

      {/* Period filter */}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => {
              setPeriod(p.value);
              setCustomActive(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              period === p.value && !customActive
                ? "bg-foreground text-background"
                : "border hover:bg-secondary"
            }`}
          >
            {p.label}
          </button>
        ))}

        {/* Custom range */}
        <div className="flex items-center gap-2 ml-auto">
          {/* FROM DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {/* <CalendarIcon className="w-4 h-4 mr-2" / */}
                {fromDate ? format(fromDate, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => {
                  setFromDate(date);
                  setCustomActive(true);

                  // Fix invalid range
                  if (toDate && date > toDate) {
                    setToDate(null);
                  }
                }}
                disabled={(date) => (toDate ? date > toDate : false)}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground">to</span>

          {/* TO DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {/* <CalendarIcon className="w-4 h-4 mr-2" /> */}
                {toDate ? format(toDate, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(date) => {
                  setToDate(date);
                  setCustomActive(true);
                }}
                disabled={(date) => (fromDate ? date < fromDate : false)}
              />
            </PopoverContent>
          </Popover>

          {/* CLEAR */}
          {customActive && (
            <button
              onClick={() => {
                setCustomActive(false);
                setFromDate(null);
                setToDate(null);
              }}
              className="px-2 py-1.5 rounded-lg border text-xs hover:bg-secondary transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, bg, text, iconBg }) => (
          <div
            key={label}
            className={`p-4 rounded-2xl border ${bg} flex items-center justify-between`}
          >
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`font-semibold text-lg mt-1 ${text}`}>
                {formatPrice(value)}
              </p>
            </div>

            <div className={`p-2 rounded-xl ${iconBg}`}>
              <Icon className={`w-4 h-4 ${text}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-48 shimmer rounded-xl" />
      ) : (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={260}
        />
      )}
    </div>
  );
}
