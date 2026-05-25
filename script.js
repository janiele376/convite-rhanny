// --- CONFIGURAÇÕES DO PIX ---
const CHAVE_PIX = "seu-pix-aqui@email.com"; // <-- Troque pela sua chave real
const NOME_RECEBEDOR = "RHAYANNE";          // <-- Apenas letras, sem acento
const CIDADE_RECEBEDOR = "FORTALEZA";      // <-- Apenas letras, sem acento

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

// --- LÓGICA DE INTRO (MEMÓRIA DO NAVEGADOR) ---
const jaViuIntro = localStorage.getItem('introVisualizada');

if (jaViuIntro) {
    introOverlay.style.display = 'none';
    mainContent.classList.remove('hidden');
} else if (btnEntrar) {
    btnEntrar.addEventListener('click', () => {
        btnEntrar.style.pointerEvents = 'none';
        video.style.opacity = '1';
        video.muted = false; 
        video.play().catch(e => console.error("Erro ao tocar vídeo:", e));

        video.onended = () => {
            localStorage.setItem('introVisualizada', 'true');
            introOverlay.style.opacity = '0';
            setTimeout(() => {
                introOverlay.style.display = 'none';
                mainContent.classList.remove('hidden');
            }, 800);
        };
    });
}

// --- CONTADOR REGRESSIVO ---
const targetDate = new Date('July 31, 2026 19:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff < 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            document.getElementById(id).innerText = "00";
        });
        return;
    }
    
    document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- LÓGICA DO MODAL ---
btnGifts?.addEventListener('click', (e) => {
    e.preventDefault();
    modalMimos.classList.remove('hidden');
});

const fecharModal = () => modalMimos.classList.add('hidden');
btnFechar?.addEventListener('click', fecharModal);
window.addEventListener('click', (e) => { if (e.target === modalMimos) fecharModal(); });

// --- GERADOR DE CÓDIGO PIX DINÂMICO ---
function gerarPayloadPix(valor) {
    const valorStr = valor.toFixed(2);
    const f = (id, v) => id + v.length.toString().padStart(2, '0') + v;
    
    let payload = f("00", "01") + 
                  f("26", f("00", "br.gov.bcb.pix") + f("01", CHAVE_PIX)) +
                  f("52", "0000") + f("53", "986") + f("54", valorStr) +
                  f("58", "BR") + f("59", NOME_RECEBEDOR) + f("60", CIDADE_RECEBEDOR) +
                  f("62", f("05", "15ANOS")) + "6304";

    function crc16(data) {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
    return payload + crc16(payload);
}

// --- EVENTO GERAR PIX ---
btnGerarPix?.addEventListener('click', () => {
    const valor = parseFloat(inputValor.value);
    
    if (isNaN(valor) || valor < 100) {
        alert("🦋 Por favor, insira um valor a partir de R$ 100,00 💜");
        areaPix.classList.add('hidden');
        return;
    }

    const codigo = gerarPayloadPix(valor);
    pixCode.innerText = codigo;
    areaPix.classList.remove('hidden');
    areaPix.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// --- CLICAR PARA COPIAR ---
pixCode?.addEventListener('click', () => {
    const texto = pixCode.innerText;
    navigator.clipboard.writeText(texto).then(() => {
        const bgOriginal = pixCode.style.background;
        const textoOriginal = pixCode.innerText;

        pixCode.innerText = "COPIADO! 🦋✨";
        pixCode.style.background = "#28a745";
        pixCode.style.color = "white";

        setTimeout(() => {
            pixCode.innerText = texto;
            pixCode.style.background = "white";
            pixCode.style.color = "black";
        }, 2000);
    });
});