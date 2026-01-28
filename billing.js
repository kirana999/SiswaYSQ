/* ========================================================= */
/* 1. KONFIGURASI DATA & VARIABEL GLOBAL                     */
/* ========================================================= */
const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

let scrollPosition = 0; 

/* ========================================================= */
/* 2. LOGIKA KONSISTENSI PEMBAYARAN (CORE LOGIC)             */
/* ========================================================= */
function hitungStatus(tagihan, dibayar) {
    const sisa = tagihan - dibayar;
    let label = "Belum Bayar";
    let css = "danger";

    if (dibayar > 0 && sisa > 0) {
        label = "Mencicil";
        css = "warning";
    } else if (dibayar >= tagihan && tagihan > 0) {
        label = "Lunas";
        css = "success";
    }
    return { sisa, label, css };
}

/* ========================================================= */
/* 3. LOGIKA UPDATE SUMMARY CARD & BADGE TUNGGAKAN           */
/* ========================================================= */
function updateSummaryCard(mode) {
    const nominalCard = document.getElementById('nominal-tagihan-aktif');
    const tunggakanBadge = document.querySelector('.ysq-tunggakan-badge'); 
    let totalSisaSemua = 0;

    if (mode === 'spp') {
        // Menghitung total sisa dari data 12 bulan
        months.forEach((_, index) => {
            const tagihan = 300000;
            let dibayar = 0;
            // Simulasi: Januari Lunas, Februari Mencicil
            if (index === 0) dibayar = 300000; 
            if (index === 1) dibayar = 150000; 
            
            totalSisaSemua += (tagihan - dibayar);
        });
    } else {
        // Menghitung total sisa dari daftar Non-Iuran
        const rows = document.querySelectorAll('#section-non-iuran .grid-body .grid-row');
        rows.forEach(row => {
            if (row.style.display !== 'none') {
                const sisaText = row.children[3].innerText.replace(/[^0-9]/g, "");
                totalSisaSemua += parseInt(sisaText) || 0;
            }
        });
    }

    // 1. Update Nominal di Card
    if (nominalCard) {
        nominalCard.innerText = `Rp ${totalSisaSemua.toLocaleString('id-ID')}`;
    }

    // 2. Update Teks Badge Tunggakan (Dinamis)
    if (tunggakanBadge) {
        if (totalSisaSemua > 0) {
            // Jika masih ada sisa bayar
            tunggakanBadge.innerHTML = `<i class='bx bx-error-circle'></i> Ada tunggakan!`;
            tunggakanBadge.classList.add('danger');
            tunggakanBadge.classList.remove('success');
        } else {
            // Jika sudah lunas semua (Rp 0)
            tunggakanBadge.innerHTML = `<i class='bx bx-check-double'></i> Tidak ada tunggakan / Lunas Semua`;
            tunggakanBadge.classList.add('success');
            tunggakanBadge.classList.remove('danger');
        }
    }
}

/* ========================================================= */
/* 4. GENERATE DATA SPP                                      */
/* ========================================================= */
function renderSPPGrid() {
    const container = document.getElementById('spp-data-container');
    const selectedYear = document.getElementById('year-filter').value;
    const selectedStatus = document.getElementById('status-filter').value;
    
    if (!container) return;

    let htmlContent = "";
    months.forEach((month, index) => {
        const nominalTagihan = 300000;
        let totalDibayar = 0;
        if (index === 0) totalDibayar = 300000; 
        if (index === 1) totalDibayar = 150000; 
        
        const info = hitungStatus(nominalTagihan, totalDibayar);
        if (selectedStatus !== "all" && info.css !== selectedStatus) return;
        
        htmlContent += `
            <div class="grid-row">
                <div class="grid-cell text-left">${month} ${selectedYear}</div>
                <div class="grid-cell">Rp ${nominalTagihan.toLocaleString('id-ID')}</div>
                <div class="grid-cell">Rp ${totalDibayar.toLocaleString('id-ID')}</div>
                <div class="grid-cell">Rp ${info.sisa.toLocaleString('id-ID')}</div>
                <div class="grid-cell">
                    <span class="ysq-status-pill ${info.css}">${info.label}</span>
                </div>
                <div class="grid-cell">
                    ${info.label === "Lunas" 
                        ? `<i class='bx bx-check-circle success-icon'></i>` 
                        : `<button class="ysq-btn-upload" 
                                   data-item="SPP ${month} ${selectedYear}" 
                                   data-amount="${info.sisa.toLocaleString('id-ID')}">
                                   Konfirmasi
                           </button>`
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = htmlContent || `<div class="grid-row"><div class="grid-cell" style="grid-column: span 6; padding: 40px; color: #888;">Tidak ada data.</div></div>`;
}

/* ========================================================= */
/* 5. FILTER & VIEW SINKRON                                  */
/* ========================================================= */
function setupFilters() {
    const mainFilter = document.getElementById('main-filter');
    const yearFilter = document.getElementById('year-filter');
    const statusFilter = document.getElementById('status-filter');
    const sppSection = document.getElementById('section-spp-table');
    const nonIuranSection = document.getElementById('section-non-iuran');
    const labelCard = document.getElementById('label-total-dinamis');
    const displayYear = document.getElementById('display-year');

    function updateView() {
        const mode = mainFilter.value;
        const year = yearFilter.value;
        const status = statusFilter.value;

        if (displayYear) displayYear.innerText = year;

        if (mode === 'spp') {
            sppSection.style.display = 'block';
            nonIuranSection.style.display = 'none';
            labelCard.innerText = `Total Tagihan SPP ${year} Belum Lunas`;
            renderSPPGrid(); 
        } else {
            sppSection.style.display = 'none';
            nonIuranSection.style.display = 'block';
            labelCard.innerText = `Total Tagihan Non-Iuran ${year} Belum Lunas`;
            
            const rows = nonIuranSection.querySelectorAll('.grid-body .grid-row');
            rows.forEach(row => {
                const statusPill = row.querySelector('.ysq-status-pill');
                row.style.display = (status === "all" || statusPill.classList.contains(status)) ? 'grid' : 'none';
            });
        }
        updateSummaryCard(mode);
    }

    mainFilter.addEventListener('change', updateView);
    yearFilter.addEventListener('change', updateView);
    statusFilter.addEventListener('change', updateView);
    updateView(); 
}

/* ========================================================= */
/* 6. MODAL & UTILITY                                        */
/* ========================================================= */
function openPaymentModal(item, jumlah) {
    const modal = document.getElementById('paymentModal');
    scrollPosition = window.pageYOffset;
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollPosition}px`;
    document.getElementById('billPeriodInfo').innerText = item;
    document.getElementById('billAmountInfo').innerText = jumlah;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('paymentForm').reset();
    }, 300);
}

function setupModalLogic() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ysq-btn-upload')) {
            openPaymentModal(e.target.dataset.item, e.target.dataset.amount);
        }
    });

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.onclick = closePaymentModal;

    const inputAmount = document.getElementById('inputAmount');
    if (inputAmount) {
        inputAmount.addEventListener('input', function() {
            let value = this.value.replace(/[^0-9]/g, "");
            if (value !== "") this.value = new Intl.NumberFormat('id-ID').format(value);
        });
    }

    document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        closePaymentModal();
        showToast("Berhasil! Konfirmasi pembayaran dikirim ke Admin.");
    });
}

setupFilters();
setupModalLogic();

function showToast(message) {
    const toast = document.getElementById('ysq-toast');
    if (toast) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}