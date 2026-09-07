import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

export function rupiah(value: number | string | null | undefined): string {
    return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`;
}

export function numberFormat(value: number | string | null | undefined): string {
    return Number(value ?? 0).toLocaleString('id-ID');
}

export function compactFormat(value: number): string {
    return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

const GRID_COLORS = {
    light: '#e2e8f0',
    dark: '#334155',
};

const TICK_COLORS = {
    light: '#64748b',
    dark: '#94a3b8',
};

export function useIsDark() {
    if (typeof document === 'undefined') {
        return false;
    }

    return document.documentElement.classList.contains('dark');
}

export function axisColors(isDark: boolean) {
    return {
        grid: isDark ? GRID_COLORS.dark : GRID_COLORS.light,
        tick: isDark ? TICK_COLORS.dark : TICK_COLORS.light,
    };
}

interface ChartTooltipItem {
    dataKey?: string | number;
    name?: string | number;
    value?: number | string | Array<number | string>;
    color?: string;
    fill?: string;
    stroke?: string;
    payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: ChartTooltipItem[];
    label?: string | number;
    formatter?: (value: number, dataKey: string) => string;
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const formatValue = (value: ChartTooltipItem['value'], dataKey: string) => {
        const numValue = Number(value);
        if (Number.isNaN(numValue)) {
            return '-';
        }

        return formatter ? formatter(numValue, dataKey) : numberFormat(numValue);
    };

    return (
        <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
            {label && <p className="mb-1.5 font-semibold">{label}</p>}
            <div className="space-y-1">
                {payload.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-6">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color ?? item.fill ?? item.stroke ?? '#64748b' }}
                            />
                            {String(item.name ?? item.dataKey ?? '')}
                        </span>
                        <span className="font-semibold tabular-nums">{formatValue(item.value, String(item.dataKey ?? ''))}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ChartLegendItem {
    label: string;
    color: string;
    value?: string | number;
}

export function ChartLegend({ items, className = '' }: { items: ChartLegendItem[]; className?: string }) {
    return (
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
            {items.map((item) => (
                <span key={item.label} className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                    {item.value !== undefined && <span className="text-foreground font-semibold">{item.value}</span>}
                </span>
            ))}
        </div>
    );
}

export function EmptyChart({ message = 'Belum ada data pada periode ini' }: { message?: string }) {
    return (
        <div className="text-muted-foreground flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center text-sm">
            <svg
                className="h-10 w-10 opacity-40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 3v18h18" />
                <path d="M7 16V9l3 3 4-5 3 2" />
            </svg>
            <p>{message}</p>
        </div>
    );
}

interface ChartCardProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    iconColor?: string;
    children: ReactNode;
    className?: string;
}

export function ChartCard({ title, description, icon: Icon, iconColor = 'text-muted-foreground', children, className = '' }: ChartCardProps) {
    return (
        <Card className={`flex flex-col ${className}`}>
            <CardHeader className="space-y-1 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <span className={`bg-muted rounded-md p-1.5 ${iconColor}`}>
                        <Icon className="h-4 w-4" />
                    </span>
                    {title}
                </CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">{children}</CardContent>
        </Card>
    );
}
