import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { MataPelajaranType } from '../mata-pelajaran/columns';

const FormDialog = () => {
    const context = useProductStore();
    const { mapel } = usePage().props as unknown as { mapel: MataPelajaranType };

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        name: context.currentRow?.name ?? '',
    });

    useEffect(() => {
        if (context.currentRow) {
            setData('id', context.currentRow.id);
            setData('name', context.currentRow.name);
        }
    }, [context.currentRow]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(
                route('materi.store', {
                    id: mapel.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        context.setOpen(false);

                        toast({
                            title: 'Success',
                            description: 'Materi created successfully',
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
        } else {
            post(
                route('materi.update', {
                    id: mapel.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        context.setOpen(false);

                        toast({
                            title: 'Success',
                            description: 'Materi updated successfully',
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
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} New Materi`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} Materi here. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="user-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => {
                                    setData('name', e.target.value);
                                }}
                                placeholder="Masukkan nama"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.name} className="col-span-4 col-start-3 mt-2" />
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
