(function() {
    "use strict";

    // Fungsi untuk toggle baris detail
    const toggleDetail = function(id) {
        const detailRow = document.getElementById(id);
        if (detailRow) {
            detailRow.classList.toggle('ysq-is-hidden');
        }
    };

    // Menggunakan Event Delegation: memasang satu listener untuk semua tombol detail
    document.onclick = function(event) {
        // Mencari apakah elemen yang diklik memiliki class trigger detail
        const trigger = event.target.closest('.ysq-trigger-detail');
        
        if (trigger) {
            // Mencegah aksi default jika itu link
            event.preventDefault(); 
            const targetId = trigger.getAttribute('data-target');
            toggleDetail(targetId);
        }
    };
})();

/* PERPINDAHAN ANTARA PROGRES DAN RAPORT */

function showTab(tabName) {
    const sectionProgres = document.getElementById('section-progres');
    const sectionRaport = document.getElementById('section-raport');
    const buttons = document.querySelectorAll('.ysq-tab-btn');

    if (tabName === 'progres') {
        sectionProgres.classList.remove('ysq-is-hidden');
        sectionRaport.classList.add('ysq-is-hidden');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        sectionProgres.classList.add('ysq-is-hidden');
        sectionRaport.classList.remove('ysq-is-hidden');
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}