import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import useProductStore from '@/stores/useProduct';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';
import FormDialog from './form';
import { SidebarMenuType } from './type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sidebar Menu settings',
        href: '/settings/sidebar-menu',
    },
];

export default function SidebarMenuPage() {
    const store = useProductStore();
    const { data } = usePage().props as unknown as { data: SidebarMenuType[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sidebar Menu Settings" />
            <FormDialog />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <HeadingSmall
                            title="Sidebar Menu"
                            description="Kelola menu tambahan yang tampil di sidebar"
                        />
                        <Button
                            onClick={() => {
                                store.setDialog('create');
                                store.setOpen(true);
                                store.setCurrentRow({});
                            }}
                            className="space-x-1"
                        >
                            <span>Tambah Menu</span> <Plus size={18} />
                        </Button>
                    </div>
                    <DataTable columns={columns} data={data} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
