document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       FAQ ACCORDION TOGGLE
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                // Set max-height to scrollHeight for smooth transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       AUTOMATIC HERO CAROUSEL
       ========================================================================== */
    const carouselImages = document.querySelectorAll('.hero-carousel .hero-image');
    const carouselIndicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    const slideDuration = 2000; // Trocar imagem a cada 2.5 segundos

    function nextSlide() {
        if (carouselImages.length === 0) return;

        // Remove active class from current image and indicator
        carouselImages[currentSlide].classList.remove('active');
        if (carouselIndicators.length > currentSlide) {
            carouselIndicators[currentSlide].classList.remove('active');
        }

        // Increment slide index
        currentSlide = (currentSlide + 1) % carouselImages.length;

        // Add active class to next image and indicator
        carouselImages[currentSlide].classList.add('active');
        if (carouselIndicators.length > currentSlide) {
            carouselIndicators[currentSlide].classList.add('active');
        }
    }

    // Set auto-advance interval if elements exist
    if (carouselImages.length > 1) {
        setInterval(nextSlide, slideDuration);
    }

    /* ==========================================================================
       FAKE LIVE NOTIFICATIONS MECHANISM
       ========================================================================== */
    const firstNames = [
        'José Roberto', 'Carlos A.', 'Vinícius', 'Lucas M.', 'Thiago',
        'Gustavo R.', 'Felipe S.', 'Ronaldo P.', 'Marcos V.', 'Henrique G.',
        'Matheus K.', 'Gabriel', 'Rodrigo F.', 'Fábio D.', 'André L.',
        'Alexandre', 'Maurício', 'Daniel S.', 'Eduardo M.', 'Bruno C.'
    ];

    const actions = [
        'acabou de assinar o Grupo VIP da Kammilly 🔥',
        'entrou no canal VIP no Telegram 🔞',
        'adquiriu um vídeo personalizado no WhatsApp 💬',
        'liberou o pacote de prévias secretas com 50% desc. 💦',
        'acabou de assinar o VIP Trimestral 💎'
    ];

    const times = [
        'agora mesmo',
        'há 2s',
        'há 5s',
        'há 10s',
        'há 15s'
    ];

    const notificationElement = document.getElementById('live-notification');
    const nameSpan = document.getElementById('notif-name');
    const textNode = document.querySelector('.notification-text');
    const timeSpan = document.querySelector('.notification-time');

    // Web Audio API notification chime generator
    function playNotificationSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;
            
            // G5 note (783.99 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(783.99, now); 
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.12, now + 0.04);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.4);

            // C6 note (1046.50 Hz) - slightly delayed for a pleasant chime
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.50, now + 0.08); 
            gain2.gain.setValueAtTime(0, now + 0.08);
            gain2.gain.linearRampToValueAtTime(0.12, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.6);
        } catch (e) {
            console.warn('Som de notificação bloqueado ou não suportado:', e);
        }
    }

    // Unblock/resume audio context on user interaction
    let audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const tempCtx = new AudioContext();
            if (tempCtx.state === 'suspended') {
                tempCtx.resume();
            }
        }
        audioUnlocked = true;
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    }
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    function showNotification() {
        // Randomize data
        const randomName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];

        // Update content
        textNode.innerHTML = `<strong>${randomName}</strong> ${randomAction}`;
        timeSpan.textContent = randomTime;

        // Slide in
        notificationElement.classList.remove('hidden');
        notificationElement.classList.add('visible');

        // Play chime sound
        playNotificationSound();

         // Stay visible for 3.5 seconds, then slide out
        setTimeout(() => {
            notificationElement.classList.remove('visible');

            // Completely hide after transition finishes (450ms)
            setTimeout(() => {
                notificationElement.classList.add('hidden');
            }, 450);

        }, 3500);
    }

    // First notification appears after 1.5 seconds
    setTimeout(() => {
        showNotification();

        // Show subsequent notifications every 4 to 7 seconds (randomized interval)
        function triggerNext() {
            const nextDelay = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;
            setTimeout(() => {
                showNotification();
                triggerNext();
            }, nextDelay);
        }

        triggerNext();

    }, 1500);
    /* ==========================================================================
       AUTOPLAY VIDEO ON SCROLL (IntersectionObserver)
       ========================================================================== */
    const vslVideo = document.getElementById('vsl-video');
    if (vslVideo) {
        const observerOptions = {
            root: null, // Viewport
            threshold: 0.5 // Trigger when 50% of the video is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    vslVideo.muted = true;
                    vslVideo.play().catch(error => {
                        console.warn("Autoplay foi bloqueado pelo navegador:", error);
                    });
                } else {
                    vslVideo.pause();
                }
            });
        }, observerOptions);

        observer.observe(vslVideo);
    }

});
