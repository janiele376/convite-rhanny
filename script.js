const btnEntrar = document.getElementById('btn-entrar');
const introOverlay = document.getElementById('intro-overlay');
const video = document.getElementById('intro-video');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');

// Iniciar Experiência
btnEntrar.addEventListener('click', () => {
    btnEntrar.style.display = 'none';
    document.querySelector('.intro-text-container').style.display = 'none';
    video.style.opacity = '1';
    video.play();
    bgMusic.play();

    // Transição após o vídeo
    video.onended = () => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.style.animation = 'fadeIn 2s forwards';
        }, 1500);
    };
});

// Contador Regressivo
const target = new Date('May 31, 2026 21:00:00').getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('days').innerText = d;
    document.getElementById('hours').innerText = h;
    document.getElementById('minutes').innerText = m;
    document.getElementById('seconds').innerText = s;
}, 1000);

// Modal de Presentes
const btnGifts = document.getElementById('btn-gifts');
const modal = document.getElementById('gift-modal');
btnGifts.onclick = () => modal.classList.remove('hidden');
document.querySelector('.close-modal').onclick = () => modal.classList.add('hidden');