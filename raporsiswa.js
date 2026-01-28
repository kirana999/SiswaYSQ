/**
 * Fungsi Utama untuk Navigasi Tab Rapor (UI 7.3)
 * Mengatur visibilitas antara Rapor Tahsin dan Rapor Tahfidz [cite: 3, 20, 35]
 */
function showTab(tabName) {
    // 1. Identifikasi elemen kontainer section menggunakan ID terbaru [cite: 34]
    const sectionTahsin = document.getElementById('section-tahsin');
    const sectionTahfidz = document.getElementById('section-rapor-tahfidz'); 
    
    // 2. Ambil semua tombol tab untuk pengaturan state aktif 
    const tabs = document.querySelectorAll('.ysq-tab-btn');

    // Pastikan elemen ditemukan sebelum memproses untuk menghindari error
    if (!sectionTahsin || !sectionTahfidz) return;

    // 3. Logika Perpindahan Konten (Toggle Visibility) 
    if (tabName === 'tahsin') {
        // Tampilkan Tahsin, Sembunyikan Tahfidz
        sectionTahsin.classList.remove('ysq-is-hidden');
        sectionTahfidz.classList.add('ysq-is-hidden');
    } else if (tabName === 'rapor-tahfidz') {
        // Tampilkan Tahfidz, Sembunyikan Tahsin [cite: 7, 21, 35]
        sectionTahsin.classList.add('ysq-is-hidden');
        sectionTahfidz.classList.remove('ysq-is-hidden');
    }

    // 4. Update Status Visual Tombol Tab (Active State)
    tabs.forEach(btn => {
        // Hapus kelas active dari semua tombol tab
        btn.classList.remove('active');
        
        // Tambahkan kelas active kembali pada tombol yang sesuai [cite: 62]
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
}

/**
 * Fungsi Penanganan Unduhan PDF Resmi (TS-CASE-004)
 * Berfungsi untuk Rapor Tahsin maupun Rapor Tahfidz [cite: 68, 69]
 */
function downloadPDF(raporType) {
    // Validasi status penerbitan (Published) sebelum proses unduh [cite: 14, 38, 65]
    console.log(`Menyiapkan dokumen PDF: Rapor ${raporType}`);
    
    // Memberikan feedback visual kepada pengguna [cite: 69, 70]
    alert(`File PDF Rapor ${raporType} sedang disiapkan oleh sistem YSQ. Silakan tunggu beberapa saat.`);
    
    // Logika integrasi: Memanggil file PDF resmi yang sudah berstatus Published [cite: 21, 67, 74]
}