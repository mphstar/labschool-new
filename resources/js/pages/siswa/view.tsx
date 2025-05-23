import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import useSiswaStore from '@/stores/useSiswa';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { SiswaType, columns } from './columns';
import { DataTable } from './data-table';
import DialogKartu from './kartu';
import UbahKelas from './ubah-kelas';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Siswa',
        href: '/siswa',
    },
];

export default function Product() {
    const { data } = usePage().props as unknown as { data: SiswaType[] };
    const store = useSiswaStore();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Siswa" />
            {store.dialog == 'qrcode' && <DialogKartu />}
            {store.dialog == 'ubah_kelas' && <UbahKelas />}
            <div className="flex h-full w-full flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Siswa</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your siswa for this month!</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/siswa/create">
                            <Button className="space-x-1">
                                <span>Create</span> <Plus size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
