import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { MataPelajaranType } from '@/pages/mata-pelajaran/columns';
import useNilaiStore from '@/stores/useNilai';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { SiswaType } from '../columns';

const DialogCreateNilai = () => {
    const context = useNilaiStore();
    const { mapel, data: siswaData } = usePage().props as unknown as { mapel: MataPelajaranType; data: SiswaType[] };

    const { data, setData, post, processing, errors, reset } = useForm({
        nilai_id: context.currentRow?.kelas_aktif?.nilai_mapel?.id ?? 0,
        id: context.currentRowDetailNilai?.id ?? 0,
        nilai: context.currentRowDetailNilai?.name ?? '',
    });

    useEffect(() => {
        if (context.currentRowDetailNilai && context.dialogDetailNilai == 'update') {
            setData('id', context.currentRowDetailNilai.id);
            setData('nilai', context.currentRowDetailNilai.nilai);
        }
    }, [context.currentRowDetailNilai]);

    useEffect(() => {
        setData('nilai_id', context.currentRow?.kelas_aktif?.nilai_mapel?.id);
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialogDetailNilai == 'create') {
            post(
                route('nilai.store', {
                    id: mapel.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        context.setOpenDetailNilai(false);

                        router.reload({
                            onSuccess: (page) => {
                                const updatedRow = siswaData.find((s) => s.id === context.currentRow.id);
                                context.setCurrentRow(updatedRow); // kamu harus punya setCurrentRow
                            },
                        });

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
                        context.setOpenDetailNilai(false);

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
            open={context.openDetailNilai}
            onOpenChange={(state) => {
                reset();
                context.setOpenDetailNilai(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`${context.dialogDetailNilai == 'create' ? 'Add' : 'Update'} Nilai`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialogDetailNilai == 'create' ? 'Create new' : 'Update'} Nilai here. `}
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
                            />
                            <InputError message={errors.nilai} className="col-span-4 col-start-3 mt-2" />
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
