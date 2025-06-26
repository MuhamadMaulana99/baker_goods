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
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { encryptStorage } from "@/config/encryptStorage";
import moment from "moment";
import fetchApi from "@/config/fetchApi";
import axios from "axios";
import { handleError } from "@/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

// Data produk contoh
const mockProducts = [
  {
    id: 1,
    name: "Roti Cokelat Premium",
    description:
      "Roti manis isi cokelat berkualitas tinggi dengan tekstur lembut",
    price: 15000,
    category: "Roti Manis",
    sku: "RCP-001",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Roti Tawar Jumbo",
    description: "Roti tawar ukuran besar, cocok untuk keluarga",
    price: 20000,
    category: "Roti Tawar",
    sku: "RTJ-002",
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    name: "Roti Keju Spesial",
    description: "Roti dengan topping keju melimpah, gurih dan lezat",
    price: 18000,
    category: "Roti Gurih",
    sku: "RKS-003",
    createdAt: "2024-01-03",
  },
  {
    id: 4,
    name: "Roti Sosis Panggang",
    description: "Roti isi sosis yang dipanggang dengan saus spesial",
    price: 22000,
    category: "Roti Isi",
    sku: "RSP-004",
    createdAt: "2024-01-04",
  },
  {
    id: 5,
    name: "Roti Pisang Cokelat",
    description: "Kombinasi lezat pisang dan cokelat dalam roti lembut",
    price: 17000,
    category: "Roti Manis",
    sku: "RPC-005",
    createdAt: "2024-01-05",
  },
];
interface Category {
  id: number;
  category_name: string;
}
export default function ProductsManagement() {
  const userInfo = encryptStorage.getItem("info");
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [datasCategory, setDatasCategody] = useState<Category[]>([]);
  const [categoryFilter, setcategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    product_name: "",
    category_id: "",
  });

  useEffect(() => {
    if (userInfo?.token) {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [userInfo]);

  const getAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi().get(`/products`);
      // console.log(response, "sss");
      setData(response?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("❌ Gagal ambil semua produk:", error);
      throw error;
    }
  };

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
  const handleSubmitProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi().post(`/products`, {
        category_id: categoryFilter,
        product_name: formData?.product_name,
      });

      setFormData({
        category_id: null,
        product_name: null,
      });
      setIsAddDialogOpen(false);
      toast.success("Product berhasil di Tambahkan");
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
        `${process.env.NEXT_PUBLIC_API_URL}/products/${complaint}`
      );
      // console.log("Response diterima:", response?.data); // Debug 3
      getAllProducts();
      toast.success("Berhasil Menghapus");
      setIsLoading(false);
    } catch (err) {
      console.error("Error saat fetching:", err); // Debug 4
      setIsLoading(false);
      handleError(err);
    }
  };
  // console.log(formData, "formData");

  useEffect(() => {
    getAllProducts();
    getDatasCategory();
  }, []);

  if (!isAuthenticated) {
    return <div>Memuat...</div>;
  }

  const resetForm = () => {
    setFormData({
      product_name: "",
      category_id: "",
    });
  };

  const handleEditProduct = async () => {
    setIsLoading(true);
    try {
      const response = await fetchApi().post(`/products/${categoryFilter}`, {
        category_id: categoryFilter,
        product_name: formData?.product_name,
      });

      setFormData({
        category_id: null,
        product_name: null,
      });
      setIsAddDialogOpen(false);
      toast.success("Product berhasil di Tambahkan");
      // console.log("Response diterima:", response?.data); // Debug 3
      setIsLoading(false);
    } catch (err) {
      setIsAddDialogOpen(false);
      setIsLoading(false);
      handleError(err);
    }
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };
  // console.log(formData, "ff");
  const openEditDialog = (product: any) => {
    // console.log(product, "pp");
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name,
      catgory_id: product.category,
    });
    setcategoryFilter(product.category?.category_nama);
    setIsEditDialogOpen(true);
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
                  Beranda
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Manajemen Produk
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Pencarian dan Tambah Produk */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Katalog Produk
                </CardTitle>
                <CardDescription>Kelola daftar produk Anda</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan detail produk baru
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        value={formData.product_name}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            product_name: e.target.value,
                          }))
                        }
                        placeholder="Masukkan nama produk"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                            {datasCategory?.map((item: any) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.category_name}
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
                      <Button onClick={handleSubmitProduct}>
                        Tambah Produk
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daftar Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((product: any) => (
            <Card
              key={product.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {product?.product_name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComplaint(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kategori:</span>
                    <span className="text-sm font-medium">
                      {product?.category?.category_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Ditambahkan:</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {moment(product?.createdAt).format("L")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data?.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian Anda."
                  : "Mulailah dengan menambahkan produk pertama Anda."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog Edit Produk */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Produk</DialogTitle>
              <DialogDescription>Perbarui informasi produk</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama Produk</Label>
                <Input
                  id="edit-name"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      product_name: e.target.value,
                    }))
                  }
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      {datasCategory?.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleEditProduct}>Perbarui Produk</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
