import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import useProductStore from '@/stores/useProduct';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    nama: z.string().min(1, { message: 'Nama tidak boleh kosong' }),
    harga_beli: z
        .string()
        .min(1, 'Harga Beli wajib diisi')
        .refine((val) => val.replace(/\D/g, '').length > 0, {
            message: 'Harga Beli harus berupa angka',
        }),
    harga_jual: z
        .string()
        .min(1, 'Harga Jual wajib diisi')
        .refine((val) => val.replace(/\D/g, '').length > 0, {
            message: 'Harga Jual harus berupa angka',
        }),
    stok: z
        .string()
        .min(1, { message: 'Stok tidak boleh kosong' })
        .refine((val) => val.replace(/\D/g, '').length > 0, {
            message: 'Harga Jual harus berupa angka',
        }),
    gambar: z.instanceof(File).optional(),
});
type UserForm = z.infer<typeof formSchema>;

const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Hanya angka
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
};

const FormDialog = () => {
    const context = useProductStore();

    console.log(context.currentRow);

    const form = useForm<UserForm>({
        resolver: zodResolver(formSchema),
        values:
            context.dialog === 'update'
                ? {
                      nama: context.currentRow?.nama,
                      harga_beli: context.currentRow?.harga_beli.toString(),
                      harga_jual: context.currentRow?.harga_jual.toString(),
                      stok: context.currentRow?.stok,
                  }
                : {
                      nama: '',
                      harga_beli: '',
                      harga_jual: '',
                      stok: '',
                  },
    });

    const onSubmit = (data: UserForm) => {
        router.post('/product/store', data, {
            onBefore: () => {
                context.setLoadingSubmit(true);
            },
            onSuccess: () => {
                context.setOpen(false);
                form.reset();

                toast({
                    title: 'Success',
                    description: 'User has been created successfully!',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(errors, null, 2)}</code>
                        </pre>
                    ),
                });
            },
            onFinish: () => {
                context.setLoadingSubmit(false);
            },
        });
    };

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                form.reset();
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {'Create new user here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <Form {...form}>
                        <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-0.5">
                            <FormField
                                control={form.control}
                                name="nama"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Nama Product</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" className="col-span-4" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="harga_beli"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Harga Beli</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan harga"
                                                autoComplete="off"
                                                value={formatCurrency(field.value)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, ''); // Ambil angka saja
                                                    field.onChange(rawValue); // Simpan angka asli ke state
                                                }}
                                                className="col-span-4"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="harga_jual"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Harga Jual</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan harga"
                                                autoComplete="off"
                                                value={formatCurrency(field.value)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, ''); // Ambil angka saja
                                                    field.onChange(rawValue); // Simpan angka asli ke state
                                                }}
                                                className="col-span-4"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stok"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Stok</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan stok"
                                                className="col-span-4"
                                                autoComplete="off"
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, ''); // Ambil angka saja
                                                    field.onChange(rawValue); // Simpan angka asli ke state
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gambar"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Gambar</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="col-span-4"
                                                type="file"
                                                placeholder="shadcn"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        field.onChange(file);
                                                        // setPreview(URL.createObjectURL(file)); // Tampilkan preview
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)} disabled={context.loadingSubmit}>
                        Cancel
                    </Button>
                    <Button type="submit" form="user-form" disabled={context.loadingSubmit}>
                        {context.loadingSubmit ? 'Loading...' : 'Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
