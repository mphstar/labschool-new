import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useProductStore from '@/stores/useProduct';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type KeuanganType = {
    id: number;
    keterangan: string;
    jenis: 'masuk' | 'keluar';
    tipe_pembayaran: 'tunai' | 'transfer';
    bukti_pembayaran: string | File;
    jumlah: number;
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
            return <span className="">{value === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</span>;
        },
    },
    {
        accessorKey: 'tipe_pembayaran',
        header: 'Tipe Pembayaran',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span className="">{value === 'tunai' ? 'Tunai' : 'Transfer'}</span>;
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
                        <Button variant="link" className="text-blue-500 hover:underline px-0">
                            Lihat Bukti
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Bukti Pembayaran</DialogTitle>
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
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span>{date.toLocaleDateString('id-ID')}</span>;
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
