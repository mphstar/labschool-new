import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import usePpdbStore from '@/stores/usePpdb';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PpdbType, columns } from './columns';
import { DataTable } from './data-table';
import MoveToSiswaDialog from './move-to-siswa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPDB',
        href: '/ppdb/data',
    },
];

const view = () => {
    const { data } = usePage().props as unknown as { data: PpdbType[] };
    const store = usePpdbStore();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data PPDB" />
            {store.dialog == 'move_to_siswa' && <MoveToSiswaDialog />}
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">Data PPDB</h2>
                        <p className="text-muted-foreground">Kelola data pendaftaran peserta didik baru dan pindahkan ke data siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/ppdb">
                            <Button className="space-x-1" variant="outline">
                                <span>Form Pendaftaran</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
};

export default view;
