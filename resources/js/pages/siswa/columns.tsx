import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useSiswaStore from '@/stores/useSiswa';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { KelasType } from '../kelas/columns';
import { TahunAkademikType } from '../tahun-akademik/columns';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type RiwayatKelasType = {
    kelas: KelasType;
};

export type SiswaType = {
    id: number;

    kelas_aktif: RiwayatKelasType;

    nis: string;
    nisn: string;
    nama_lengkap: string;
    nama_panggilan: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    agama: 'Islam' | 'Kristen' | 'Hindu' | 'Buddha' | 'Khonghucu' | 'Khatolik';
    alamat: string;
    no_telepon: string;
    pendidikan_sebelumnya: string;
    pilihan_seni?: string;

    // informasi orang tua
    nama_ayah?: string;
    nama_ibu?: string;
    pekerjaan_ayah?: string;
    pekerjaan_ibu?: string;
    jalan?: string;
    kelurahan?: string;
    kecamatan?: string;
    kabupaten?: string;
    provinsi?: string;

    // informasi wali
    nama_wali?: string;
    pekerjaan_wali?: string;
    alamat_wali?: string;
    no_telepon_wali?: string;

    tahun_akademik: TahunAkademikType;

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
                route('siswa.delete'),
                {
                    id,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your siswa has been deleted.',
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

export const columns: ColumnDef<SiswaType>[] = [
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
        accessorKey: 'nis',
        header: ({ column }) => {
            return (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    NIS
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },
    {
        accessorKey: 'nisn',
        header: ({ column }) => {
            return (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    NISN
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ cell }) => {
            return <span className="px-2">{cell.getValue<string>()}</span>;
        },
    },

    {
        accessorKey: 'nama_lengkap',
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
        accessorKey: 'nama_panggilan',
        header: 'Nama Panggilan',
    },
    {
        accessorKey: 'tempat_lahir',
        header: 'Tempat Lahir',
    },
    {
        id: 'kelas',
        accessorFn: (row) => row.kelas_aktif.kelas.name,
        filterFn: (row, id, value) => {
            return row.original.kelas_aktif.kelas.id == value;
        },
        header: 'Kelas',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <Badge className="bg-primary text-primary-foreground">{value}</Badge>;
        },
    },
    {
        id: 'tahun_akademik',
        filterFn: (row, id, value) => {
            return row.original.tahun_akademik.id == value;
        },
        accessorKey: 'tahun_akademik.name',
        header: 'Tahun Akademik',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <Badge className="bg-secondary text-secondary-foreground">{value}</Badge>;
        },
    },
    {
        accessorKey: 'tanggal_lahir',
        header: 'Tanggal Lahir',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span>{date.toLocaleDateString('id-ID')}</span>;
        },
    },
    {
        accessorKey: 'jenis_kelamin',
        header: 'Jenis Kelamin',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span>{value === 'L' ? 'Laki-laki' : 'Perempuan'}</span>;
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
        accessorKey: 'alamat',
        header: 'Alamat',
    },
    {
        accessorKey: 'no_telepon',
        header: 'No Telepon',
    },
    {
        accessorKey: 'pendidikan_sebelumnya',
        header: 'Pendidikan Sebelumnya',
    },
    {
        accessorKey: 'pilihan_seni',
        header: 'Pilihan Seni',
        cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return <span className="px-2">{value || '-'}</span>;
        },
    },

    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<string>());
            return <span>{date.toLocaleDateString('id-ID')}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const payment = row.original;
            const store = useSiswaStore();

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
                                store.setDialog('ubah_kelas');
                                store.setOpen(true);
                            }}
                        >
                            Ubah Kelas
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                store.setCurrentRow(payment);
                                store.setDialog('qrcode');
                                store.setOpen(true);
                            }}
                        >
                            Lihat QRCode
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Data Nilai</DropdownMenuItem> */}
                        <Link href={`/siswa/${payment.id}/edit`}>
                            <DropdownMenuItem>Edit Data</DropdownMenuItem>
                        </Link>
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
