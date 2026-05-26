// --- CONFIGURAÇÕES DO PIX ---
const CHAVE_PIX = "+5585988075559"; 
const NOME_RECEBEDOR = "DAIANE";          
const CIDADE_RECEBEDOR = "FORTALEZA";       

// --- SELETORES GERAIS ---
const btnEntrar = document.getElementById('btn-entrar');
const introOverlay = document.getElementById('intro-overlay');
const video = document.getElementById('intro-video');
const mainContent = document.getElementById('main-content');
const btnGifts = document.getElementById('btn-gifts');
const modalMimos = document.getElementById('modal-mimos'); 
const btnFechar = document.getElementById('btn-fechar');
const btnGerarPix = document.getElementById('btn-gerar-pix');
const inputValor = document.getElementById('valor-pix');
const areaPix = document.getElementById('area-pix');
const pixCode = document.getElementById('pix-code');
const btnReplayVideo = document.getElementById('btn-replay-video'); 

// --- LÓGICA DE INTRO (SÓ EXECUTA NO PRIMEIRO ACESSO) ---
const jaViuIntro = localStorage.getItem('introVisualizada');

if (jaViuIntro) {
    if (introOverlay) introOverlay.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
}

// Vincula o evento de clique uma única vez para o botão de entrada
btnEntrar?.addEventListener('click', iniciarVideoIntro);

function iniciarVideoIntro() {
    if (!video || !introOverlay || !mainContent) return;
    
    // Desativa o clique para não bugar durante o vídeo
    btnEntrar.style.pointerEvents = 'none';
    
    // Configurações do vídeo
    video.currentTime = 0; 
    video.muted = false; 
    video.style.opacity = '1';
    introOverlay.style.opacity = '1';
    
    video.play().catch(e => {
        console.error("Erro ao tocar vídeo:", e);
        encerrarVideo(); // Pula se der erro
    });

    video.onended = encerrarVideo;
}

function encerrarVideo() {
    localStorage.setItem('introVisualizada', 'true');
    if (introOverlay) introOverlay.style.opacity = '0';
    
    setTimeout(() => {
        if (introOverlay) introOverlay.style.display = 'none';
        if (mainContent) mainContent.classList.remove('hidden');
        
        const areaBotoes = document.querySelector('.actions-container');
        if (areaBotoes) {
            areaBotoes.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Libera o botão novamente para um futuro replay
        if (btnEntrar) btnEntrar.style.pointerEvents = 'auto';
    }, 800);
}

// --- REPLAY (VOLTAR PARA O INÍCIO) ---
btnReplayVideo?.addEventListener('click', () => {
    // 1. Esconde o convite
    if (mainContent) mainContent.classList.add('hidden');
    
    // 2. Reseta a Intro
    if (introOverlay) {
        introOverlay.style.display = 'flex';
        introOverlay.style.opacity = '1';
    }
    
    // 3. Garante que o vídeo esteja oculto e pronto
    if (video) {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = '0';
    }

    // 4. FORÇA O BOTÃO INVISÍVEL A SER CLICÁVEL NOVAMENTE
    if (btnEntrar) {
        btnEntrar.style.pointerEvents = 'auto';
        btnEntrar.style.display = 'block';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- CONTADOR ---
const targetDate = new Date('July 31, 2026 19:30:00').getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff < 0) return;
    document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);

// --- MODAL ---
btnGifts?.addEventListener('click', (e) => { e.preventDefault(); modalMimos.classList.remove('hidden'); });
btnFechar?.addEventListener('click', () => modalMimos.classList.add('hidden'));

// --- GERADOR PIX REAL ---
function gerarPayloadPix(valor) {
    const f = (id, v) => id + v.length.toString().padStart(2, '0') + v;
    const valorStr = valor.toFixed(2);
    const subChave = f("00", "br.gov.bcb.pix") + f("01", CHAVE_PIX);
    let payload = f("00", "01") + f("26", subChave) + f("52", "0000") + f("53", "986") + f("54", valorStr) + f("58", "BR") + f("59", NOME_RECEBEDOR) + f("60", CIDADE_RECEBEDOR) + f("62", f("05", "***")) + "6304";
    function crc16(d) {
        let c = 0xFFFF;
        for (let i = 0; i < d.length; i++) {
            c ^= d.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) c = (c & 0x8000) ? (c << 1) ^ 0x1021 : (c << 1);
        }
        return (c & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
    return payload + crc16(payload);
}

btnGerarPix?.addEventListener('click', () => {
    const valor = parseFloat(inputValor.value);
    if (valor >= 100) {
        pixCode.innerText = gerarPayloadPix(valor);
        areaPix.classList.remove('hidden');
    } else { alert("🦋 Valor mínimo R$ 100,00 💜"); }
});

// --- COPIAR ---
pixCode?.addEventListener('click', () => {
    const texto = pixCode.innerText;
    if (texto.includes("COPIADO")) return;
    navigator.clipboard.writeText(texto).then(() => {
        pixCode.innerText = "COPIADO! 🦋✨";
        setTimeout(() => pixCode.innerText = texto, 2000);
    });
});