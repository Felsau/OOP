document.addEventListener("DOMContentLoaded", function () {
  
  // Initialize Animate On Scroll (AOS)
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });

  const fullRoomData = {
    "โซนเก่า": [
      { number: "01", status: "occupied" },
      { number: "02", status: "available", type: 'ห้องพัดลม', price: '3,500', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80', amenities: ['เตียง 5 ฟุต', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น'] },
      { number: "03", status: "occupied" },
      { number: "04", status: "occupied" },
      { number: "05", status: "available", type: 'ห้องพัดลม', price: '3,500', image: 'https://images.unsplash.com/photo-1560185893-a55de8537e4e?auto=format&fit=crop&q=80', amenities: ['เตียง 5 ฟุต', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น'] },
      { number: "06", status: "occupied" },
      { number: "07", status: "occupied" }
    ],
    "โซนกลาง": [
      { number: "08", status: "occupied" },
      { number: "09", status: "available", type: 'ห้องแอร์', price: '4,000', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80', amenities: ['เตียง 6 ฟุต', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น', 'เครื่องปรับอากาศ', 'ตู้เย็น'] },
      { number: "10", status: "occupied" },
      { number: "11", status: "occupied" },
      { number: "12", status: "available", type: 'ห้องแอร์', price: '4,000', image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c015d?auto=format&fit=crop&q=80', amenities: ['เตียง 6 ฟุต', 'ตู้เสื้อผ้า', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น', 'เครื่องปรับอากาศ', 'ตู้เย็น'] },
      { number: "13", status: "occupied" },
      { number: "14", status: "occupied" }
    ],
    "โซนใหม่": [
      { number: "15", status: "available", type: 'ห้องแอร์บิ้วอิน', price: '4,500', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80', amenities: ['เตียง 6 ฟุต', 'ตู้เสื้อผ้าบิ้วอิน', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น', 'เครื่องปรับอากาศ', 'ตู้เย็น', 'ไมโครเวฟ'] },
      { number: "16", status: "occupied" },
      { number: "17", status: "occupied" },
      { number: "18", status: "available", type: 'ห้องแอร์บิ้วอิน', price: '4,500', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80', amenities: ['เตียง 6 ฟุต', 'ตู้เสื้อผ้าบิ้วอิน', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น', 'เครื่องปรับอากาศ', 'ตู้เย็น', 'ไมโครเวฟ'] },
      { number: "19", status: "occupied" },
      { number: "20", status: "available", type: 'ห้องแอร์บิ้วอิน', price: '4,500', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80', amenities: ['เตียง 6 ฟุต', 'ตู้เสื้อผ้าบิ้วอิน', 'โต๊ะทำงาน', 'เครื่องทำน้ำอุ่น', 'เครื่องปรับอากาศ', 'ตู้เย็น', 'ไมโครเวฟ'] }
    ]
  };

  // --- Zone Tabs & Room Map Logic ---
  const zoneButtons = document.querySelectorAll(".zone-button");
  const roomColumns = document.querySelectorAll(".room-column");
  
  if (zoneButtons.length && roomColumns.length >= 2) {
    const leftColumn = roomColumns[0];
    const rightColumn = roomColumns[1];

    function renderRooms(zoneName) {
      leftColumn.innerHTML = "";
      rightColumn.innerHTML = "";
      const rooms = fullRoomData[zoneName];
      if (!rooms) return;

      const sortedRooms = [...rooms].sort((a, b) => parseInt(a.number) - parseInt(b.number));

      function createRoomButton(room) {
          const roomButton = document.createElement("button");
          roomButton.className = `room-unit ${room.status}`;
          roomButton.textContent = room.number;
          if (room.status === 'available') {
              roomButton.addEventListener('click', () => openDetailsModal(room));
          }
          return roomButton;
      }

      sortedRooms.forEach((room, index) => {
          if (index % 2 === 0) {
              leftColumn.appendChild(createRoomButton(room));
          } else {
              rightColumn.appendChild(createRoomButton(room));
          }
      });
    }

    function handleZoneClick(event) {
      zoneButtons.forEach((button) => button.classList.remove("active"));
      const clickedButton = event.currentTarget;
      clickedButton.classList.add("active");
      const zoneName = clickedButton.textContent.trim();
      renderRooms(zoneName);
    }

    zoneButtons.forEach((button) => {
      button.addEventListener("click", handleZoneClick);
    });
    
    renderRooms("โซนเก่า");
  }


  // ---  Pannellum 360 Viewer Modal Logic ---
  const galleryModal = document.getElementById('gallery-modal');
  const roomCards = document.querySelectorAll('.room-card');
  let pannellumViewer = null; 

  if (galleryModal && roomCards.length) {
    const galleryCloseButton = galleryModal.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');

    function openGalleryModal(roomName, panoramaImage) {
      if (!panoramaImage) return;

      modalTitle.textContent = `ภาพตัวอย่าง 360°: ${roomName}`;
      galleryModal.style.display = 'flex';

      if (pannellumViewer) pannellumViewer.destroy();

      pannellumViewer = pannellum.viewer('panorama-container', {
          "type": "equirectangular",
          "panorama": panoramaImage,
          "autoLoad": true,
          "autoRotate": -2,
      });
    }

    function closeGalleryModal() {
      if (galleryModal) galleryModal.style.display = 'none';
      if (pannellumViewer) {
        pannellumViewer.destroy();
        pannellumViewer = null;
      }
    }

    roomCards.forEach(card => {
      card.addEventListener('click', () => {
          const roomName = card.dataset.roomName;
          const panoramaImage = card.dataset.panoramaImage;
          openGalleryModal(roomName, panoramaImage);
      });
    });

    if(galleryCloseButton) galleryCloseButton.addEventListener('click', closeGalleryModal);
    if(galleryModal) galleryModal.addEventListener('click', (event) => {
      if (event.target === galleryModal) closeGalleryModal();
    });
  }


  // --- Room Details Modal Logic ---
  const detailsModal = document.getElementById('details-modal');
  const roomChoiceDropdown = document.getElementById('room-choice');
  
  if (detailsModal) {
      const detailsCloseButton = detailsModal.querySelector('.details-close-button');
      const modalTitle = document.getElementById('details-modal-title');
      const modalImg = document.getElementById('details-modal-img');
      const modalType = document.querySelector('#details-modal-type span');
      const modalPrice = document.querySelector('#details-modal-price span');
      const modalStatus = document.querySelector('#details-modal-status span');
      const modalAmenities = document.getElementById('details-modal-amenities');
      const modalBookButton = detailsModal.querySelector('.details-modal-button');

      function openDetailsModal(room) {
          modalTitle.innerHTML = `รายละเอียดห้อง <strong>${room.number}</strong>`;
          modalImg.src = room.image;
          modalImg.alt = `รูปภาพห้อง ${room.number}`;
          modalType.textContent = room.type;
          modalPrice.textContent = `${room.price} บาท/เดือน`;
          modalStatus.textContent = "ว่าง";

          modalAmenities.innerHTML = '';
          room.amenities.forEach(item => {
              const li = document.createElement('li');
              li.textContent = item;
              modalAmenities.appendChild(li);
          });
          
          if (modalBookButton && roomChoiceDropdown) {
            modalBookButton.onclick = () => {
                closeDetailsModal();
                roomChoiceDropdown.value = `ห้อง ${room.number}`;
            };
          }

          detailsModal.style.display = 'flex';
      }

      function closeDetailsModal() {
          if (detailsModal) detailsModal.style.display = 'none';
      }

      if(detailsCloseButton) detailsCloseButton.addEventListener('click', closeDetailsModal);
      detailsModal.addEventListener('click', (event) => {
          if (event.target === detailsModal) closeDetailsModal();
      });
  }
  
  if (roomChoiceDropdown) {
      function updateRoomChoiceDropdown() {
          roomChoiceDropdown.innerHTML = '<option value="">-- กรุณาเลือกห้องว่าง --</option>';
          for (const zone in fullRoomData) {
              if (fullRoomData.hasOwnProperty(zone)) {
                  fullRoomData[zone].forEach(room => {
                      if (room.status === 'available') {
                          const option = document.createElement('option');
                          option.value = `ห้อง ${room.number}`;
                          option.textContent = `ห้อง ${room.number} (${room.type})`;
                          roomChoiceDropdown.appendChild(option);
                      }
                  });
              }
          }
      }
      updateRoomChoiceDropdown();
  }

  // --- FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if(currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
  }

  // --- Login Modal Logic ---
  const loginModal = document.getElementById('login-modal');
  const loginTriggerButton = document.querySelector('.menu-login');
  
  if (loginModal && loginTriggerButton) {
      const loginCloseButton = loginModal.querySelector('.login-close-button');
      const loginForm = document.getElementById('login-form');

      function openLoginModal(event) {
          event.preventDefault();
          loginModal.style.display = 'flex';
      }

      function closeLoginModal() {
          if(loginModal) loginModal.style.display = 'none';
      }

      loginTriggerButton.addEventListener('click', openLoginModal);
      if(loginCloseButton) loginCloseButton.addEventListener('click', closeLoginModal);
      
      loginModal.addEventListener('click', (event) => {
          if (event.target === loginModal) {
              closeLoginModal();
          }
      });
      
      if(loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = event.target.email.value;
            const password = event.target.password.value;
            
            if (email.toLowerCase() === 'tenant@email.com') {
                alert('ล็อกอินสำเร็จ! กำลังเข้าสู่หน้าแดชบอร์ด...');
                window.location.href = 'dashboard.html';
            } else if (email.toLowerCase() === 'owner@email.com') {
                alert('ล็อกอินสำเร็จ! (เจ้าของหอพัก)');
                // window.location.href = 'admin.html'; // In the future, this can go to an admin page
                closeLoginModal();
            } else {
                alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        });
      }
  }

  // --- Global Escape Key Listener ---
  window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
          if(galleryModal && galleryModal.style.display === 'flex') galleryModal.querySelector('.close-button').click();
          if(detailsModal && detailsModal.style.display === 'flex') detailsModal.querySelector('.details-close-button').click();
          if(loginModal && loginModal.style.display === 'flex') loginModal.querySelector('.login-close-button').click();
      }
  });
});