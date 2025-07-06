import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { MataPelajaranType } from '@/pages/mata-pelajaran/columns';
import useNilaiStore from '@/stores/useNilai';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const DialogCreateNilai = () => {
    const context = useNilaiStore();
    const { mapel, nilai_id } = usePage().props as unknown as { mapel: MataPelajaranType; nilai_id: number };

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        nilai: context.currentRow?.nilai ?? '',
        nilai_id: nilai_id,
        keterangan: context.currentRow?.keterangan ?? '',
        jenis: context.currentRow?.jenis ?? 'sas',
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'update') {
            setData('id', context.currentRow.id);
            setData('nilai', context.currentRow.nilai);
            setData('keterangan', context.currentRow.keterangan);
            setData('jenis', context.currentRow.jenis);
        }
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(
                route('nilai.store', {
                    id: mapel.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        context.setOpen(false);

                        toast({
                            title: 'Success',
                            description: 'Nilai added successfully',
                        });
                    },
                    onError: (errors) => {
                        console.log(errors);

                        toast({
                            title: 'Error',
                            description: 'Cek kembali data yang anda masukkan',
                        });
                    },
                },
            );
        } else {
            post(
                route('nilai.update', {
                    id: mapel.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        context.setOpen(false);

                        toast({
                            title: 'Success',
                            description: 'Nilai updated successfully',
                        });
                    },
                    onError: (errors) => {
                        toast({
                            title: 'Error',
                            description: 'Cek kembali data yang anda masukkan',
                        });
                    },
                },
            );
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
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} Nilai`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} Nilai here. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Nilai</Label>
                            <Input
                                value={data.nilai}
                                onChange={(e) => {
                                    setData('nilai', e.target.value);
                                }}
                                placeholder="Masukkan nilai"
                                className="col-span-4"
                                autoComplete="off"
                                type="number"
                            />
                            <InputError message={errors.nilai} className="col-span-4 col-start-3 mt-2" />
                        </div>
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
                            <Label className="col-span-2 text-right">Jenis</Label>
                            <Select value={data.jenis} onValueChange={(value) => setData('jenis', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Jenis</SelectLabel>
                                        <SelectItem value="materi">Materi</SelectItem>
                                        <SelectItem value="non-tes">Non Tes</SelectItem>
                                        <SelectItem value="tes">Tes</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis} className="col-span-4 col-start-3 mt-2" />
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

export default DialogCreateNilai;
