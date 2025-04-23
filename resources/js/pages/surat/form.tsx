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
        nomor_surat: context.currentRow?.nomor_surat ?? '',
        perihal: context.currentRow?.perihal ?? '',
        pihak: context.currentRow?.pihak ?? '',
        jenis: context.currentRow?.jenis ?? 'masuk',
        file_surat: context.currentRow?.file_surat ?? undefined,
        tanggal_surat: context.currentRow?.tanggal_surat ?? '',
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'update') {
            setData('id', context.currentRow.id);
            setData('jenis', context.currentRow.jenis);
            setData('nomor_surat', context.currentRow?.nomor_surat);
            setData('perihal', context.currentRow.perihal);
            setData('pihak', context.currentRow.pihak);
            setData('file_surat', context.currentRow.file_surat);
            setData('tanggal_surat', context.currentRow.tanggal_surat);
        }
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(route('surat.store'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Surat created successfully',
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
            post(route('surat.update'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Surat updated successfully',
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
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} New Surat`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} Surat here. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Nomor Surat</Label>

                            <div className="col-span-4 flex items-center gap-2">
                                <Input
                                    value={data.nomor_surat}
                                    onChange={(e) => {
                                        setData('nomor_surat', e.target.value);
                                    }}
                                    placeholder="1/UN25.1.5/SDL/2025"
                                    className="flex-1"
                                    autoComplete="off"
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        const bulan = today.getMonth() + 1;
                                        const tahun = today.getFullYear();
                                        const autoNomor = `1/UN25.1.5/SDL/${tahun}`;
                                        setData('nomor_surat', autoNomor);
                                    }}
                                    className=""
                                >
                                    Auto
                                </Button>
                            </div>

                            <InputError message={errors.nomor_surat} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Perihal</Label>
                            <Input
                                value={data.perihal}
                                onChange={(e) => {
                                    setData('perihal', e.target.value);
                                }}
                                placeholder="Masukkan Perihal"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.perihal} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Pihak</Label>
                            <Input
                                value={data.pihak}
                                onChange={(e) => {
                                    setData('pihak', e.target.value);
                                }}
                                placeholder="Pengirim atau penerima"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.pihak} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Jenis Surat</Label>
                            <Select value={data.jenis} onValueChange={(value) => setData('jenis', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Jenis Surat" />
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
                            <Label className="col-span-2 text-right">Tanggal</Label>
                            <Input
                                type="date"
                                value={data.tanggal_surat}
                                onChange={(e) => {
                                    setData('tanggal_surat', e.target.value);
                                }}
                                placeholder="Masukkan tanggal"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.tanggal_surat} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">File Surat</Label>
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('file_surat', e.target.files[0]);
                                    }
                                }}
                                placeholder="Masukkan file surat"
                                className="col-span-4"
                            />
                            <InputError message={errors.file_surat} className="col-span-4 col-start-3 mt-2" />
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
