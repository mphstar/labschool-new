import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, ArrowLeft, ArrowUpDown, Eye } from 'lucide-react';
import { DataTable } from './simple-data-table';

type KenakalanType = {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal: string;
};

type SiswaType = {
    id: number;
    nis: string;
    nama_lengkap: string;
    kelas_aktif?: {
        kelas?: {
            name: string;
        };
    };
    kenakalan: KenakalanType[];
};

type DataItem = {
    siswa: SiswaType;
    kenakalan: KenakalanType[];
};

type KelasType = {
    id: number;
    name: string;
    guru: User | null;
};

export default function Page() {
    const { kelas, data } = usePage().props as unknown as {
        kelas: KelasType;
        data: DataItem[];
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kelas', href: '/kelas' },
        { title: kelas.name, href: `/kelas` },
        { title: 'Siswa Bermasalah', href: `/kelas/${kelas.id}/kenakalan` },
    ];

    const columns: ColumnDef<DataItem>[] = [
        {
            id: 'rowNumber',
            header: '#',
            cell: ({ row }) => row.index + 1,
        },
        {
            id: 'nis',
            header: 'NIS',
            accessorFn: (row) => row.siswa.nis,
        },
        {
            id: 'nama_lengkap',
            header: ({ column }) => (
                <Button className="gap-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama Siswa
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            accessorFn: (row) => row.siswa.nama_lengkap,
            cell: ({ row }) => <span className="font-medium">{row.original.siswa.nama_lengkap}</span>,
        },
        {
            id: 'jumlah_kenakalan',
            header: 'Jumlah Pelanggaran',
            cell: ({ row }) => (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" />
                    {row.original.kenakalan.length} Catatan
                </Badge>
            ),
        },
        {
            id: 'kenakalan_terakhir',
            header: 'Pelanggaran Terakhir',
            cell: ({ row }) => {
                const lastKenakalan = row.original.kenakalan[0];
                return lastKenakalan ? (
                    <span className="max-w-xs truncate block">{lastKenakalan.judul}</span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <Link href={`/siswa/${item.siswa.id}/kenakalan`}>
                        <Button variant="outline" size="sm">
                            <Eye size={16} className="mr-1" /> Detail
                        </Button>
                    </Link>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Siswa Bermasalah - ${kelas.name}`} />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                            Siswa Bermasalah
                        </h2>
                        <p className="text-muted-foreground">
                            Kelas: <strong>{kelas.name}</strong> {kelas.guru && `- Wali Kelas: ${kelas.guru.name}`}
                        </p>
                    </div>
                    <Link href="/kelas">
                        <Button variant="outline" className="space-x-1">
                            <ArrowLeft size={18} /> <span>Kembali</span>
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={data} emptyMessage="Tidak ada siswa yang memiliki catatan kenakalan di kelas ini" />
            </div>
        </AppLayout>
    );
}
