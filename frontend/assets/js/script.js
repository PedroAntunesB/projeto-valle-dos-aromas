// ===================================
// Navegação Suave e Menu Mobile
// ===================================

// Menu Mobile Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('#nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Header com efeito ao rolar
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.padding = '0.8rem 0';
        header.style.boxShadow = '0 4px 30px rgba(45, 95, 63, 0.15)';
    } else {
        header.style.padding = '1.2rem 0';
        header.style.boxShadow = '0 2px 20px rgba(45, 95, 63, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Sistema de Calendário Interativo
// ===================================

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDates = {
            checkIn: null,
            checkOut: null
        };
        this.isSelectingCheckOut = false;
        
        this.calendarContainer = document.getElementById('calendar-container');
        this.calendarGrid = document.getElementById('calendar-grid');
        this.monthYearDisplay = document.getElementById('calendar-month-year');
        this.checkInInput = document.getElementById('check-in');
        this.checkOutInput = document.getElementById('check-out');
        
        this.init();
    }
    
    init() {
        // Botões de navegação do calendário
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });
        
        // Mostrar calendário ao clicar nos inputs
        this.checkInInput.addEventListener('click', () => {
            this.isSelectingCheckOut = false;
            this.calendarContainer.classList.add('active');
            this.render();
        });
        
        this.checkOutInput.addEventListener('click', () => {
            if (this.selectedDates.checkIn) {
                this.isSelectingCheckOut = true;
                this.calendarContainer.classList.add('active');
                this.render();
            }
        });
        
        this.render();
    }
    
    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Atualizar título
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        this.monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        // Limpar grid
        this.calendarGrid.innerHTML = '';
        
        // Adicionar nomes dos dias
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day day-name';
            dayElement.textContent = day;
            this.calendarGrid.appendChild(dayElement);
        });
        
        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1).getDay();
        
        // Adicionar células vazias
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day disabled';
            this.calendarGrid.appendChild(emptyCell);
        }
        
        // Dias do mês
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDayDate = new Date(year, month, day);
            currentDayDate.setHours(0, 0, 0, 0);
            
            // Desabilitar datas passadas
            if (currentDayDate < today) {
                dayElement.classList.add('disabled');
            } else {
                // Verificar se é data selecionada
                if (this.selectedDates.checkIn && 
                    this.isSameDay(currentDayDate, this.selectedDates.checkIn)) {
                    dayElement.classList.add('selected');
                }
                
                if (this.selectedDates.checkOut && 
                    this.isSameDay(currentDayDate, this.selectedDates.checkOut)) {
                    dayElement.classList.add('selected');
                }
                
                // Verificar se está no intervalo
                if (this.selectedDates.checkIn && this.selectedDates.checkOut) {
                    if (currentDayDate > this.selectedDates.checkIn && 
                        currentDayDate < this.selectedDates.checkOut) {
                        dayElement.classList.add('in-range');
                    }
                }
                
                // Adicionar evento de clique
                dayElement.addEventListener('click', () => {
                    this.selectDate(currentDayDate);
                });
            }
            
            this.calendarGrid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        if (!this.isSelectingCheckOut) {
            // Selecionando check-in
            this.selectedDates.checkIn = date;
            this.selectedDates.checkOut = null;
            this.checkInInput.value = this.formatDate(date);
            this.checkOutInput.value = '';
            this.isSelectingCheckOut = true;
        } else {
            // Selecionando check-out
            if (date > this.selectedDates.checkIn) {
                this.selectedDates.checkOut = date;
                this.checkOutInput.value = this.formatDate(date);
                
                // Fechar calendário após selecionar ambas as datas
                setTimeout(() => {
                    this.calendarContainer.classList.remove('active');
                }, 300);
            } else {
                // Se a data for anterior ao check-in, reiniciar seleção
                this.selectedDates.checkIn = date;
                this.selectedDates.checkOut = null;
                this.checkInInput.value = this.formatDate(date);
                this.checkOutInput.value = '';
            }
        }
        
        this.render();
    }
    
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
}

// Inicializar calendário
const calendar = new Calendar();

// ===================================
// Sistema de Reservas
// ===================================

const checkAvailabilityBtn = document.getElementById('check-availability');

checkAvailabilityBtn.addEventListener('click', () => {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    
    if (!checkIn || !checkOut) {
        showNotification('Por favor, selecione as datas de check-in e check-out.', 'warning');
        return;
    }
    
    // Calcular número de noites
    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    showNotification(
        `Ótima escolha! Encontramos quartos disponíveis para ${nights} noite(s) com ${guests} hóspede(s). 
        Nossa equipe entrará em contato em breve para confirmar sua reserva.`,
        'success'
    );
});

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

// ===================================
// Sistema de Notificações
// ===================================

function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        background-color: white;
        padding: 1.5rem;
        border-radius: 4px;
        box-shadow: 0 10px 40px rgba(45, 95, 63, 0.2);
        z-index: 10000;
        animation: slideIn 0.4s ease;
        border-left: 4px solid ${type === 'success' ? '#2d5f3f' : type === 'warning' ? '#9b7ba7' : '#4a7c59'};
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
    `;
    
    const notificationText = notification.querySelector('p');
    notificationText.style.cssText = `
        margin: 0;
        color: #4a5550;
        font-size: 1rem;
        line-height: 1.6;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #a8b0ac;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
    `;
    
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.color = '#2d5f3f';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.color = '#a8b0ac';
    });
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    });
    
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Galeria com Lightbox
// ===================================

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt;
        openLightbox(imgSrc, imgAlt);
    });
});

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="${alt}">
            <p class="lightbox-caption">${alt}</p>
        </div>
    `;
    
    // Estilos do lightbox
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(26, 31, 29, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
        cursor: pointer;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        cursor: default;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        border-radius: 4px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    const caption = lightbox.querySelector('.lightbox-caption');
    caption.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 1rem;
        font-size: 1.2rem;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    `;
    
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.transform = 'scale(1.2)';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.transform = 'scale(1)';
    });
    
    // Fechar ao clicar no fundo
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });
    
    // Fechar ao clicar no botão
    closeBtn.addEventListener('click', () => {
        closeLightbox(lightbox);
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    document.body.appendChild(lightbox);
}

function closeLightbox(lightbox) {
    lightbox.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => lightbox.remove(), 300);
}

// Adicionar animação de fade
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeStyle);

// ===================================
// Animações ao Scroll
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
const animatedElements = document.querySelectorAll('.content-text, .content-images, .room-card, .gallery-item, .section-header');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Inicialização
// ===================================

console.log('Villa Verde Luxury Resort - Site carregado com sucesso! ✨');
