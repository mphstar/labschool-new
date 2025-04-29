import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import useNilaiStore from '@/stores/useNilai';
import { Plus } from 'lucide-react';
import { columns, DetailNilaiType } from './columns';
import { DataTable } from './data-table';

type NilaiType = {
    id: number;
    nilai: number | undefined;
};

const DetailNilai = () => {
    const context = useNilaiStore();

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-7xl">
                <DialogHeader className="text-left">
                    <DialogTitle>{`Detail Nilai`}</DialogTitle>
                    <DialogDescription>
                        Berikut adalah informasi detail nilai siswa. Anda dapat melakukan input nilai siswa pada form di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                        <div></div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    context.setOpenDetailNilai(true);
                                }}
                                className="space-x-1"
                            >
                                <span>Create</span> <Plus size={18} />
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={
                            context.currentRow?.kelas_aktif?.nilai_mapel?.detail_nilai?.map((item: NilaiType) => ({
                                id: item.id,
                                nilai: item.nilai,
                            })) as unknown as DetailNilaiType[]
                        }
                    />
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DetailNilai;
