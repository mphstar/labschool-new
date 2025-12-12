import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface SiswaType {
    id: number;
    nis: string;
    nama_lengkap: string;
    riwayat_kelas: {
        id: number;
        kelas: {
            id: number;
            name: string;
        };
    }[];
}

interface KelasType {
    id: number;
    name: string;
}

const FormDialog = () => {
    const context = useProductStore();
    const { kelas } = usePage().props as unknown as { kelas: KelasType[] };

    const [filteredSiswa, setFilteredSiswa] = useState<SiswaType[]>([]);
    const [isLoadingSiswa, setIsLoadingSiswa] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        riwayat_kelas_id: context.currentRow?.riwayat_kelas_id ?? '',
        siswa_id: context.currentRow?.riwayat_kelas?.siswa?.id ?? '',
        kelas_id: context.currentRow?.riwayat_kelas?.kelas?.id ?? '',
        status: context.currentRow?.status ?? 'hadir',
        keterangan: context.currentRow?.keterangan ?? '',
        tanggal: context.currentRow?.tanggal
            ? context.currentRow.tanggal.replace(' ', 'T').slice(0, 16)
            : new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16),
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'update') {
            setData('id', context.currentRow.id);
            setData('riwayat_kelas_id', context.currentRow.riwayat_kelas_id.toString());
            setData('siswa_id', context.currentRow.riwayat_kelas.siswa.id.toString());
            setData('kelas_id', context.currentRow.riwayat_kelas.kelas.id.toString());
            setData('status', context.currentRow.status);
            setData('keterangan', context.currentRow.keterangan);
            setData('tanggal', context.currentRow.tanggal.replace(' ', 'T').slice(0, 16));

            // Load siswa for the selected kelas when updating
            if (context.currentRow.riwayat_kelas.kelas.id) {
                fetchSiswaByKelas(context.currentRow.riwayat_kelas.kelas.id.toString());
            }
        }
    }, [context.currentRow, context.dialog]);

    // Fetch siswa by kelas
    const fetchSiswaByKelas = async (kelasId: string) => {
        if (!kelasId) {
            setFilteredSiswa([]);
            return;
        }

        setIsLoadingSiswa(true);
        try {
            const response = await fetch(route('presensi.get-siswa-by-kelas', { kelas_id: kelasId }));
            const result = await response.json();
            setFilteredSiswa(result.data || []);
        } catch (error) {
            console.error('Error fetching siswa:', error);
            setFilteredSiswa([]);
            toast({
                title: 'Error',
                description: 'Gagal memuat data siswa',
            });
        } finally {
            setIsLoadingSiswa(false);
        }
    };

    // Handle kelas change
    useEffect(() => {
        if (data.kelas_id) {
            fetchSiswaByKelas(data.kelas_id);
        }
    }, [data.kelas_id]);

    // Handle siswa change to get riwayat_kelas_id
    const handleSiswaChange = (siswaId: string) => {
        setData('siswa_id', siswaId);

        const selectedSiswa = filteredSiswa.find(s => s.id.toString() === siswaId);
        if (selectedSiswa) {
            const riwayatKelas = selectedSiswa.riwayat_kelas.find(rk => rk.kelas.id.toString() === data.kelas_id);
            if (riwayatKelas) {
                setData('riwayat_kelas_id', riwayatKelas.id.toString());
            }
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(route('presensi.store'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);
                    setFilteredSiswa([]);

                    toast({
                        title: 'Success',
                        description: 'Presensi berhasil dicatat',
                    });
                },
                onError: (errors) => {
                    // Check if there's a specific duplicate error message
                    const duplicateError = errors.riwayat_kelas_id || errors.error;
                    toast({
                        title: 'Error',
                        description: duplicateError || 'Cek kembali data yang anda masukkan',
                    });
                },
            });
        } else {
            post(route('presensi.update'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);
                    setFilteredSiswa([]);

                    toast({
                        title: 'Success',
                        description: 'Presensi berhasil diperbarui',
                    });
                },
                onError: (errors) => {
                    // Check if there's a specific duplicate error message
                    const duplicateError = errors.riwayat_kelas_id || errors.error;
                    toast({
                        title: 'Error',
                        description: duplicateError || 'Cek kembali data yang anda masukkan',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                reset();
                setFilteredSiswa([]);
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`${context.dialog == 'create' ? 'Tambah' : 'Update'} Presensi Manual`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Tambah presensi' : 'Update presensi'} siswa secara manual. `}
                        Pilih kelas, siswa, dan status kehadiran.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[28rem] w-full py-1 pr-4">
                    <form id="presensi-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Kelas</Label>
                            <Select value={data.kelas_id} onValueChange={(value) => {
                                setData('kelas_id', value);
                                setData('siswa_id', ''); // Reset siswa selection
                                setData('riwayat_kelas_id', '');
                            }}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Kelas</SelectLabel>
                                        {kelas?.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.kelas_id} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Siswa</Label>
                            <Select
                                value={data.siswa_id}
                                onValueChange={handleSiswaChange}
                                disabled={!data.kelas_id || isLoadingSiswa}
                            >
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder={
                                        isLoadingSiswa ? "Memuat siswa..." :
                                            !data.kelas_id ? "Pilih kelas terlebih dahulu" :
                                                "Pilih Siswa"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Siswa</SelectLabel>
                                        {filteredSiswa.map((siswa) => (
                                            <SelectItem key={siswa.id} value={siswa.id.toString()}>
                                                {siswa.nis} - {siswa.nama_lengkap}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.siswa_id || errors.riwayat_kelas_id} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status Kehadiran</SelectLabel>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="alfa">Alfa</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Tanggal</Label>
                            <Input
                                type="datetime-local"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="col-span-4"
                            />
                            <InputError message={errors.tanggal} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right mt-2">Keterangan</Label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                placeholder="Keterangan tambahan (opsional)"
                                className="col-span-4 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                rows={3}
                            />
                            <InputError message={errors.keterangan} className="col-span-4 col-start-3 mt-2" />
                        </div>
                    </form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                        reset();
                        setFilteredSiswa([]);
                        context.setOpen(false);
                    }} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" form="presensi-form" disabled={processing}>
                        {processing ? 'Loading...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
