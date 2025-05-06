import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useNilaiStore from '@/stores/useNilai';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { KelasType } from '../kelas/columns';
import { MataPelajaranType } from '../mata-pelajaran/columns';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type RiwayatKelasType = {
    kelas: KelasType;
    nilai_mapel: {
        id: number;
    };
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
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
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
        accessorKey: 'kelas_aktif.nilai_mapel.detail_nilai',
        header: 'Nilai',
        cell: ({ cell }) => {
            const values = cell.getValue<any[]>() || [];

            if (values.length === 0) {
                return <span className="text-gray-500">Tidak ada nilai</span>;
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {values.map((item, i) => (
                        <Badge key={i} variant="outline" className={cn('border-gray-300 text-gray-700 font-semibold', item.nilai < 50 && 'bg-red-800 text-white')}>
                            {item.nilai}
                        </Badge>
                    ))}
                </div>
            );
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
            const store = useNilaiStore();
            
            const { mapel } = usePage().props as unknown as { mapel: MataPelajaranType };

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
                        <Link href={route('nilai.detail.index', [mapel.id, payment.kelas_aktif?.nilai_mapel?.id ?? 0])}>
                            <DropdownMenuItem>Detail Nilai</DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
