document.addEventListener('DOMContentLoaded', async () => {
    const featuredCarsContainer = document.getElementById('featuredCars');
    const modal = document.getElementById('carModal');
    const closeModal = document.querySelector('.close-modal');
    const rentButton = document.querySelector('.rent-button');
    const searchForm = document.getElementById('searchForm');
  
    let cars = [];
    let currentCar = null;
  
    async function init() {
      await loadCars();
      setupEventListeners();
      renderCarCards(cars);
    }

    async function loadCars() {
      try {
        const response = await fetch('../assets/dados.json');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        cars = await response.json();
      } catch (error) {
        console.error('Erro ao carregar carros:', error);
        cars = getFallbackCars();
      }
    }
  
    function getFallbackCars() {
      return [
        {
          id: 1,
          modelo: "Onix LT 1.0",
          marca: "Chevrolet",
          ano: 2022,
          imagem: "onix.png",
          combustivel: "Flex",
          portas: 4,
          transmissao: "Manual",
          valor_diaria: 120.00
        },
        {
          id: 2,
          modelo: "HB20 Vision",
          marca: "Hyundai",
          ano: 2023,
          imagem: "hb20.png",
          combustivel: "Flex",
          portas: 4,
          transmissao: "Automático",
          valor_diaria: 150.00
        },
        {
          id: 3,
          modelo: "Renegade Longitude",
          marca: "Jeep",
          ano: 2023,
          imagem: "renegade.png",
          combustivel: "Gasolina",
          portas: 4,
          transmissao: "Automático",
          valor_diaria: 210.00
        }
      ];
    }
  
    function setupEventListeners() {
      closeModal.addEventListener('click', () => modal.style.display = 'none');
      
      window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
      
      rentButton.addEventListener('click', handleRentCar);
    
      searchForm.addEventListener('submit', handleSearch);
      
      document.getElementById('exploreBtn')?.addEventListener('click', () => {
        document.querySelector('.search').scrollIntoView({ behavior: 'smooth' });
      });
    }
  
    function renderCarCards(carsToRender) {
      featuredCarsContainer.innerHTML = '';
      
      carsToRender.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
          <img src="../assets/images/${car.imagem}" alt="${car.modelo}" onerror="this.src='../assets/images/default-car.png'">
          <div class="car-info">
            <h3>${car.modelo}</h3>
            <p class="car-make">${car.marca}</p>
            <p class="car-year">${car.ano}</p>
            <p class="car-price">R$ ${car.valor_diaria.toFixed(2)} <span>/dia</span></p>
            <button class="button view-details" data-id="${car.id}">View Details</button>
          </div>
        `;
        featuredCarsContainer.appendChild(carCard);
      });
  
      document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
          const carId = e.target.getAttribute('data-id');
          currentCar = cars.find(c => c.id == carId);
          showCarDetails(currentCar);
        });
      });
    }
  
    function showCarDetails(car) {
      if (!car) return;
    
      document.getElementById('modalCarModel').textContent = car.modelo;
      document.getElementById('modalCarMake').textContent = car.marca;
      
      const carImage = document.getElementById('modalCarImage');
      carImage.src = `../assets/images/${car.imagem}`;
      carImage.onerror = () => carImage.src = '../assets/images/default-car.png';
      
      document.getElementById('modalCarColor').textContent = getRandomColor();
      document.getElementById('modalCarMileage').textContent = getRandomMileage();
      document.getElementById('modalCarTransmission').textContent = translateTransmission(car.transmissao);
      document.getElementById('modalCarFuel').textContent = translateFuelType(car.combustivel);
      document.getElementById('modalCarDoors').textContent = `${car.portas} portas`;
      document.getElementById('modalCarPrice').textContent = `R$ ${car.valor_diaria.toFixed(2)}`;
    
      modal.style.display = 'block';
    }
  
    function handleRentCar() {
      if (!currentCar) return;
      
      const pickupDate = document.getElementById('pickupDate').value;
      const returnDate = document.getElementById('returnDate').value;
      
      if (!pickupDate || !returnDate) {
        alert('Por favor, selecione as datas de retirada e devolução primeiro.');
        modal.style.display = 'none';
        document.querySelector('.search').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      
      alert(`Você alugou um ${currentCar.marca} ${currentCar.modelo}\n\nPeríodo: ${pickupDate} a ${returnDate}\nValor total: R$ ${calculateTotalPrice(currentCar.valor_diaria, pickupDate, returnDate).toFixed(2)}`);
      
      modal.style.display = 'none';
      currentCar = null;
    }
  
    function handleSearch(e) {
      e.preventDefault();
      const pickupDate = document.getElementById('pickupDate').value;
      const returnDate = document.getElementById('returnDate').value;
      
      if (!pickupDate || !returnDate) {
        alert('Por favor, selecione as datas de retirada e devolução.');
        return;
      }
      
      const filteredCars = cars.filter(car => car.disponivel !== false);
      renderCarCards(filteredCars);
      
      alert(`Mostrando carros disponíveis para ${pickupDate} até ${returnDate}`);
    }
  
    function getRandomColor() {
      const colors = ['Prata', 'Preto', 'Branco', 'Cinza', 'Vermelho', 'Azul', 'Verde'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  
    function getRandomMileage() {
      return `${Math.floor(Math.random() * 50) + 5}.000 km`;
    }
  
    function translateTransmission(transmission) {
      return transmission === 'Automático' ? 'Automático' : 'Manual';
    }
  
    function translateFuelType(fuel) {
      const translations = {
        'Gasolina': 'Gasolina',
        'Flex': 'Flex (Álcool/Gasolina)',
        'Diesel': 'Diesel'
      };
      return translations[fuel] || fuel;
    }
  
    function calculateTotalPrice(dailyPrice, startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      return dailyPrice * days;
    }


function handleRentCar() {
  if (!currentCar) return;
  
  const pickupDate = document.getElementById('pickupDate').value;
  const returnDate = document.getElementById('returnDate').value;
  
  if (!pickupDate || !returnDate) {
      alert('Por favor, selecione as datas de retirada e devolução primeiro.');
      modal.style.display = 'none';
      document.querySelector('.search').scrollIntoView({ behavior: 'smooth' });
      return;
  }
  
  const newRental = {
      id: Date.now(),
      car: currentCar,
      dates: {
          pickup: pickupDate,
          return: returnDate
      },
      status: "pending",
      total: calculateTotalPrice(currentCar.valor_diaria, pickupDate, returnDate)
  };
  
  saveRental(newRental);
  
  alert(`Você alugou um ${currentCar.marca} ${currentCar.modelo}\n\nPeríodo: ${pickupDate} a ${returnDate}\nValor total: R$ ${newRental.total.toFixed(2)}`);
  
  modal.style.display = 'none';
  currentCar = null;
}

function saveRental(rental) {
  let rentals = JSON.parse(localStorage.getItem('carRentals') || '[]');
  rentals.push(rental);
  localStorage.setItem('carRentals', JSON.stringify(rentals));
}

rentButton.addEventListener('click', handleRentCar);
  
    init();
  });