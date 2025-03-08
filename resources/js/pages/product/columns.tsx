import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useProductStore from '@/stores/useProduct';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
    id: number;
    nama: string;
    harga_jual: number;
    harga_beli: number;
    stok: number;
};

export const columns: ColumnDef<Product>[] = [
    {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'harga_jual',
        header: 'Harga Jual',
        cell: ({ cell }) => {
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            });
            return <span>{formatter.format(cell.getValue<number>())}</span>;
        },
    },
    {
        accessorKey: 'harga_beli',
        header: 'Harga Beli',
        cell: ({ cell }) => {
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            });
            return <span>{formatter.format(cell.getValue<number>())}</span>;
        },
    },
    {
        accessorKey: 'stok',
        header: 'Stok',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const payment = row.original;
            const store = useProductStore();

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
                        <DropdownMenuItem onClick={() => {
                            store.setCurrentRow(payment);
                            store.setDialog('update');
                            store.setOpen(true);
                        }}>Edit Data</DropdownMenuItem>
                        <DropdownMenuItem>Delete Data</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
