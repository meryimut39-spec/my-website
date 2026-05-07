// =====================================================
// SCRIPT.JS — Aplikasi Data Karyawan
// Semua logika aplikasi ada di file ini
// =====================================================


// ===================================================
// BAGIAN 1: DATA AWAL
// Array ini menyimpan semua data karyawan.
// Setiap karyawan disimpan sebagai "object" { key: value }
// ===================================================

let daftarKaryawan = [
  {
    nik: "EMP-001",
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "1990-05-12",
    email: "budi@perusahaan.com",
    telepon: "0812-3456-7890",
    alamat: "Jl. Merdeka No. 5, Jakarta Selatan",
    divisi: "Teknologi",
    jabatan: "Senior Developer",
    tanggalMasuk: "2018-03-01",
    status: "Aktif",
    gaji: 15000000,
    pendidikan: "S1"
  },
  {
    nik: "EMP-002",
    nama: "Siti Rahayu",
    jenisKelamin: "Perempuan",
    tanggalLahir: "1993-08-20",
    email: "siti@perusahaan.com",
    telepon: "0821-2345-6789",
    alamat: "Jl. Melati No. 12, Bekasi",
    divisi: "Keuangan",
    jabatan: "Finance Analyst",
    tanggalMasuk: "2020-01-15",
    status: "Aktif",
    gaji: 12000000,
    pendidikan: "S1"
  },
  {
    nik: "EMP-003",
    nama: "Ahmad Fauzi",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "1988-12-03",
    email: "ahmad@perusahaan.com",
    telepon: "0857-9876-5432",
    alamat: "Jl. Anggrek No. 8, Depok",
    divisi: "HRD",
    jabatan: "HR Manager",
    tanggalMasuk: "2016-07-01",
    status: "Aktif",
    gaji: 18000000,
    pendidikan: "S2"
  },
  {
    nik: "EMP-004",
    nama: "Dewi Lestari",
    jenisKelamin: "Perempuan",
    tanggalLahir: "1995-03-17",
    email: "dewi@perusahaan.com",
    telepon: "0815-1111-2222",
    alamat: "Jl. Kenanga No. 3, Tangerang",
    divisi: "Pemasaran",
    jabatan: "Marketing Staff",
    tanggalMasuk: "2022-06-10",
    status: "Cuti",
    gaji: 9000000,
    pendidikan: "S1"
  },
  {
    nik: "EMP-005",
    nama: "Rudi Hermawan",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "1985-09-25",
    email: "rudi@perusahaan.com",
    telepon: "0899-3344-5566",
    alamat: "Jl. Mawar No. 20, Bogor",
    divisi: "Operasional",
    jabatan: "Operations Manager",
    tanggalMasuk: "2014-04-15",
    status: "Aktif",
    gaji: 20000000,
    pendidikan: "S1"
  }
];

// Variabel untuk menyimpan index karyawan yang sedang diedit
// null = mode tambah baru, angka = mode edit
let indexEdit = null;

// Variabel untuk menyimpan index yang akan dihapus (dipakai modal konfirmasi)
let indexHapus = null;


// ===================================================
// BAGIAN 2: FUNGSI TAB
// Mengatur perpindahan antar tab
// ===================================================

/**
 * Fungsi untuk berpindah tab
 * @param {string} namaTab - nama tab yang ingin dibuka ('input', 'daftar', 'statistik')
 * @param {HTMLElement} elTab - elemen tombol tab yang diklik
 */
function bukaTab(namaTab, elTab) {
  // 1. Sembunyikan semua konten tab
  document.querySelectorAll('.tab-content').forEach(function(el) {
    el.classList.remove('aktif');
  });

  // 2. Hapus class 'active' dari semua tombol tab
  document.querySelectorAll('.tab').forEach(function(el) {
    el.classList.remove('active');
  });

  // 3. Tampilkan konten tab yang dipilih
  document.getElementById('tab-' + namaTab).classList.add('aktif');

  // 4. Beri tanda 'active' pada tombol yang diklik
  elTab.classList.add('active');

  // 5. Kalau tab daftar dibuka, render ulang tabel
  if (namaTab === 'daftar') {
    renderTabel(daftarKaryawan);
  }

  // 6. Kalau tab statistik dibuka, render statistik
  if (namaTab === 'statistik') {
    renderStatistik();
  }
}


// ===================================================
// BAGIAN 3: FUNGSI FORM — SIMPAN & RESET
// ===================================================

/**
 * Fungsi yang dipanggil saat tombol Simpan ditekan
 * Parameter 'event' digunakan untuk mencegah halaman reload
 */
function simpanData(event) {
  event.preventDefault(); // Cegah form submit default (reload halaman)

  // --- Ambil nilai dari setiap input ---
  var nik          = document.getElementById('nik').value.trim();
  var nama         = document.getElementById('nama').value.trim();
  var jenisKelamin = document.getElementById('jenis-kelamin').value;
  var tanggalLahir = document.getElementById('tanggal-lahir').value;
  var email        = document.getElementById('email').value.trim();
  var telepon      = document.getElementById('telepon').value.trim();
  var alamat       = document.getElementById('alamat').value.trim();
  var divisi       = document.getElementById('divisi').value;
  var jabatan      = document.getElementById('jabatan').value.trim();
  var tanggalMasuk = document.getElementById('tanggal-masuk').value;
  var status       = document.getElementById('status').value;
  var gaji         = parseInt(document.getElementById('gaji').value) || 0;
  var pendidikan   = document.getElementById('pendidikan').value;

  // --- Validasi: pastikan field wajib diisi ---
  if (!nik || !nama || !divisi || !jabatan) {
    tampilkanToast('⚠️ Lengkapi semua field yang wajib diisi (*)', 'error');
    return; // Hentikan fungsi
  }

  // --- Validasi: NIK tidak boleh duplikat (kecuali saat edit) ---
  var nikSudahAda = daftarKaryawan.some(function(k, i) {
    return k.nik === nik && i !== indexEdit;
  });

  if (nikSudahAda) {
    tampilkanToast('⚠️ NIK "' + nik + '" sudah terdaftar!', 'error');
    return;
  }

  // --- Buat object data karyawan baru ---
  var dataKaryawan = {
    nik: nik,
    nama: nama,
    jenisKelamin: jenisKelamin,
    tanggalLahir: tanggalLahir,
    email: email,
    telepon: telepon,
    alamat: alamat,
    divisi: divisi,
    jabatan: jabatan,
    tanggalMasuk: tanggalMasuk,
    status: status,
    gaji: gaji,
    pendidikan: pendidikan
  };

  // --- Simpan data: tambah baru ATAU update yang sudah ada ---
  if (indexEdit === null) {
    // Mode tambah: push data baru ke array
    daftarKaryawan.push(dataKaryawan);
    tampilkanToast('✅ Karyawan "' + nama + '" berhasil ditambahkan!', 'sukses');
  } else {
    // Mode edit: ganti data di posisi indexEdit
    daftarKaryawan[indexEdit] = dataKaryawan;
    tampilkanToast('✅ Data "' + nama + '" berhasil diperbarui!', 'sukses');
    indexEdit = null; // Reset mode edit
  }

  // --- Reset form & kembali ke tampilan awal form ---
  resetForm();

  // --- Pindah ke tab daftar agar user bisa melihat hasilnya ---
  setTimeout(function() {
    bukaTab('daftar', document.querySelectorAll('.tab')[1]);
  }, 600);
}


/**
 * Reset semua input form ke kondisi kosong
 */
function resetForm() {
  document.getElementById('form-karyawan').reset();
  indexEdit = null;

  // Kembalikan judul dan tombol ke mode tambah
  document.getElementById('judul-form').textContent = '➕ Tambah Karyawan Baru';
  document.getElementById('btn-simpan').textContent = '💾 Simpan Data';
}


// ===================================================
// BAGIAN 4: FUNGSI TABEL — TAMPILKAN, FILTER, EDIT, HAPUS
// ===================================================

/**
 * Render (tampilkan) data ke tabel HTML
 * @param {Array} data - array karyawan yang akan ditampilkan
 */
function renderTabel(data) {
  var tbody = document.getElementById('tbody-karyawan');
  var divKosong = document.getElementById('data-kosong');
  var infoJumlah = document.getElementById('info-jumlah');

  // Kalau tidak ada data
  if (data.length === 0) {
    tbody.innerHTML = '';
    divKosong.style.display = 'block';
    infoJumlah.textContent = '';
    return;
  }

  divKosong.style.display = 'none';
  infoJumlah.textContent = 'Menampilkan ' + data.length + ' dari ' + daftarKaryawan.length + ' karyawan';

  // Buat baris tabel dari setiap data karyawan
  var html = '';

  data.forEach(function(k, i) {
    // Cari index asli di daftarKaryawan (penting untuk edit/hapus saat filter aktif)
    var indexAsli = daftarKaryawan.indexOf(k);

    // Tentukan class badge status
    var classBadge = 'badge ';
    if (k.status === 'Aktif')     classBadge += 'badge-aktif';
    else if (k.status === 'Cuti') classBadge += 'badge-cuti';
    else                          classBadge += 'badge-nonaktif';

    // Format gaji dengan titik ribuan
    var gajiFormatted = 'Rp ' + k.gaji.toLocaleString('id-ID');

    html += '<tr>';
    html += '  <td>' + (i + 1) + '</td>';
    html += '  <td><strong>' + k.nik + '</strong></td>';
    html += '  <td>' + k.nama + '</td>';
    html += '  <td><span class="badge-divisi divisi-' + k.divisi + '">' + k.divisi + '</span></td>';
    html += '  <td>' + k.jabatan + '</td>';
    html += '  <td><span class="' + classBadge + '">' + k.status + '</span></td>';
    html += '  <td>' + gajiFormatted + '</td>';
    html += '  <td>';
    html += '    <button class="btn btn-edit" onclick="editKaryawan(' + indexAsli + ')">✏️ Edit</button> ';
    html += '    <button class="btn btn-hapus" onclick="bukaModalHapus(' + indexAsli + ')">🗑️ Hapus</button>';
    html += '  </td>';
    html += '</tr>';
  });

  tbody.innerHTML = html;
}


/**
 * Filter data berdasarkan pencarian, divisi, dan status
 * Dipanggil setiap kali input pencarian atau select filter berubah
 */
function filterData() {
  var kataCari    = document.getElementById('input-cari').value.toLowerCase();
  var filterDivisi = document.getElementById('filter-divisi').value;
  var filterStatus = document.getElementById('filter-status').value;

  // Saring data dengan Array.filter()
  var hasilFilter = daftarKaryawan.filter(function(k) {
    var cocokteks   = k.nama.toLowerCase().includes(kataCari) || k.nik.toLowerCase().includes(kataCari);
    var cocokDivisi = filterDivisi === '' || k.divisi === filterDivisi;
    var cocokStatus = filterStatus === '' || k.status === filterStatus;

    // Karyawan ditampilkan hanya kalau SEMUA kondisi terpenuhi
    return cocokteks && cocokDivisi && cocokStatus;
  });

  renderTabel(hasilFilter);
}


/**
 * Isi form dengan data karyawan yang akan diedit
 * @param {number} index - posisi karyawan di array daftarKaryawan
 */
function editKaryawan(index) {
  var k = daftarKaryawan[index];

  // Isi setiap input dengan data karyawan yang dipilih
  document.getElementById('nik').value           = k.nik;
  document.getElementById('nama').value          = k.nama;
  document.getElementById('jenis-kelamin').value = k.jenisKelamin;
  document.getElementById('tanggal-lahir').value = k.tanggalLahir;
  document.getElementById('email').value         = k.email;
  document.getElementById('telepon').value       = k.telepon;
  document.getElementById('alamat').value        = k.alamat;
  document.getElementById('divisi').value        = k.divisi;
  document.getElementById('jabatan').value       = k.jabatan;
  document.getElementById('tanggal-masuk').value = k.tanggalMasuk;
  document.getElementById('status').value        = k.status;
  document.getElementById('gaji').value          = k.gaji;
  document.getElementById('pendidikan').value    = k.pendidikan;

  // Simpan index agar simpanData() tahu ini mode edit
  indexEdit = index;

  // Ubah judul dan teks tombol
  document.getElementById('judul-form').textContent = '✏️ Edit Data Karyawan';
  document.getElementById('btn-simpan').textContent = '💾 Perbarui Data';

  // Pindah ke tab input
  bukaTab('input', document.querySelectorAll('.tab')[0]);

  // Gulir ke atas halaman
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/**
 * Buka modal konfirmasi sebelum hapus
 */
function bukaModalHapus(index) {
  indexHapus = index;
  var nama = daftarKaryawan[index].nama;
  document.getElementById('modal-pesan').textContent =
    'Yakin ingin menghapus data karyawan "' + nama + '"? Tindakan ini tidak bisa dibatalkan.';
  document.getElementById('modal-hapus').style.display = 'flex';
}

/**
 * Tutup modal tanpa menghapus
 */
function tutupModal() {
  document.getElementById('modal-hapus').style.display = 'none';
  indexHapus = null;
}

/**
 * Eksekusi hapus data setelah dikonfirmasi
 */
function konfirmasiHapus() {
  if (indexHapus === null) return;

  var namaHapus = daftarKaryawan[indexHapus].nama;

  // splice(index, 1) = hapus 1 elemen pada posisi index
  daftarKaryawan.splice(indexHapus, 1);

  tutupModal();
  filterData(); // Render ulang tabel
  tampilkanToast('🗑️ Data "' + namaHapus + '" berhasil dihapus.', 'sukses');
}


// ===================================================
// BAGIAN 5: FUNGSI STATISTIK
// ===================================================

/**
 * Render halaman statistik
 */
function renderStatistik() {
  var total    = daftarKaryawan.length;
  var aktif    = daftarKaryawan.filter(function(k) { return k.status === 'Aktif'; }).length;
  var cuti     = daftarKaryawan.filter(function(k) { return k.status === 'Cuti'; }).length;
  var nonaktif = daftarKaryawan.filter(function(k) { return k.status === 'Non-aktif'; }).length;

  var totalGaji = daftarKaryawan.reduce(function(sum, k) { return sum + k.gaji; }, 0);

  // --- Kartu Ringkasan ---
  document.getElementById('statistik-grid').innerHTML =
    buatKartuStat('Total Karyawan', total, '') +
    buatKartuStat('Karyawan Aktif', aktif, 'hijau') +
    buatKartuStat('Sedang Cuti', cuti, 'kuning') +
    buatKartuStat('Total Gaji/Bulan', 'Rp ' + totalGaji.toLocaleString('id-ID'), 'merah');

  // --- Grafik per Divisi ---
  var hitungDivisi = {};
  daftarKaryawan.forEach(function(k) {
    hitungDivisi[k.divisi] = (hitungDivisi[k.divisi] || 0) + 1;
  });

  var maxDivisi = Math.max.apply(null, Object.values(hitungDivisi));
  var warnaDivisi = {
    Teknologi: '#3498db', Keuangan: '#27ae60', HRD: '#9b59b6',
    Pemasaran: '#e67e22', Operasional: '#f1c40f', Legal: '#95a5a6'
  };

  var htmlDivisi = '';
  Object.entries(hitungDivisi).forEach(function(entry) {
    var divisi = entry[0];
    var jumlah = entry[1];
    var persen = Math.round(jumlah / maxDivisi * 100);
    var warna = warnaDivisi[divisi] || '#888';
    htmlDivisi += '<div class="bar-row">';
    htmlDivisi += '  <div class="bar-label">' + divisi + '</div>';
    htmlDivisi += '  <div class="bar-track">';
    htmlDivisi += '    <div class="bar-fill" style="width:' + persen + '%; background:' + warna + ';">';
    htmlDivisi += '      ' + jumlah + ' orang';
    htmlDivisi += '    </div>';
    htmlDivisi += '  </div>';
    htmlDivisi += '</div>';
  });
  document.getElementById('grafik-divisi').innerHTML = htmlDivisi;

  // --- Grafik Status ---
  var dataStatus = [
    { label: 'Aktif',     jumlah: aktif,    warna: '#27ae60' },
    { label: 'Cuti',      jumlah: cuti,     warna: '#f39c12' },
    { label: 'Non-aktif', jumlah: nonaktif, warna: '#e74c3c' }
  ];
  var maxStatus = Math.max.apply(null, dataStatus.map(function(s) { return s.jumlah; })) || 1;

  var htmlStatus = '';
  dataStatus.forEach(function(s) {
    var persen = Math.round(s.jumlah / maxStatus * 100);
    htmlStatus += '<div class="bar-row">';
    htmlStatus += '  <div class="bar-label">' + s.label + '</div>';
    htmlStatus += '  <div class="bar-track">';
    htmlStatus += '    <div class="bar-fill" style="width:' + persen + '%; background:' + s.warna + ';">';
    htmlStatus += '      ' + s.jumlah + ' orang';
    htmlStatus += '    </div>';
    htmlStatus += '  </div>';
    htmlStatus += '</div>';
  });
  document.getElementById('grafik-status').innerHTML = htmlStatus;
}

/**
 * Buat HTML kartu statistik
 */
function buatKartuStat(label, angka, warna) {
  return '<div class="stat-kartu ' + warna + '">' +
         '  <div class="stat-angka">' + angka + '</div>' +
         '  <div class="stat-label">' + label + '</div>' +
         '</div>';
}


// ===================================================
// BAGIAN 6: FUNGSI NOTIFIKASI TOAST
// ===================================================

/**
 * Tampilkan notifikasi singkat di pojok kanan bawah
 * @param {string} pesan - teks notifikasi
 * @param {string} tipe  - 'sukses' atau 'error'
 */
function tampilkanToast(pesan, tipe) {
  var toast = document.getElementById('toast');
  toast.textContent = pesan;
  toast.className = 'toast ' + (tipe || '');
  toast.classList.add('tampil');

  // Sembunyikan otomatis setelah 3 detik
  setTimeout(function() {
    toast.classList.remove('tampil');
  }, 3000);
}


// ===================================================
// BAGIAN 7: EXPORT KE EXCEL
// Menggunakan library SheetJS (xlsx) yang dimuat dari CDN
// ===================================================

/**
 * Export semua data karyawan ke file .xlsx
 * Library SheetJS mengubah array JS menjadi file Excel sungguhan
 */
function exportExcel() {
  if (daftarKaryawan.length === 0) {
    tampilkanToast('⚠️ Tidak ada data untuk diekspor!', 'error');
    return;
  }

  // ---- 1. Siapkan data dalam format array of array ----
  // Baris pertama = header kolom
  var header = [
    "No", "NIK", "Nama Lengkap", "Jenis Kelamin", "Tanggal Lahir",
    "Email", "No. Telepon", "Alamat", "Divisi", "Jabatan",
    "Tanggal Masuk", "Status", "Gaji Pokok (Rp)", "Pendidikan"
  ];

  // Baris berikutnya = data setiap karyawan
  var baris = daftarKaryawan.map(function(k, i) {
    return [
      i + 1,
      k.nik,
      k.nama,
      k.jenisKelamin,
      k.tanggalLahir,
      k.email,
      k.telepon,
      k.alamat,
      k.divisi,
      k.jabatan,
      k.tanggalMasuk,
      k.status,
      k.gaji,
      k.pendidikan
    ];
  });

  // Gabungkan header + data
  var semuaData = [header].concat(baris);

  // ---- 2. Buat worksheet dari data ----
  var ws = XLSX.utils.aoa_to_sheet(semuaData);

  // ---- 3. Atur lebar kolom agar rapi ----
  ws['!cols'] = [
    {wch: 4},  // No
    {wch: 10}, // NIK
    {wch: 22}, // Nama
    {wch: 14}, // Jenis Kelamin
    {wch: 14}, // Tgl Lahir
    {wch: 26}, // Email
    {wch: 16}, // Telepon
    {wch: 28}, // Alamat
    {wch: 13}, // Divisi
    {wch: 20}, // Jabatan
    {wch: 13}, // Tgl Masuk
    {wch: 10}, // Status
    {wch: 18}, // Gaji
    {wch: 12}  // Pendidikan
  ];

  // ---- 4. Buat workbook & tambahkan worksheet ----
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Karyawan");

  // ---- 5. Buat sheet Statistik ----
  var total    = daftarKaryawan.length;
  var aktif    = daftarKaryawan.filter(function(k){ return k.status==='Aktif'; }).length;
  var nonaktif = daftarKaryawan.filter(function(k){ return k.status==='Non-aktif'; }).length;
  var cuti     = daftarKaryawan.filter(function(k){ return k.status==='Cuti'; }).length;
  var totalGaji= daftarKaryawan.reduce(function(s,k){ return s+k.gaji; }, 0);
  var rataGaji = total > 0 ? Math.round(totalGaji / total) : 0;

  var hitungDivisi = {};
  daftarKaryawan.forEach(function(k){
    hitungDivisi[k.divisi] = (hitungDivisi[k.divisi]||0)+1;
  });

  var dataStat = [
    ["STATISTIK KARYAWAN", ""],
    ["", ""],
    ["RINGKASAN UMUM", ""],
    ["Total Karyawan",        total],
    ["Karyawan Aktif",        aktif],
    ["Karyawan Non-aktif",    nonaktif],
    ["Sedang Cuti",           cuti],
    ["Total Gaji/Bulan (Rp)", totalGaji],
    ["Rata-rata Gaji (Rp)",   rataGaji],
    ["", ""],
    ["DISTRIBUSI DIVISI", ""],
  ];
  Object.entries(hitungDivisi).forEach(function(e){
    dataStat.push([e[0], e[1]]);
  });

  var wsStat = XLSX.utils.aoa_to_sheet(dataStat);
  wsStat['!cols'] = [{wch: 26}, {wch: 18}];
  XLSX.utils.book_append_sheet(wb, wsStat, "Statistik");

  // ---- 6. Unduh file dengan nama berisi tanggal ----
  var tanggal = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD
  var namaFile = 'Data_Karyawan_' + tanggal + '.xlsx';

  XLSX.writeFile(wb, namaFile);
  tampilkanToast('✅ File "' + namaFile + '" berhasil diunduh!', 'sukses');
}


// ===================================================
// BAGIAN 8: IMPORT DARI EXCEL
// Membaca file .xlsx yang diunggah user dan memasukkan datanya
// ===================================================

/**
 * Dipanggil saat user memilih file Excel untuk diimpor
 * @param {Event} event - event dari input type="file"
 */
function importExcel(event) {
  var file = event.target.files[0];
  if (!file) return;

  // Pastikan file bertipe Excel
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    tampilkanToast('⚠️ File harus berformat .xlsx atau .xls', 'error');
    return;
  }

  tampilkanToast('⏳ Membaca file Excel...', '');

  // ---- Baca file sebagai ArrayBuffer menggunakan FileReader ----
  var reader = new FileReader();

  reader.onload = function(e) {
    try {
      // Parse file Excel dengan SheetJS
      var data     = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });

      // Ambil sheet pertama (sheet "Data Karyawan")
      var namaSheet = workbook.SheetNames[0];
      var sheet     = workbook.Sheets[namaSheet];

      // Ubah sheet menjadi array of objects (header baris pertama jadi key)
      var rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (rows.length === 0) {
        tampilkanToast('⚠️ Sheet Excel kosong atau tidak ada data!', 'error');
        return;
      }

      // ---- Peta nama kolom Excel → nama field di aplikasi ----
      // Ini memungkinkan impor dari file Excel yang kita export sendiri
      var petaKolom = {
        'NIK':               'nik',
        'Nama Lengkap':      'nama',
        'Jenis Kelamin':     'jenisKelamin',
        'Tanggal Lahir':     'tanggalLahir',
        'Email':             'email',
        'No. Telepon':       'telepon',
        'Alamat':            'alamat',
        'Divisi':            'divisi',
        'Jabatan':           'jabatan',
        'Tanggal Masuk':     'tanggalMasuk',
        'Status':            'status',
        'Gaji Pokok (Rp)':   'gaji',
        'Pendidikan':        'pendidikan'
      };

      var dataImport  = [];
      var dilewati    = 0;
      var nikExisting = daftarKaryawan.map(function(k){ return k.nik; });

      rows.forEach(function(row) {
        var k = {};

        // Petakan setiap kolom Excel ke field yang sesuai
        Object.keys(petaKolom).forEach(function(kolomExcel) {
          var fieldApp = petaKolom[kolomExcel];
          k[fieldApp]  = row[kolomExcel] !== undefined ? String(row[kolomExcel]).trim() : '';
        });

        // Konversi gaji ke angka
        k.gaji = parseInt(k.gaji) || 0;

        // Lewati baris yang NIK atau Nama kosong
        if (!k.nik || !k.nama) { dilewati++; return; }

        // Lewati kalau NIK sudah ada (hindari duplikat)
        if (nikExisting.indexOf(k.nik) !== -1) { dilewati++; return; }

        dataImport.push(k);
        nikExisting.push(k.nik); // tambahkan ke daftar agar tidak duplikat antar baris import
      });

      if (dataImport.length === 0) {
        tampilkanToast('⚠️ Tidak ada data baru yang bisa diimpor (mungkin semua NIK sudah ada)', 'error');
        return;
      }

      // Masukkan data ke daftarKaryawan
      dataImport.forEach(function(k){ daftarKaryawan.push(k); });

      var pesan = '✅ ' + dataImport.length + ' data berhasil diimpor!';
      if (dilewati > 0) pesan += ' (' + dilewati + ' dilewati)';
      tampilkanToast(pesan, 'sukses');

      // Reset input file agar bisa impor file yang sama lagi
      event.target.value = '';

      // Pindah ke tab daftar
      setTimeout(function(){
        bukaTab('daftar', document.querySelectorAll('.tab')[1]);
      }, 800);

    } catch(err) {
      tampilkanToast('❌ Gagal membaca file: ' + err.message, 'error');
    }
  };

  reader.readAsArrayBuffer(file);
}


// ===================================================
// BAGIAN 9: INISIALISASI — Jalankan saat halaman dimuat
// ===================================================

// Render tabel pertama kali saat halaman dibuka
renderTabel(daftarKaryawan);
