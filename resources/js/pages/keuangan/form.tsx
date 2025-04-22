import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

const FormDialog = () => {
    const context = useProductStore();

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        keterangan: context.currentRow?.keterangan ?? '',
        jenis: context.currentRow?.jenis ?? 'masuk',
        tipe_pembayaran: context.currentRow?.tipe_pembayaran ?? 'tunai',
        bukti_pembayaran: context.currentRow?.bukti_pembayaran ?? undefined,
        jumlah: context.currentRow?.jumlah ?? '',
        tanggal: context.currentRow?.tanggal ?? '',
    });

    useEffect(() => {
        if (context.currentRow) {
            setData('id', context.currentRow.id);
            setData('keterangan', context.currentRow.keterangan);
            setData('jenis', context.currentRow.jenis);
            setData('tipe_pembayaran', context.currentRow.tipe_pembayaran);
            setData('bukti_pembayaran', context.currentRow.bukti_pembayaran);
            setData('jumlah', context.currentRow.jumlah);
            setData('tanggal', context.currentRow.tanggal);
        }
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(route('keuangan.store'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Keuangan created successfully',
                    });
                },
                onError: (errors) => {
                    toast({
                        title: 'Error',
                        description: 'Cek kembali data yang anda masukkan',
                    });
                },
            });
        } else {
            post(route('keuangan.update'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Keuangan updated successfully',
                    });
                },
                onError: (errors) => {
                    toast({
                        title: 'Error',
                        description: 'Cek kembali data yang anda masukkan',
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
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} New Keuangan`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} Keuangan here. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Keterangan</Label>
                            <Input
                                value={data.keterangan}
                                onChange={(e) => {
                                    setData('keterangan', e.target.value);
                                }}
                                placeholder="Masukkan keterangan"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.keterangan} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Tanggal</Label>
                            <Input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => {
                                    setData('tanggal', e.target.value);
                                }}
                                placeholder="Masukkan tanggal"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.tanggal} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Jumlah</Label>
                            <Input
                                type="number"
                                value={data.jumlah}
                                onChange={(e) => {
                                    setData('jumlah', e.target.value);
                                }}
                                placeholder="Masukkan jumlah"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.jumlah} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Jenis</Label>
                            <Select value={data.jenis} onValueChange={(value) => setData('jenis', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Jenis</SelectLabel>
                                        <SelectItem value="masuk">Masuk</SelectItem>
                                        <SelectItem value="keluar">Keluar</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Tipe Pembayaran</Label>
                            <Select value={data.tipe_pembayaran} onValueChange={(value) => setData('tipe_pembayaran', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Tipe Pembayaran</SelectLabel>
                                        <SelectItem value="tunai">Tunai</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipe_pembayaran} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Bukti Pembayaran</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('bukti_pembayaran', e.target.files[0]);
                                    }
                                }}
                                placeholder="Masukkan bukti pembayaran"
                                className="col-span-4"
                            />
                            <InputError message={errors.bukti_pembayaran} className="col-span-4 col-start-3 mt-2" />
                        </div>
                    </form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" form="user-form" disabled={processing}>
                        {processing ? 'Loading...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
