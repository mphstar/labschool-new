import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useSiswaStore from '@/stores/useSiswa';

import html2canvas from 'html2canvas-pro';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

const DialogKartu = () => {
    const context = useSiswaStore();
    const qrCodeRef = useRef(null);

    const handleDownloadQRCode = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `qrcode-${context.currentRow?.nis}.png`;
                link.click();
            });
        }
    };

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                context.setOpen(state);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{`Kartu Siswa`}</DialogTitle>
                    <DialogDescription>Berikut adalah QR Code yang dapat digunakan untuk mengakses informasi siswa.</DialogDescription>
                </DialogHeader>
                <div className="flex w-full flex-col items-center justify-center">
                    <div className="" ref={qrCodeRef}>
                        <QRCodeSVG value={context.currentRow?.nis} size={256} />
                    </div>
                    <h3 className="mt-3 mb-4">{context.currentRow?.nis}</h3>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)}>
                        Tutup
                    </Button>
                    <Button type="button" variant="default" onClick={handleDownloadQRCode}>
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogKartu;
