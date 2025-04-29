import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import useNilaiStore from '@/stores/useNilai';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { MataPelajaranType } from '../mata-pelajaran/columns';
import { SiswaType, columns } from './columns';
import { DataTable } from './data-table';
import DetailNilai from './detail/detail-nilai';
import DialogCreateNilai from './detail/form';

export default function Product() {
    const { data, mapel } = usePage().props as unknown as { data: SiswaType[]; mapel: MataPelajaranType };
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
            href: `/mata-pelajaran/${mapel.name}/nilai`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Nilai" />
            <DetailNilai />
            <DialogCreateNilai />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Nilai</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your siswa for this month!</p>
                    </div>
                    <div className="flex gap-2">
                        {/* <Link href="/siswa/create">
                            <Button className="space-x-1">
                                <span>Create</span> <Plus size={18} />
                            </Button>
                        </Link> */}
                    </div>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
