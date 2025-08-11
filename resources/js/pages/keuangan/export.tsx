import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import { FileBadge } from "lucide-react";
import { useRef, useState } from "react";
import { MdOutlineImportExport } from "react-icons/md";
import { CategoryKeuanganType } from "../category-keuangan/columns";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const ExportKeuangan = () => {

    const closeDialogButton = useRef<HTMLButtonElement>(null);
    const { categories } = usePage().props as unknown as { categories: CategoryKeuanganType[] };
    const [categoryId, setCategoryId] = useState<string>("");

    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"outline"}
                        onClick={() => { }}
                        className={cn("text-xs md:text-sm")}
                    >
                        <FileBadge className="mr-2 h-4 w-4" /> Export
                    </Button>
                </DialogTrigger>
                <DialogContent className={`max-h-[90%] flex flex-col`}>
                    <DialogHeader>
                        <DialogTitle>Export Keuangan</DialogTitle>
                        <DialogDescription>
                            Export keuangan data dalam format yang diinginkan. Pilih format yang sesuai dan klik tombol export.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="py-4 flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-x-4 gap-y-3">
                            <Label>Kategori</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Kategori Keuangan</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button ref={closeDialogButton} variant={"outline"}>
                                Tutup
                            </Button>
                        </DialogTrigger>
                        <Button onClick={() => {
                            if (categoryId == '') {
                                toast({
                                    title: "Error",
                                    description: "Silakan pilih kategori sebelum mengekspor.",
                                });
                            } else {

                                window.open(`/keuangan/export?category_id=${categoryId}`, '_blank');
                            }


                        }}>Export</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ExportKeuangan