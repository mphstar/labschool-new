import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Website settings',
        href: '/settings/website',
    },
];

interface WebsiteForm {
    id: number;
    name: string;
    logo: string | File;
    favicon: string | File;
}

export default function Website() {
    const { pengaturan } = usePage().props as unknown as { pengaturan: WebsiteForm };

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        id: pengaturan.id,
        name: pengaturan.name,
        logo: pengaturan.logo,
        favicon: pengaturan.favicon,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('website.update'), {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (e) => {
                console.error(e);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Website information" description="Update your configuration website" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Website</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="logo">Logo</Label>

                            <Input
                                id="logo"
                                type="file"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setData('logo', file);
                                    }
                                    // setData('logo', e.target.value);
                                }}
                                accept="image/*"
                                autoComplete="logo"
                                placeholder="Logo URL"
                            />

                            <InputError className="mt-2" message={errors.logo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="favicon">Favicon</Label>

                            <Input
                                id="favicon"
                                type="file"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setData('favicon', file);
                                    }
                                }}
                                autoComplete="favicon"
                                accept="image/*"
                                placeholder="Favicon URL"
                            />

                            <InputError className="mt-2" message={errors.favicon} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
