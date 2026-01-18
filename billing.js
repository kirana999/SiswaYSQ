/* ========================================================= */
/* 1. INISIALISASI PERIODE (Bulan Berjalan)                  */
/* ========================================================= */
function initPeriode() {
    const periodInput = document.getElementById('filter-periode');
    const now = new Date();
    
    // Set otomatis ke bulan berjalan (Format: YYYY-MM)
    const currentMonth = now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2);
    
    if (periodInput) {
        periodInput.value = currentMonth;
    }
}

// Langsung panggil fungsi inisialisasi
initPeriode();

/* ========================================================= */
/* 2. FUNGSI FORMAT RUPIAH (TITIK OTOMATIS)                  */
/* ========================================================= */
const inputNominal = document.getElementById('inputAmount');

if (inputNominal) {
    inputNominal.addEventListener('input', function(e) {
        // Ambil angka saja dari input
        let value = this.value.replace(/[^0-9]/g, "");
        
        // Format menjadi ribuan dengan titik menggunakan locale Indonesia
        if (value !== "") {
            this.value = new Intl.NumberFormat('id-ID').format(value);
        } else {
            this.value = "";
        }
    });
}

/* ========================================================= */
/* 3. KONTROL MODAL (OPEN/CLOSE)                             */
/* ========================================================= */
function openPaymentModal(bulan, jumlah) {
    const modal = document.getElementById('paymentModal');
    
    // Mengubah display menjadi flex agar muncul ke tengah
    modal.style.setProperty('display', 'flex', 'important');
    
    document.getElementById('billPeriodInfo').innerText = "Bulan " + bulan;
    document.getElementById('billAmountInfo').innerText = jumlah;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.setProperty('display', 'none', 'important');
    
    // Reset form agar saat dibuka lagi bersih
    document.getElementById('paymentForm').reset();
    resetPreview(); 
}

// Tutup modal jika user klik di area luar (overlay)
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target == modal) {
        closePaymentModal();
    }
}

/* ========================================================= */
/* 4. PREVIEW GAMBAR BUKTI TRANSFER                          */
/* ========================================================= */
function previewImage(input) {
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Sembunyikan ikon, tampilkan gambar preview
            placeholder.style.display = 'none';
            previewContainer.classList.remove('ysq-is-hidden');
            previewImage.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function resetPreview() {
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('imagePreview');

    if (placeholder) placeholder.style.display = 'block';
    if (previewContainer) previewContainer.classList.add('ysq-is-hidden');
    if (previewImage) previewImage.src = "#";
}

/* ========================================================= */
/* 5. HANDLING SUBMIT (TOAST & CLOSE)                        */
/* ========================================================= */
document.getElementById('paymentForm').onsubmit = function(e) {
    e.preventDefault(); 

    // 1. Ambil data nominal dan hapus titiknya untuk sistem
    const formattedValue = document.getElementById('inputAmount').value;
    const cleanValue = formattedValue.replace(/\./g, "");

    // 2. Tutup Modal Secara Instan
    closePaymentModal();

    // 3. Tampilkan Toast Notification
    showToast("Berhasil! Bukti transfer telah dikirim. Status: Menunggu Verifikasi.");

    // Logika pengiriman data (FR.010)
    console.log("Nominal murni dikirim:", cleanValue);
};

/* ========================================================= */
/* 6. FUNGSI TOAST NOTIFICATION                              */
/* ========================================================= */
function showToast(message) {
    const toast = document.getElementById('ysq-toast');
    if (toast) {
        toast.innerText = message;
        toast.className = "ysq-toast show";
        
        // Hilangkan toast setelah 3 detik
        setTimeout(function() { 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
    }
}

/* ========================================================= */
/* 1. KONTROL MODAL TUNGGAKAN                                */
/* ========================================================= */
function openTunggakanModal() {
    const modal = document.getElementById('tunggakanModal');
    const listContainer = document.getElementById('list-tunggakan-popup');
    modal.style.setProperty('display', 'flex', 'important');

    // Ambil data yang statusnya 'Belum Ada Bukti Transfer'
    const tunggakan = dataTagihan.filter(item => item.status === "Belum Ada Bukti Transfer");
    listContainer.innerHTML = "";

    tunggakan.forEach(item => {
        const li = document.createElement('li');
        li.className = "tunggakan-item-popup";
        li.innerHTML = `
            <span><i class='bx bx-calendar-exclamation'></i> ${formatBulanIndo(item.bulan)}</span>
            <button class="btn-bayar-cepat" onclick="gotoPayment('${item.bulan}')">Bayar Sekarang</button>
        `;
        listContainer.appendChild(li);
    });
}

function closeTunggakanModal() {
    document.getElementById('tunggakanModal').style.setProperty('display', 'none', 'important');
}

function gotoPayment(bulan) {
    closeTunggakanModal(); // Tutup modal tunggakan
    document.getElementById('filter-periode').value = bulan;
    filterDataByMonth(bulan); // Arahkan tabel ke bulan tersebut
    document.querySelector('.ysq-table-wrapper').scrollIntoView({ behavior: 'smooth' });
}

/* ========================================================= */
/* FUNGSI TRANSISI: DARI LIST TUNGGAKAN KE PAYMENT           */
/* ========================================================= */
function prosesBayarDariPopup(bulan, nominal) {
    // 1. Tutup modal daftar tunggakan terlebih dahulu
    closeTunggakanModal();
    
    // 2. Gunakan setTimeout agar transisi modal tidak bertabrakan (smooth)
    setTimeout(() => {
        // 3. Format nominal agar cantik saat muncul di form (tambah titik)
        const nominalCantik = new Intl.NumberFormat('id-ID').format(nominal);
        
        // 4. Panggil fungsi openPaymentModal yang sudah ada
        // Gunakan formatBulanIndo untuk mengubah '2026-01' jadi 'Januari 2026'
        openPaymentModal(formatBulanIndo(bulan), nominalCantik);
        
        // 5. Scroll otomatis ke atas modal agar santri langsung melihat form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300); 
}

/* ========================================================= */
/* UPDATE FUNGSI GENERATE LIST TUNGGAKAN                     */
/* ========================================================= */
function scanSemuaTunggakan() {
    const container = document.getElementById('popuplist-tunggakan-container');
    const infoBadge = document.getElementById('info-tunggakan');
    const now = new Date();

    const daftarTunggakan = dataTagihan.filter(item => {
        return item.status === "Belum Ada Bukti Transfer" && new Date(item.jatuhTempo) < now;
    });

    if (daftarTunggakan.length > 0) {
        if (infoBadge) infoBadge.classList.remove('ysq-is-hidden');
        if (container) {
            container.innerHTML = "";
            daftarTunggakan.forEach(item => {
                const div = document.createElement('div');
                div.className = "popuplist-tunggakan-item";
                // Pastikan onclick memanggil fungsi transisi di atas
                div.innerHTML = `
                    <span><i class='bx bx-calendar-exclamation'></i> ${formatBulanIndo(item.bulan)}</span>
                    <button class="popuplist-tunggakan-btn" 
                        onclick="prosesBayarDariPopup('${item.bulan}', ${item.nominal})">
                        Bayar
                    </button>
                `;
                container.appendChild(div);
            });
        }
    }
}
