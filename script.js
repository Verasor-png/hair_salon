// Данные мастеров
const mastersData = [
    {
        id: 'anna',
        name: 'Анна Петрова',
        specialty: 'Специалист по окрашиванию',
        experience: '8 лет опыта',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        services: ['female-haircut', 'single-color', 'balayage', 'highlighting', 'evening-hairstyle']
    },
    {
        id: 'mikhail',
        name: 'Михаил Соколов',
        specialty: 'Барбер / Мужские стрижки',
        experience: '6 лет опыта',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        services: ['male-haircut', 'styling']
    },
    {
        id: 'elena',
        name: 'Елена Волкова',
        specialty: 'Стилист-универсал',
        experience: '10 лет опыта',
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        services: ['female-haircut', 'styling', 'evening-hairstyle', 'hair-mask']
    },
    {
        id: 'olga',
        name: 'Ольга Новикова',
        specialty: 'Специалист по уходу',
        experience: '7 лет опыта',
        image: 'https://images.unsplash.com/photo-1591084728792-2c1a5b5b8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        services: ['keratin', 'botox', 'hair-mask']
    }
];

// Данные доступного времени (для демонстрации)
const timeSlotsData = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00'
];

// Занятые слоты (для демонстрации)
const bookedSlots = ['12:00', '14:30', '16:00', '18:30'];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    // Отображение мастеров
    displayMasters();
    
    // Отображение опций выбора мастеров в форме
    displayMastersOptions();
    
    // Инициализация выбора даты (устанавливаем минимальную дату на сегодня)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Обработчик изменения услуги
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', (e) => {
            updateMastersByService(e.target.value);
        });
    }
    
    // Обработчик изменения даты
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            updateTimeSlots();
        });
    }
    
    // Инициализация выбора мастера
    updateMastersByService('');
    
    // Инициализация временных слотов
    updateTimeSlots();
    
    // Обработка отправки формы
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Мобильное меню
    initMobileMenu();
});

// Отображение карточек мастеров
function displayMasters() {
    const mastersGrid = document.getElementById('mastersGrid');
    if (!mastersGrid) return;
    
    mastersGrid.innerHTML = mastersData.map(master => `
        <div class="master-card">
            <img src="${master.image}" alt="${master.name}" class="master-image">
            <div class="master-info">
                <h3 class="master-name">${master.name}</h3>
                <p class="master-specialty">${master.specialty}</p>
                <p class="master-experience">${master.experience}</p>
            </div>
        </div>
    `).join('');
}

// Отображение опций выбора мастеров в форме
function displayMastersOptions() {
    const mastersOptions = document.getElementById('mastersOptions');
    if (!mastersOptions) return;
    
    mastersOptions.innerHTML = mastersData.map(master => `
        <label class="master-option">
            <input type="radio" name="master" value="${master.id}" data-services='${JSON.stringify(master.services)}'>
            <span>${master.name}</span>
        </label>
    `).join('');
    
    // Добавляем опцию "Любой мастер"
    const anyMasterOption = document.createElement('label');
    anyMasterOption.className = 'master-option';
    anyMasterOption.innerHTML = `
        <input type="radio" name="master" value="any" checked>
        <span>Любой мастер</span>
    `;
    mastersOptions.appendChild(anyMasterOption);
}

// Обновление списка мастеров в зависимости от выбранной услуги
function updateMastersByService(selectedService) {
    const masterOptions = document.querySelectorAll('.master-option');
    
    if (!selectedService) {
        // Если услуга не выбрана, показываем всех мастеров
        masterOptions.forEach(option => {
            option.style.display = 'flex';
        });
        return;
    }
    
    masterOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.value === 'any') {
            option.style.display = 'flex';
            return;
        }
        
        const master = mastersData.find(m => m.id === radio.value);
        if (master && master.services.includes(selectedService)) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
    
    // Если выбранный мастер скрыт, сбрасываем выбор
    const selectedMaster = document.querySelector('input[name="master"]:checked');
    if (selectedMaster && selectedMaster.value !== 'any') {
        const selectedOption = selectedMaster.closest('.master-option');
        if (selectedOption && selectedOption.style.display === 'none') {
            document.querySelector('input[name="master"][value="any"]').checked = true;
        }
    }
}

// Обновление временных слотов
function updateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    const selectedDate = document.getElementById('date')?.value;
    const selectedMaster = document.querySelector('input[name="master"]:checked')?.value;
    
    // Здесь можно добавить логику загрузки расписания для конкретного мастера и даты
    // Для демонстрации используем статический список с занятыми слотами
    
    timeSlotsContainer.innerHTML = timeSlotsData.map(time => {
        const isBooked = bookedSlots.includes(time);
        const disabledClass = isBooked ? 'disabled' : '';
        
        return `
            <div class="time-slot ${disabledClass}" data-time="${time}" onclick="selectTimeSlot(this)">
                ${time}
            </div>
        `;
    }).join('');
    
    // Сбрасываем выбранное время
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    if (selectedTimeSlot) {
        selectedTimeSlot.classList.remove('selected');
    }
}

// Выбор временного слота
function selectTimeSlot(element) {
    if (element.classList.contains('disabled')) return;
    
    // Удаляем выделение с предыдущего слота
    const currentSelected = document.querySelector('.time-slot.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }
    
    // Выделяем новый слот
    element.classList.add('selected');
}

// Обработка отправки формы
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Сбор данных из формы
    const service = document.getElementById('service')?.value;
    const serviceSelect = document.getElementById('service');
    const serviceText = serviceSelect?.options[serviceSelect.selectedIndex]?.text;
    
    const selectedMaster = document.querySelector('input[name="master"]:checked');
    let masterText = 'Любой мастер';
    if (selectedMaster && selectedMaster.value !== 'any') {
        const master = mastersData.find(m => m.id === selectedMaster.value);
        masterText = master ? master.name : 'Любой мастер';
    }
    
    const date = document.getElementById('date')?.value;
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    const time = selectedTimeSlot ? selectedTimeSlot.dataset.time : null;
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('phone')?.value;
    
    // Валидация
    if (!service) {
        alert('Пожалуйста, выберите услугу');
        return;
    }
    
    if (!date) {
        alert('Пожалуйста, выберите дату');
        return;
    }
    
    if (!time) {
        alert('Пожалуйста, выберите время');
        return;
    }
    
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    if (!phone) {
        alert('Пожалуйста, введите телефон');
        return;
    }
    
    // Формирование сообщения о записи
    const bookingMessage = `
        ✅ Запись успешно создана!
        
        📋 Детали записи:
        👤 Имя: ${name}
        📞 Телефон: ${phone}
        ✂️ Услуга: ${serviceText}
        💇 Мастер: ${masterText}
        📅 Дата: ${date}
        ⏰ Время: ${time}
        
        Мы ждем вас в нашем салоне!
    `;
    
    alert(bookingMessage);
    
    // Здесь можно добавить отправку данных на сервер
    console.log('Запись:', {
        service,
        master: selectedMaster?.value,
        date,
        time,
        name,
        phone
    });
    
    // Сброс выбранного времени
    const currentSelected = document.querySelector('.time-slot.selected');
    if (currentSelected) {
        currentSelected.classList.remove('selected');
    }
    
    // Опционально: сброс формы
    // document.getElementById('bookingForm').reset();
}

// Инициализация мобильного меню
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрываем меню при клике на ссылку
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Плавный скролл для всех якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Высота фиксированной шапки
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Экспорт функции выбора времени в глобальную область
window.selectTimeSlot = selectTimeSlot;