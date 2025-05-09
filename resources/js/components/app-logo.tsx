import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { pengaturan } = usePage<SharedData>().props;
    const [isError, setIsError] = useState(false);

    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {pengaturan.logo && !isError ? (
                    <img onError={() => setIsError(true)} src={`/${pengaturan.logo}`} alt="Logo" className="h-8 w-8 rounded-md object-cover" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current dark:text-white text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{pengaturan.name ?? 'Laravel'}</span>
            </div>
        </>
    );
}
