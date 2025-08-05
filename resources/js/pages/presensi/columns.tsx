import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useProductStore from '@/stores/useProduct';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { KelasType } from '../kelas/columns';
import { SiswaType } from '../siswa/columns';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RiwayatKelasType = {
    status: string;
    created_at: string;
    kelas: KelasType;
    siswa: SiswaType;
};

export type PresensiType = {
    id: number;
    riwayat_kelas_id: number;
    status: string;
    keterangan?: string;
    tanggal: string;
    riwayat_kelas: RiwayatKelasType;
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
                route('presensi.delete'),
                {
                    id,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Presensi has been deleted.',
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

export const columns: ColumnDef<PresensiType>[] = [
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
        accessorKey: 'riwayat_kelas.siswa.nama_lengkap',
        header: ({ column }) => {
            return (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ cell }) => {
            const status = cell.getValue<string>();
            return <Badge variant={status === 'hadir' ? 'default' : status === 'izin' ? 'default' : 'destructive'}>{status.toUpperCase()}</Badge>;
        },
    },
    {
        id: 'tahun_akademik',
        accessorKey: 'riwayat_kelas.siswa.tahun_akademik.name',
        filterFn: (row, id, value) => {
            return row.original.riwayat_kelas.siswa.tahun_akademik.id == value;
        },
        header: 'Tahun Akademik',
    },
    {
        id: 'kelas',
        accessorKey: 'riwayat_kelas.kelas.name',
        header: 'Kelas',
        cell: ({ cell }) => {
            const kelas = cell.getValue<string>();
            return <span className="">{kelas || '-'}</span>;
        },
    },
    {
        accessorKey: 'keterangan',
        header: 'Keterangan',
        cell: ({ cell }) => {
            const keterangan = cell.getValue<string>();
            return <span className="px-2">{keterangan || '-'}</span>;
        },
    },
    {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        filterFn: (row, id, value) => {
            if (!value || (!value.from && !value.to)) return true;
            // Ambil tanggal saja (tanpa jam) untuk perbandingan
            const rowDate = new Date(row.getValue(id));
            const rowDateOnly = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate(), 0, 0, 0, 0);
            let start = value.from ? (typeof value.from === 'string' ? new Date(value.from) : value.from) : null;
            let end = value.to ? (typeof value.to === 'string' ? new Date(value.to) : value.to) : null;
            // startOnly: 00:00:01, endOnly: 23:59:00
            const startOnly = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 1) : null;
            const endOnly = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 0) : null;
            if (startOnly && endOnly) {
                return rowDateOnly >= startOnly && rowDateOnly <= endOnly;
            }
            if (startOnly) {
                return rowDateOnly >= startOnly;
            }
            if (endOnly) {
                return rowDateOnly <= endOnly;
            }
            return true;
        },
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return (
                <span className="">
                    {date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                    {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
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
