import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Award, BookOpenText, CalendarClock, FileText, Landmark, Mailbox, TrendingDown, TrendingUp, UserPlus, Users, Wallet } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ChartCard, ChartLegend, ChartTooltip, EmptyChart, axisColors, compactFormat, numberFormat, rupiah, useIsDark } from './components';
import { type ReportData } from './types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/report',
    },
];

const COLORS = {
    emerald: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    amber: '#f59e0b',
    indigo: '#6366f1',
    orange: '#f97316',
    violet: '#8b5cf6',
    pink: '#ec4899',
};

const CHART_HEIGHT = 280;

interface ChartSection {
    title: string;
    description?: string;
    children: ReactNode;
}

function Section({ title, description, children }: ChartSection) {
    return (
        <section className="space-y-3">
            <div>
                <h3 className="text-base font-semibold">{title}</h3>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">{children}</div>
        </section>
    );
}

export default function Report({ reportData }: { reportData: ReportData }) {
    const isDark = useIsDark();
    const { grid, tick } = axisColors(isDark);

    const { keuangan, presensi, surat, siswa, ppdb, nilai } = reportData;

    const keuanganCumulative = useMemo(() => {
        let saldo = 0;
        return keuangan.bulanan.map((item) => {
            saldo += item.pemasukan - item.pengeluaran;
            return { ...item, saldo };
        });
    }, [keuangan.bulanan]);

    const keuanganEmpty = keuangan.totalPemasukan === 0 && keuangan.totalPengeluaran === 0;
    const presensiEmpty = presensi.total.total === 0;
    const suratEmpty = surat.total === 0;

    const presensiDonut = [
        { name: 'Hadir', value: presensi.total.hadir, color: COLORS.emerald },
        { name: 'Izin', value: presensi.total.izin, color: COLORS.blue },
        { name: 'Sakit', value: presensi.total.sakit, color: COLORS.amber },
        { name: 'Alfa', value: presensi.total.alfa, color: COLORS.red },
    ];

    const suratDonut = [
        { name: 'Surat Masuk', value: surat.totalMasuk, color: COLORS.indigo },
        { name: 'Surat Keluar', value: surat.totalKeluar, color: COLORS.orange },
    ];

    const siswaDonut = [
        { name: 'Laki-laki', value: siswa.perJenisKelamin.laki, color: COLORS.blue },
        { name: 'Perempuan', value: siswa.perJenisKelamin.perempuan, color: COLORS.pink },
    ];

    const pendaftarData = useMemo(() => {
        return siswa.pendaftarBulanan.map((item, index) => ({
            bulan: item.bulan,
            'Siswa Baru': item.jumlah,
            PPDB: ppdb.pendaftarBulanan[index]?.jumlah ?? 0,
        }));
    }, [siswa.pendaftarBulanan, ppdb.pendaftarBulanan]);

    const handleYearChange = (yearValue: string) => {
        router.get(route('report.index'), { year: yearValue }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="flex h-full w-full flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Laporan &amp; Rekapitulasi</h2>
                        <p className="text-muted-foreground text-sm">
                            Rekapitulasi keuangan, presensi, surat, siswa, PPDB, dan nilai tahun {reportData.meta.tahun}.
                        </p>
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <CalendarClock className="text-muted-foreground hidden h-5 w-5 shrink-0 sm:block" />
                        <Select value={String(reportData.selectedYear)} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-full sm:w-[140px]" aria-label="Pilih tahun laporan">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {reportData.years.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-start justify-between gap-3 p-5">
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-sm">Total Pemasukan</p>
                                <p className="text-foreground mt-1 truncate text-xl font-bold sm:text-2xl">{rupiah(keuangan.totalPemasukan)}</p>
                                <p className="text-muted-foreground text-xs">Tahun {reportData.meta.tahun}</p>
                            </div>
                            <span className="rounded-lg bg-green-500/10 p-2.5 text-green-600">
                                <TrendingUp className="h-5 w-5" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-start justify-between gap-3 p-5">
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-sm">Total Pengeluaran</p>
                                <p className="text-foreground mt-1 truncate text-xl font-bold sm:text-2xl">{rupiah(keuangan.totalPengeluaran)}</p>
                                <p className="text-muted-foreground text-xs">Tahun {reportData.meta.tahun}</p>
                            </div>
                            <span className="rounded-lg bg-red-500/10 p-2.5 text-red-600">
                                <TrendingDown className="h-5 w-5" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-start justify-between gap-3 p-5">
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-sm">Saldo</p>
                                <p
                                    className={
                                        keuangan.saldo >= 0
                                            ? 'mt-1 truncate text-xl font-bold text-green-600 sm:text-2xl'
                                            : 'mt-1 truncate text-xl font-bold text-red-600 sm:text-2xl'
                                    }
                                >
                                    {rupiah(keuangan.saldo)}
                                </p>
                                <p className="text-muted-foreground text-xs">Pemasukan - Pengeluaran</p>
                            </div>
                            <span className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600">
                                <Wallet className="h-5 w-5" />
                            </span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-start justify-between gap-3 p-5">
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-sm">Kehadiran</p>
                                <p className="text-foreground mt-1 text-xl font-bold sm:text-2xl">
                                    {presensi.kehadiranRate}%
                                    <span className="text-muted-foreground ml-1.5 text-sm font-normal">
                                        ({numberFormat(presensi.total.total)} catatan)
                                    </span>
                                </p>
                                <p className="text-muted-foreground text-xs">Rata-rata kehadiran siswa</p>
                            </div>
                            <span className="rounded-lg bg-violet-500/10 p-2.5 text-violet-600">
                                <CalendarClock className="h-5 w-5" />
                            </span>
                        </CardContent>
                    </Card>
                </div>

                <Section title="Keuangan" description="Arus kas masuk dan keluar sepanjang tahun">
                    <ChartCard
                        title="Arus Kas Bulanan"
                        description={`Perbandingan pemasukan, pengeluaran, dan saldo tahun ${reportData.meta.tahun}`}
                        icon={Landmark}
                        iconColor="text-blue-600"
                        className="lg:col-span-2"
                    >
                        {keuanganEmpty ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={keuanganCumulative} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                tickFormatter={(value: number) => compactFormat(value)}
                                                width={56}
                                            />
                                            <Tooltip content={<ChartTooltip formatter={rupiah} />} />
                                            <Bar dataKey="pemasukan" name="Pemasukan" fill={COLORS.emerald} radius={[4, 4, 0, 0]} maxBarSize={22} />
                                            <Bar dataKey="pengeluaran" name="Pengeluaran" fill={COLORS.red} radius={[4, 4, 0, 0]} maxBarSize={22} />
                                            <Line type="monotone" dataKey="saldo" name="Saldo" stroke={COLORS.blue} strokeWidth={2} dot={false} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[
                                        { label: 'Pemasukan', color: COLORS.emerald },
                                        { label: 'Pengeluaran', color: COLORS.red },
                                        { label: 'Saldo', color: COLORS.blue },
                                    ]}
                                />
                            </>
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Arus Kas per Kategori"
                        description={`Total nominal per kategori keuangan tahun ${reportData.meta.tahun}`}
                        icon={Wallet}
                        iconColor="text-emerald-600"
                    >
                        {keuangan.perKategori.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div style={{ height: Math.max(CHART_HEIGHT, keuangan.perKategori.length * 40 + 60) }} className="w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={keuangan.perKategori} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                                            <XAxis
                                                type="number"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                tickFormatter={(value: number) => compactFormat(value)}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={110}
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                interval={0}
                                            />
                                            <Tooltip content={<ChartTooltip formatter={rupiah} />} />
                                            <Bar dataKey="pemasukan" name="Pemasukan" fill={COLORS.emerald} radius={[0, 4, 4, 0]} maxBarSize={16} />
                                            <Bar dataKey="pengeluaran" name="Pengeluaran" fill={COLORS.red} radius={[0, 4, 4, 0]} maxBarSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[
                                        { label: 'Pemasukan', color: COLORS.emerald },
                                        { label: 'Pengeluaran', color: COLORS.red },
                                    ]}
                                />
                            </>
                        )}
                    </ChartCard>
                </Section>

                <Section title="Presensi" description="Status kehadiran siswa per bulan dan total keseluruhan">
                    <ChartCard
                        title="Presensi per Bulan"
                        description={`Distribusi kehadiran siswa tahun ${reportData.meta.tahun}`}
                        icon={CalendarClock}
                        iconColor="text-violet-600"
                        className="lg:col-span-2"
                    >
                        {presensiEmpty ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={presensi.bulanan} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                allowDecimals={false}
                                                width={40}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="hadir" name="Hadir" stackId="presensi" fill={COLORS.emerald} maxBarSize={26} />
                                            <Bar dataKey="izin" name="Izin" stackId="presensi" fill={COLORS.blue} maxBarSize={26} />
                                            <Bar dataKey="sakit" name="Sakit" stackId="presensi" fill={COLORS.amber} maxBarSize={26} />
                                            <Bar
                                                dataKey="alfa"
                                                name="Alfa"
                                                stackId="presensi"
                                                fill={COLORS.red}
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={26}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[
                                        { label: 'Hadir', color: COLORS.emerald, value: numberFormat(presensi.total.hadir) },
                                        { label: 'Izin', color: COLORS.blue, value: numberFormat(presensi.total.izin) },
                                        { label: 'Sakit', color: COLORS.amber, value: numberFormat(presensi.total.sakit) },
                                        { label: 'Alfa', color: COLORS.red, value: numberFormat(presensi.total.alfa) },
                                    ]}
                                />
                            </>
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Status Kehadiran"
                        description={`Rekap status tahun ${reportData.meta.tahun} (persentase kehadiran ${presensi.kehadiranRate}%)`}
                        icon={Users}
                        iconColor="text-emerald-600"
                    >
                        {presensiEmpty ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={presensiDonut}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={56}
                                                outerRadius={86}
                                                paddingAngle={2}
                                                cornerRadius={4}
                                                strokeWidth={0}
                                            >
                                                {presensiDonut.map((entry) => (
                                                    <Cell key={entry.name} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltip />} />
                                            <text
                                                x="50%"
                                                y="46%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-foreground text-2xl font-bold"
                                            >
                                                {presensi.kehadiranRate}%
                                            </text>
                                            <text
                                                x="50%"
                                                y="57%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-muted-foreground text-xs"
                                            >
                                                Kehadiran
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={presensiDonut.map((item) => ({
                                        label: item.name,
                                        color: item.color,
                                        value: numberFormat(item.value),
                                    }))}
                                    className="justify-center"
                                />
                            </>
                        )}
                    </ChartCard>
                </Section>

                <Section title="Surat" description="Dokumen surat masuk dan keluar">
                    <ChartCard
                        title="Surat per Bulan"
                        description={`Perbandingan surat masuk dan keluar tahun ${reportData.meta.tahun}`}
                        icon={Mailbox}
                        iconColor="text-indigo-600"
                        className="lg:col-span-2"
                    >
                        {suratEmpty ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={surat.bulanan} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                allowDecimals={false}
                                                width={40}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="masuk" name="Surat Masuk" fill={COLORS.indigo} radius={[4, 4, 0, 0]} maxBarSize={22} />
                                            <Bar dataKey="keluar" name="Surat Keluar" fill={COLORS.orange} radius={[4, 4, 0, 0]} maxBarSize={22} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[
                                        { label: 'Surat Masuk', color: COLORS.indigo, value: numberFormat(surat.totalMasuk) },
                                        { label: 'Surat Keluar', color: COLORS.orange, value: numberFormat(surat.totalKeluar) },
                                    ]}
                                />
                            </>
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Komposisi Surat"
                        description={`Total ${numberFormat(surat.total)} surat tahun ${reportData.meta.tahun}`}
                        icon={FileText}
                        iconColor="text-orange-600"
                    >
                        {suratEmpty ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={suratDonut}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={56}
                                                outerRadius={86}
                                                paddingAngle={2}
                                                cornerRadius={4}
                                                strokeWidth={0}
                                            >
                                                {suratDonut.map((entry) => (
                                                    <Cell key={entry.name} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={suratDonut.map((item) => ({
                                        label: item.name,
                                        color: item.color,
                                        value: numberFormat(item.value),
                                    }))}
                                    className="justify-center"
                                />
                            </>
                        )}
                    </ChartCard>
                </Section>

                <Section title="Siswa & PPDB" description="Komposisi siswa, sebaran per kelas, dan pendaftaran">
                    <ChartCard
                        title="Siswa per Kelas"
                        description={`Sebaran siswa aktif per kelas tahun ${reportData.meta.tahun}`}
                        icon={Users}
                        iconColor="text-blue-600"
                    >
                        {siswa.perKelas.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div style={{ height: Math.max(CHART_HEIGHT, siswa.perKelas.length * 40 + 60) }} className="w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={siswa.perKelas} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                                            <XAxis
                                                type="number"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                allowDecimals={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={90}
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                interval={0}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="jumlah" name="Siswa" fill={COLORS.blue} radius={[0, 4, 4, 0]} maxBarSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend items={[{ label: 'Siswa aktif per kelas', color: COLORS.blue }]} />
                            </>
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Komposisi Siswa"
                        description={`Total ${numberFormat(siswa.total)} siswa (aktif, putus, lulus)`}
                        icon={Users}
                        iconColor="text-pink-600"
                    >
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={siswaDonut}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={52}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        cornerRadius={4}
                                        strokeWidth={0}
                                    >
                                        {siswaDonut.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-bold">
                                        {numberFormat(siswa.total)}
                                    </text>
                                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                                        Total
                                    </text>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend
                            items={siswaDonut.map((item) => ({
                                label: item.name,
                                color: item.color,
                                value: numberFormat(item.value),
                            }))}
                            className="justify-center"
                        />
                        <div className="border-t pt-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {siswa.perStatus.map((status) => (
                                    <span key={status.name} className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                                        {status.name}: <span className="text-foreground font-bold">{status.jumlah}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Pendaftaran per Bulan"
                        description={`Pendaftar baru siswa dan PPDB tahun ${reportData.meta.tahun}`}
                        icon={UserPlus}
                        iconColor="text-emerald-600"
                    >
                        {siswa.pendaftarBulanan.every((item) => item.jumlah === 0) && ppdb.pendaftarBulanan.every((item) => item.jumlah === 0) ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[240px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={pendaftarData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradSiswa" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradPpdb" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                allowDecimals={false}
                                                width={40}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="Siswa Baru"
                                                stroke={COLORS.emerald}
                                                strokeWidth={2}
                                                fill="url(#gradSiswa)"
                                                dot={{ r: 3, fill: COLORS.emerald, strokeWidth: 0 }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="PPDB"
                                                stroke={COLORS.indigo}
                                                strokeWidth={2}
                                                fill="url(#gradPpdb)"
                                                dot={{ r: 3, fill: COLORS.indigo, strokeWidth: 0 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[
                                        {
                                            label: 'Siswa Baru',
                                            color: COLORS.emerald,
                                            value: numberFormat(siswa.pendaftarBulanan.reduce((acc, item) => acc + item.jumlah, 0)),
                                        },
                                        {
                                            label: 'PPDB',
                                            color: COLORS.indigo,
                                            value: numberFormat(ppdb.pendaftarBulanan.reduce((acc, item) => acc + item.jumlah, 0)),
                                        },
                                    ]}
                                />
                            </>
                        )}
                    </ChartCard>
                </Section>

                <Section title="Nilai" description="Rata-rata nilai siswa">
                    <ChartCard
                        title="Rata-rata Nilai per Bulan"
                        description={`Rata-rata nilai semester per bulan tahun ${reportData.meta.tahun}`}
                        icon={Award}
                        iconColor="text-violet-600"
                        className="lg:col-span-2"
                    >
                        {nilai.totalTerinput === 0 ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={nilai.bulanan} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                domain={[0, 100]}
                                                width={40}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="rata"
                                                name="Rata-rata"
                                                stroke={COLORS.violet}
                                                strokeWidth={2.5}
                                                connectNulls
                                                dot={{ r: 3, fill: COLORS.violet, strokeWidth: 0 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend
                                    items={[{ label: 'Rata-rata nilai', color: COLORS.violet, value: `${nilai.totalTerinput} nilai terinput` }]}
                                />
                            </>
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Rata-rata per Mata Pelajaran"
                        description={`Rata-rata nilai per mapel tahun ${reportData.meta.tahun}`}
                        icon={BookOpenText}
                        iconColor="text-indigo-600"
                    >
                        {nilai.mapelRata.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <>
                                <div style={{ height: Math.max(CHART_HEIGHT, nilai.mapelRata.length * 36 + 60) }} className="w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={nilai.mapelRata} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                                            <XAxis
                                                type="number"
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 12, fill: tick }}
                                                domain={[0, 100]}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={140}
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{ fontSize: 11, fill: tick }}
                                                interval={0}
                                            />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="rata" name="Rata-rata" fill={COLORS.indigo} radius={[0, 4, 4, 0]} maxBarSize={14} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ChartLegend items={[{ label: 'Rata-rata nilai (0-100)', color: COLORS.indigo }]} />
                            </>
                        )}
                    </ChartCard>
                </Section>

                <p className="text-muted-foreground text-center text-xs">
                    Laporan dihasilkan pada {reportData.meta.generatedAt}. Pilih tahun pada bagian atas untuk melihat data periode lainnya.
                </p>
            </div>
        </AppLayout>
    );
}
