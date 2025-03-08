import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import useProductStore from '@/stores/useProduct';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Product as ProductType, columns } from './columns';
import { DataTable } from './data-table';
import FormDialog from './form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/product',
    },
];


export default function Product() {
    const store = useProductStore();
    const { products } = usePage().props as unknown as { products: ProductType[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />
            <FormDialog />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                        <p className="text-muted-foreground">Here&apos;s a list of your products for this month!</p>
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
                <DataTable columns={columns} data={products} />
            </div>
        </AppLayout>
    );
}
