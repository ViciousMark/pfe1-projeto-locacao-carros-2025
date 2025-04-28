document.addEventListener('DOMContentLoaded', () => {
  const rentalsContainer = document.getElementById('rentalsList');
  const rentalModal = document.getElementById('rentalModal');
  const editModal = document.getElementById('editModal');
  const closeModals = document.querySelectorAll('.close-modal');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editRentalForm = document.getElementById('editRentalForm');
  const cancelRentalBtn = document.getElementById('cancelRentalBtn');

  let currentRental = null;
  let rentals = [];

  init();

  async function init() {
    await loadRentals();
    setupEventListeners();
    renderRentals();
  }

  async function loadRentals() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      rentals = [
        {
          id: 1,
          car: {
            id: 2,
            modelo: "HB20 Vision",
            marca: "Hyundai",
            ano: 2023,
            imagem: "hb20.png",
            valor_diaria: 150.00
          },
          dates: {
            pickup: "2025-06-15",
            return: "2025-06-20"
          },
          status: "active",
          total: 750.00
        },
        {
          id: 2,
          car: {
            id: 4,
            modelo: "Corolla XEi",
            marca: "Toyota",
            ano: 2022,
            imagem: "corolla.png",
            valor_diaria: 250.00
          },
          dates: {
            pickup: "2025-07-10",
            return: "2025-07-15"
          },
          status: "pending",
          total: 1250.00
        },
        {
          id: 3,
          car: {
            id: 3,
            modelo: "Renegade Longitude",
            marca: "Jeep",
            ano: 2023,
            imagem: "renegade.png",
            valor_diaria: 210.00
          },
          dates: {
            pickup: "2025-05-01",
            return: "2025-05-05"
          },
          status: "completed",
          total: 840.00
        }
      ];
    } catch (error) {
      console.error("Erro ao carregar locações:", error);
      rentals = [];
    }
  }

  function setupEventListeners() {
    closeModals.forEach(btn => {
      btn.addEventListener('click', () => {
        rentalModal.style.display = 'none';
        editModal.style.display = 'none';
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === rentalModal) rentalModal.style.display = 'none';
      if (e.target === editModal) editModal.style.display = 'none';
    });

    cancelEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
    });

    editRentalForm.addEventListener('submit', handleEditRental);

    cancelRentalBtn.addEventListener('click', handleCancelRental);
  }

  function renderRentals() {
    rentalsContainer.innerHTML = '';

    if (rentals.length === 0) {
      rentalsContainer.innerHTML = '<p>Você não possui locações cadastradas.</p>';
      return;
    }

    rentals.forEach(rental => {
      const rentalCard = document.createElement('div');
      rentalCard.className = 'rental-card';
      
      const statusClass = getStatusClass(rental.status);
      const statusText = getStatusText(rental.status);
      
      rentalCard.innerHTML = `
        <div class="rental-info">
          <div class="rental-model">${rental.car.marca} ${rental.car.modelo}</div>
          <div class="rental-dates">
            ${formatDate(rental.dates.pickup)} - ${formatDate(rental.dates.return)}
          </div>
          <div class="rental-status ${statusClass}">${statusText}</div>
        </div>
        <div class="rental-car">
          <img src="../assets/images/${rental.car.imagem}" alt="${rental.car.modelo}" onerror="this.src='../assets/images/default-car.png'">
        </div>
        <div class="rental-actions">
          <button class="button view-details" data-id="${rental.id}">Detalhes</button>
        </div>
      `;
      
      rentalsContainer.appendChild(rentalCard);
    });

    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rentalId = e.target.getAttribute('data-id');
        showRentalDetails(rentalId);
      });
    });
  }

  function showRentalDetails(rentalId) {
    currentRental = rentals.find(r => r.id == rentalId);
    if (!currentRental) return;

    document.getElementById('modalRentalId').textContent = currentRental.id;
    document.getElementById('modalRentalStatus').textContent = getStatusText(currentRental.status);
    document.getElementById('modalRentalStatus').className = getStatusClass(currentRental.status);
    document.getElementById('modalRentalPickup').textContent = formatDate(currentRental.dates.pickup);
    document.getElementById('modalRentalReturn').textContent = formatDate(currentRental.dates.return);
    document.getElementById('modalRentalTotal').textContent = `R$ ${currentRental.total.toFixed(2)}`;
    
    document.getElementById('modalRentalCarModel').textContent = currentRental.car.modelo;
    document.getElementById('modalRentalCarMake').textContent = currentRental.car.marca;
    document.getElementById('modalRentalCarYear').textContent = currentRental.car.ano;
    
    const carImage = document.getElementById('modalRentalCarImage');
    carImage.src = `../assets/images/${currentRental.car.imagem}`;
    carImage.onerror = () => carImage.src = '../assets/images/default-car.png';

    rentalModal.style.display = 'block';
    
    cancelRentalBtn.style.display = ['active', 'pending'].includes(currentRental.status) ? 'block' : 'none';
  }

  function handleEditRental(e) {
    e.preventDefault();
    
    const newPickup = document.getElementById('editPickupDate').value;
    const newReturn = document.getElementById('editReturnDate').value;
    
    if (!newPickup || !newReturn) {
      alert('Por favor, preencha ambas as datas.');
      return;
    }
    
    currentRental.dates.pickup = newPickup;
    currentRental.dates.return = newReturn;
    currentRental.total = calculateTotal(currentRental.car.valor_diaria, newPickup, newReturn);
    
    editModal.style.display = 'none';
    renderRentals();
    
    alert('Reserva atualizada com sucesso!');
  }

  function handleCancelRental() {
    if (!currentRental) return;
    
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      currentRental.status = 'cancelled';
      rentalModal.style.display = 'none';
      renderRentals();
      alert('Reserva cancelada com sucesso.');
    }
  }

  function getStatusClass(status) {
    const classes = {
      'active': 'status-active',
      'pending': 'status-pending',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  function getStatusText(status) {
    const texts = {
      'active': 'Ativa',
      'pending': 'Pendente',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return texts[status] || status;
  }

  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  function calculateTotal(dailyPrice, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return dailyPrice * days;
  }
});