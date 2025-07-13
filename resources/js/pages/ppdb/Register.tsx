import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Loader2, MapPin, School, User, Users } from 'lucide-react';
import React from 'react';
import { z } from 'zod';
import { PpdbForm } from '../settings/ppdb';

// Zod validation schema
const ppdbSchema = z.object({
    nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi').max(255, 'Nama lengkap maksimal 255 karakter'),
    nama_panggilan: z.string().min(1, 'Nama panggilan wajib diisi').max(255, 'Nama panggilan maksimal 255 karakter'),
    tempat_lahir: z.string().min(1, 'Tempat lahir wajib diisi').max(255, 'Tempat lahir maksimal 255 karakter'),
    tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
    jenis_kelamin: z.enum(['L', 'P'], { errorMap: () => ({ message: 'Jenis kelamin wajib dipilih' }) }),
    agama: z.enum(['Islam', 'Kristen', 'Khatolik', 'Hindu', 'Buddha', 'Khonghucu'], {
        errorMap: () => ({ message: 'Agama wajib dipilih' }),
    }),
    alamat: z.string().min(1, 'Alamat wajib diisi'),
    no_telepon: z.string().optional(),
    pendidikan_sebelumnya: z.string().optional(),
    pilihan_seni: z.enum(['-', 'Seni Musik', 'Seni Tari', 'Seni Rupa', 'Seni Teater', 'Seni Media']).optional(),

    // Data Orang Tua
    nama_ayah: z.string().optional(),
    nama_ibu: z.string().optional(),
    pekerjaan_ayah: z.string().optional(),
    pekerjaan_ibu: z.string().optional(),
    jalan: z.string().optional(),
    kelurahan: z.string().optional(),
    kecamatan: z.string().optional(),
    kabupaten: z.string().optional(),
    provinsi: z.string().optional(),

    // Data Wali
    nama_wali: z.string().optional(),
    pekerjaan_wali: z.string().optional(),
    alamat_wali: z.string().optional(),
    no_telepon_wali: z.string().optional(),
});

type PpdbFormData = z.infer<typeof ppdbSchema>;

const Register = () => {
    const { flash, pengaturan } = usePage().props as unknown as {
        flash: { success?: string; error?: string };
        pengaturan: PpdbForm;
    };

    const { data, setData, post, processing, errors, reset } = useForm<{
        nama_lengkap: string;
        nama_panggilan: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        jenis_kelamin: 'L' | 'P';
        agama: 'Islam' | 'Kristen' | 'Khatolik' | 'Hindu' | 'Buddha' | 'Khonghucu';
        alamat: string;
        no_telepon?: string;
        pendidikan_sebelumnya?: string;
        pilihan_seni?: '-' | 'Seni Musik' | 'Seni Tari' | 'Seni Rupa' | 'Seni Teater' | 'Seni Media';

        // Data Orang Tua
        nama_ayah?: string;
        nama_ibu?: string;
        pekerjaan_ayah?: string;
        pekerjaan_ibu?: string;
        jalan?: string;
        kelurahan?: string;
        kecamatan?: string;
        kabupaten?: string;
        provinsi?: string;

        // Data Wali
        nama_wali?: string;
        pekerjaan_wali?: string;
        alamat_wali?: string;
        no_telepon_wali?: string;
        bukti_pembayaran: File | undefined;
    }>({
        nama_lengkap: '',
        nama_panggilan: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: 'L',
        agama: 'Islam',
        alamat: '',
        no_telepon: '',
        pendidikan_sebelumnya: '',
        pilihan_seni: '-',
        nama_ayah: '',
        nama_ibu: '',
        pekerjaan_ayah: '',
        pekerjaan_ibu: '',
        jalan: '',
        kelurahan: '',
        kecamatan: '',
        kabupaten: '',
        provinsi: '',
        nama_wali: '',
        pekerjaan_wali: '',
        alamat_wali: '',
        no_telepon_wali: '',
        bukti_pembayaran: undefined,
    });

    // Tambahkan state untuk input file (agar bisa reset input file)
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('bukti_pembayaran', e.target.files[0]);
        } else {
            setData('bukti_pembayaran', undefined);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('ppdb.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset input file
                }
                toast({
                    title: 'Pendaftaran berhasil!',
                    description: 'Data pendaftaran telah disimpan.',
                });
            },
            onError: (errors) => {
                console.error(errors);
                toast({
                    title: 'Terjadi kesalahan!',
                    description: 'Silakan periksa kembali data yang Anda masukkan.',
                });
            },
        });
    };

    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    // Show flash messages
    React.useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Berhasil!',
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: 'Error!',
                description: flash.error,
            });
        }
    }, [flash]);

    return (
        <>
            <Head title="Pendaftaran PPDB" />
            <Toaster />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 text-center">
                        <School className="mx-auto mb-4 h-16 w-16 text-blue-600" />
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Pendaftaran Peserta Didik Baru (PPDB)</h1>
                        <p className="text-gray-600">Silakan lengkapi formulir pendaftaran di bawah ini dengan data yang benar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Siswa */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Data Siswa
                                </CardTitle>
                                <CardDescription>Informasi personal calon siswa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                                        <Input
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className={errors.nama_lengkap ? 'border-red-500' : ''}
                                        />
                                        {errors.nama_lengkap && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.nama_lengkap}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="nama_panggilan">Nama Panggilan *</Label>
                                        <Input
                                            id="nama_panggilan"
                                            value={data.nama_panggilan}
                                            onChange={(e) => setData('nama_panggilan', e.target.value)}
                                            placeholder="Masukkan nama panggilan"
                                            className={errors.nama_panggilan ? 'border-red-500' : ''}
                                        />
                                        {errors.nama_panggilan && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.nama_panggilan}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                                        <Input
                                            id="tempat_lahir"
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            placeholder="Masukkan tempat lahir"
                                            className={errors.tempat_lahir ? 'border-red-500' : ''}
                                        />
                                        {errors.tempat_lahir && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.tempat_lahir}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            className={errors.tanggal_lahir ? 'border-red-500' : ''}
                                        />
                                        {errors.tanggal_lahir && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.tanggal_lahir}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label>Jenis Kelamin *</Label>
                                        <RadioGroup
                                            value={data.jenis_kelamin}
                                            onValueChange={(value: 'L' | 'P') => setData('jenis_kelamin', value)}
                                            className="mt-2 flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="L" id="laki-laki" />
                                                <Label htmlFor="laki-laki">Laki-laki</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="P" id="perempuan" />
                                                <Label htmlFor="perempuan">Perempuan</Label>
                                            </div>
                                        </RadioGroup>
                                        {errors.jenis_kelamin && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.jenis_kelamin}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="agama">Agama *</Label>
                                        <Select value={data.agama} onValueChange={(value) => setData('agama', value as any)}>
                                            <SelectTrigger className={errors.agama ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih agama" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Islam">Islam</SelectItem>
                                                <SelectItem value="Kristen">Kristen</SelectItem>
                                                <SelectItem value="Khatolik">Khatolik</SelectItem>
                                                <SelectItem value="Hindu">Hindu</SelectItem>
                                                <SelectItem value="Buddha">Buddha</SelectItem>
                                                <SelectItem value="Khonghucu">Khonghucu</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.agama && (
                                            <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.agama}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="alamat">Alamat *</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat', e.target.value)}
                                        placeholder="Masukkan alamat lengkap"
                                        className={errors.alamat ? 'border-red-500' : ''}
                                        rows={3}
                                    />
                                    {errors.alamat && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.alamat}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="no_telepon">No. Telepon</Label>
                                        <Input
                                            id="no_telepon"
                                            value={data.no_telepon}
                                            onChange={(e) => setData('no_telepon', e.target.value)}
                                            placeholder="Masukkan nomor telepon"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="pendidikan_sebelumnya">Pendidikan Sebelumnya</Label>
                                        <Input
                                            id="pendidikan_sebelumnya"
                                            value={data.pendidikan_sebelumnya}
                                            onChange={(e) => setData('pendidikan_sebelumnya', e.target.value)}
                                            placeholder="Contoh: TK Pertiwi"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="pilihan_seni">Pilihan Seni</Label>
                                    <Select value={data.pilihan_seni} onValueChange={(value) => setData('pilihan_seni', value as any)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih bidang seni" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="-">Tidak ada pilihan</SelectItem>
                                            <SelectItem value="Seni Musik">Seni Musik</SelectItem>
                                            <SelectItem value="Seni Tari">Seni Tari</SelectItem>
                                            <SelectItem value="Seni Rupa">Seni Rupa</SelectItem>
                                            <SelectItem value="Seni Teater">Seni Teater</SelectItem>
                                            <SelectItem value="Seni Media">Seni Media</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Orang Tua */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Data Orang Tua
                                </CardTitle>
                                <CardDescription>Informasi tentang orang tua siswa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="nama_ayah">Nama Ayah</Label>
                                        <Input
                                            id="nama_ayah"
                                            value={data.nama_ayah}
                                            onChange={(e) => setData('nama_ayah', e.target.value)}
                                            placeholder="Masukkan nama ayah"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nama_ibu">Nama Ibu</Label>
                                        <Input
                                            id="nama_ibu"
                                            value={data.nama_ibu}
                                            onChange={(e) => setData('nama_ibu', e.target.value)}
                                            placeholder="Masukkan nama ibu"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                                        <Input
                                            id="pekerjaan_ayah"
                                            value={data.pekerjaan_ayah}
                                            onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                            placeholder="Masukkan pekerjaan ayah"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                                        <Input
                                            id="pekerjaan_ibu"
                                            value={data.pekerjaan_ibu}
                                            onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                            placeholder="Masukkan pekerjaan ibu"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alamat Orang Tua */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Alamat Orang Tua
                                </CardTitle>
                                <CardDescription>Alamat lengkap orang tua siswa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="jalan">Jalan</Label>
                                    <Textarea
                                        id="jalan"
                                        value={data.jalan}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('jalan', e.target.value)}
                                        placeholder="Masukkan nama jalan dan nomor rumah"
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="kelurahan">Kelurahan</Label>
                                        <Input
                                            id="kelurahan"
                                            value={data.kelurahan}
                                            onChange={(e) => setData('kelurahan', e.target.value)}
                                            placeholder="Masukkan kelurahan"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="kecamatan">Kecamatan</Label>
                                        <Input
                                            id="kecamatan"
                                            value={data.kecamatan}
                                            onChange={(e) => setData('kecamatan', e.target.value)}
                                            placeholder="Masukkan kecamatan"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="kabupaten">Kabupaten</Label>
                                        <Input
                                            id="kabupaten"
                                            value={data.kabupaten}
                                            onChange={(e) => setData('kabupaten', e.target.value)}
                                            placeholder="Masukkan kabupaten"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="provinsi">Provinsi</Label>
                                        <Input
                                            id="provinsi"
                                            value={data.provinsi}
                                            onChange={(e) => setData('provinsi', e.target.value)}
                                            placeholder="Masukkan provinsi"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Wali */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Data Wali (Opsional)
                                </CardTitle>
                                <CardDescription>Informasi wali jika berbeda dengan orang tua</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="nama_wali">Nama Wali</Label>
                                        <Input
                                            id="nama_wali"
                                            value={data.nama_wali}
                                            onChange={(e) => setData('nama_wali', e.target.value)}
                                            placeholder="Masukkan nama wali"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="pekerjaan_wali">Pekerjaan Wali</Label>
                                        <Input
                                            id="pekerjaan_wali"
                                            value={data.pekerjaan_wali}
                                            onChange={(e) => setData('pekerjaan_wali', e.target.value)}
                                            placeholder="Masukkan pekerjaan wali"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="alamat_wali">Alamat Wali</Label>
                                    <Textarea
                                        id="alamat_wali"
                                        value={data.alamat_wali}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('alamat_wali', e.target.value)}
                                        placeholder="Masukkan alamat lengkap wali"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="no_telepon_wali">No. Telepon Wali</Label>
                                    <Input
                                        id="no_telepon_wali"
                                        value={data.no_telepon_wali}
                                        onChange={(e) => setData('no_telepon_wali', e.target.value)}
                                        placeholder="Masukkan nomor telepon wali"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informasi Rekening */}
                        {pengaturan?.no_rekening && pengaturan?.atas_nama && pengaturan?.biaya_pendaftaran && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Informasi Rekening Pembayaran
                                    </CardTitle>
                                    <CardDescription>Silakan transfer biaya pendaftaran ke rekening berikut:</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-base">
                                        <div>
                                            <b>No. Rekening:</b> {pengaturan.no_rekening}
                                        </div>
                                        <div>
                                            <b>Atas Nama:</b> {pengaturan.atas_nama}
                                        </div>
                                        <div>
                                            <b>Biaya Pendaftaran:</b> Rp{Number(pengaturan.biaya_pendaftaran).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Bukti Pembayaran */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Bukti Pembayaran
                                </CardTitle>
                                <CardDescription>Upload bukti pembayaran pendaftaran (jpg/png, max 2MB)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="bukti_pembayaran">Bukti Pembayaran *</Label>
                                    <Input
                                        id="bukti_pembayaran"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className={errors.bukti_pembayaran ? 'border-red-500' : ''}
                                    />
                                    {errors.bukti_pembayaran && (
                                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.bukti_pembayaran}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <Button type="submit" size="lg" disabled={processing} className="min-w-[200px]">
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
