import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Folder,
    LayoutGrid,
    LucideActivity,
    LucideAlignEndVertical,
    LucideBetweenVerticalStart,
    LucideBlocks,
    LucideLayoutTemplate,
    LucideUser,
    PackageSearch,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const masterNavItems: NavItem[] = [
    {
        title: 'Pengguna',
        url: '/user',
        icon: LucideUser,
    },
    {
        title: 'Kelas',
        url: '/kelas',
        icon: LucideBetweenVerticalStart,
    },
    {
        title: 'Mata Pelajaran',
        url: '/mata-pelajaran',
        icon: PackageSearch,
    },
    {
        title: 'Kategori Keuangan',
        url: '/category-keuangan',
        icon: LucideBlocks,
    },
    {
        title: 'Materi',
        url: '/materi',
        icon: Folder,
    },
    {
        title: 'Jadwal Pelajaran',
        url: '/jadwal-pelajaran',
        icon: LucideAlignEndVertical,
    },
];

const masterNavDataAkademik: NavItem[] = [
    {
        title: 'Tahun Akademik',
        url: '/tahun-akademik',
        icon: LucideLayoutTemplate,
    },
    {
        title: 'PPDB',
        url: '/data-ppdb',
        icon: LucideAlignEndVertical,
    },
    {
        title: 'Siswa',
        url: '/siswa',
        icon: Folder,
    },
];

const reportNavItems: NavItem[] = [
    {
        title: 'Keuangan',
        url: '/keuangan',
        icon: LucideBetweenVerticalStart,
    },
    {
        title: 'Surat',
        url: '/surat',
        icon: PackageSearch,
    },
    {
        title: 'Presensi',
        url: '/presensi',
        icon: LucideUser,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain title={'Master Data'} items={masterNavItems} />
                <NavMain title={'Data Akademik'} items={masterNavDataAkademik} />
                <NavMain title={'Pencatatan'} items={reportNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
