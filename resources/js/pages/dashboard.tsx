import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, BookOpen, BookText, GraduationCap, School, TrendingDown, TrendingUp, UserCheck, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardData {
    totalSiswaAktif: number;
    totalGuru: number;
    totalKelas: number;
    totalMapel: number;
    totalPendaftarPpdb: number;
    pemasukanBulanIni: number;
    pengeluaranBulanIni: number;
    presensiHariIni: number;
    siswaLaki: number;
    siswaPerempuan: number;
    materiBulanIni: number;
    nilaiBulanIni: number;
    rataRataNilai: number;
    tahunAkademikAktif: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    } | null;
    recentActivities: Array<{
        type: string;
        count: number;
        label: string;
    }>;
    financialSummary: {
        total_pemasukan_tahun: number;
        total_pengeluaran_tahun: number;
    };
    currentMonth: string;
    currentDate: string;
}

interface DashboardProps {
    dashboardData: DashboardData;
}

export default function Dashboard({ dashboardData }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa Aktif</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalSiswaAktif}</div>
                            <p className="text-muted-foreground text-xs">
                                {dashboardData.siswaLaki} Laki-laki, {dashboardData.siswaPerempuan} Perempuan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalGuru}</div>
                            <p className="text-muted-foreground text-xs">Guru aktif</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                            <School className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalKelas}</div>
                            <p className="text-muted-foreground text-xs">Kelas tersedia</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
                            <BookOpen className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalMapel}</div>
                            <p className="text-muted-foreground text-xs">Total mata pelajaran</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendaftar PPDB</CardTitle>
                            <UserPlus className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.totalPendaftarPpdb}</div>
                            <p className="text-muted-foreground text-xs">Calon siswa baru</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Rp {dashboardData.pemasukanBulanIni.toLocaleString('id-ID')}</div>
                            <p className="text-muted-foreground text-xs">Total pemasukan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">Rp {dashboardData.pengeluaranBulanIni.toLocaleString('id-ID')}</div>
                            <p className="text-muted-foreground text-xs">Total pengeluaran</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Presensi Hari Ini</CardTitle>
                            <UserCheck className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardData.presensiHariIni}</div>
                            <p className="text-muted-foreground text-xs">Siswa hadir hari ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Financial Summary */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Ringkasan Keuangan Tahun Ini
                            </CardTitle>
                            <CardDescription>Total pemasukan dan pengeluaran tahun {new Date().getFullYear()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                <span className="text-sm font-medium text-green-700">Total Pemasukan</span>
                                <span className="font-bold text-green-700">
                                    Rp {dashboardData.financialSummary.total_pemasukan_tahun.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                                <span className="text-sm font-medium text-red-700">Total Pengeluaran</span>
                                <span className="font-bold text-red-700">
                                    Rp {dashboardData.financialSummary.total_pengeluaran_tahun.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                <span className="text-sm font-medium text-blue-700">Saldo</span>
                                <span
                                    className={`font-bold ${
                                        dashboardData.financialSummary.total_pemasukan_tahun -
                                            dashboardData.financialSummary.total_pengeluaran_tahun >=
                                        0
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                    }`}
                                >
                                    Rp{' '}
                                    {(
                                        dashboardData.financialSummary.total_pemasukan_tahun - dashboardData.financialSummary.total_pengeluaran_tahun
                                    ).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>Aktivitas dalam 7 hari terakhir</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {dashboardData.recentActivities.map((activity, index) => (
                                <div key={index} className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2">
                                    <span className="text-muted-foreground text-sm">{activity.label}</span>
                                    <span className="font-medium">{activity.count}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
