import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FilterIcon } from 'lucide-react';
import { useState } from 'react';

function formatDate(date: Date | undefined) {
    if (!date) {
        return '';
    }
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

interface DialogDateProps {
    onChange?: (range: { from?: Date; to?: Date }) => void;
}

const DialogDate = ({ onChange }: DialogDateProps) => {
    const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });
    const [month, setMonth] = useState<Date | undefined>(undefined);
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');

    return (
        <Dialog>
            <form className='w-full md:w-fit'
                onSubmit={(e) => {
                    e.preventDefault();
                    onChange && onChange(range);
                }}
            >
                <DialogTrigger asChild>
                    <Button className='w-full' variant="outline">
                        <FilterIcon className="h-4 w-4" /> Filter
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Date</DialogTitle>
                        <DialogDescription>Select a date range to filter results.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Input
                                id="date-from"
                                value={fromValue}
                                placeholder="Start date"
                                className="bg-background pr-2"
                                onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    setFromValue(e.target.value);
                                    if (isValidDate(date)) {
                                        setRange((prev) => ({ ...prev, from: date }));
                                        setMonth(date);
                                    }
                                }}
                            />
                            <span className="self-center">-</span>
                            <Input
                                id="date-to"
                                value={toValue}
                                placeholder="End date"
                                className="bg-background pr-2"
                                onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    setToValue(e.target.value);
                                    if (isValidDate(date)) {
                                        setRange((prev) => ({ ...prev, to: date }));
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-2 w-full">
                            <Calendar
                                mode="range"
                                selected={range}
                                captionLayout="dropdown"
                                className="w-full"
                                month={month}
                                onMonthChange={setMonth}
                                onSelect={(selected) => {
                                    // Set jam pada from ke 00:00:01 dan to ke 23:59:59.999 jika ada
                                    const fixedRange = {
                                        from: selected?.from
                                            ? new Date(selected.from.getFullYear(), selected.from.getMonth(), selected.from.getDate(), 0, 0, 1)
                                            : undefined,
                                        to: selected?.to
                                            ? new Date(selected.to.getFullYear(), selected.to.getMonth(), selected.to.getDate(), 23, 59, 59, 999)
                                            : undefined,
                                    };
                                    setRange(fixedRange);
                                    setFromValue(formatDate(fixedRange.from));
                                    setToValue(formatDate(fixedRange.to));
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setRange({ from: undefined, to: undefined });
                                setFromValue('');
                                setToValue('');
                                onChange && onChange({});
                            }}
                        >
                            Reset
                        </Button>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                onClick={() => {
                                    onChange && onChange(range);
                                }}
                                variant="outline"
                            >
                                Filter
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default DialogDate;
