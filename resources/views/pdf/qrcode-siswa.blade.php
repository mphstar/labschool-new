{{-- filepath: d:\Development\labschool\resources\views\pdf\qrcode-siswa.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <title>QR Siswa</title>
    <style>
        .qr-grid {
            display: table;
            width: 100%;
            border-spacing: 0;
            table-layout: fixed;
        }

        .qr-row {
            display: table-row;
        }

        .qr-item {
            display: table-cell;
            width: 19%;
            min-width: 100px;
            max-width: 140px;
            padding: 4px 2px;
            text-align: center;
            vertical-align: top;
            word-break: break-word;
        }

        .qr-item img {
            max-width: 90px;
            height: auto;
            display: block;
            margin: 0 auto 2px auto;
        }
    </style>
</head>

<body>
    <h2>Daftar QRCode Siswa</h2>
    <div style="margin-bottom: 10px; font-size:13px;">
        <strong>Tahun Akademik:</strong> {{ $tahun_akademik->name ?? '-' }}<br>
        <strong>Kelas:</strong> {{ $kelas->name ?? '-' }}
    </div>
    <div class="qr-grid">
        @foreach ($qrData->chunk(4) as $row)
            <div class="qr-row">
                @foreach ($row as $data)
                    <div class="qr-item">
                        <img src="{{ $data['qr'] }}" alt="QR {{ $data['nis'] }}">
                        <div
                            style="font-size:11px; font-weight: bold; line-height:1.1; margin-bottom:2px; white-space:normal; word-break:break-word;">
                            {{ $data['nama'] }}</div>
                        <div style="font-size:10px;">{{ $data['nis'] }}</div>
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>
</body>

</html>
