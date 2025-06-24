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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Package,
  Tag,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Data Pengaduan (Mock)
const mockComplaints = [
  {
    id: 1,
    code: "PNG-123456",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+6281234567890",
    product: "Roti Cokelat Premium",
    category: "Rasa",
    description:
      "Rasa roti terlalu manis dan tidak sesuai dengan deskripsi produk. Teksturnya juga terasa aneh saat dimakan.",
    status: "Sedang Diproses",
    priority: "Tinggi",
    createdAt: "2024-01-15",
    incidentDate: "2024-01-10",
    responses: [
      {
        id: 1,
        message:
          "Terima kasih atas pengaduannya. Kami akan melakukan evaluasi terhadap produk roti yang Anda beli.",
        createdAt: "2024-01-16",
        isAdmin: true,
      },
    ],
  },
  {
    id: 2,
    code: "PNG-789012",
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "+6289876543210",
    product: "Roti Tawar Jumbo",
    category: "Pengemasan Kurang Aman",
    description:
      "Roti sampai dalam kondisi penyok dan tidak segar. Plastik pembungkusnya sobek dan terbuka saat diterima.",
    status: "Selesai",
    priority: "Sedang",
    createdAt: "2024-01-10",
    incidentDate: "2024-01-08",
    responses: [
      {
        id: 1,
        message:
          "Mohon maaf atas ketidaknyamanan ini. Kami sudah mengirimkan roti pengganti dengan pengemasan yang lebih baik.",
        createdAt: "2024-01-11",
        isAdmin: true,
      },
    ],
  },
  {
    id: 3,
    code: "PNG-345678",
    fullName: "Bob Johnson",
    email: "bob@example.com",
    phone: "+6281122334455",
    product: "Roti Manis Keju",
    category: "Pelayanan Pegawai",
    description:
      "Saya merasa tidak nyaman saat dilayani oleh kasir yang kurang ramah dan tidak membantu ketika saya menanyakan promo.",
    status: "Menunggu",
    priority: "Rendah",
    createdAt: "2024-01-18",
    incidentDate: "2024-01-15",
    responses: [],
  },
];

export default function ComplaintsManagement() {
  const router = useRouter();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.priority === priorityFilter
      );
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, priorityFilter, complaints]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Sedang Diproses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu":
        return <Clock className="w-4 h-4" />;
      case "Sedang Diproses":
        return <AlertCircle className="w-4 h-4" />;
      case "Selesai":
        return <CheckCircle className="w-4 h-4" />;
      case "Ditolak":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Tinggi":
        return "bg-red-100 text-red-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Rendah":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = (complaintId: number, status: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId ? { ...complaint, status } : complaint
      )
    );
  };

  const handleAddResponse = (complaintId: number, message: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              responses: [
                ...complaint.responses,
                {
                  id: Date.now(),
                  message,
                  createdAt: new Date().toISOString().split("T")[0],
                  isAdmin: true,
                },
              ],
            }
          : complaint
      )
    );
    setResponseText("");
  };

  const handleDeleteComplaint = (complaintId: number) => {
    setComplaints((prev) =>
      prev.filter((complaint) => complaint.id !== complaintId)
    );
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
                Manajemen Pengaduan
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Pencarian</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Cari pengaduan..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Pending">Menunggu</SelectItem>
                    <SelectItem value="In Progress">Sedang Diproses</SelectItem>
                    <SelectItem value="Resolved">Selesai</SelectItem>
                    <SelectItem value="Rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioritas</Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prioritas</SelectItem>
                    <SelectItem value="High">Tinggi</SelectItem>
                    <SelectItem value="Medium">Sedang</SelectItem>
                    <SelectItem value="Low">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  Hapus Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  Daftar Pengaduan ({filteredComplaints.length})
                </CardTitle>
                <CardDescription>
                  Kelola dan tanggapi pengaduan pelanggan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <h4 className="font-medium text-lg">{complaint.code}</h4>
                      <Badge
                        className={`${getStatusColor(
                          complaint.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </Badge>
                      <Badge className={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Lihat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Detail Pengaduan - {complaint.code}
                            </DialogTitle>
                            <DialogDescription>
                              Kelola status pengaduan dan berikan tanggapan
                            </DialogDescription>
                          </DialogHeader>

                          {selectedComplaint && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Informasi Pelanggan
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">Nama:</span>
                                      <span>{selectedComplaint.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Email:
                                      </span>
                                      <span>{selectedComplaint.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Telepon:
                                      </span>
                                      <span>{selectedComplaint.phone}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-medium">
                                    Detail Pengaduan
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Package className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Produk:
                                      </span>
                                      <span>{selectedComplaint.product}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Tag className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Kategori:
                                      </span>
                                      <span>{selectedComplaint.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Tanggal Kejadian:
                                      </span>
                                      <span>
                                        {selectedComplaint.incidentDate}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">
                                        Dikirim Pada:
                                      </span>
                                      <span>{selectedComplaint.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <h4 className="font-medium mb-2">Deskripsi</h4>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {selectedComplaint.description}
                                </p>
                              </div>

                              {/* Status Update */}
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="newStatus">
                                    Perbarui Status
                                  </Label>
                                  <Select
                                    value={
                                      newStatus || selectedComplaint.status
                                    }
                                    onValueChange={setNewStatus}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">
                                        Menunggu
                                      </SelectItem>
                                      <SelectItem value="In Progress">
                                        Sedang Diproses
                                      </SelectItem>
                                      <SelectItem value="Resolved">
                                        Selesai
                                      </SelectItem>
                                      <SelectItem value="Rejected">
                                        Ditolak
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-end">
                                  <Button
                                    onClick={() => {
                                      if (newStatus) {
                                        handleStatusUpdate(
                                          selectedComplaint.id,
                                          newStatus
                                        );
                                        setSelectedComplaint({
                                          ...selectedComplaint,
                                          status: newStatus,
                                        });
                                        setNewStatus("");
                                      }
                                    }}
                                    disabled={
                                      !newStatus ||
                                      newStatus === selectedComplaint.status
                                    }
                                  >
                                    Perbarui Status
                                  </Button>
                                </div>
                              </div>

                              {/* Communication History */}
                              {selectedComplaint.responses &&
                                selectedComplaint.responses.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-4">
                                      Riwayat Komunikasi
                                    </h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                      {selectedComplaint.responses.map(
                                        (response: any) => (
                                          <div
                                            key={response.id}
                                            className={`p-4 rounded-lg ${
                                              response.isAdmin
                                                ? "bg-blue-50 border-l-4 border-blue-400"
                                                : "bg-gray-50 border-l-4 border-gray-400"
                                            }`}
                                          >
                                            <div className="flex justify-between items-start mb-2">
                                              <span className="font-medium text-sm">
                                                {response.isAdmin
                                                  ? "Tim Dukungan"
                                                  : "Pelanggan"}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {response.createdAt}
                                              </span>
                                            </div>
                                            <p className="text-gray-700">
                                              {response.message}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Add Response */}
                              <div>
                                <Label htmlFor="response">Tanggapan</Label>
                                <Textarea
                                  id="response"
                                  placeholder="Ketik tanggapan Anda kepada pelanggan..."
                                  value={responseText}
                                  onChange={(e) =>
                                    setResponseText(e.target.value)
                                  }
                                  rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                  <Button
                                    onClick={() => {
                                      if (responseText.trim()) {
                                        handleAddResponse(
                                          selectedComplaint.id,
                                          responseText
                                        );
                                        setSelectedComplaint({
                                          ...selectedComplaint,
                                          responses: [
                                            ...selectedComplaint.responses,
                                            {
                                              id: Date.now(),
                                              message: responseText,
                                              createdAt: new Date()
                                                .toISOString()
                                                .split("T")[0],
                                              isAdmin: true,
                                            },
                                          ],
                                        });
                                      }
                                    }}
                                    disabled={!responseText.trim()}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Kirim Tanggapan
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteComplaint(complaint.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{complaint.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>{complaint.product}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span>{complaint.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{complaint.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {complaint.description}
                  </p>

                  {complaint.responses.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">
                      Tanggapan terakhir:{" "}
                      {
                        complaint.responses[complaint.responses.length - 1]
                          .createdAt
                      }
                    </div>
                  )}
                </div>
              ))}

              {filteredComplaints.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pengaduan ditemukan
                  </h3>
                  <p className="text-gray-600">
                    Coba ubah kata pencarian atau filter Anda.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
