import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import usePpdbStore from '@/stores/usePpdb'
import { useForm, usePage } from '@inertiajs/react'
import { useEffect } from 'react'

interface KelasType {
    id: number
    name: string
}

interface TahunAkademikType {
    id: number
    name: string
}

const MoveToSiswaDialog = () => {
    const context = usePpdbStore()

    const { data, setData, post, processing, errors, reset } = useForm({
        ppdb_id: context.currentRow?.id ?? 0,
        nis: '',
        nisn: '',
        kelas_id: '',
        tahun_akademik_id: '',
    })

    useEffect(() => {
        if (context.currentRow && context.dialog == 'move_to_siswa') {
            setData('ppdb_id', context.currentRow.id)
        }
    }, [context.currentRow])

    const { kelas, tahun_akademik } = usePage().props as unknown as { 
        kelas: KelasType[]
        tahun_akademik: TahunAkademikType[] 
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('ppdb.move-to-siswa'), {
            onSuccess: () => {
                reset()
                context.setOpen(false)

                toast({
                    title: 'Berhasil!',
                    description: 'Data berhasil dipindahkan ke siswa',
                })
            },
            onError: (errors) => {
                console.log(errors)
                
                toast({
                    title: 'Error',
                    description: 'Cek kembali data yang anda masukkan',
                })
            },
        })
    }

    return (
        <Dialog
            open={context.open}
            onOpenChange={(state) => {
                context.setOpen(state)
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>Pindah ke Data Siswa</DialogTitle>
                    <DialogDescription>
                        Menambahkan {context.currentRow?.nama_lengkap} ke data siswa dengan informasi tambahan
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                    <form id="move-form" onSubmit={onSubmit} className="space-y-4 p-0.5">
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right required">NIS</Label>
                            <Input
                                className="col-span-4"
                                value={data.nis}
                                onChange={(e) => setData('nis', e.target.value)}
                                placeholder="Masukkan NIS"
                            />
                            <InputError message={errors.nis} className="col-span-4 col-start-3 mt-2" />
                        </div>
                        
                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right required">NISN</Label>
                            <Input
                                className="col-span-4"
                                value={data.nisn}
                                onChange={(e) => setData('nisn', e.target.value)}
                                placeholder="Masukkan NISN"
                            />
                            <InputError message={errors.nisn} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right required">Kelas</Label>
                            <Select value={data.kelas_id} onValueChange={(value) => setData('kelas_id', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Kelas</SelectLabel>
                                        {kelas?.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.kelas_id} className="col-span-4 col-start-3 mt-2" />
                        </div>

                        <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                            <Label className="col-span-2 text-right required">Tahun Akademik</Label>
                            <Select value={data.tahun_akademik_id} onValueChange={(value) => setData('tahun_akademik_id', value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Pilih Tahun Akademik" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Pilih Tahun Akademik</SelectLabel>
                                        {tahun_akademik?.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tahun_akademik_id} className="col-span-4 col-start-3 mt-2" />
                        </div>
                    </form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => context.setOpen(false)}>
                        Batal
                    </Button>
                    <Button type="submit" form="move-form" disabled={processing}>
                        {processing ? 'Memproses...' : 'Pindahkan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MoveToSiswaDialog
