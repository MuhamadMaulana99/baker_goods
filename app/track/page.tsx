"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Package,
  Tag,
} from "lucide-react";
import Link from "next/link";

const mockComplaints = [
  {
    id: 1,
    code: "CMP-123456",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+6281234567890",
    product: "Roti Cokelat Premium",
    category: "Rasa",
    description:
      "Rasa roti terlalu manis dan ada rasa gosong di bagian bawahnya.",
    status: "Sedang Diproses",
    createdAt: "2024-01-15",
    incidentDate: "2024-01-10",
    responses: [
      {
        id: 1,
        message:
          "Terima kasih atas pengaduannya. Kami sedang menyelidiki masalah ini.",
        createdAt: "2024-01-16",
        isAdmin: true,
      },
      {
        id: 2,
        message:
          "Kami telah menghubungi tim produksi untuk meninjau ulang kualitas rasa.",
        createdAt: "2024-01-18",
        isAdmin: true,
      },
    ],
  },
  {
    id: 2,
    code: "CMP-789012",
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "+6289876543210",
    product: "Roti Tawar Jumbo",
    category: "Pengemasan Kurang Aman",
    description: "Roti tiba dalam keadaan penyok, kemasan plastik robek.",
    status: "Selesai",
    createdAt: "2024-01-10",
    incidentDate: "2024-01-08",
    responses: [
      {
        id: 1,
        message:
          "Kami mohon maaf atas kerusakan kemasan. Roti pengganti telah dikirimkan.",
        createdAt: "2024-01-11",
        isAdmin: true,
      },
      {
        id: 2,
        message:
          "Roti pengganti sudah saya terima dalam kondisi baik. Terima kasih!",
        createdAt: "2024-01-13",
        isAdmin: false,
      },
    ],
  },
];

const statusConfig = {
  Menunggu: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Menunggu",
  },
  "Sedang Diproses": {
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
    label: "Sedang Diproses",
  },
  Selesai: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Selesai",
  },
  Ditolak: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Ditolak",
  },
};

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(
    searchParams.get("code") || ""
  );
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchParams.get("code")) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((c) => c.status === statusFilter)
      );
    }
  }, [statusFilter, complaints]);

  const handleSearch = async () => {
    if (!trackingCode.trim()) return;
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const found = complaints.find(
      (c) => c.code.toLowerCase() === trackingCode.toLowerCase()
    );
    setSearchResult(found || null);
    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config?.color} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {config?.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Lacak Pengaduan
              </h1>
            </div>
            <Link href="/admin">
              <Button variant="outline">Login Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Cari Berdasarkan Kode Pelacakan
            </CardTitle>
            <CardDescription>
              Masukkan kode pelacakan pengaduan Anda untuk melihat status dan
              pembaruan secara detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Kode Pelacakan</Label>
                <Input
                  id="search"
                  placeholder="contoh: CMP-123456"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !trackingCode.trim()}
                >
                  {isSearching ? "Mencari..." : "Cari"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searchResult && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Detail Pengaduan
                  </CardTitle>
                  <CardDescription>
                    Kode Pelacakan: {searchResult.code}
                  </CardDescription>
                </div>
                {getStatusBadge(searchResult.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Pelanggan:</span>
                    <span>{searchResult.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Produk:</span>
                    <span>{searchResult.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Kategori:</span>
                    <span>{searchResult.category}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Tanggal Pengaduan:</span>
                    <span>{searchResult.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Tanggal Kejadian:</span>
                    <span>{searchResult.incidentDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Deskripsi Masalah:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {searchResult.description}
                </p>
              </div>

              {searchResult.responses?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">Riwayat Komunikasi:</h4>
                  <div className="space-y-3">
                    {searchResult.responses.map((res: any) => (
                      <div
                        key={res.id}
                        className={`p-4 rounded-lg ${
                          res.isAdmin
                            ? "bg-blue-50 border-l-4 border-blue-400"
                            : "bg-gray-50 border-l-4 border-gray-400"
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-sm">
                            {res.isAdmin ? "Tim Dukungan" : "Anda"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {res.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700">{res.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {trackingCode && !searchResult && !isSearching && (
          <Card className="mb-8">
            <CardContent className="text-center py-8">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pengaduan Tidak Ditemukan
              </h3>
              <p className="text-gray-600">
                Tidak ditemukan pengaduan dengan kode "{trackingCode}". Silakan
                periksa kembali kode Anda.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pengaduan Terbaru</CardTitle>
                <CardDescription>
                  Ringkasan pengaduan yang baru saja dikirim
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Sedang Diproses">
                    Sedang Diproses
                  </SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{c.code}</h4>
                      <p className="text-sm text-gray-600">{c.fullName}</p>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Produk:</span> {c.product}
                    </div>
                    <div>
                      <span className="font-medium">Kategori:</span>{" "}
                      {c.category}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {c.createdAt}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
