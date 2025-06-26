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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { encryptStorage } from "@/config/encryptStorage";
import fetchApi from "@/config/fetchApi";
import { handleError } from "@/helper";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const kategoriPengaduan = [
  "Rasa",
  "Kemasan",
  "Keterlambatan",
  "Kualitas Roti",
  "Pelayanan Pegawai",
  "Kesalahan Pesanan",
  "Harga Tidak Sesuai",
  "Kebersihan Toko",
  "Promo / Diskon Bermasalah",
  "Stok Sering Kosong",
  "Waktu Pelayanan Lama",
  "Pengemasan Kurang Aman",
  "Pengiriman Bermasalah",
  "Perbedaan Tampilan Produk",
  "Lainnya",
];
// Data kategori contoh
const mockCategories = [
  {
    id: 1,
    name: "Rasa",
    description:
      "Keluhan terkait rasa roti yang kurang enak, hambar, atau tidak sesuai ekspektasi",
    complaintsCount: 45,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Kemasan",
    description:
      "Masalah pada kemasan roti seperti sobek, kotor, atau tidak higienis",
    complaintsCount: 32,
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    name: "Keterlambatan",
    description:
      "Pengiriman roti terlambat atau tidak sesuai waktu yang dijanjikan",
    complaintsCount: 28,
    createdAt: "2024-01-03",
  },
  {
    id: 4,
    name: "Kualitas Roti",
    description: "Roti keras, basi, atau tidak segar saat diterima",
    complaintsCount: 15,
    createdAt: "2024-01-04",
  },
  {
    id: 5,
    name: "Pelayanan Pegawai",
    description:
      "Pegawai kurang ramah, tidak membantu, atau bersikap tidak profesional",
    complaintsCount: 8,
    createdAt: "2024-01-05",
  },
  {
    id: 6,
    name: "Kesalahan Pesanan",
    description:
      "Pesanan tidak sesuai, jumlah roti salah, atau jenis roti berbeda",
    complaintsCount: 18,
    createdAt: "2024-01-06",
  },
  {
    id: 7,
    name: "Harga Tidak Sesuai",
    description:
      "Harga roti tidak sesuai dengan yang tertera di toko atau promosi",
    complaintsCount: 12,
    createdAt: "2024-01-07",
  },
  {
    id: 8,
    name: "Kebersihan Toko",
    description:
      "Toko kotor, berdebu, atau tidak menjaga kebersihan lingkungan",
    complaintsCount: 9,
    createdAt: "2024-01-08",
  },
  {
    id: 9,
    name: "Promo / Diskon Bermasalah",
    description:
      "Promo tidak berlaku, diskon tidak sesuai, atau informasi promo membingungkan",
    complaintsCount: 10,
    createdAt: "2024-01-09",
  },
  {
    id: 10,
    name: "Stok Sering Kosong",
    description: "Jenis roti tertentu sering tidak tersedia atau cepat habis",
    complaintsCount: 14,
    createdAt: "2024-01-10",
  },
  {
    id: 11,
    name: "Waktu Pelayanan Lama",
    description:
      "Antrian panjang atau proses pelayanan yang memakan waktu terlalu lama",
    complaintsCount: 20,
    createdAt: "2024-01-11",
  },
  {
    id: 12,
    name: "Pengemasan Kurang Aman",
    description:
      "Pengemasan tidak melindungi roti dengan baik hingga menyebabkan kerusakan",
    complaintsCount: 7,
    createdAt: "2024-01-12",
  },
  {
    id: 13,
    name: "Pengiriman Bermasalah",
    description:
      "Roti datang dalam kondisi rusak atau alamat pengiriman tidak sesuai",
    complaintsCount: 11,
    createdAt: "2024-01-13",
  },
  {
    id: 14,
    name: "Perbedaan Tampilan Produk",
    description:
      "Roti yang diterima berbeda bentuk atau ukuran dengan gambar di katalog",
    complaintsCount: 6,
    createdAt: "2024-01-14",
  },
  {
    id: 15,
    name: "Lainnya",
    description: "Keluhan lain yang tidak termasuk dalam kategori di atas",
    complaintsCount: 5,
    createdAt: "2024-01-15",
  },
];
interface Category {
  id: number;
  category_name: string;
}
export default function CategoriesManagement() {
  const userInfo = encryptStorage.getItem("info");
  const router = useRouter();
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [categoryFilter, setcategoryFilter] = useState("");
  const [datasCategory, setDatasCategody] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    category_name: "",
  });

  useEffect(() => {
    if (userInfo?.token) {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [userInfo]);

  const getDatasCategory = async () => {
    setIsLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/categories`;
      const response = await axios.get(url);
      // console.log("Response diterima:", response?.data); // Debug 3
      setIsLoading(false);
      setDatasCategody(response.data);
    } catch (err) {
      console.error("Error saat fetching:", err); // Debug 4
      setDatasCategody([]);
      setIsLoading(false);
      handleError(err);
    }
  };
  // console.log(categoryFilter, categoryFilter);
  const handleSubmitCategory = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi().post(`/categories`, {
        category_name: categoryFilter,
      });

      setFormData({
        category_name: "",
      });
      setIsAddDialogOpen(false);
      toast.success("Category berhasil di Tambahkan");
      getDatasCategory();
      // console.log("Response diterima:", response?.data); // Debug 3
      setIsLoading(false);
    } catch (err) {
      setIsAddDialogOpen(false);
      console.error("Error saat fetching:", err); // Debug 4
      setIsLoading(false);
      handleError(err);
    }
  };

  const handleDeleteComplaint = async (complaint: number) => {
    setIsLoading(true);
    try {
      const response = await fetchApi().delete(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${complaint}`
      );
      // console.log("Response diterima:", response?.data); // Debug 3
      getDatasCategory();
      toast.success(" Category Berhasil Menghapus");
      setIsLoading(false);
    } catch (err) {
      console.error("Error saat fetching:", err); // Debug 4
      setIsLoading(false);
      handleError(err);
    }
  };
  // console.log(formData, "formData");

  useEffect(() => {
    getDatasCategory();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCategories(
        categories.filter(
          (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  if (!isAuthenticated) return <div>Memuat...</div>;

  const resetForm = () => {
    setFormData({ name: "", description: "" });
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      ...formData,
      complaintsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCategories((prev) => [...prev, newCategory]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, ...formData }
          : category
      )
    );
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0">
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
                  Kembali ke Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Manajemen Kategori
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Pencarian dan Tambah */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Kategori Pengaduan
                </CardTitle>
                <CardDescription>
                  Kelola sistem pengelompokan pengaduan
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Kategori
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Kategori Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan informasi kategori pengaduan
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <div>
                        <Label htmlFor="priority">Kategori</Label>
                        <Select
                          value={categoryFilter}
                          onValueChange={setcategoryFilter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                            {kategoriPengaduan.map((kategori, index) => (
                              <SelectItem key={index} value={kategori}>
                                {kategori}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button onClick={handleSubmitCategory}>Tambah</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari kategori..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Daftar Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasCategory.map((category: any) => (
            <Card
              key={category.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      {category.category_name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComplaint(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <p className="text-gray-600 text-sm">{category.description}</p> */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Pengaduan:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {category.total_complaints}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dibuat:</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {category.createdAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Kategori tidak ditemukan
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian."
                  : "Silakan tambahkan kategori pertama Anda."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog Edit */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Kategori</DialogTitle>
              <DialogDescription>
                Perbarui informasi kategori pengaduan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama Kategori</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama kategori"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi kategori"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleEditCategory}>Perbarui</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
