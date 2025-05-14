import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Transition } from '@headlessui/react';
import { toast } from '@/hooks/use-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Capaian Kompetensi',
        href: '/settings/capaian-kompetensi',
    },
];

interface CapaianType {
    id: number;
    min: number;
    max: number;
    label: string;
}

interface CapaianForm {
    rentang: CapaianType[];
    [key: string]: any;
}

export default function CapaianKompetensi() {
    const { capaian } = usePage().props as unknown as { capaian: CapaianType[] };

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<CapaianForm>({
        rentang: capaian || [], // isi dari DB
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data);

        post(route('capaian-kompetensi.save'), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Capaian Kompetensi updated successfully',
                })
            },
            onError: (e) => {
                console.error(e);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Capaian Kompetensi" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Capaian Kompetensi" description="Update your capaian kompetensi" />

                    <form onSubmit={submit} className="space-y-6">
                        {data.rentang.map((item, index) => (
                            <div key={index} className="mb-2 grid w-full grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`min-${index}`}>Min</Label>
                                    <Input
                                        id={`min-${index}`}
                                        type="number"
                                        value={item.min}
                                        onChange={(e) => {
                                            const updated = [...data.rentang];
                                            updated[index].min = Number(e.target.value);
                                            setData('rentang', updated);
                                        }}
                                    />

                                    <InputError className="mt-2" message={errors[`rentang.${index}.min`] ?? ''} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`max-${index}`}>Max</Label>
                                    <Input
                                        id={`max-${index}`}
                                        type="number"
                                        value={item.max}
                                        onChange={(e) => {
                                            const updated = [...data.rentang];
                                            updated[index].max = Number(e.target.value);
                                            setData('rentang', updated);
                                        }}
                                    />
                                    <InputError className="mt-2" message={errors[`rentang.${index}.max`] ?? ''} />
                                </div>

                                <div className="col-span-2 flex flex-col gap-2">
                                    <Label htmlFor={`label-${index}`}>Label</Label>
                                    <Input
                                        id={`label-${index}`}
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => {
                                            const updated = [...data.rentang];
                                            updated[index].label = e.target.value;
                                            setData('rentang', updated);
                                        }}
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors[`rentang.${index}.label`] ?? ''}
                                    />
                                </div>
                            </div>
                        ))}

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
