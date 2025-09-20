document.addEventListener("DOMContentLoaded", function () {
    // --- MOCK DATA ---
    // ข้อมูลจำลองสำหรับผู้เช่า โดยมีการปรับปรุงค่าเช่าและค่าสาธารณูปโภคตามที่คุณต้องการ
    const userData = {
        name: "ชานนท์ มั่นคง",
        roomNumber: "A201",
        phone: "081-234-5678",
        email: "chanon.m@email.com",
        emergencyContact: { name: "สมศรี มั่นคง (มารดา)", phone: "089-876-5432" },
        
        // --- ส่วนที่แก้ไขตามโจทย์ ---
        baseRent: 3500, // ค่าเช่า 3,500 บาท
        tenantsCount: 1, // จำนวนผู้เช่าในห้อง (สำหรับคำนวณค่าน้ำ)
        utilityUsage: {
            water: {
                flatRate: 100 // ค่าน้ำเหมาคนละ 100 บาท
            },
            electricity: {
                previous: 2540,
                current: 2595,
                unitPrice: 8, // ค่าไฟหน่วยละ 8 บาท
                imageUrl: 'https://www.conserve-energy-future.com/wp-content/uploads/2013/02/Digital_Electricity_Meter.jpg'
            }
        },
        // --- สิ้นสุดส่วนที่แก้ไข ---

        paymentHistory: [
            { month: "สิงหาคม 2568", amount: "3,940 บาท", date: "5 ส.ค. 2568", status: "ชำระแล้ว" },
            { month: "กรกฎาคม 2568", amount: "3,884 บาท", date: "4 ก.ค. 2568", status: "ชำระแล้ว" }
        ],
        maintenanceRequests: [
            { issue: "แอร์ไม่เย็น", status: "ดำเนินการเสร็จสิ้น", date: "15 ส.ค. 2568", details: "ช่างได้เข้ามาล้างแอร์และเติมน้ำยาเรียบร้อยแล้ว" },
            { issue: "หลอดไฟห้องน้ำขาด", status: "กำลังดำเนินการ", date: "18 ก.ย. 2568", details: "รับเรื่องแล้ว รอช่างเข้าตรวจสอบ" }
        ],
        announcements: [
            { id: 1, title: "แจ้งงดใช้น้ำชั่วคราว", date: "20 ก.ย. 2568", content: "เนื่องจากมีการซ่อมท่อประปา จะงดจ่ายน้ำในวันที่ 21 ก.ย. เวลา 10:00-12:00 น. ขออภัยในความไม่สะดวกครับ", isRead: false },
            { id: 2, title: "เรื่องการทิ้งขยะ", date: "15 ก.ย. 2568", content: "ขอความร่วมมือผู้เช่าทุกท่านโปรดทิ้งขยะให้ลงถังและแยกขยะตามประเภทที่กำหนดไว้ เพื่อความเป็นระเบียบเรียบร้อย", isRead: true },
        ],
        leaseInfo: { id: "LEASE-2024-A201", startDate: "2024-10-01", endDate: "2025-09-30", status: "Active", fileUrl: "./sample-lease.pdf" },
        calendarEvents: [
            { date: "2025-10-05", type: "rent-due", title: "ครบกำหนดชำระค่าเช่า" },
            { date: "2025-10-15", type: "maintenance", title: "นัดหมายล้างแอร์ประจำปี" },
        ]
    };

    // --- Element Selections ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentPanels = document.querySelectorAll('.content-panel');
    const mainHeaderTitle = document.getElementById('main-header-title');
    const announcementBadge = document.getElementById('announcement-badge');

    // --- Calendar Variables ---
    let currentDate = new Date();

    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            mainHeaderTitle.textContent = this.querySelector('span').textContent;
            contentPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetId);
            });
        });
    });

    // --- Data Loading & Rendering Logic ---
    function loadAllData() {
        // --- ส่วนที่แก้ไข: อัปเดตตรรกะการคำนวณใหม่ ---
        const waterCost = userData.tenantsCount * userData.utilityUsage.water.flatRate;
        const elecUsage = userData.utilityUsage.electricity.current - userData.utilityUsage.electricity.previous;
        const elecCost = elecUsage * userData.utilityUsage.electricity.unitPrice;
        const totalBill = userData.baseRent + waterCost + elecCost;
        
        populateOverviewAndReminders(totalBill);
        populatePayments(totalBill, waterCost, elecCost, elecUsage);
        // --- สิ้นสุดส่วนที่แก้ไข ---
        
        populateAnnouncements();
        populateMaintenance();
        populateLease();
        renderCalendar();
        populateProfile();
    }
    
    function populateOverviewAndReminders(totalBill) {
        document.getElementById('user-name').textContent = `สวัสดี, คุณ${userData.name.split(' ')[0]}`;
        document.getElementById('payment-due').textContent = `${totalBill.toLocaleString()} บาท`;
        document.getElementById('due-date').textContent = `วันที่ 5 ตุลาคม 2568`;
        const pendingMaintenance = userData.maintenanceRequests.filter(req => req.status === 'กำลังดำเนินการ');
        document.getElementById('maintenance-status').textContent = pendingMaintenance.length > 0 ? `${pendingMaintenance.length} รายการ` : 'ไม่มี';
        
        const upcomingEvents = userData.calendarEvents.filter(event => new Date(event.date) >= new Date()).slice(0, 3);
        const remindersList = document.getElementById('reminders-list');
        remindersList.innerHTML = '';
        if (upcomingEvents.length > 0) {
            upcomingEvents.forEach(event => {
                const icon = event.type === 'rent-due' ? 'fa-file-invoice-dollar' : 'fa-tools';
                remindersList.innerHTML += `<li class="${event.type}"><i class="fas ${icon}"></i><div><span class="date">${formatDateThai(event.date)}:</span><span class="description">${event.title}</span></div></li>`;
            });
        } else {
            remindersList.innerHTML = '<li>ไม่มีนัดหมายเร็วๆ นี้</li>';
        }
    }

    function populatePayments(totalBill, waterCost, elecCost, elecUsage) {
        document.getElementById('modal-payment-amount').textContent = totalBill.toLocaleString();
        
        // --- ส่วนที่แก้ไข: อัปเดตการแสดงผลค่าน้ำ ---
        document.getElementById('utility-breakdown').innerHTML = `
            <div class="meter-details-grid"><div><h4>ค่าเช่าห้อง</h4><p>${userData.baseRent.toFixed(2)} บาท</p></div></div>
            <div class="meter-details-grid"><div><h4>ค่าน้ำ (เหมาจ่าย)</h4><p>${waterCost.toFixed(2)} บาท</p><small>(${userData.tenantsCount} คน x ${userData.utilityUsage.water.flatRate} บาท)</small></div></div>
            <div class="meter-details-grid">
                <div><h4>ค่าไฟ</h4><p>${elecCost.toFixed(2)} บาท</p><small>(${elecUsage} หน่วย x ${userData.utilityUsage.electricity.unitPrice} บาท)</small></div>
                <img src="${userData.utilityUsage.electricity.imageUrl}" class="meter-image" alt="Electricity Meter">
            </div>`;
        // --- สิ้นสุดส่วนที่แก้ไข ---
            
        const historyTableBody = document.getElementById('history-table-body');
        historyTableBody.innerHTML = '';
        userData.paymentHistory.forEach(item => historyTableBody.innerHTML += `<tr><td>${item.month}</td><td>${item.amount}</td><td>${item.date}</td><td class="status-paid">${item.status}</td></tr>`);
    }

    function populateAnnouncements() {
        const announcementList = document.getElementById('announcement-list');
        announcementList.innerHTML = '';
        userData.announcements.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `announcement-item ${item.isRead ? '' : 'unread'}`;
            itemElement.innerHTML = `<div class="announcement-header"><h3>${item.title}</h3><span class="date">${item.date}</span></div><div class="announcement-content"><p>${item.content}</p></div>`;
            if (!item.isRead) {
                itemElement.addEventListener('click', () => {
                    item.isRead = true;
                    itemElement.classList.remove('unread');
                    updateUnreadCount();
                }, { once: true });
            }
            announcementList.appendChild(itemElement);
        });
        updateUnreadCount();
    }

    function updateUnreadCount() {
        const unreadCount = userData.announcements.filter(item => !item.isRead).length;
        announcementBadge.textContent = unreadCount;
        announcementBadge.classList.toggle('hidden', unreadCount === 0);
    }

    function populateMaintenance() {
        const maintenanceList = document.getElementById('maintenance-list');
        maintenanceList.innerHTML = '';
        if (userData.maintenanceRequests.length > 0) {
            userData.maintenanceRequests.slice().reverse().forEach(item => {
                const statusClass = item.status === 'ดำเนินการเสร็จสิ้น' ? 'status-completed' : 'status-pending';
                maintenanceList.innerHTML += `<div class="maintenance-item"><div><h4>${item.issue}</h4><small>${item.date} - ${item.details}</small></div><span class="status ${statusClass}">${item.status}</span></div>`;
            });
        } else {
            maintenanceList.innerHTML = "<p>ไม่มีรายการแจ้งซ่อม</p>";
        }
    }
    
    function populateLease() {
        const leaseDetails = document.getElementById('lease-details');
        leaseDetails.innerHTML = `
            <div class="lease-detail-item"><h4>รหัสสัญญา</h4><p>${userData.leaseInfo.id}</p></div>
            <div class="lease-detail-item"><h4>วันเริ่มสัญญา</h4><p>${formatDateThai(userData.leaseInfo.startDate)}</p></div>
            <div class="lease-detail-item"><h4>วันสิ้นสุดสัญญา</h4><p>${formatDateThai(userData.leaseInfo.endDate)}</p></div>
            <div class="lease-detail-item"><h4>สถานะ</h4><p class="status-active">${userData.leaseInfo.status}</p></div>`;
        document.getElementById('download-lease-btn').href = userData.leaseInfo.fileUrl;
    }

    function populateProfile() {
        document.getElementById('profile-name').value = userData.name;
        document.getElementById('profile-room').value = userData.roomNumber;
        document.getElementById('profile-phone').value = userData.phone;
        document.getElementById('profile-email').value = userData.email;
        document.getElementById('emergency-name').value = userData.emergencyContact.name;
        document.getElementById('emergency-phone').value = userData.emergencyContact.phone;
    }
    
    function renderCalendar() {
        const monthYearHeader = document.getElementById('month-year-header');
        const calendarDays = document.getElementById('calendar-days');
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYearHeader.textContent = `${new Date(year, month).toLocaleString('th-TH', { month: 'long' })} ${year + 543}`;
        calendarDays.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.innerHTML += `<div class="calendar-day other-month"></div>`; }
        for (let day = 1; day <= daysInMonth; day++) {
            let dayClasses = "calendar-day";
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) { dayClasses += " today"; }
            let eventHTML = '';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            userData.calendarEvents.forEach(event => {
                if (event.date === dateStr) { eventHTML += `<div class="event-dot ${event.type}" title="${event.title}"></div>`; }
            });
            calendarDays.innerHTML += `<div class="${dayClasses}"><span class="day-number">${day}</span>${eventHTML}</div>`;
        }
    }

    document.getElementById('prev-month-btn').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month-btn').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    function setProfileEditing(isEditing) {
        document.querySelectorAll('#profile-form input:not([disabled])').forEach(input => input.disabled = !isEditing);
        document.getElementById('edit-profile-btn').classList.toggle('hidden', isEditing);
        document.getElementById('save-profile-btn').classList.toggle('hidden', !isEditing);
    }
    document.getElementById('edit-profile-btn').addEventListener('click', () => setProfileEditing(true));
    document.getElementById('profile-form').addEventListener('submit', (e) => { e.preventDefault(); alert('บันทึกข้อมูลสำเร็จ!'); setProfileEditing(false); });
    document.getElementById('contact-form').addEventListener('submit', (e) => { e.preventDefault(); alert('ส่งข้อความถึงเจ้าของบ้านเรียบร้อยแล้ว'); e.target.reset(); });
    document.getElementById('moveout-form').addEventListener('submit', (e) => { e.preventDefault(); const moveOutDate = document.getElementById('moveout-date').value; if (confirm(`คุณยืนยันที่จะแจ้งย้ายออกในวันที่ ${formatDateThai(moveOutDate)} ใช่หรือไม่?`)) { alert('ระบบได้รับเรื่องแจ้งย้ายออกของคุณแล้ว'); e.target.reset(); } });
    document.getElementById('upload-form').addEventListener('submit', (e) => { e.preventDefault(); alert('อัปโหลดสลิปเรียบร้อยแล้ว!'); e.target.reset(); });
    document.getElementById('maintenance-form').addEventListener('submit', (e) => { e.preventDefault(); alert('ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว!'); e.target.reset(); });

    function formatDateThai(dateString) { return new Date(dateString).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }); }

    loadAllData();
});