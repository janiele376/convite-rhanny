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

// --- LÓGICA DE INTRO ---
const jaViuIntro = localStorage.getItem('introVisualizada');

if (jaViuIntro) {
    if (introOverlay) introOverlay.style.display = 'none';
    if (mainContent) mainContent.classList.remove('hidden');
} else if (btnEntrar) {
    btnEntrar.addEventListener('click', () => {
        iniciarVideoIntro();
    });
}

function iniciarVideoIntro() {
    if (!video || !introOverlay || !mainContent) return;
    if (btnEntrar) btnEntrar.style.pointerEvents = 'none';
    
    introOverlay.style.display = 'flex';
    introOverlay.style.opacity = '1';
    video.style.opacity = '1';
    video.muted = false; 
    video.currentTime = 0; 
    video.play().catch(e => console.error("Erro ao tocar vídeo:", e));

    video.onended = () => {
        localStorage.setItem('introVisualizada', 'true');
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            
            const areaBotoes = document.querySelector('.actions-container');
            if (areaBotoes) {
                areaBotoes.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (btnEntrar) btnEntrar.style.pointerEvents = 'auto';
        }, 800);
    };
}

// --- REPLAY ---
btnReplayVideo?.addEventListener('click', () => {
    if (mainContent) mainContent.classList.add('hidden');
    if (introOverlay) {
        introOverlay.style.display = 'flex';
        introOverlay.style.opacity = '1';
    }
    if (video) {
        video.style.opacity = '0';
        video.pause();
        video.currentTime = 0;
    }
    if (btnEntrar) btnEntrar.style.pointerEvents = 'auto';
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
const fecharModal = () => modalMimos.classList.add('hidden');
btnFechar?.addEventListener('click', fecharModal);

// --- GERADOR PIX REAL ---
function gerarPayloadPix(valor) {
    const f = (id, valorCampo) => {
        const tam = valorCampo.length.toString().padStart(2, '0');
        return `${id}${tam}${valorCampo}`;
    };

    const valorStr = valor.toFixed(2);
    const subChavePix = f("00", "br.gov.bcb.pix") + f("01", CHAVE_PIX);

    let payload = f("00", "01") + 
                  f("26", subChavePix) + 
                  f("52", "0000") + 
                  f("53", "986") + 
                  f("54", valorStr) + 
                  f("58", "BR") + 
                  f("59", NOME_RECEBEDOR) + 
                  f("60", CIDADE_RECEBEDOR) + 
                  f("62", f("05", "***")) + 
                  "6304";

    function calcularCRC16(dados) {
        let crc = 0xFFFF;
        for (let i = 0; i < dados.length; i++) {
            crc ^= dados.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : (crc << 1);
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    return payload + calcularCRC16(payload);
}

btnGerarPix?.addEventListener('click', () => {
    const valor = parseFloat(inputValor.value);
    if (isNaN(valor) || valor < 100) {
        alert("🦋 Por favor, insira um valor a partir de R$ 100,00 💜");
        return;
    }
    pixCode.innerText = gerarPayloadPix(valor);
    areaPix.classList.remove('hidden');
});

// --- CLICAR PARA COPIAR (MELHORADO) ---
pixCode?.addEventListener('click', () => {
    const texto = pixCode.innerText;
    if (texto.includes("COPIADO")) return;

    // Tenta usar a API moderna, se falhar usa o método antigo
    const copyAction = async () => {
        try {
            await navigator.clipboard.writeText(texto);
        } catch (err) {
            const el = document.createElement('textarea');
            el.value = texto;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        
        pixCode.innerText = "COPIADO! 🦋✨";
        pixCode.style.background = "#28a745";
        pixCode.style.color = "white";
        setTimeout(() => {
            pixCode.innerText = texto;
            pixCode.style.background = "white";
            pixCode.style.color = "black";
        }, 2000);
    };
    copyAction();
});