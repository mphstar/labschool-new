import { create } from 'zustand';

interface Nilai {
    open: boolean;
    setOpen: (open: boolean) => void;
    dialog: 'detail_nilai' | 'qrcode';
    setDialog: (dialog: 'detail_nilai' | 'qrcode') => void;
    currentRow: any;
    setCurrentRow: (currentRow: any) => void;

    // dialog nilai
    dialogDetailNilai: 'create' | 'update';
    setDialogDetailNilai: (dialogDetailNilai: 'create' | 'update') => void;
    openDetailNilai: boolean;
    setOpenDetailNilai: (openDetailNilai: boolean) => void;
    currentRowDetailNilai: any;
    setCurrentRowDetailNilai: (currentRowDetailNilai: any) => void;
}

const useNilaiStore = create<Nilai>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    dialog: 'detail_nilai',
    setDialog: (dialog: 'detail_nilai' | 'qrcode') => set({ dialog }),
    currentRow: null,
    setCurrentRow: (currentRow) => set({ currentRow }),

    // dialog nilai
    dialogDetailNilai: 'create',
    setDialogDetailNilai: (dialogDetailNilai: 'create' | 'update') => set({ dialogDetailNilai }),
    openDetailNilai: false,
    setOpenDetailNilai: (openDetailNilai: boolean) => set({ openDetailNilai }),
    currentRowDetailNilai: null,
    setCurrentRowDetailNilai: (currentRowDetailNilai) => set({ currentRowDetailNilai }),
}));

export default useNilaiStore;
