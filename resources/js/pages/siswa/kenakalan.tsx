import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, ArrowUpDown, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { SiswaType } from './columns';
import { DataTable } from './prestasi-data-table';

type KenakalanType = {
    id: number;
    siswa_id: number;
    judul: string;
    deskripsi: string;
    tanggal: string;
    created_at: string;
};

export default function Page() {
    const { siswa, data } = usePage().props as unknown as {
        siswa: SiswaType;
        data: KenakalanType[];
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Siswa', href: '/siswa' },
        { title: siswa.nama_lengkap, href: `/siswa/${siswa.id}/edit` },
        { title: 'Kenakalan', href: `/siswa/${siswa.id}/kenakalan` },
    ];

    const { data: formData, setData, post, processing, errors, reset } = useForm({
        id: 0,
        siswa_id: siswa.id,
        judul: '',
        deskripsi: '',
        tanggal: '',
    });

    const openCreateDialog = () => {
        reset();
        setData('siswa_id', siswa.id);
        setEditMode(false);
        setDialogOpen(true);
    };

    const openEditDialog = (item: KenakalanType) => {
        setData({
            id: item.id,
            siswa_id: item.siswa_id,
            judul: item.judul,
            deskripsi: item.deskripsi,
            tanggal: item.tanggal.split('T')[0],
        });
        setEditMode(true);
        setDialogOpen(true);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const routeName = editMode ? 'siswa.kenakalan.update' : 'siswa.kenakalan.store';
        post(route(routeName), {
            onSuccess: () => {
                toast({ title: 'Success', description: editMode ? 'Kenakalan berhasil diupdate' : 'Kenakalan berhasil ditambahkan' });
                setDialogOpen(false);
                reset();
            },
            onError: (e) => toast({ title: 'Error', description: Object.values(e)[0] }),
        });
    };

    const onDelete = (id: number) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Data kenakalan akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('siswa.kenakalan.delete'), { id }, {
                    onSuccess: () => Swal.fire('Terhapus!', 'Data kenakalan telah dihapus.', 'success'),
                    onError: () => Swal.fire('Error!', 'Terjadi kesalahan.', 'error'),
                });
            }
        });
    };

    const columns: ColumnDef<KenakalanType>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'rowNumber',
            header: '#',
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: 'judul',
            header: ({ column }) => (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Judul
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: ({ cell }) => <span className="font-medium">{cell.getValue<string>()}</span>,
        },
        {
            accessorKey: 'deskripsi',
            header: 'Deskripsi',
            cell: ({ cell }) => <span className="max-w-xs truncate block">{cell.getValue<string>()}</span>,
        },
        {
            accessorKey: 'tanggal',
            header: ({ column }) => (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Tanggal
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: ({ cell }) => <span>{new Date(cell.getValue<string>()).toLocaleDateString('id-ID')}</span>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                            <Trash2 size={16} className="text-destructive" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kenakalan - ${siswa.nama_lengkap}`} />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Kenakalan</h2>
                        <p className="text-muted-foreground">
                            Siswa: <strong>{siswa.nama_lengkap}</strong> ({siswa.nis}) - Kelas: {siswa.kelas_aktif?.kelas?.name ?? '-'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/siswa">
                            <Button variant="outline" className="space-x-1">
                                <ArrowLeft size={18} /> <span>Kembali</span>
                            </Button>
                        </Link>
                        <Button onClick={openCreateDialog} className="space-x-1">
                            <Plus size={18} /> <span>Tambah Kenakalan</span>
                        </Button>
                    </div>
                </div>

                <DataTable columns={columns} data={data} deleteRoute="siswa.kenakalan.delete-multiple" emptyMessage="Belum ada data kenakalan" />
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editMode ? 'Edit Kenakalan' : 'Tambah Kenakalan'}</DialogTitle>
                        <DialogDescription>
                            {editMode ? 'Ubah data kenakalan siswa' : 'Tambahkan data kenakalan baru untuk siswa ini'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label className="required">Judul</Label>
                                <Input value={formData.judul} onChange={(e) => setData('judul', e.target.value)} placeholder="Masukkan judul kenakalan" />
                                <InputError message={errors.judul} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="required">Deskripsi</Label>
                                <Textarea value={formData.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} placeholder="Masukkan deskripsi kenakalan" rows={3} />
                                <InputError message={errors.deskripsi} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="required">Tanggal</Label>
                                <Input type="date" value={formData.tanggal} onChange={(e) => setData('tanggal', e.target.value)} />
                                <InputError message={errors.tanggal} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>{editMode ? 'Update' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
