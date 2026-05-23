// --- CONFIGURAÇÃO INICIAL ---
const btnEntrar = document.getElementById('btn-entrar');
const introOverlay = document.getElementById('intro-overlay');
const video = document.getElementById('intro-video');
const mainContent = document.getElementById('main-content');

// --- TRANSIÇÃO DE INTRO ---
btnEntrar.addEventListener('click', () => {
    btnEntrar.style.pointerEvents = 'none';
    video.style.opacity = '1';
    
    // O navegador permite áudio apenas após interação do usuário.
    // Garantimos que o vídeo toque com som desde o clique.
    video.muted = false; 
    video.play().catch(e => console.error("Erro ao reproduzir vídeo:", e));

    // Quando o vídeo terminar, ocultamos a intro e revelamos o convite
    video.onended = () => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, 800);
    };
});

// --- CONTADOR REGRESSIVO ---
const target = new Date('July 31, 2026 19:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = target - now;
    
    // Se o evento passou, exibe 00 para evitar erros
    if (diff < 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        return;
    }
    
    document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}

// Atualiza o contador a cada segundo
setInterval(updateCountdown, 1000);
updateCountdown();

// --- LÓGICA DO MODAL (CAIXA DE MIMOS) ---
const btnGifts = document.getElementById('btn-gifts');
const modalMimos = document.getElementById('modal-mimos'); 
const btnFechar = document.getElementById('btn-fechar');

// Abrir Modal
if (btnGifts && modalMimos) {
    btnGifts.addEventListener('click', (e) => {
        e.preventDefault();
        modalMimos.classList.remove('hidden');
    });
}

// Fechar Modal pelo X
if (btnFechar) {
    btnFechar.addEventListener('click', () => {
        modalMimos.classList.add('hidden');
    });
}

// Fechar Modal clicando no fundo escuro (fora da caixa)
window.addEventListener('click', (e) => {
    if (e.target === modalMimos) {
        modalMimos.classList.add('hidden');
    }
});

