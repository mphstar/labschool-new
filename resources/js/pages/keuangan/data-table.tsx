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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeadTablePagination } from '@/components/ui/head-table';
import { DataTablePagination } from '@/components/ui/pagination-control';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { CategoryKeuanganType } from '../category-keuangan/columns';

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

    const { categories } = usePage().props as unknown as { categories: CategoryKeuanganType[] };

    return (
        <div className="">
            <HeadTablePagination
                table={table}
                action={
                    <>
                        <Select onValueChange={(value) => table.getColumn('category')?.setFilterValue(value == 'all' ? undefined : value)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => table.getColumn('jenis')?.setFilterValue(value == 'all' ? undefined : value)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="masuk">Pemasukan</SelectItem>
                                <SelectItem value="keluar">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => table.getColumn('tipe_pembayaran')?.setFilterValue(value == 'all' ? undefined : value)}>
                            <SelectTrigger className="w-full text-nowrap">
                                <SelectValue placeholder="Tipe Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="tunai">Tunai</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                }
            />

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="border-primary/10 bg-primary/10 my-4 flex items-center justify-between rounded-md border px-4 py-2">
                    <span className="text-primary text-sm font-semibold">{`${table.getFilteredSelectedRowModel().rows.length} Data Dipilih`}</span>

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
                    <TableFooter className="bg-background">
                        <TableRow>
                            <TableCell colSpan={columns.length} className="border-none bg-transparent py-4 text-end">
                                {/* Summary Footer */}
                                {(() => {
                                    // Ambil data dari table.getRowModel().rows
                                    const rows = table.getRowModel().rows;
                                    let totalMasuk = 0;
                                    let totalKeluar = 0;
                                    rows.forEach((row) => {
                                        const data = row.original as any;
                                        if (data.jenis === 'masuk') {
                                            totalMasuk += data.jumlah || 0;
                                        } else if (data.jenis === 'keluar') {
                                            totalKeluar += data.jumlah || 0;
                                        }
                                    });
                                    const selisih = totalMasuk - totalKeluar;
                                    if (totalMasuk === 0 && totalKeluar === 0) return null;
                                    return (
                                        <div className="flex w-full justify-end">
                                            <div className="flex w-fit flex-row justify-end gap-2">
                                                <Badge>
                                                    <span className="font-semibold">Total Pemasukan:</span> Rp {totalMasuk.toLocaleString('id-ID')}
                                                </Badge>
                                                <Badge>
                                                    <span className="font-semibold">Total Pengeluaran:</span> Rp {totalKeluar.toLocaleString('id-ID')}
                                                </Badge>
                                                <Badge
                                                    className="flex w-fit justify-between rounded px-3 py-1 font-bold"
                                                    style={{
                                                        backgroundColor: selisih >= 0 ? '#bbdefb' : '#ffcdd2',
                                                        color: selisih >= 0 ? '#0d47a1' : '#b71c1c',
                                                    }}
                                                >
                                                    <span>Selisih:</span>
                                                    <span>Rp {selisih.toLocaleString('id-ID')}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
