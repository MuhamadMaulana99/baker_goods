"use client";

import type React from "react";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  CalendarIcon,
  Upload,
  Search,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const products = [
  { id: 1, name: "Roti Cokelat Premium" },
  { id: 2, name: "Roti Tawar Jumbo" },
  { id: 3, name: "Roti Keju Spesial" },
  { id: 4, name: "Roti Sosis Panggang" },
  { id: 5, name: "Roti Pisang Cokelat" },
];

const categories = [
  { id: 1, name: "Rasa" },
  { id: 2, name: "Kemasan" },
  { id: 3, name: "Keterlambatan" },
  { id: 4, name: "Pelayanan Pegawai" },
  { id: 5, name: "Kesalahan Pesanan" },
];

export default function HomePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    productId: "",
    categoryId: "",
    incidentDate: undefined as Date | undefined,
    description: "",
    files: [] as File[],
  });
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const code = `CMP-${Date.now().toString().slice(-6)}`;
    setGeneratedCode(code);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: Array.from(e.target.files || []),
      }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Pengaduan Terkirim!
            </CardTitle>
            <CardDescription>
              Pengaduan Anda berhasil dikirim dan mendapatkan kode pelacakan:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">
                {generatedCode}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Silakan simpan kode ini untuk melacak status pengaduan Anda.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    productId: "",
                    categoryId: "",
                    incidentDate: undefined,
                    description: "",
                    files: [],
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Kirim Lagi
              </Button>
              <Link href="/track" className="flex-1">
                <Button className="w-full">Lacak Status</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Baker Goods</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/track">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Lacak Pengaduan
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Login Admin</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kirim Pengaduan
              </CardTitle>
              <CardDescription>
                Isi formulir berikut untuk mengajukan pengaduan. Anda akan
                menerima kode pelacakan untuk memantau statusnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Alamat Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Produk *</Label>
                      <Select
                        value={formData.productId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, productId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori Pengaduan *</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Tanggal Kejadian *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.incidentDate
                            ? format(formData.incidentDate, "PPP")
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.incidentDate}
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              incidentDate: date,
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Masalah *</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan masalah Anda secara rinci..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="files">File Pendukung (Opsional)</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="files"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                          >
                            <span>Unggah file</span>
                            <input
                              id="files"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleFileUpload}
                              accept="image/*,.pdf,.doc,.docx"
                            />
                          </label>
                          <p className="pl-1">atau seret ke sini</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF maksimal 10MB per file
                        </p>
                      </div>
                    </div>
                    {formData.files.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">File terpilih:</p>
                        <ul className="text-sm text-gray-500">
                          {formData.files.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Panel Pelacakan */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Lacak Pengaduan Anda
                </CardTitle>
                <CardDescription>
                  Masukkan kode pelacakan untuk memeriksa status pengaduan Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trackingCode">Kode Pelacakan</Label>
                  <Input
                    id="trackingCode"
                    placeholder="contoh: CMP-123456"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div>
                <Link href={`/track?code=${trackingCode}`}>
                  <Button className="w-full" disabled={!trackingCode}>
                    Lacak Status
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bagaimana Cara Kerjanya?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Ajukan Pengaduan</h4>
                    <p className="text-sm text-gray-600">
                      Isi formulir dengan detail masalah Anda
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Dapatkan Kode Pelacakan</h4>
                    <p className="text-sm text-gray-600">
                      Terima kode unik untuk melacak pengaduan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Pantau Proses</h4>
                    <p className="text-sm text-gray-600">
                      Lihat pembaruan status dan tanggapan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
