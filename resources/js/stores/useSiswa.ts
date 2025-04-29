import { create } from 'zustand';

interface Siswa {
    open: boolean;
    setOpen: (open: boolean) => void;
    dialog: 'ubah_kelas' | 'qrcode';
    setDialog: (dialog: 'ubah_kelas' | 'qrcode') => void;
    currentRow: any;
    setCurrentRow: (currentRow: any) => void;
    loadingSubmit: boolean;
    setLoadingSubmit: (loadingSubmit: boolean) => void;
}

const useSiswaStore = create<Siswa>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    dialog: 'ubah_kelas',
    setDialog: (dialog: 'ubah_kelas' | 'qrcode') => set({ dialog }),
    currentRow: null,
    setCurrentRow: (currentRow) => set({ currentRow }),
    loadingSubmit: false,
    setLoadingSubmit: (loadingSubmit: boolean) => set({ loadingSubmit }),
}));

export default useSiswaStore;
