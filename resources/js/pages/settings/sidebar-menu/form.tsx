import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { iconOptions } from './icon-options';

const FormDialog = () => {
    const context = useProductStore();
    const [iconSearch, setIconSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        id: context.currentRow?.id ?? 0,
        title: context.currentRow?.title ?? '',
        url: context.currentRow?.url ?? '',
        icon: context.currentRow?.icon ?? '',
        order: context.currentRow?.order ?? 1,
        is_active: context.currentRow?.is_active ?? true,
    });

    useEffect(() => {
        if (context.currentRow && context.dialog == 'update') {
            setData('id', context.currentRow.id);
            setData('title', context.currentRow.title);
            setData('url', context.currentRow.url);
            setData('icon', context.currentRow.icon ?? '');
            setData('order', context.currentRow.order ?? 1);
            setData('is_active', context.currentRow.is_active ?? true);
        }
    }, [context.currentRow]);

    const filteredIcons = iconOptions.filter((opt) =>
        opt.name.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (context.dialog == 'create') {
            post(route('sidebar-menu.store'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Menu created successfully',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Cek kembali data yang anda masukkan',
                    });
                },
            });
        } else {
            post(route('sidebar-menu.update'), {
                onSuccess: () => {
                    reset();
                    context.setOpen(false);

                    toast({
                        title: 'Success',
                        description: 'Menu updated successfully',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Cek kembali data yang anda masukkan',
                    });
                },
            });
        }
    };

    const SelectedIcon = iconOptions.find((opt) => opt.name === data.icon)?.icon;

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                reset();
                setIconSearch('');
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`${context.dialog == 'create' ? 'Add' : 'Update'} Menu`}</DialogTitle>
                    <DialogDescription>
                        {`${context.dialog == 'create' ? 'Create new' : 'Update'} sidebar menu. `}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="sidebar-menu-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Title</Label>
                            <Input
                                value={data.title}
                                onChange={(e) => {
                                    setData('title', e.target.value);
                                }}
                                placeholder="Nama menu"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.title} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">URL</Label>
                            <Input
                                value={data.url}
                                onChange={(e) => {
                                    setData('url', e.target.value);
                                }}
                                placeholder="https://example.com atau /page"
                                className="col-span-4"
                                autoComplete="off"
                            />
                            <InputError message={errors.url} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Icon</Label>
                            <div className="col-span-4">
                                <Select
                                    value={data.icon}
                                    onValueChange={(value) => setData('icon', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih icon">
                                            {data.icon && SelectedIcon && (
                                                <div className="flex items-center gap-2">
                                                    <SelectedIcon className="h-4 w-4" />
                                                    <span>{data.icon}</span>
                                                </div>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search icon..."
                                                value={iconSearch}
                                                onChange={(e) => setIconSearch(e.target.value)}
                                                className="mb-2"
                                            />
                                        </div>
                                        <ScrollArea className="h-60">
                                            {filteredIcons.map((opt) => (
                                                <SelectItem key={opt.name} value={opt.name}>
                                                    <div className="flex items-center gap-2">
                                                        <opt.icon className="h-4 w-4" />
                                                        <span>{opt.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>
                            <InputError message={errors.icon} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right pt-2">Urutan</Label>
                            <div className="col-span-4 space-y-1">
                                <Input
                                    type="number"
                                    min="1"
                                    value={data.order}
                                    onChange={(e) => {
                                        setData('order', parseInt(e.target.value) || 1);
                                    }}
                                    placeholder="1"
                                    className="w-24"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Angka lebih kecil tampil lebih atas (1 = paling atas)
                                </p>
                            </div>
                            <InputError message={errors.order} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right">Active</Label>
                            <div className="col-span-4 flex items-center gap-2">
                                <Checkbox
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </div>
                        </div>
                    </form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button type="submit" form="sidebar-menu-form" disabled={processing}>
                        {processing ? 'Loading...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;

