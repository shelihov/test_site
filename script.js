document.addEventListener('DOMContentLoaded', function() {
    // Модальные окна
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackModal = document.getElementById('callbackModal');
    const closeCallbackModal = document.getElementById('closeCallbackModal');
    
    const consultationBtn = document.getElementById('consultationBtn');
    const consultationModal = document.getElementById('consultationModal');
    const closeConsultationModal = document.getElementById('closeConsultationModal');
    
    // Открытие и закрытие модального окна для обратного звонка
    if (callbackBtn && callbackModal && closeCallbackModal) {
        callbackBtn.addEventListener('click', function() {
            callbackModal.classList.add('active');
        });
        
        closeCallbackModal.addEventListener('click', function() {
            callbackModal.classList.remove('active');
        });
    }
    
    // Открытие и закрытие модального окна для консультации
    if (consultationBtn && consultationModal && closeConsultationModal) {
        consultationBtn.addEventListener('click', function() {
            consultationModal.classList.add('active');
        });
        
        closeConsultationModal.addEventListener('click', function() {
            consultationModal.classList.remove('active');
        });
    }
    
    // Закрытие модальных окон при клике вне их содержимого
    document.addEventListener('click', function(event) {
        if (callbackModal && callbackModal.classList.contains('active') && 
            !event.target.closest('.modal__content') && !event.target.closest('#callbackBtn')) {
            callbackModal.classList.remove('active');
        }
        
        if (consultationModal && consultationModal.classList.contains('active') && 
            !event.target.closest('.modal__content') && !event.target.closest('#consultationBtn')) {
            consultationModal.classList.remove('active');
        }
    });
    
    // Кнопки "Подробнее" в карточках услуг
    const serviceButtons = document.querySelectorAll('.price-card__btn');
    const modal = document.getElementById('contacts-messager'); // Укажите ID элемента, к которому нужно прокрутить

    if (modal) {
        serviceButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.scrollIntoView({ behavior: 'smooth' }); // Плавная прокрутка к элементу
            });
        });
    }
    
    // Слайдер изображений портфолио
    const portfolioSlider = document.getElementById('portfolioSlider');
    const portfolioPrev = document.getElementById('portfolioPrev');
    const portfolioNext = document.getElementById('portfolioNext');
    
    if (portfolioSlider && portfolioPrev && portfolioNext) {
        const slides = portfolioSlider.querySelectorAll('.portfolio__slide');
        let currentSlide = 0;
        
        
        // Обновляем количество слайдов
        const totalSlides = portfolioSlider.querySelectorAll('.portfolio__slide').length;
        
        // Функция для переключения слайдов
        function showSlide(index) {
            if (index < 0) {
                currentSlide = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }
            
            portfolioSlider.style.transform = `translateX(${-currentSlide * 100}%)`;
        }
        
        // Обработчики событий для кнопок
        portfolioPrev.addEventListener('click', function() {
            showSlide(currentSlide - 1);
        });
        
        portfolioNext.addEventListener('click', function() {
            showSlide(currentSlide + 1);
        });
        
        // Автоматическое переключение слайдов
        setInterval(function() {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    
    // Обработка отправки форм
    const callbackForm = document.getElementById('callbackForm');
    const consultationForm = document.getElementById('consultationForm');
    
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('callbackName').value;
            const phone = document.getElementById('callbackPhone').value;
            
            // В реальном проекте здесь бы отправлялся AJAX-запрос на сервер
            alert(`Спасибо за заявку, ${name}! Мы свяжемся с вами по номеру ${phone} в ближайшее время.`);
            callbackModal.classList.remove('active');
            callbackForm.reset();
        });
    }
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('consultationName').value;
            const phone = document.getElementById('consultationPhone').value;
            const message = document.getElementById('consultationMessage').value;
            
            // В реальном проекте здесь бы отправлялся AJAX-запрос на сервер
            alert(`Спасибо за запрос консультации, ${name}! Мы свяжемся с вами по номеру ${phone} в ближайшее время. Ваш вопрос: "${message || 'Не указан'}" будет передан специалисту.`);
            consultationModal.classList.remove('active');
            consultationForm.reset();
        });
    }
});