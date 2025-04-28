import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const FormDialog = () => {
    const context = useProductStore();

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        nama_lengkap: context.currentRow?.nama_lengkap ?? '',
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'update') {
            setData('id', context.currentRow.id);
            setData('nama_lengkap', context.currentRow.nama_lengkap);
        }
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(route('siswa.store'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Siswa created successfully',
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
            post(route('siswa.update'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Siswa updated successfully',
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
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} New siswa`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} siswa here. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Name</Label>
                            <Input
                                value={data.nama_lengkap}
                                onChange={(e) => {
                                    setData('nama_lengkap', e.target.value);
                                }}
                                placeholder="Masukkan nama"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.nama_lengkap} className="col-span-4 col-start-3 mt-2" />
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
