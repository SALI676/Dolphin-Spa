
document.addEventListener('DOMContentLoaded', function() {

  // Services Data
  const services = [
    { name: "Foot Massage", description: "Relax your feet with our soothing massage.", price: "10$", image: "images/Foot-Massage.png" },
    { name: "Traditional Khmer Massage", description: "Traditional techniques to heal and refresh.", price: "15$", image: "images/khmer-massage.jpg" },
    { name: "Back, Chest, Head and Shoulder Massage", description: "Relieve stress from upper body muscles.", price: "20$", image: "images/back-chest-massage.jpg" },
    { name: "Aroma Therapy Massage", description: "Relaxing massage with essential oils.", price: "18$", image: "images/aroma-therapy.jpg" },
    { name: "Deep Tissue Massage", description: "Focuses on deeper muscle layers.", price: "25$", image: "images/deep-tissue.jpg" },
    { name: "Four Hands Massage", description: "Two therapists massaging you at once.", price: "40$", image: "images/four-hands.jpg" },
    { name: "Hot Stones Therapy", description: "Heated stones to relax muscles deeply.", price: "22$", image: "images/hot-stones.jpg" },
    { name: "Herbal Warm Massage", description: "Massage with warm herbal compress.", price: "30$", image: "images/herbal-warm.jpg" },
    { name: "Foot Reflexology 30mins & Traditional Khmer Massage 60mins", description: "Combination of foot and body massage.", price: "28$", image: "images/reflexology-khmer30-60.jpg" },
    { name: "Foot Reflexology 60mins & Traditional Khmer Massage 60mins", description: "One hour foot and one hour traditional massage.", price: "35$", image: "images/reflexology-khmer60-60.jpg" },
    { name: "Foot Reflexology 60mins & Aroma Therapy 60mins", description: "Foot reflexology and aroma therapy combined.", price: "38$", image: "images/reflexology-aroma60-60.jpg" },
    { name: "Traditional Khmer Massage 60mins & Aroma Therapy 60mins", description: "Best of traditional Khmer and aroma massage.", price: "40$", image: "images/khmer-aroma60-60.jpg" },
    { name: "Traditional Khmer Massage 60mins & Deep Tissue Therapy 60mins", description: "Strong deep tissue plus traditional massage.", price: "42$", image: "images/khmer-deeptissue60-60.jpg" },
    { name: "Traditional Khmer Massage 60mins & Hot Stones Therapy 90mins", description: "Full traditional massage with hot stones.", price: "50$", image: "images/khmer-hotstones60-90.jpg" },
    { name: "Traditional Khmer Massage 60mins & Herbal Warm Compression 90mins", description: "Relaxing warm herbal compress with Khmer massage.", price: "52$", image: "images/khmer-herbalwarm60-90.jpg" }
  ];
  

  let selectedService = null;

  // Navigation Tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' class from all tabs and add to clicked tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding section based on clicked tab
      const sectionId = tab.id.replace('Tab', 'Section');
      showSection(sectionId);
    });
  });

  // Show Section Function
  function showSection(id) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
      section.style.display = 'none';
    });

    // Show the selected section
    const section = document.getElementById(id);
    if (section) section.style.display = 'block';
  }

  // Render Services
  const servicesContainer = document.getElementById('servicesContainer');
  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}">
      <div class="card-content">
        <h3>${service.name}</h3>
        <p>${service.price}</p>
      </div>
    `;
    card.addEventListener('click', () => showServiceDetail(index));
    servicesContainer.appendChild(card);
  });

  // Show Service Detail
  function showServiceDetail(index) {
    const service = services[index];
    document.getElementById('serviceDetail').innerHTML = `
      <h2>${service.name}</h2>
      <img src="${service.image}" style="width: 100%; max-width: 400px;">
      <p>${service.description}</p>
      <p><strong>Price: ${service.price}</strong></p>
    `;
    selectedService = service;
    showSection('detailSection');
  }

  // Back button to go back to Services section
  document.getElementById('backBtn').addEventListener('click', () => {
    showSection('servicesSection');
  });

  // Book Now button
  document.getElementById('bookNowBtn').addEventListener('click', () => {
    if (selectedService) {
      showSection('bookingSection');
    } else {
      alert("Please select a service first.");
    }
  });

  // Booking form submit
  document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const datetime = document.getElementById('bookingDateTime').value;

    if (!selectedService) {
      alert("Please select a service before booking.");
      return;
    }

    const bookingInfo = {
      service: selectedService.name,
      name,
      phone,
      datetime,
      paymentStatus: "Pending"
    };

    saveBooking(bookingInfo);
    showSection('qrCodeSection');
  });

  // Save Booking to Local Storage
  function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  // Load Bookings
  function loadBookings() {
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const viewBookingList = document.getElementById('viewBookingList');
    viewBookingList.innerHTML = bookings.map(b => `
      <div>
        <h3>${b.service}</h3>
        <p>Name: ${b.name}</p>
        <p>Phone: ${b.phone}</p>
        <p>Date & Time: ${b.datetime}</p>
        <p>Payment Status: ${b.paymentStatus}</p>
      </div>
      <hr>
    `).join('');
  }

  // View Booking Tab Click
  document.getElementById('viewBookingTab').addEventListener('click', loadBookings);

  // Confirm Payment
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', function() {
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      const lastBooking = bookings[bookings.length - 1];

      if (!lastBooking) {
        alert("No booking found.");
        return;
      }

      if (lastBooking.paymentStatus === "Paid") {
        alert("The payment has already been confirmed for this booking.");
      } else {
        const paymentStatus = confirm("Have you completed the payment via QR code? Click 'OK' for Yes, 'Cancel' for No.");
        if (paymentStatus) {
          lastBooking.paymentStatus = "Paid";
          alert("Payment confirmed!");
        } else {
          lastBooking.paymentStatus = "Pending";
          alert("Payment still pending.");
        }
        localStorage.setItem('bookings', JSON.stringify(bookings));
        document.getElementById('status').innerText = lastBooking.paymentStatus;
      }
    });
  }

});
