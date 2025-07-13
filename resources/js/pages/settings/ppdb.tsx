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
        title: 'PPDB Settings',
        href: '/settings/ppdb',
    },
];

export interface PpdbForm {
    id: number;
    title: string;
    description: string;
    no_rekening: string;
    atas_nama: string;
    biaya_pendaftaran: number;
}

export default function Ppdb() {
    const { pengaturan } = usePage().props as unknown as { pengaturan: PpdbForm };

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        id: pengaturan.id,
        title: pengaturan.title,
        description: pengaturan.description,
        no_rekening: pengaturan.no_rekening,
        atas_nama: pengaturan.atas_nama,
        biaya_pendaftaran: pengaturan.biaya_pendaftaran,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('ppdb.update'), {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (e) => {
                console.error(e);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PPDB Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="PPDB Information" description="Update your PPDB configuration" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Judul</Label>

                            <Input
                                id="title"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                autoComplete="title"
                                placeholder="Judul"
                            />

                            <InputError className="mt-2" message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>

                            <Input
                                id="description"
                                className="mt-1 block w-full"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                autoComplete="description"
                                placeholder="Deskripsi"
                            />

                            <InputError className="mt-2" message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="no_rekening">No Rekening</Label>

                            <Input
                                id="no_rekening"
                                className="mt-1 block w-full"
                                value={data.no_rekening}
                                onChange={(e) => setData('no_rekening', e.target.value)}
                                required
                                autoComplete="no_rekening"
                                placeholder="No Rekening"
                            />

                            <InputError className="mt-2" message={errors.no_rekening} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="atas_nama">Atas Nama</Label>

                            <Input
                                id="atas_nama"
                                className="mt-1 block w-full"
                                value={data.atas_nama}
                                onChange={(e) => setData('atas_nama', e.target.value)}
                                required
                                autoComplete="atas_nama"
                                placeholder="Atas Nama"
                            />

                            <InputError className="mt-2" message={errors.atas_nama} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="biaya_pendaftaran">Biaya Pendaftaran</Label>

                            <Input
                                id="biaya_pendaftaran"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.biaya_pendaftaran}
                                onChange={(e) => setData('biaya_pendaftaran', parseInt(e.target.value))}
                                required
                                autoComplete="biaya_pendaftaran"
                                placeholder="Biaya Pendaftaran"
                            />

                            <InputError className="mt-2" message={errors.biaya_pendaftaran} />
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
