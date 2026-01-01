import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData, type SidebarMenu as SidebarMenuType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Folder,
    LayoutGrid,
    LucideAlignEndVertical,
    LucideBetweenVerticalStart,
    LucideBlocks,
    LucideLayoutTemplate,
    LucideUser,
    PackageSearch,
    type LucideIcon,
} from 'lucide-react';
import AppLogo from './app-logo';
import { getIconComponent } from '@/pages/settings/sidebar-menu/icon-options';

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
    const { sidebarMenus } = usePage<SharedData>().props;

    // Convert dynamic menus to NavItem format
    const dynamicMenuItems: NavItem[] = (sidebarMenus || []).map((menu) => ({
        title: menu.title,
        url: menu.url,
        icon: menu.icon ? getIconComponent(menu.icon) : null,
        openInNewTab: true, // Always open in new tab
    }));

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
                {dynamicMenuItems.length > 0 && (
                    <NavMain title={'Menu Tambahan'} items={dynamicMenuItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
