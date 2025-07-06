import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { ArrowLeft, Camera, CameraOff, RotateCcw, Scan, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Presensi',
        href: '/presensi',
    },
    {
        title: 'Scanner QR Code',
        href: '/presensi/create',
    },
];

interface QRScanResult {
    text: string;
    timestamp: Date;
}

const QRCodeScanner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>('');
    const [scanCount, setScanCount] = useState(0); // Track scan attempts for better UX
    const codeReader = useRef<BrowserMultiFormatReader | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize camera permissions and get available cameras
    const initializeCamera = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasPermission(true);

            // Stop the initial stream
            stream.getTracks().forEach((track) => track.stop());

            // Get available cameras
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setCameras(videoDevices);

            if (videoDevices.length > 0) {
                setSelectedCameraId(videoDevices[0].deviceId);
            }
        } catch (err) {
            setHasPermission(false);
            setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
            console.error('Camera permission error:', err);

            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Akses Kamera Ditolak',
                text: 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser Anda.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Start scanning
    const startScanning = useCallback(async () => {
        if (!videoRef.current || !selectedCameraId) return;

        try {
            setIsLoading(true);
            setError(null);
            setScanResult(null);

            // Stop previous stream if exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            // Initialize ZXing code reader
            if (!codeReader.current) {
                codeReader.current = new BrowserMultiFormatReader();
            } // Start video stream
            const constraints = {
                video: {
                    deviceId: { exact: selectedCameraId },
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            videoRef.current.srcObject = stream;

            setIsScanning(true);
            setIsLoading(false);

            // Start QR code detection
            codeReader.current.decodeFromVideoDevice(selectedCameraId, videoRef.current, (result, error) => {
                if (result) {
                    const qrResult: QRScanResult = {
                        text: result.getText(),
                        timestamp: new Date(),
                    };
                    setScanResult(qrResult);
                    handleQRCodeDetected(qrResult);
                }

                // Only log errors that are not "NotFoundException" (which occurs when no QR code is detected)
                if (
                    error &&
                    !error.name.includes('NotFoundException') &&
                    !error.message.includes('No MultiFormat Readers were able to detect the code')
                ) {
                    console.error('QR scan error:', error);
                }
            });
        } catch (err) {
            setError('Tidak dapat memulai scanning. Periksa koneksi kamera.');
            console.error('Start scanning error:', err);
            setIsLoading(false);

            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Error Memulai Scanner',
                text: 'Tidak dapat memulai scanning. Periksa koneksi kamera.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    }, [selectedCameraId]);    // Stop scanning
    const stopScanning = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (codeReader.current) {
            codeReader.current.reset();
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsScanning(false);
    }, []);

    // Pause scanning without stopping video stream
    const pauseScanning = useCallback(() => {
        if (codeReader.current) {
            codeReader.current.reset();
        }
        setIsScanning(false);
    }, []);

    // Resume scanning with existing video stream
    const resumeScanning = useCallback(() => {
        if (!videoRef.current || !selectedCameraId || !streamRef.current) {
            // If no existing stream, start fresh
            startScanning();
            return;
        }

        try {
            // Initialize ZXing code reader if needed
            if (!codeReader.current) {
                codeReader.current = new BrowserMultiFormatReader();
            }

            setIsScanning(true);

            // Start QR code detection with existing video stream
            codeReader.current.decodeFromVideoDevice(selectedCameraId, videoRef.current, (result, error) => {
                if (result) {
                    const qrResult: QRScanResult = {
                        text: result.getText(),
                        timestamp: new Date(),
                    };
                    setScanResult(qrResult);
                    handleQRCodeDetected(qrResult);
                }

                // Only log errors that are not "NotFoundException"
                if (
                    error &&
                    !error.name.includes('NotFoundException') &&
                    !error.message.includes('No MultiFormat Readers were able to detect the code')
                ) {
                    console.error('QR scan error:', error);
                }
            });
        } catch (err) {
            console.error('Resume scanning error:', err);
            // Fall back to full restart
            startScanning();
        }
    }, [selectedCameraId, startScanning]);    // Handle QR code detection
    const handleQRCodeDetected = useCallback(
        (result: QRScanResult) => {
            // Pause scanning after successful detection (keep video stream alive)
            pauseScanning();

            // Increment scan count
            setScanCount((prev) => prev + 1); // Directly process attendance without confirmation dialog
            processAttendance(result.text);

            console.log('QR Code detected:', result);
        },
        [pauseScanning],
    );
    // Process attendance based on QR code
    const processAttendance = useCallback(
        async (qrData: string) => {
            try {
                // Show loading alert
                Swal.fire({
                    title: 'Memproses Presensi...',
                    text: 'Mohon tunggu sebentar',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                // Make API call to process attendance
                const response = await fetch(route('presensi.process-qr'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        qr_data: qrData,
                        status: 'hadir',
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    // Show success alert with auto close
                    Swal.fire({
                        icon: 'success',
                        title: 'Presensi Berhasil!',
                        html: `
            <div class="text-left">
              <p><strong>Nama:</strong> ${result.data.siswa.nama_lengkap}</p>
              <p><strong>NIS:</strong> ${result.data.siswa.nis}</p>
              <p><strong>Kelas:</strong> ${result.data.kelas.name}</p>
              <p><strong>Status:</strong> ${result.data.presensi.status}</p>
              <p><strong>Waktu:</strong> ${new Date(result.data.presensi.tanggal).toLocaleString('id-ID')}</p>
            </div>
          `,
                        timer: 2000, // Auto close after 2 seconds
                        timerProgressBar: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,                    }).then(() => {
                        // Reset scanner for next scan automatically (keep video stream)
                        setScanResult(null);
                        setError(null);

                        // Resume scanning with existing video stream
                        setTimeout(() => {
                            resumeScanning();
                        }, 500);
                    });
                } else {
                    // Handle error response
                    if (response.status === 409) {
                        // Already marked attendance, show brief message and continue
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sudah Absen',
                            text: result.message,
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,                        }).then(() => {
                            // Reset scanner and continue scanning (keep video stream)
                            setScanResult(null);
                            setError(null);
                            setTimeout(() => {
                                resumeScanning();
                            }, 500);
                        });
                    } else {
                        // Other errors
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Memproses Presensi',
                            text: result.message,
                            timer: 3000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,                        }).then(() => {
                            // Reset scanner for retry (keep video stream)
                            setScanResult(null);
                            setError(null);
                            setTimeout(() => {
                                resumeScanning();
                            }, 500);
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing attendance:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal memproses presensi. Silakan coba lagi.',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,                }).then(() => {
                    setScanResult(null);
                    setError(null);
                    setTimeout(() => {
                        resumeScanning();
                    }, 500);
                });
            }        },
        [resumeScanning, setScanResult, setError],
    );

    // Reset scanner
    const resetScanner = useCallback(() => {
        stopScanning();
        setScanResult(null);
        setError(null);
    }, [stopScanning]);

    // Switch camera
    const switchCamera = useCallback(
        (cameraId: string) => {
            setSelectedCameraId(cameraId);
            if (isScanning) {
                stopScanning();
                // Restart with new camera after a brief delay
                setTimeout(() => startScanning(), 100);
            }
        },
        [isScanning, stopScanning, startScanning],
    );    // Initialize on component mount
    useEffect(() => {
        initializeCamera();

        return () => {
            stopScanning();
        };
    }, [initializeCamera, stopScanning]);

    // Auto start scanning when camera is ready
    useEffect(() => {
        if (hasPermission && selectedCameraId && !isScanning && !isLoading) {
            const timer = setTimeout(() => {
                startScanning();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasPermission, selectedCameraId, isScanning, isLoading, startScanning]);

    // Handle permission denied
    if (hasPermission === false) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Scanner QR Code - Akses Kamera Ditolak" />
                <div className="flex min-h-[70vh] items-center justify-center p-4">
                    <Card className="w-full">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <CameraOff className="text-destructive h-6 w-6" />
                                Akses Kamera Ditolak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <p className="text-muted-foreground">
                                Aplikasi memerlukan akses kamera untuk memindai QR code. Silakan berikan izin akses kamera dan refresh halaman.
                            </p>
                            <div className="space-y-2">
                                <Button onClick={initializeCamera} className="w-full">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Coba Lagi
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/presensi">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali ke Presensi
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scanner QR Code Presensi" />
            <div className="p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Scan className="h-6 w-6" />
                                    Scanner QR Code Presensi
                                </CardTitle>
                                <Button variant="outline" asChild>
                                    <Link href="/presensi">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Camera Controls */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Camera Selection */}
                                {cameras.length > 1 && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Pilih Kamera:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {cameras.map((camera, index) => (
                                                <Button
                                                    key={camera.deviceId}
                                                    variant={selectedCameraId === camera.deviceId ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => switchCamera(camera.deviceId)}
                                                    disabled={isLoading}
                                                >
                                                    <Camera className="mr-2 h-4 w-4" />
                                                    Kamera {index + 1}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {!isScanning ? (
                                        <Button onClick={startScanning} disabled={isLoading || !selectedCameraId} className="flex-1">
                                            {isLoading ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Memuat...
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="mr-2 h-4 w-4" />
                                                    Mulai Scan
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button onClick={stopScanning} variant="destructive" className="flex-1">
                                            <X className="mr-2 h-4 w-4" />
                                            Berhenti
                                        </Button>
                                    )}

                                    <Button onClick={resetScanner} variant="outline" disabled={isLoading}>
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Camera Preview */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="space-y-4 text-center">
                                            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                                            <p className="text-muted-foreground">Memuat kamera...</p>
                                        </div>
                                    </div>
                                )}                                <video
                                    ref={videoRef}
                                    className={cn('h-full w-full object-cover', !streamRef.current && 'hidden')}
                                    autoPlay
                                    playsInline
                                    muted
                                />
                                {!streamRef.current && !isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <CameraOff className="text-muted-foreground mx-auto h-16 w-16" />
                                            <p className="text-muted-foreground mt-2">Kamera belum aktif</p>
                                        </div>
                                    </div>
                                )}{' '}
                                {/* Scanning overlay */}
                                {isScanning && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Main scan area */}
                                            <div className="border-primary relative h-48 w-48 rounded-lg border-2">
                                                {/* Corner indicators */}
                                                <div className="border-primary absolute -top-1 -left-1 h-8 w-8 border-t-4 border-l-4"></div>
                                                <div className="border-primary absolute -top-1 -right-1 h-8 w-8 border-t-4 border-r-4"></div>
                                                <div className="border-primary absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4"></div>
                                                <div className="border-primary absolute -right-1 -bottom-1 h-8 w-8 border-r-4 border-b-4"></div>

                                                {/* Scanning line animation */}
                                                <div className="absolute inset-0 overflow-hidden rounded-lg">
                                                    <div className="bg-primary absolute top-1/2 h-0.5 w-full -translate-y-1/2 transform animate-pulse"></div>
                                                </div>
                                            </div>

                                            {/* Instruction text */}
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform whitespace-nowrap">
                                                <p className="text-primary bg-background/80 rounded px-2 py-1 text-sm font-medium">
                                                    Arahkan QR code ke area ini
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>{' '}                            {/* Status */}
                            <div className="mt-4 flex items-center justify-center gap-4">
                                {isScanning ? (
                                    <Badge variant="default" className="animate-pulse">
                                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                        Scanning aktif
                                    </Badge>
                                ) : streamRef.current ? (
                                    <Badge variant="outline">
                                        <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                                        Kamera siap
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        <div className="mr-2 h-2 w-2 rounded-full bg-gray-500"></div>
                                        Kamera tidak aktif
                                    </Badge>
                                )}

                                {scanCount > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                        Scan: {scanCount}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Error Display */}
                    {error && (
                        <Card className="border-destructive">
                            <CardContent className="pt-6">
                                <div className="text-destructive flex items-center gap-2">
                                    <X className="h-5 w-5" />
                                    <span className="font-medium">Error:</span>
                                    <span>{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Result Display */}
                    {scanResult && (
                        <Card className="border-green-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <Scan className="h-5 w-5" />
                                    QR Code Terdeteksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium">Data: </span>
                                        <code className="bg-muted rounded px-2 py-1">{scanResult.text}</code>
                                    </div>
                                    <div>
                                        <span className="font-medium">Waktu: </span>
                                        <span className="text-muted-foreground">{scanResult.timestamp.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Instructions */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-muted-foreground space-y-2 text-sm">
                                <h4 className="text-foreground font-medium">Petunjuk Penggunaan:</h4>
                                <ul className="ml-4 list-disc space-y-1">
                                    <li>Pastikan QR code berada dalam frame kamera</li>
                                    <li>Jaga agar kamera dalam kondisi stabil</li>
                                    <li>Pastikan pencahayaan cukup untuk membaca QR code</li>{' '}
                                    <li>QR code akan terdeteksi secara otomatis dan langsung memproses presensi</li>
                                    <li>Dialog sukses akan muncul selama 2 detik lalu otomatis lanjut scan berikutnya</li>
                                    <li>Untuk siswa yang sudah absen akan muncul peringatan singkat</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default QRCodeScanner;
