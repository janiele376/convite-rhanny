// --- CONFIGURAÇÕES DO PIX ---
const CHAVE_PIX = "seu-pix-aqui@email.com"; 
const NOME_RECEBEDOR = "RHAYANNE";          
const CIDADE_RECEBEDOR = "FORTALEZA";       

// --- SELETORES ---
const btnEntrar = document.getElementById('btn-entrar');
const introOverlay = document.getElementById('intro-overlay');
const video = document.getElementById('intro-video');
const mainContent = document.getElementById('main-content');
const btnReplayVideo = document.getElementById('btn-replay-video'); 

// --- FUNÇÃO PARA TOCAR O VÍDEO ---
function iniciarVideoIntro() {
    if (!video || !introOverlay) return;
    
    // Trava o botão para não clicar duas vezes
    if (btnEntrar) btnEntrar.style.pointerEvents = 'none';
    
    video.currentTime = 0;
    video.muted = false;
    video.style.opacity = '1';

    video.play().then(() => {
        console.log("Vídeo iniciado");
    }).catch(e => {
        console.error("Erro no play:", e);
        encerrarVideo(); // Se der erro, pula pro convite
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
    }, 800);
}

// --- LÓGICA INICIAL ---
const jaViuIntro = localStorage.getItem('introVisualizada');
if (jaViuIntro) {
    if (introOverlay) introOverlay.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
}

btnEntrar?.addEventListener('click', iniciarVideoIntro);

// --- O BOTÃO DE VOLTAR (VERSÃO CORRIGIDA) ---
btnReplayVideo?.addEventListener('click', function() {
    console.log("Botão voltar clicado");

    // 1. Força o convite a sumir
    mainContent.classList.add('hidden');

    // 2. Força a intro a aparecer
    introOverlay.style.display = 'flex';
    introOverlay.style.opacity = '1';

    // 3. Reseta o vídeo (deixa ele invisível e pausado)
    video.pause();
    video.currentTime = 0;
    video.style.opacity = '0';

    // 4. LIBERA O BOTÃO INVISÍVEL
    if (btnEntrar) {
        btnEntrar.style.pointerEvents = 'auto';
        btnEntrar.style.display = 'block'; 
    }

    // 5. Sobe a tela
    window.scrollTo(0, 0);
});

// --- RESTANTE DAS FUNÇÕES (CONTADOR E PIX) ---
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

document.getElementById('btn-gifts')?.addEventListener('click', () => document.getElementById('modal-mimos').classList.remove('hidden'));
document.getElementById('btn-fechar')?.addEventListener('click', () => document.getElementById('modal-mimos').classList.add('hidden'));

function gerarPayloadPix(valor) {
    const valorStr = valor.toFixed(2);
    const f = (id, v) => id + v.length.toString().padStart(2, '0') + v;
    let p = f("00", "01") + f("26", f("00", "br.gov.bcb.pix") + f("01", CHAVE_PIX)) + f("52", "0000") + f("53", "986") + f("54", valorStr) + f("58", "BR") + f("59", NOME_RECEBEDOR) + f("60", CIDADE_RECEBEDOR) + f("62", f("05", "15ANOS")) + "6304";
    const crc16 = (d) => {
        let c = 0xFFFF;
        for (let i = 0; i < d.length; i++) {
            c ^= d.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) c = (c & 0x8000) ? (c << 1) ^ 0x1021 : (c << 1);
        }
        return (c & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };
    return p + crc16(p);
}

document.getElementById('btn-gerar-pix')?.addEventListener('click', () => {
    const v = parseFloat(document.getElementById('valor-pix').value);
    if (v >= 100) {
        document.getElementById('pix-code').innerText = gerarPayloadPix(v);
        document.getElementById('area-pix').classList.remove('hidden');
    } else {
        alert("🦋 Valor mínimo R$ 100,00 💜");
    }
});

document.getElementById('pix-code')?.addEventListener('click', function() {
    navigator.clipboard.writeText(this.innerText).then(() => {
        const t = this.innerText;
        this.innerText = "COPIADO! 🦋✨";
        setTimeout(() => this.innerText = t, 2000);
    });
});