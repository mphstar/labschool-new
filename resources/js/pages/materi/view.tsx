import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import useProductStore from '@/stores/useProduct';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { MataPelajaranType } from '../mata-pelajaran/columns';
import { MateriType, columns } from './columns';
import { DataTable } from './data-table';
import FormDialog from './form';

export default function Product() {
    const store = useProductStore();
    const { data, mapel } = usePage().props as unknown as { data: MateriType[]; mapel: MataPelajaranType };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mata Pelajaran',
            href: '/mata-pelajaran',
        },
        {
            title: mapel.name,
            href: `/mata-pelajaran/${mapel.id}/materi`,
        },
        {
            title: 'Materi',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas" />
            <FormDialog />
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Materi</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your materi for this month!</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                store.setDialog('create');
                                store.setOpen(true);
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
