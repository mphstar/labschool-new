import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import useSiswaStore from '@/stores/useSiswa';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { KelasType } from '../kelas/columns';

const UbahKelas = () => {
    const context = useSiswaStore();

    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: context.currentRow?.id ?? 0,
        riwayat_kelas_id: context.currentRow?.kelas_aktif.id ?? 0,
        kelas_id: context.currentRow?.kelas_aktif.kelas.id ?? 0,
        status: context.currentRow?.kelas_aktif.status ?? 'selesai',
        status_siswa: context.currentRow?.status ?? 'aktif',

        kelas_selanjutnya: undefined as string | undefined,
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'ubah_kelas') {
            setData('siswa_id', context.currentRow.id);
            setData('riwayat_kelas_id', context.currentRow.kelas_aktif.id);
            setData('kelas_id', context.currentRow.kelas_aktif.kelas.id);
            setData('status_siswa', context.currentRow.status);
            setData('status', 'selesai');
        }
    }, [context.currentRow]);

    const { kelas } = usePage().props as unknown as { kelas: KelasType[] };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('siswa.ubah-kelas'), {
            onSuccess: () => {
                reset();
                context.setOpen(false);

                toast({
                    title: 'Success',
                    description: 'Kelas siswa berhasil diubah',
                });
            },
            onError: (errors) => {
                console.log(errors);

                toast({
                    title: 'Error',
                    description: 'Cek kembali data yang anda masukkan',
                });
            },
        });
    };

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`Ubah Kelas`}</DialogTitle>
                    <DialogDescription>
                        Saat ini siswa {context.currentRow?.nama_lengkap} berada di {context.currentRow?.kelas_aktif.kelas.name}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Status Siswa</Label>
                            <Select value={data.status_siswa} onValueChange={(value) => setData('status_siswa', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Status Siswa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status Siswa</SelectLabel>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="putus">Putus Sekolah</SelectItem>
                                        <SelectItem value="lulus">Lulus</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} className="col-span-4 col-start-3 mt-2" />
                        </div>
                        {data.status_siswa == 'aktif' && (
                            <>
                                <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                    <Label className="col-span-2 text-right">Status Kelas</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="col-span-4">
                                            <SelectValue placeholder="Pilih Status Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status Kelas</SelectLabel>
                                                <SelectItem value="selesai">Selesai</SelectItem>
                                                <SelectItem value="ulang">Ulang</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} className="col-span-4 col-start-3 mt-2" />
                                </div>
                                {data.status === 'selesai' && (
                                    <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <Label className="col-span-2 text-right">Kelas Selanjutnya</Label>
                                        <Select value={data.kelas_selanjutnya} onValueChange={(value) => setData('kelas_selanjutnya', value)}>
                                            <SelectTrigger className="col-span-4">
                                                <SelectValue placeholder="Pilih Kelas Selanjutnya" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Pilih Kelas</SelectLabel>
                                                    {kelas.map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.kelas_selanjutnya} className="col-span-4 col-start-3 mt-2" />
                                    </div>
                                )}
                            </>
                        )}
                    </form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)}>
                        Tutup
                    </Button>
                    <Button type="submit" form="user-form" disabled={processing}>
                        {processing ? 'Loading...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UbahKelas;
