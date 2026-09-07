export interface MonthlyKeuangan {
    bulan: string;
    pemasukan: number;
    pengeluaran: number;
}

export interface KeuanganKategori {
    name: string;
    pemasukan: number;
    pengeluaran: number;
    total: number;
}

export interface MonthlyPresensi {
    bulan: string;
    hadir: number;
    izin: number;
    sakit: number;
    alfa: number;
}

export interface MonthlySurat {
    bulan: string;
    masuk: number;
    keluar: number;
}

export interface MonthlyJumlah {
    bulan: string;
    jumlah: number;
}

export interface ReportData {
    years: number[];
    selectedYear: number;
    keuangan: {
        bulanan: MonthlyKeuangan[];
        perKategori: KeuanganKategori[];
        totalPemasukan: number;
        totalPengeluaran: number;
        saldo: number;
    };
    presensi: {
        bulanan: MonthlyPresensi[];
        total: { hadir: number; izin: number; sakit: number; alfa: number; total: number };
        kehadiranRate: number;
    };
    surat: {
        bulanan: MonthlySurat[];
        totalMasuk: number;
        totalKeluar: number;
        total: number;
    };
    siswa: {
        total: number;
        perJenisKelamin: { laki: number; perempuan: number };
        perStatus: Array<{ name: string; jumlah: number }>;
        perKelas: Array<{ name: string; jumlah: number }>;
        pendaftarBulanan: MonthlyJumlah[];
    };
    ppdb: {
        total: number;
        perJenisKelamin: { laki: number; perempuan: number };
        pendaftarBulanan: MonthlyJumlah[];
    };
    nilai: {
        bulanan: Array<{ bulan: string; rata: number | null }>;
        mapelRata: Array<{ name: string; rata: number }>;
        totalTerinput: number;
    };
    meta: {
        tahun: number;
        generatedAt: string;
    };
}
