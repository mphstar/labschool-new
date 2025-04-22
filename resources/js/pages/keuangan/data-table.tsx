import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { HeadTablePagination } from '@/components/ui/head-table';
import { DataTablePagination } from '@/components/ui/pagination-control';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: (rowSelection) => {
            setRowSelection(rowSelection);
        },
        state: {
            columnFilters,
            sorting,
            rowSelection,
        },
    });

    const onDelete = () => {
        const payloadRequest = table.getFilteredSelectedRowModel().rows.map((row) => {
            const { id } = row.original as { id: number };
            return { id };
        });

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
                    route('keuangan.delete-multiple'),
                    {
                        data: payloadRequest,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your keuangan has been deleted.',
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
                        onFinish: () => {
                            table.resetRowSelection();
                        },
                    },
                );
            }
        });
    };

    return (
        <div className="">
            <HeadTablePagination
                table={table}
                action={
                    <div></div>
                }
            />

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="my-4 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-2">
                    <span className="text-sm font-semibold text-green-700">{`Selected ${table.getFilteredSelectedRowModel().rows.length} Data`}</span>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                            onDelete();
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            )}

            <div className="my-4 flex w-full flex-col rounded-md border p-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
