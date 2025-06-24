"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
  Tag,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const dashboardStats = {
  totalComplaints: 156,
  pending: 23,
  inProgress: 45,
  resolved: 78,
  rejected: 10,
  thisMonth: 34,
  lastMonth: 28,
  avgResolutionTime: 3.2,
}

const recentComplaints = [
  {
    id: 1,
    code: "CMP-123456",
    customer: "John Doe",
    product: "Roti Cokelat Premium",
    category: "Rasa",
    status: "Dalam Proses",
    createdAt: "2024-01-20",
    priority: "Tinggi",
  },
  {
    id: 2,
    code: "CMP-789012",
    customer: "Jane Smith",
    product: "Roti Tawar Jumbo",
    category: "Pengemasan Kurang Aman",
    status: "Menunggu",
    createdAt: "2024-01-19",
    priority: "Sedang",
  },
  {
    id: 3,
    code: "CMP-345678",
    customer: "Bob Johnson",
    product: "Roti Manis Keju",
    category: "Pelayanan Pegawai",
    status: "Selesai",
    createdAt: "2024-01-18",
    priority: "Rendah",
  },
];


const chartData = {
  monthly: [
    { month: "Jan", complaints: 45 },
    { month: "Feb", complaints: 52 },
    { month: "Mar", complaints: 38 },
    { month: "Apr", complaints: 61 },
    { month: "Mei", complaints: 55 },
    { month: "Jun", complaints: 67 },
  ],
  byCategory: [
    { category: "Cacat Produk", count: 45, percentage: 35 },
    { category: "Masalah Pengiriman", count: 32, percentage: 25 },
    { category: "Layanan Pelanggan", count: 28, percentage: 22 },
    { category: "Masalah Pembayaran", count: 15, percentage: 12 },
    { category: "Klaim Garansi", count: 8, percentage: 6 },
  ],
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return <div>Memuat...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800"
      case "Dalam Proses":
        return "bg-blue-100 text-blue-800"
      case "Selesai":
        return "bg-green-100 text-green-800"
      case "Ditolak":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Tinggi":
        return "bg-red-100 text-red-800"
      case "Sedang":
        return "bg-yellow-100 text-yellow-800"
      case "Rendah":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dasbor Admin</h1>
            <nav className="flex items-center space-x-4">
              <Link href="/admin/complaints"><Button variant="ghost">Pengaduan</Button></Link>
              <Link href="/admin/products"><Button variant="ghost">Produk</Button></Link>
              <Link href="/admin/categories"><Button variant="ghost">Kategori</Button></Link>
              <Link href="/admin/reports"><Button variant="ghost">Laporan</Button></Link>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pengaduan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalComplaints}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardStats.thisMonth - dashboardStats.lastMonth} dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pending}</div>
              <p className="text-xs text-muted-foreground">Menunggu ditinjau</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Sedang diproses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.resolved}</div>
              <p className="text-xs text-muted-foreground">Selesai ditangani</p>
            </CardContent>
          </Card>
        </div>

        {/* Grafik Bulanan & Kategori */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Tren Pengaduan Bulanan
              </CardTitle>
              <CardDescription>Jumlah pengaduan dalam 6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.monthly.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <div className="w-12">{item.month}</div>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(item.complaints / 70) * 100}%` }} />
                  </div>
                  <div className="w-12 text-right">{item.complaints}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Berdasarkan Kategori
              </CardTitle>
              <CardDescription>Distribusi pengaduan berdasarkan jenis</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.byCategory.map((item, index) => (
                <div key={index} className="space-y-2 mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pengaduan Terbaru */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Pengaduan Terbaru</CardTitle>
              <CardDescription>Pengaduan yang baru masuk dan butuh perhatian</CardDescription>
            </div>
            <Link href="/admin/complaints">
              <Button>Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-medium">{complaint.code}</h4>
                      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                      <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div><Users className="inline w-4 h-4 mr-1" /> {complaint.customer}</div>
                      <div><Package className="inline w-4 h-4 mr-1" /> {complaint.product}</div>
                      <div><Tag className="inline w-4 h-4 mr-1" /> {complaint.category}</div>
                      <div>{complaint.createdAt}</div>
                    </div>
                  </div>
                  <Link href={`/admin/complaints/${complaint.id}`}>
                    <Button variant="outline" size="sm">Lihat</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aksi Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="hover:shadow-md cursor-pointer">
            <Link href="/admin/complaints">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Kelola Pengaduan
                </CardTitle>
                <CardDescription>Lihat dan tanggapi pengaduan pelanggan</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md cursor-pointer">
            <Link href="/admin/products">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Kelola Produk
                </CardTitle>
                <CardDescription>Tambah, ubah, dan atur produk</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md cursor-pointer">
            <Link href="/admin/reports">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Buat Laporan
                </CardTitle>
                <CardDescription>Buat laporan dan ekspor data</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
