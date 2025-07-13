import { create } from 'zustand';

interface Ppdb {
    open: boolean;
    setOpen: (open: boolean) => void;
    dialog: 'move_to_siswa' | 'bukti_pembayaran' | 'edit' | 'delete';
    setDialog: (dialog: 'move_to_siswa' | 'bukti_pembayaran' | 'edit' | 'delete') => void;
    currentRow: any;
    setCurrentRow: (currentRow: any) => void;
    loadingSubmit: boolean;
    setLoadingSubmit: (loadingSubmit: boolean) => void;
}

const usePpdbStore = create<Ppdb>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    dialog: 'move_to_siswa',
    setDialog: (dialog: 'move_to_siswa' | 'bukti_pembayaran' | 'edit' | 'delete') => set({ dialog }),
    currentRow: null,
    setCurrentRow: (currentRow) => set({ currentRow }),
    loadingSubmit: false,
    setLoadingSubmit: (loadingSubmit: boolean) => set({ loadingSubmit }),
}));

export default usePpdbStore;
