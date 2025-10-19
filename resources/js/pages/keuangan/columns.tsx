import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useProductStore from '@/stores/useProduct';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { CategoryKeuanganType } from '../category-keuangan/columns';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type KeuanganType = {
    id: number;
    keterangan: string;
    jenis: 'masuk' | 'keluar';
    tipe_pembayaran: 'tunai' | 'transfer';
    bukti_pembayaran: string | File;
    category_keuangan_id: number;
    category_keuangan: CategoryKeuanganType;
    jumlah: number | null;
    tanggal: string;
    created_at: string;
};

const onDelete = (id: number) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleting...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            router.post(
                route('keuangan.delete'),
                {
                    id,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your keuangan has been deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Something went wrong.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    },
                    onFinish: () => {},
                },
            );
        }
    });
};

export const columns: ColumnDef<KeuanganType>[] = [
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
        accessorKey: 'tanggal',
        header: ({ column }) => (
            <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Tanggal
                <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
        ),
        // Ensure dates are sorted chronologically, not as plain strings
        sortingFn: (rowA, rowB, columnId) => {
            const a = rowA.getValue<string>(columnId);
            const b = rowB.getValue<string>(columnId);
            const aTime = a ? new Date(a).getTime() : 0;
            const bTime = b ? new Date(b).getTime() : 0;
            const aNum = isNaN(aTime) ? 0 : aTime;
            const bNum = isNaN(bTime) ? 0 : bTime;
            return aNum - bNum;
        },
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span>{date.toLocaleDateString('id-ID')}</span>;
        },
    },
    {
        accessorKey: 'keterangan',
        header: ({ column }) => {
            return (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Keterangan
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'jenis',
        header: 'Jenis',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return (
                <Badge className={`${value == 'masuk' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                    {value === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                </Badge>
            );
        },
    },
    {
        id: 'category',
        accessorKey: 'category_keuangan.name',
        header: 'Kategori',
        filterFn: (row, id, value) => {
            return row.original.category_keuangan.id.toString() === value;
        },
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span className="">{value}</span>;
        },
    },
    {
        accessorKey: 'tipe_pembayaran',
        header: 'Tipe Pembayaran',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return (
                <Badge className={`${value == 'tunai' ? 'bg-slate-200 text-slate-800' : 'bg-cyan-200 text-cyan-800'}`}>
                    {value === 'tunai' ? 'Tunai' : 'Transfer'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'jumlah',
        header: 'Jumlah',
        cell: ({ cell }) => {
            const value = cell.getValue<number>();
            return <span className="">Rp {value.toLocaleString('id-ID')}</span>;
        },
    },
    {
        accessorKey: 'bukti_pembayaran',
        header: 'Bukti Pembayaran',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="link" className="px-0 text-blue-500 hover:underline">
                            Lihat Bukti
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Bukti Pembayaran</DialogTitle>
                            <DialogDescription>
                                Berikut adalah bukti pembayaran yang telah diunggah. Anda dapat memeriksa detailnya di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex w-full justify-center">
                            <img src={value} alt="Bukti Pembayaran" className="max-h-[400px] w-auto rounded border" />
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const payment = row.original;
            const store = useProductStore();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem
                            onClick={() => {
                                store.setCurrentRow(payment);
                                store.setDialog('update');
                                store.setOpen(true);
                            }}
                        >
                            Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                onDelete(payment.id);
                            }}
                        >
                            Delete Data
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
