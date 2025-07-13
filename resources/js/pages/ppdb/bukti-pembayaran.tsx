import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import usePpdbStore from '@/stores/usePpdb';

interface KelasType {
    id: number;
    name: string;
}

interface TahunAkademikType {
    id: number;
    name: string;
}

const BuktiPembayaranDialog = () => {
    const context = usePpdbStore();

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>Bukti Pembayaran</DialogTitle>
                    <DialogDescription>Menampilkan bukti pembayaran untuk {context.currentRow?.nama_lengkap}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    {context.currentRow?.bukti_pembayaran && (
                        <div className="mb-4 flex flex-col items-center">
                            <Label className="mb-2">Bukti Pembayaran</Label>
                            <img
                                src={
                                    context.currentRow.bukti_pembayaran.startsWith('http')
                                        ? context.currentRow.bukti_pembayaran
                                        : `/` + context.currentRow.bukti_pembayaran.replace(/^public\//, '')
                                }
                                alt="Bukti Pembayaran"
                                className="max-h-80 rounded border shadow"
                            />
                        </div>
                    )}
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

export default BuktiPembayaranDialog;
