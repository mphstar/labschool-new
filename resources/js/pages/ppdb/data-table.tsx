import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHeader } from '@/components/ui/table'
import { HeadTablePagination } from '@/components/ui/head-table'
import { DataTablePagination } from '@/components/ui/pagination-control'
import { router } from '@inertiajs/react'
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Settings2Icon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Swal from 'sweetalert2'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})

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
            setRowSelection(rowSelection)
        },
        state: {
            columnFilters,
            sorting,
            rowSelection,
        },
    })

    const onDeleteMultiple = () => {
        const payloadRequest = table.getFilteredSelectedRowModel().rows.map((row) => {
            const { id } = row.original as { id: number }
            return { id }
        })

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data yang dipilih akan dihapus dan tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Menghapus...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                })

                router.post(
                    route('ppdb.delete-multiple'),
                    {
                        data: payloadRequest,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: 'Terhapus!',
                                text: 'Data PPDB yang dipilih berhasil dihapus.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                            })
                        },
                        onError: () => {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Terjadi kesalahan saat menghapus data.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                            })
                        },
                        onFinish: () => {
                            table.resetRowSelection()
                        },
                    },
                )
            }
        })
    }

    return (
        <div className="">
            <HeadTablePagination
                table={table}
                action={
                    <>
                        <Select onValueChange={(value) => table.getColumn('jenis_kelamin')?.setFilterValue(value == 'all' ? undefined : value)}>
                            <SelectTrigger className="whitespace-nowrap">
                                <SelectValue placeholder="Jenis Kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="L">Laki-laki</SelectItem>
                                <SelectItem value="P">Perempuan</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => table.getColumn('agama')?.setFilterValue(value == 'all' ? undefined : value)}>
                            <SelectTrigger className="whitespace-nowrap">
                                <SelectValue placeholder="Agama" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Kristen">Kristen</SelectItem>
                                <SelectItem value="Khatolik">Khatolik</SelectItem>
                                <SelectItem value="Hindu">Hindu</SelectItem>
                                <SelectItem value="Buddha">Buddha</SelectItem>
                                <SelectItem value="Khonghucu">Khonghucu</SelectItem>
                            </SelectContent>
                        </Select>
                        
                    </>
                }
            />

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="border-primary/10 bg-primary/10 my-4 flex items-center justify-between rounded-md border px-4 py-2">
                    <span className="text-primary text-sm font-semibold">
                        {`${table.getFilteredSelectedRowModel().rows.length} Data Dipilih`}
                    </span>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                            onDeleteMultiple()
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
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} className="px-4 py-3 text-left">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data PPDB.
                                </td>
                            </tr>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
