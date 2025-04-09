console.log('script.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    // Модальные окна
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackModal = document.getElementById('callbackModal');
    const closeCallbackModal = document.getElementById('closeCallbackModal');
    
    const consultationBtns = document.querySelectorAll('#consultationBtn');
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
    
    // Открытие модального окна для всех кнопок "Получить консультацию"
    consultationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            consultationModal.classList.add('active');
        });
    });

    // Закрытие модального окна
    closeConsultationModal.addEventListener('click', function() {
        consultationModal.classList.remove('active');
    });

    // Закрытие модального окна при клике вне его содержимого
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
    
    // Функция debounce для оптимизации событий
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Универсальная функция для слайдеров
    function initSlider(sliderId, prevBtnId, nextBtnId, interval = 5000) {
        const slider = document.getElementById(sliderId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!slider || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

        const updateSlider = () => {
            const slideWidth = slider.children[0].offsetWidth;
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slider.children.length - 1;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slider.children.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });

        setInterval(() => {
            currentIndex = (currentIndex < slider.children.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        }, interval);

        window.addEventListener('resize', debounce(updateSlider, 200));
    }

    // Инициализация слайдеров
    initSlider('portfolioSlider', 'portfolioPrev', 'portfolioNext');
    initSlider('reviewsSlider', 'reviewsPrev', 'reviewsNext');
    
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
        const submitButton = consultationForm.querySelector('button[type="submit"]');

        const recaptchaContainer = document.querySelector('.g-recaptcha');

        consultationForm.addEventListener('submit', async function(event) {
            const recaptchaResponse = grecaptcha.getResponse();
            const recaptchaError = document.getElementById('recaptchaError');

            if (!recaptchaResponse) {
                event.preventDefault();
                if (!recaptchaError) {
                    const errorElement = document.createElement('div');
                    errorElement.id = 'recaptchaError';
                    errorElement.style.color = 'red';
                    errorElement.style.marginTop = '10px';
                    errorElement.textContent = 'Пожалуйста, пройдите капчу перед отправкой формы.';
                    recaptchaContainer.parentNode.insertBefore(errorElement, recaptchaContainer.nextSibling);
                }
                return;
            }

            if (recaptchaError) {
                recaptchaError.remove();
            }

            const formData = new FormData(consultationForm);
            formData.append('g-recaptcha-response', recaptchaResponse);

            const response = await fetch('data.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Форма успешно отправлена!');
                consultationForm.reset();
                grecaptcha.reset();
            } else {
                alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
            }
        });

        const recaptchaCallback = function() {
            submitButton.disabled = false;
        };

        window.recaptchaCallback = recaptchaCallback;
        submitButton.disabled = true;
    }

    // Добавление обработчиков для кнопок "Заказать" в блоке "типы заборов и цены"
    const priceCardButtons = document.querySelectorAll('.price-card__btn');

    priceCardButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            consultationModal.classList.add('active');

            const materialSelect = consultationForm.querySelector('select[name="var_fence"]');
            if (materialSelect) {
                materialSelect.selectedIndex = index + 1;
            }
        });
    });
});