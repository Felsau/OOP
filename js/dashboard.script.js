document.addEventListener("DOMContentLoaded", function () {
    
    // --- Element Selections ---
    const paymentModal = document.getElementById('payment-modal');
    const historyModal = document.getElementById('history-modal');
    const maintenanceModal = document.getElementById('maintenance-modal');

    const paymentBtn = document.getElementById('payment-btn');
    const historyBtn = document.getElementById('history-btn');
    const maintenanceBtn = document.getElementById('maintenance-btn');

    const allModals = document.querySelectorAll('.modal');
    const allCloseButtons = document.querySelectorAll('.close-button');

    // --- Functions ---
    function openModal(modal) {
        if (modal) modal.style.display = 'flex';
    }

    function closeModal() {
        allModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // --- Event Listeners ---
    if (paymentBtn) paymentBtn.addEventListener('click', () => openModal(paymentModal));
    if (historyBtn) historyBtn.addEventListener('click', () => openModal(historyModal));
    if (maintenanceBtn) maintenanceBtn.addEventListener('click', () => openModal(maintenanceModal));

    // Add event listener for all close buttons
    allCloseButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Add event listener to close modal when clicking outside of the content
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Add event listener for escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

});