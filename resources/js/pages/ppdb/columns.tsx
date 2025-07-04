import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import usePpdbStore from '@/stores/usePpdb';

import { router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, DeleteIcon, MoreHorizontal, Trash2, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

// Type definition untuk PPDB
export type PpdbType = {
    id: number;
    nama_lengkap: string;
    nama_panggilan: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    agama: 'Islam' | 'Kristen' | 'Khatolik' | 'Hindu' | 'Buddha' | 'Khonghucu';
    alamat: string;
    no_telepon?: string;
    pendidikan_sebelumnya?: string;
    pilihan_seni?: string;
    nama_ayah?: string;
    nama_ibu?: string;
    pekerjaan_ayah?: string;
    pekerjaan_ibu?: string;
    jalan?: string;
    kelurahan?: string;
    kecamatan?: string;
    kabupaten?: string;
    provinsi?: string;
    nama_wali?: string;
    pekerjaan_wali?: string;
    alamat_wali?: string;
    no_telepon_wali?: string;
    created_at: string;
};

const onDelete = (id: number) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data yang dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Menghapus...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            router.post(
                route('ppdb.delete'),
                { id },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Data PPDB berhasil dihapus.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Terjadi kesalahan saat menghapus data.',
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

export const columns: ColumnDef<PpdbType>[] = [
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
        accessorKey: 'nama_lengkap',
        header: ({ column }) => {
            return (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama Lengkap
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ cell }) => {
            return <span className="px-2 font-medium">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'nama_panggilan',
        header: 'Nama Panggilan',
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'tempat_lahir',
        header: 'Tempat Lahir',
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'tanggal_lahir',
        header: 'Tanggal Lahir',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span className="px-2">{date.toLocaleDateString('id-ID')}</span>;
        },
    },
    {
        accessorKey: 'jenis_kelamin',
        header: 'Jenis Kelamin',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <Badge variant={value === 'L' ? 'default' : 'secondary'}>{value === 'L' ? 'Laki-laki' : 'Perempuan'}</Badge>;
        },
    },
    {
        accessorKey: 'agama',
        header: 'Agama',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <Badge className="bg-primary text-primary-foreground">{value}</Badge>;
        },
    },
    {
        accessorKey: 'no_telepon',
        header: 'No Telepon',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span className="px-2">{value || '-'}</span>;
        },
    },
    {
        accessorKey: 'pendidikan_sebelumnya',
        header: 'Pendidikan Sebelumnya',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span className="px-2">{value || '-'}</span>;
        },
    },
    {
        accessorKey: 'pilihan_seni',
        header: 'Pilihan Seni',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <Badge variant="outline">{value && value !== '-' ? value : 'Tidak ada'}</Badge>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Daftar',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span className="px-2">{date.toLocaleDateString('id-ID')}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const ppdb = row.original
            
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const store = usePpdbStore()

            const onMoveToSiswa = (ppdb: PpdbType) => {
                store.setCurrentRow(ppdb)
                store.setDialog('move_to_siswa')
                store.setOpen(true)
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onMoveToSiswa(ppdb)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Pindah ke Siswa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(ppdb.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Data
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
