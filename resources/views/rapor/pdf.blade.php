<!DOCTYPE html>
<html>

<head>
    <title>Rapor Siswa</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            margin: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }

        .header-top {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .logo-left,
        .logo-right {
            display: table-cell;
            width: 80px;
            vertical-align: middle;
        }

        .school-info {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }

        .school-info h3 {
            margin: 2px 0;
            font-size: 14px;
            font-weight: bold;
        }

        .school-info h2 {
            margin: 5px 0;
            font-size: 16px;
            font-weight: bold;
        }

        .school-info p {
            margin: 2px 0;
            font-size: 10px;
        }

        .report-title {
            padding: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }

        .student-info {
            margin-bottom: 20px;
        }

        .student-info table {
            border: none;
            width: 100%;
        }

        .student-info td {
            border: none;
            padding: 3px 8px;
            vertical-align: middle;
        }

        .student-info .label {
            width: 140px;
            font-weight: normal;
            text-align: left;
        }

        .student-info .colon {
            width: 15px;
            text-align: center;
        }

        .student-info .value {
            text-align: left;
            min-width: 120px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 15px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }

        .mata-pelajaran-col {
            text-align: left;
            padding-left: 8px;
        }

        .capaian-col {
            text-align: left;
            padding-left: 8px;
        }

        h2,
        h3,
        p {
            margin: 0;
            padding: 0;
        }

        .logo {
            width: 60px;
            height: 60px;
        }
    </style>
</head>

<body>
    <!-- Header dengan Kop Sekolah -->
    <div class="header">
        <div class="header-top">
            <div class="logo-left">
                <!-- Logo Sekolah Kiri - bisa diganti dengan gambar sebenarnya -->
                <div
                    style="width: 60px; height: 60px; border: 0px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">
                    <img style="width: 60px; height: 60px"
                        src="data:image/png;base64,{{ base64_encode(file_get_contents($pengaturan->logo ? $pengaturan->logo : public_path('images/default.png'))) }}" />

                </div>
            </div>

            <div class="school-info">
                <h3>UPTD SATUAN PENDIDIKAN</h3>
                <h2>SD LABSCHOOL FKIP UNIVERSITAS JEMBER</h2>
                <p>Jl. Mastrip, Tegalgede, Sumbersari, Jember - Kode Pos 68111</p>
                <p>Website: www.fkip.unej.ac.id - E-mail: labschool@unej.ac.id</p>
            </div>

            <div class="logo-right">
                <!-- Logo Sekolah Kanan - bisa diganti dengan gambar sebenarnya -->
                <div
                    style="width: 60px; height: 60px; border: 0px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">
                    <img style="width: 60px; height: 60px"
                        src="data:image/png;base64,{{ base64_encode(file_get_contents($pengaturan->logo ? $pengaturan->logo : public_path('images/default.png'))) }}" />

                </div>
            </div>
        </div>
    </div>

    <!-- Judul Laporan -->
    <div class="report-title">
        LAPORAN HASIL BELAJAR INTRAKURIKULER
    </div>

    <!-- Informasi Siswa -->
    <div class="student-info">
        <table>
            <tr>
                <td class="label">Nama Peserta Didik</td>
                <td class="colon">:</td>
                <td class="value"><strong>{{ $data['nama'] }}</strong></td>
                <td class="label">Tahun Pelajaran</td>
                <td class="colon">:</td>
                <td class="value">{{ $data['tahun_ajaran'] }}</td>
                {{-- <td class="label">Semester</td>
                <td class="colon">:</td>
                <td class="value">{{ $data['semester'] }}</td> --}}
            </tr>
            <tr>
                <td class="label">NIS/NISN</td>
                <td class="colon">:</td>
                <td class="value">{{ $data['nis'] }}/{{ $data['nisn'] }}</td>

            </tr>
            <tr>
                <td class="label">Kelas/Fase</td>
                <td class="colon">:</td>
                <td class="value">{{ $data['kelas'] }}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>

    <!-- Tabel Mata Pelajaran -->
    <table>
        <thead>
            <tr>
                <th style="width: 30px;">NO</th>
                <th style="width: 200px;">Mata Pelajaran</th>
                <th style="width: 80px;">Nilai Akhir</th>
                <th>Capaian Kompetensi</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data['mata_pelajaran'] as $mp)
                <tr>
                    <td rowspan="2">{{ $mp['no'] }}</td>
                    <td rowspan="2" class="mata-pelajaran-col">{{ $mp['nama'] }}</td>
                    <td rowspan="2">{{ $mp['nilai']['nr'] }}</td>
                    <td class="capaian-col">{{ $mp['capaian']['capaian_1'] }}</td>
                </tr>
                <tr>
                    <td class="capaian-col">{{ $mp['capaian']['capaian_2'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- <br><br>
    <h3>Ekstrakurikuler</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Ekstrakurikuler</th>
                <th>Predikat</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data['ekskul'] as $i => $e)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $e['nama'] }}</td>
                    <td>{{ $e['predikat'] }}</td>
                    <td>{{ $e['keterangan'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table> --}}

    <br><br>
    <h3>Prestasi</h3>
    <ol>
        @foreach ($data['prestasi'] as $p)
            <li>{{ $p }}</li>
        @endforeach
    </ol>

    <br><br>
    <h3>Ketidakhadiran</h3>
    <ul>
        <li>Sakit: {{ $data['ketidakhadiran']['sakit'] }} hari</li>
        <li>Ijin: {{ $data['ketidakhadiran']['ijin'] }} hari</li>
        <li>Tanpa Keterangan: {{ $data['ketidakhadiran']['tanpa_keterangan'] }} hari</li>
    </ul>

    <br><br>
    <table style="width: 100%; border: none;">
        <tr style="border: none;">
            <td style="border: none; width: 50%; text-align: left; vertical-align: top;">
                <div style="text-align: center;">
                    Orang Tua,
                    <br><br><br><br>
                    <div style="border-bottom: 1px solid #000; width: 150px; margin: 0 auto;"></div>
                    <br>
                    <strong>
                        {{ $data['nama_orang_tua']['nama_ayah'] ??
                            ($data['nama_orang_tua']['nama_ibu'] ?? ($data['nama_orang_tua']['nama_wali'] ?? 'Tidak Diketahui')) }}
                    </strong><br>

                </div>
            </td>
            <td style="border: none; width: 50%; text-align: right; vertical-align: top;">
                <div style="text-align: center;">
                    Kab. Jember, {{ $data['tanggal_cetak'] ?? '20 Desember 2024' }}<br>
                    Guru {{ $data['kelas'] ?? '2A' }}
                    <br><br><br><br>
                    <div style="border-bottom: 1px solid #000; width: 150px; margin: 0 auto;"></div>
                    <br>
                    <strong>{{ $data['wali_kelas']['nama'] ?? 'IFTITAH ADELIA, S.Pd.' }}</strong><br>
                    NIP : {{ $data['wali_kelas']['nip'] ?? '-' }}
                </div>
            </td>
        </tr>
        <tr style="border: none;">
            <td colspan="2" style="border: none; text-align: center; vertical-align: top; padding-top: 30px;">
                <div style="text-align: center;">
                    Mengetahui,<br>
                    Kepala Sekolah,
                    <br><br><br><br>
                    <div style="border-bottom: 1px solid #000; width: 150px; margin: 0 auto;"></div>
                    <br>
                    <strong>{{ $data['kepala_sekolah'] ?? 'ERVAN PRASETYO, S.Pd., MOS., MCE.' }}</strong><br>
                    NIP : {{ $data['nip_kepala_sekolah'] ?? '-' }}
                </div>
            </td>
        </tr>
    </table>

</body>

</html>
