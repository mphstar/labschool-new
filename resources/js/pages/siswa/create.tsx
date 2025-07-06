import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { KelasType } from '../kelas/columns';
import { TahunAkademikType } from '../tahun-akademik/columns';
import { SiswaType } from './columns';

export default function Page() {
    const { siswa, kelas, thnakademik } = usePage().props as unknown as {
        siswa: SiswaType;
        kelas: KelasType[];
        thnakademik: TahunAkademikType[];
    };

    console.log(thnakademik);
    

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Siswa',
            href: '/siswa',
        },
        {
            title: siswa ? siswa.nama_lengkap : 'Siswa',
            href: siswa ? `/siswa/${siswa.id}/edit` : '/siswa/create',
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        kelas_id: undefined as number | undefined,
        tahun_akademik_id: undefined as number | undefined,
        id: siswa?.id ?? 0,
        nis: siswa?.nis ?? '',
        nisn: siswa?.nisn ?? '',
        nama_lengkap: siswa?.nama_lengkap ?? '',
        nama_panggilan: siswa?.nama_panggilan ?? '',
        tempat_lahir: siswa?.tempat_lahir ?? '',
        tanggal_lahir: siswa?.tanggal_lahir ?? '',
        jenis_kelamin: siswa?.jenis_kelamin ?? 'L',
        agama: siswa?.agama ?? 'Islam',
        alamat: siswa?.alamat ?? '',
        no_telepon: siswa?.no_telepon ?? '',
        pendidikan_sebelumnya: siswa?.pendidikan_sebelumnya ?? '',
        pilihan_seni: siswa?.pilihan_seni ?? '',

        // informasi orang tua
        nama_ayah: siswa?.nama_ayah ?? '',
        nama_ibu: siswa?.nama_ibu ?? '',
        pekerjaan_ayah: siswa?.pekerjaan_ayah ?? '',
        pekerjaan_ibu: siswa?.pekerjaan_ibu ?? '',
        jalan: siswa?.jalan ?? '',
        kelurahan: siswa?.kelurahan ?? '',
        kecamatan: siswa?.kecamatan ?? '',
        kabupaten: siswa?.kabupaten ?? '',
        provinsi: siswa?.provinsi ?? '',

        // informasi wali
        nama_wali: siswa?.nama_wali ?? '',
        pekerjaan_wali: siswa?.pekerjaan_wali ?? '',
        alamat_wali: siswa?.alamat_wali ?? '',
        no_telepon_wali: siswa?.no_telepon_wali ?? '',
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission

        if (siswa) {
            post(route('siswa.update'), {
                onSuccess: (e) => {
                    toast({
                        title: 'Success',
                        description: 'Data siswa berhasil diperbarui',
                    });
                },
                onError: (e) => {
                    toast({
                        title: 'Error',
                        description: Object.values(e)[0],
                    });
                },
            });
        } else {
            post(route('siswa.store'), {
                onSuccess: (e) => {
                    toast({
                        title: 'Success',
                        description: 'Data siswa berhasil disimpan',
                    });
                },
                onError: (e) => {
                    toast({
                        title: 'Error',
                        description: Object.values(e)[0],
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Siswa" />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Siswa</h2>
                        <p className="text-muted-foreground">Here&apos;s a information of siswa</p>
                    </div>
                    <div className="flex gap-2">{/* actions here */}</div>
                </div>

                <form id="user-form" onSubmit={onSubmit} className="grid grid-cols-1 space-y-4 space-x-4 p-0.5 sm:grid-cols-2 md:grid-cols-3">
                    {!siswa && (
                        <>
                            <div className="flex flex-col gap-y-3">
                                <Label className="required">Pilih Tahun Akademik</Label>
                                <Select
                                    value={data.tahun_akademik_id?.toString()}
                                    onValueChange={(value) => setData('tahun_akademik_id', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-4">
                                        <SelectValue placeholder="Pilih Tahun Akademik" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pilih Tahun Akademik</SelectLabel>
                                            {thnakademik.map((it) => (
                                                <SelectItem key={it.id} value={it.id.toString()}>
                                                    {it.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tahun_akademik_id} className="" />
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <Label className="required">Pilih Kelas</Label>
                                <Select value={data.kelas_id?.toString()} onValueChange={(value) => setData('kelas_id', parseInt(value))}>
                                    <SelectTrigger className="col-span-4">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Pilih Kelas</SelectLabel>
                                            {kelas.map((it) => (
                                                <SelectItem key={it.id} value={it.id.toString()}>
                                                    {it.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.kelas_id} className="" />
                            </div>
                        </>
                    )}

                    <h1 className="col-span-full mt-3 font-semibold">Informasi Siswa</h1>
                    <Separator className="col-span-full my-1 mb-6" />

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">NIS</Label>
                        <Input
                            value={data.nis}
                            onChange={(e) => {
                                setData('nis', e.target.value);
                            }}
                            placeholder="Masukkan NIS"
                            className=""
                            type="number"
                            autoComplete="off"
                        />
                        <InputError message={errors.nis} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">NISN</Label>
                        <Input
                            value={data.nisn}
                            onChange={(e) => {
                                setData('nisn', e.target.value);
                            }}
                            placeholder="Masukkan NISN"
                            className=""
                            type="number"
                            autoComplete="off"
                        />
                        <InputError message={errors.nisn} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Nama Lengkap</Label>
                        <Input
                            value={data.nama_lengkap}
                            onChange={(e) => {
                                setData('nama_lengkap', e.target.value);
                            }}
                            placeholder="Masukkan Nama Lengkap"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.nama_lengkap} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Nama Panggilan</Label>
                        <Input
                            value={data.nama_panggilan}
                            onChange={(e) => {
                                setData('nama_panggilan', e.target.value);
                            }}
                            placeholder="Masukkan Nama Panggilan"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.nama_panggilan} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Tempat Lahir</Label>
                        <Input
                            value={data.tempat_lahir}
                            onChange={(e) => {
                                setData('tempat_lahir', e.target.value);
                            }}
                            placeholder="Masukkan Tempat Lahir"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.tempat_lahir} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Tanggal Lahir</Label>
                        <Input
                            type="date"
                            value={data.tanggal_lahir}
                            onChange={(e) => {
                                setData('tanggal_lahir', e.target.value);
                            }}
                            placeholder="Masukkan Tanggal Lahir"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.tanggal_lahir} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Jenis Kelamin</Label>
                        <RadioGroup
                            value={data.jenis_kelamin}
                            onValueChange={(e) => setData('jenis_kelamin', e as 'L' | 'P')}
                            className="flex gap-x-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="L" id="L" />
                                <Label htmlFor="L">Laki-laki</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="P" id="P" />
                                <Label htmlFor="P">Perempuan</Label>
                            </div>
                        </RadioGroup>

                        <InputError message={errors.jenis_kelamin} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Agama</Label>
                        <Select
                            value={data.agama}
                            onValueChange={(value) => setData('agama', value as 'Islam' | 'Kristen' | 'Hindu' | 'Buddha' | 'Khonghucu' | 'Khatolik')}
                        >
                            <SelectTrigger className="col-span-4">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Agama</SelectLabel>
                                    <SelectItem value="Islam">Islam</SelectItem>
                                    <SelectItem value="Kristen">Kristen</SelectItem>
                                    <SelectItem value="Khatolik">Khatolik</SelectItem>
                                    <SelectItem value="Hindu">Hindu</SelectItem>
                                    <SelectItem value="Buddha">Buddha</SelectItem>
                                    <SelectItem value="Khonghucu">Khonghucu</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.agama} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Alamat</Label>
                        <Input
                            value={data.alamat}
                            onChange={(e) => {
                                setData('alamat', e.target.value);
                            }}
                            placeholder="Masukkan Alamat"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.alamat} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">No Telepon</Label>
                        <Input
                            value={data.no_telepon}
                            onChange={(e) => {
                                setData('no_telepon', e.target.value);
                            }}
                            placeholder="Masukkan No Telepon"
                            type="number"
                            max={15}
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.no_telepon} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Pendidikan Sebelumnya</Label>
                        <Input
                            value={data.pendidikan_sebelumnya}
                            onChange={(e) => {
                                setData('pendidikan_sebelumnya', e.target.value);
                            }}
                            placeholder="Masukkan Pendidikan Sebelumnya"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.pendidikan_sebelumnya} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="required">Pilihan Seni</Label>
                        <Select value={data.pilihan_seni} onValueChange={(value) => setData('pilihan_seni', value)}>
                            <SelectTrigger className="col-span-4">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilihan Seni</SelectLabel>
                                    <SelectItem value="Seni Musik">Seni Musik</SelectItem>
                                    <SelectItem value="Seni Tari">Seni Tari</SelectItem>
                                    <SelectItem value="Seni Rupa">Seni Rupa</SelectItem>
                                    <SelectItem value="Seni Teater">Seni Teater</SelectItem>
                                    <SelectItem value="Seni Media">Seni Media</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.pilihan_seni} className="" />
                    </div>

                    <h1 className="col-span-full mt-3 font-semibold">Informasi Orang Tua</h1>
                    <Separator className="col-span-full my-1 mb-6" />

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Nama Ayah</Label>
                        <Input
                            value={data.nama_ayah}
                            onChange={(e) => {
                                setData('nama_ayah', e.target.value);
                            }}
                            placeholder="Masukkan Nama Ayah"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.nama_ayah} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Nama Ibu</Label>
                        <Input
                            value={data.nama_ibu}
                            onChange={(e) => {
                                setData('nama_ibu', e.target.value);
                            }}
                            placeholder="Masukkan Nama Ibu"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.nama_ibu} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Pekerjaan Ayah</Label>
                        <Input
                            value={data.pekerjaan_ayah}
                            onChange={(e) => {
                                setData('pekerjaan_ayah', e.target.value);
                            }}
                            placeholder="Masukkan Pekerjaan Ayah"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.pekerjaan_ayah} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Pekerjaan Ibu</Label>
                        <Input
                            value={data.pekerjaan_ibu}
                            onChange={(e) => {
                                setData('pekerjaan_ibu', e.target.value);
                            }}
                            placeholder="Masukkan Pekerjaan Ibu"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.pekerjaan_ibu} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Jalan</Label>
                        <Input
                            value={data.jalan}
                            onChange={(e) => {
                                setData('jalan', e.target.value);
                            }}
                            placeholder="Masukkan Jalan"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.jalan} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Kelurahan</Label>
                        <Input
                            value={data.kelurahan}
                            onChange={(e) => {
                                setData('kelurahan', e.target.value);
                            }}
                            placeholder="Masukkan Kelurahan"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.kelurahan} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Kecamatan</Label>
                        <Input
                            value={data.kecamatan}
                            onChange={(e) => {
                                setData('kecamatan', e.target.value);
                            }}
                            placeholder="Masukkan Kecamatan"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.kecamatan} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Kabupaten</Label>
                        <Input
                            value={data.kabupaten}
                            onChange={(e) => {
                                setData('kabupaten', e.target.value);
                            }}
                            placeholder="Masukkan Kabupaten"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.kabupaten} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Provinsi</Label>
                        <Input
                            value={data.provinsi}
                            onChange={(e) => {
                                setData('provinsi', e.target.value);
                            }}
                            placeholder="Masukkan Provinsi"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.provinsi} className="" />
                    </div>

                    <h1 className="col-span-full mt-3 font-semibold">Informasi Wali</h1>
                    <Separator className="col-span-full my-1 mb-6" />
                    <div className="flex flex-col gap-y-3">
                        <Label className="">Nama Wali</Label>
                        <Input
                            value={data.nama_wali}
                            onChange={(e) => {
                                setData('nama_wali', e.target.value);
                            }}
                            placeholder="Masukkan Nama Wali"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.nama_wali} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Pekerjaan Wali</Label>
                        <Input
                            value={data.pekerjaan_wali}
                            onChange={(e) => {
                                setData('pekerjaan_wali', e.target.value);
                            }}
                            placeholder="Masukkan Pekerjaan Wali"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.pekerjaan_wali} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">Alamat Wali</Label>
                        <Input
                            value={data.alamat_wali}
                            onChange={(e) => {
                                setData('alamat_wali', e.target.value);
                            }}
                            placeholder="Masukkan Alamat Wali"
                            className=""
                            autoComplete="off"
                        />
                        <InputError message={errors.alamat_wali} className="" />
                    </div>

                    <div className="flex flex-col gap-y-3">
                        <Label className="">No Telepon Wali</Label>
                        <Input
                            value={data.no_telepon_wali}
                            onChange={(e) => {
                                setData('no_telepon_wali', e.target.value);
                            }}
                            placeholder="Masukkan No Telepon Wali"
                            className=""
                            type="number"
                            max={15}
                            autoComplete="off"
                        />
                        <InputError message={errors.no_telepon_wali} className="" />
                    </div>

                    <div className="col-span-full flex items-center justify-end gap-x-2">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {siswa ? 'Update' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
