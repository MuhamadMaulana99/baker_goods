"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Download,
  FileText,
  CalendarIcon,
  ArrowLeft,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

// Mock report data
// Mock report data untuk toko roti
const reportData = {
  summary: {
    totalComplaints: 156,
    resolvedComplaints: 78,
    pendingComplaints: 23,
    inProgressComplaints: 45,
    rejectedComplaints: 10,
    avgResolutionTime: 3.2, // dalam hari
    customerSatisfaction: 4.2, // dari skala 1–5
  },
  byStatus: [
    { status: "Selesai", count: 78, percentage: 50 },
    { status: "Dalam Proses", count: 45, percentage: 29 },
    { status: "Menunggu", count: 23, percentage: 15 },
    { status: "Ditolak", count: 10, percentage: 6 },
  ],
  byCategory: [
    { category: "Rasa", count: 30, percentage: 19 },
    { category: "Kemasan", count: 25, percentage: 16 },
    { category: "Keterlambatan", count: 20, percentage: 13 },
    { category: "Pelayanan Pegawai", count: 18, percentage: 12 },
    { category: "Kesalahan Pesanan", count: 15, percentage: 10 },
    { category: "Lainnya", count: 48, percentage: 30 },
  ],
  byProduct: [
    { product: "Roti Cokelat Premium", count: 32, percentage: 21 },
    { product: "Roti Tawar Jumbo", count: 28, percentage: 18 },
    { product: "Roti Keju Spesial", count: 22, percentage: 14 },
    { product: "Roti Sosis Panggang", count: 18, percentage: 12 },
    { product: "Roti Pisang Cokelat", count: 15, percentage: 10 },
    { product: "Lainnya", count: 41, percentage: 25 },
  ],
  monthly: [
    { month: "Jan", complaints: 45, resolved: 38 },
    { month: "Feb", complaints: 52, resolved: 45 },
    { month: "Mar", complaints: 38, resolved: 32 },
    { month: "Apr", complaints: 61, resolved: 48 },
    { month: "May", complaints: 55, resolved: 42 },
    { month: "Jun", complaints: 67, resolved: 51 },
  ],
};


export default function ReportsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
  });
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    product: "all",
  });
  const [reportType, setReportType] = useState("summary");

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert(
      "PDF export functionality would be implemented here using react-pdf or similar library"
    );
  };

  const handleExportExcel = () => {
    // In a real app, this would generate and download an Excel file
    alert("Excel export functionality would be implemented here");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dasbor
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Laporan & Analitik
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Laporan
            </CardTitle>
            <CardDescription>Atur parameter laporan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label>Jenis Laporan</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Ringkasan</SelectItem>
                    <SelectItem value="detailed">Detail</SelectItem>
                    <SelectItem value="trends">Analisis Tren</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(v) => setFilters({ ...filters, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="in-progress">Diproses</SelectItem>
                    <SelectItem value="resolved">Selesai</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Kategori</Label>
                <Select
                  value={filters.category}
                  onValueChange={(v) => setFilters({ ...filters, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="product-defect">Cacat Produk</SelectItem>
                    <SelectItem value="delivery">Masalah Pengiriman</SelectItem>
                    <SelectItem value="service">Layanan Pelanggan</SelectItem>
                    <SelectItem value="billing">Masalah Penagihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dari Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from
                        ? format(dateRange.from, "PPP")
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(d) => setDateRange({ ...dateRange, from: d })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Sampai Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to
                        ? format(dateRange.to, "PPP")
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(d) => setDateRange({ ...dateRange, to: d })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Ekspor Excel
              </Button>
              <Button
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Ekspor PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pengaduan
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.summary.totalComplaints}
              </div>
              <p className="text-xs text-muted-foreground">Sepanjang waktu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tingkat Penyelesaian
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (reportData.summary.resolvedComplaints /
                    reportData.summary.totalComplaints) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.summary.resolvedComplaints} pengaduan diselesaikan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rata-rata Waktu Penyelesaian
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.summary.avgResolutionTime} hari
              </div>
              <p className="text-xs text-muted-foreground">
                Waktu rata-rata penyelesaian
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Skor Kepuasan
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.summary.customerSatisfaction}/5
              </div>
              <p className="text-xs text-muted-foreground">Dari pelanggan</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribusi Status & Kategori */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Status Pengaduan</CardTitle>
              <CardDescription>Pembagian status pengaduan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.byStatus.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        />
                        {item.status}
                      </span>
                      <span>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(
                          item.status
                        )}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Kategori Pengaduan</CardTitle>
              <CardDescription>Kategori pengaduan terbanyak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.byCategory.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribusi Produk & Tren Bulanan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Produk</CardTitle>
              <CardDescription>
                Produk dengan pengaduan terbanyak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.byProduct.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.product}</span>
                      <span>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tren Bulanan</CardTitle>
              <CardDescription>
                Tren pengaduan dan penyelesaian tiap bulan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthly.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <span>
                        {item.complaints} pengaduan, {item.resolved} selesai
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-400 h-2 rounded-full"
                          style={{ width: `${(item.complaints / 70) * 100}%` }}
                        />
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: `${(item.resolved / 70) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 text-xs text-gray-600 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-red-400 rounded" />
                    <span>Pengaduan</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-green-400 rounded" />
                    <span>Selesai</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
