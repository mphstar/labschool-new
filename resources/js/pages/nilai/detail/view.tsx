import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { MataPelajaranType } from '@/pages/mata-pelajaran/columns';
import { SiswaType } from '@/pages/siswa/columns';
import useNilaiStore from '@/stores/useNilai';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns, DetailNilaiType } from './columns';
import { DataTable } from './data-table';
import DialogCreateNilai from './form';
export default function Product() {
    const { data, mapel, siswa } = usePage().props as unknown as { data: DetailNilaiType[]; mapel: MataPelajaranType; siswa: SiswaType };
    const store = useNilaiStore();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mata Pelajaran',
            href: '/mata-pelajaran',
            
        },
        {
            title: `${mapel.name}`,
            href: `#`,
        },
        {
            title: 'Nilai',
            href: `/mata-pelajaran/${mapel.id}/nilai`,
        },
        {
            title: siswa.nama_lengkap,
            href: `#`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Nilai" />
            <DialogCreateNilai />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Nilai</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your siswa for this month!</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                store.setDialog('create');
                                store.setOpen(true);
                                store.setCurrentRow({});
                            }}
                            className="space-x-1"
                        >
                            <span>Create</span> <Plus size={18} />
                        </Button>
                    </div>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
