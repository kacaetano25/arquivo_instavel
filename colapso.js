// ===================================================================
// COLAPSO DE SISTEMA - Efeito Puro com Aleatoriedade
// ASCII + Hard Glitch + Transformação + Ajuste de Cor
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarColapso(ctx, canvas) {
    console.log('💥 Aplicando COLAPSO DE SISTEMA...');
    
    // PARÂMETROS BASE
    const baseParams = {
        glitch: {
            amount: 0.55,    // 55% chance de glitch por chunk
            scale: 0.57,     // Escala dos chunks (5-80px)
            colorSplit: 0.5  // Separação RGB
        },
        ascii: {
            amount: 0.81,    // 81% transparência do ASCII
            size: 1.13       // Tamanho da fonte ASCII
        },
        transform: {
            scaleX: 1.8,     // Escala horizontal
            scaleY: 1.34,    // Escala vertical
            angle: 0.29      // Rotação em radianos
        },
        ajuste: {
            brilho: -1.2,    // Redução de brilho
            contraste: 1,    // Contraste neutro
            saturacao: -10   // Dessaturação
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        glitch: {
            amount: baseParams.glitch.amount * (0.8 + Math.random() * 0.4), // 0.44-0.66
            scale: baseParams.glitch.scale * (0.8 + Math.random() * 0.4),   // 0.46-0.68
            colorSplit: baseParams.glitch.colorSplit // Mantido fixo (mais seguro)
        },
        ascii: {
            amount: baseParams.ascii.amount * (0.8 + Math.random() * 0.4),  // 0.65-0.97
            size: baseParams.ascii.size // Mantido fixo (mais seguro)
        },
        transform: baseParams.transform, // TODOS FIXOS (muito sensíveis à variação)
        ajuste: baseParams.ajuste,       // TODOS FIXOS (muito sensíveis à variação)
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Colapso (com variação ±20%):', params);
    console.log(`🎲 Glitch Amount: ${params.glitch.amount.toFixed(2)} (base: ${baseParams.glitch.amount})`);
    console.log(`🎲 Glitch Scale: ${params.glitch.scale.toFixed(2)} (base: ${baseParams.glitch.scale})`);
    console.log(`🎲 ASCII Amount: ${params.ascii.amount.toFixed(2)} (base: ${baseParams.ascii.amount})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // APLICAR EFEITO EM 4 ETAPAS
    seedRandom(params.seed);
    
    // ETAPA 1: ASCII sobre imagem original
    aplicarASCII(ctx, canvas, params.ascii);
    
    // ETAPA 2: Hard Glitch sobre imagem+ASCII
    aplicarHardGlitch(ctx, canvas, params.glitch);
    
    // ETAPA 3: Transformação geométrica
    aplicarTransformacao(ctx, canvas, params.transform);
    
    // ETAPA 4: Ajuste final de cor
    aplicarAjusteFinal(ctx, canvas, params.ajuste);
    
    console.log('✅ Colapso de Sistema aplicado com variação única');
}

// ===================================================================
// ETAPA 1: ASCII - Sobrepõe caracteres baseados no brilho
// ===================================================================
function aplicarASCII(ctx, canvas, asciiParams) {
    console.log('📝 Aplicando camada ASCII...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar canvas temporário para ASCII
    const asciiCanvas = document.createElement('canvas');
    const asciiCtx = asciiCanvas.getContext('2d');
    asciiCanvas.width = width;
    asciiCanvas.height = height;
    
    // Conjunto de caracteres ASCII (do mais escuro ao mais claro)
    const charSet = '`.:-=+*#%@0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Calcular tamanho da fonte baseado no parâmetro size
    const fontSize = Math.floor(asciiParams.size * 6 + 4); // 4-18px aproximadamente
    const stepX = fontSize * 0.6;
    const stepY = fontSize;
    
    // Configurar fonte
    asciiCtx.font = `${fontSize}px monospace`;
    asciiCtx.textAlign = 'center';
    asciiCtx.textBaseline = 'middle';
    
    // Processar imagem pixel por pixel e gerar ASCII
    for (let y = 0; y < height; y += stepY) {
        for (let x = 0; x < width; x += stepX) {
            // Obter pixel da imagem original
            const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
            const r = originalImageData.data[pixelIndex];
            const g = originalImageData.data[pixelIndex + 1];
            const b = originalImageData.data[pixelIndex + 2];
            
            // Calcular brilho (0-255)
            const brightness = (r + g + b) / 3;
            
            // Mapear brilho para caractere (inversão: escuro → caractere denso)
            const charIndex = Math.floor(((255 - brightness) / 255) * (charSet.length - 1));
            const char = charSet[charIndex];
            
            // Calcular cor do caractere (mais escuro em áreas claras)
            const charGray = Math.floor(255 - brightness * 0.9 + 20);
            
            // Desenhar caractere
            asciiCtx.fillStyle = `rgb(${charGray}, ${charGray}, ${charGray})`;
            asciiCtx.fillText(char, x + stepX / 2, y + stepY / 2);
        }
    }
    
    // Combinar ASCII com imagem original
    ctx.globalAlpha = 1 - asciiParams.amount; // Transparência da imagem original
    ctx.putImageData(originalImageData, 0, 0);
    ctx.globalAlpha = asciiParams.amount; // Transparência do ASCII
    ctx.drawImage(asciiCanvas, 0, 0);
    ctx.globalAlpha = 1; // Resetar transparência
    
    console.log('✅ ASCII aplicado');
}

// ===================================================================
// ETAPA 2: HARD GLITCH - Chunks deslocados + separação RGB
// ===================================================================
function aplicarHardGlitch(ctx, canvas, glitchParams) {
    console.log('⚡ Aplicando Hard Glitch...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual (já com ASCII)
    const currentImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar canvas temporário para displacement
    const displacementCanvas = document.createElement('canvas');
    const displacementCtx = displacementCanvas.getContext('2d');
    displacementCanvas.width = width;
    displacementCanvas.height = height;
    displacementCtx.putImageData(currentImageData, 0, 0);
    
    // Aplicar displacement em chunks horizontais
    let y = 0;
    while (y < height) {
        const maxChunkHeight = Math.floor(glitchParams.scale * 75 + 5); // 5-80px
        const chunkHeight = Math.floor(seededRandom() * maxChunkHeight) + 1;
        
        // Decidir se este chunk será deslocado
        if (seededRandom() < glitchParams.amount) {
            const maxOffset = width * glitchParams.amount * 0.1;
            const xOffset = Math.floor((seededRandom() - 0.5) * 2 * maxOffset);
            
            // Mover chunk horizontalmente
            displacementCtx.drawImage(
                displacementCanvas,
                0, y, width, chunkHeight,
                xOffset, y, width, chunkHeight
            );
        }
        
        y += chunkHeight;
    }
    
    // Aplicar separação de cores RGB
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    const splitAmount = Math.floor(glitchParams.colorSplit * 35);
    
    // Misturar canais RGB com deslocamento
    tempCtx.globalCompositeOperation = 'screen';
    
    // Canal Vermelho (deslocado para esquerda)
    tempCtx.fillStyle = 'red';
    tempCtx.globalCompositeOperation = 'multiply';
    tempCtx.fillRect(0, 0, width, height);
    tempCtx.globalCompositeOperation = 'screen';
    tempCtx.drawImage(displacementCanvas, -splitAmount, 0);
    
    // Canal Verde (posição normal)
    tempCtx.fillStyle = 'green';
    tempCtx.globalCompositeOperation = 'multiply';
    tempCtx.fillRect(0, 0, width, height);
    tempCtx.globalCompositeOperation = 'screen';
    tempCtx.drawImage(displacementCanvas, 0, 0);
    
    // Canal Azul (deslocado para direita)
    tempCtx.fillStyle = 'blue';
    tempCtx.globalCompositeOperation = 'multiply';
    tempCtx.fillRect(0, 0, width, height);
    tempCtx.globalCompositeOperation = 'screen';
    tempCtx.drawImage(displacementCanvas, splitAmount, 0);
    
    // Aplicar resultado final
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(tempCanvas, 0, 0);
    
    console.log('✅ Hard Glitch aplicado');
}

// ===================================================================
// ETAPA 3: TRANSFORMAÇÃO GEOMÉTRICA - Escala, rotação e mosaico
// ===================================================================
function aplicarTransformacao(ctx, canvas, transformParams) {
    console.log('🔄 Aplicando transformação geométrica...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const currentImageData = ctx.getImageData(0, 0, width, height);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(currentImageData, 0, 0);
    
    // Limpar canvas principal
    ctx.clearRect(0, 0, width, height);
    
    // Aplicar transformação com mosaico
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-transformParams.angle);
    ctx.scale(transformParams.scaleX, transformParams.scaleY);
    
    // Desenhar mosaico 3x3 para criar efeito de repetição
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            ctx.drawImage(tempCanvas, 
                -width / 2 + i * width, 
                -height / 2 + j * height
            );
        }
    }
    
    ctx.restore();
    
    console.log('✅ Transformação aplicada');
}

// ===================================================================
// ETAPA 4: AJUSTE FINAL DE COR - Correção HSL
// ===================================================================
function aplicarAjusteFinal(ctx, canvas, ajusteParams) {
    console.log('🎨 Aplicando ajuste final de cor...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Processar cada pixel
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Converter RGB para HSL
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Aplicar ajustes
        let newS = s + ajusteParams.saturacao;
        let newL = l + ajusteParams.brilho;
        
        // Aplicar contraste
        newL = (newL - 50) * ajusteParams.contraste + 50;
        
        // Limitar valores
        newS = Math.max(0, Math.min(100, newS));
        newL = Math.max(0, Math.min(100, newL));
        
        // Converter de volta para RGB
        const [newR, newG, newB] = hslToRgb(h, newS, newL);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Ajuste de cor aplicado');
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS - Gerador de números aleatórios e conversões
// ===================================================================

let seedValue = 0;

function seedRandom(seed) {
    seedValue = seed;
}

function seededRandom() {
    // Algoritmo Linear Congruential Generator (simula random() do p5.js)
    seedValue = (seedValue * 1664525 + 1013904223) % 4294967296;
    return seedValue / 4294967296;
}

// Conversão RGB para HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
}

// Conversão HSL para RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [r * 255, g * 255, b * 255];
}

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================
const colapsoDefinition = {
    title: "COLAPSO DE SISTEMA",
    definition: `→ <strong>Colapso</strong>: falha súbita e irreversível no funcionamento de um sistema, resultando na interrupção completa ou no comprometimento grave de suas operações.<br><br>→ <strong>Sistema</strong>: conjunto estruturado de elementos interdependentes, regido por regras ou padrões, que busca estabilidade e previsibilidade.`,
    poetry: "Falha como linguagem.<br>Erro como narrativa visual.<br>Cor desmembrada.<br>Distorção geométrica."
};