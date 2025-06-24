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

// Data produk contoh
const mockProducts = [
  {
    id: 1,
    name: "Roti Cokelat Premium",
    description: "Roti manis isi cokelat berkualitas tinggi dengan tekstur lembut",
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


export default function ProductsManagement() {
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
  });

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  if (!isAuthenticated) {
    return <div>Memuat...</div>;
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      sku: "",
    });
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      ...formData,
      price: Number.parseFloat(formData.price),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [...prev, newProduct]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = () => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              ...formData,
              price: Number.parseFloat(formData.price),
            }
          : product
      )
    );
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sku: product.sku,
    });
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
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Masukkan nama produk"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sku: e.target.value,
                          }))
                        }
                        placeholder="Masukkan SKU"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          placeholder="Masukkan kategori"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Masukkan deskripsi produk"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button onClick={handleAddProduct}>Tambah Produk</Button>
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
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </CardDescription>
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
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {product.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Harga:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kategori:</span>
                    <span className="text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Ditambahkan:</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {product.createdAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  placeholder="Masukkan SKU"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Harga</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Kategori</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Masukkan kategori"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Masukkan deskripsi produk"
                  rows={3}
                />
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
