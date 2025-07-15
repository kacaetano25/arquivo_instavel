// ===================================================================
// DEVANEIO DE BUFFER - Efeito Puro com Aleatoriedade
// Blur + Inversão + Smear + Correção Rosa
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarDevaneio(ctx, canvas) {
    console.log('🌸 Aplicando DEVANEIO DE BUFFER...');
    
    // PARÂMETROS BASE
    const baseParams = {
        blur: {
            amount: 0.81,    // 81% intensidade do blur (0-10)
            distance: 0.92   // 92% força do glow (0.5-1.5)
        },
        smear: {
            amount: 0.73,    // 73% densidade do rastro (1-40 camadas)
            angle: 0.03      // 3% ângulo do rastro (0-2π)
        },
        colorCorrection: {
            brightness: 0.5, // 50% ajuste de brilho
            contrast: 0.26,  // 26% contraste final
            saturation: 0.25,// 25% saturação rosa
            hueOffset: 0.5,  // 50% tom rosa/vermelho
            invert: true     // Inversão ativada
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        blur: {
            amount: baseParams.blur.amount * (0.8 + Math.random() * 0.4),         // 0.65-0.97
            distance: baseParams.blur.distance * (0.8 + Math.random() * 0.4)     // 0.74-1.10
        },
        smear: {
            amount: baseParams.smear.amount * (0.8 + Math.random() * 0.4),        // 0.58-0.88
            angle: baseParams.smear.angle * (0.8 + Math.random() * 0.4)           // 0.024-0.036
        },
        colorCorrection: {
            brightness: baseParams.colorCorrection.brightness * (0.8 + Math.random() * 0.4), // 0.40-0.60
            contrast: baseParams.colorCorrection.contrast * (0.8 + Math.random() * 0.4),     // 0.21-0.31
            saturation: baseParams.colorCorrection.saturation * (0.8 + Math.random() * 0.4), // 0.20-0.30
            hueOffset: baseParams.colorCorrection.hueOffset * (0.8 + Math.random() * 0.4),   // 0.40-0.60
            invert: baseParams.colorCorrection.invert // Mantido fixo (boolean)
        },
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Devaneio (com variação ±20%):', params);
    console.log(`🎲 Blur Amount: ${params.blur.amount.toFixed(2)} (base: ${baseParams.blur.amount})`);
    console.log(`🎲 Blur Distance: ${params.blur.distance.toFixed(2)} (base: ${baseParams.blur.distance})`);
    console.log(`🎲 Smear Amount: ${params.smear.amount.toFixed(2)} (base: ${baseParams.smear.amount})`);
    console.log(`🎲 Smear Angle: ${params.smear.angle.toFixed(3)} (base: ${baseParams.smear.angle})`);
    console.log(`🎲 Saturation: ${params.colorCorrection.saturation.toFixed(2)} (base: ${baseParams.colorCorrection.saturation})`);
    console.log(`🎲 Brightness: ${params.colorCorrection.brightness.toFixed(2)} (base: ${baseParams.colorCorrection.brightness})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // Armazenar imagem original para processamento
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // APLICAR EFEITO EM 4 ETAPAS
    seedRandom(params.seed);
    
    // ETAPA 1: Blur e Inversão
    aplicarBlurEInversao(ctx, canvas, params.blur, params.colorCorrection.invert);
    
    // ETAPA 2: Smear (rastro)
    aplicarSmear(ctx, canvas, params.smear);
    
    // ETAPA 3: Correção de cor final
    aplicarColorCorrectionFinal(ctx, canvas, params.colorCorrection);
    
    console.log('✅ Devaneio de Buffer aplicado com variação única');
}

// ===================================================================
// ETAPA 1: BLUR E INVERSÃO
// ===================================================================
function aplicarBlurEInversao(ctx, canvas, blurParams, shouldInvert) {
    console.log('🌀 Aplicando Blur e Inversão...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar camada de glow (blur)
    const glowCanvas = document.createElement('canvas');
    const glowCtx = glowCanvas.getContext('2d');
    glowCanvas.width = width;
    glowCanvas.height = height;
    glowCtx.putImageData(originalImageData, 0, 0);
    
    // Aplicar blur usando filtro
    const blurIntensity = blurParams.amount * 10;
    glowCtx.filter = `blur(${blurIntensity}px)`;
    glowCtx.drawImage(glowCanvas, 0, 0);
    glowCtx.filter = 'none';
    
    // Criar camada de detalhes invertida
    const detailCanvas = document.createElement('canvas');
    const detailCtx = detailCanvas.getContext('2d');
    detailCanvas.width = width;
    detailCanvas.height = height;
    detailCtx.putImageData(originalImageData, 0, 0);
    
    // Aplicar inversão manual
    const detailImageData = detailCtx.getImageData(0, 0, width, height);
    const detailData = detailImageData.data;
    
    for (let i = 0; i < detailData.length; i += 4) {
        detailData[i] = 255 - detailData[i];     // R
        detailData[i + 1] = 255 - detailData[i + 1]; // G
        detailData[i + 2] = 255 - detailData[i + 2]; // B
    }
    
    detailCtx.putImageData(detailImageData, 0, 0);
    
    // Combinar camadas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Aplicar glow com intensidade variável
    const glowStrength = Math.min(Math.max(blurParams.distance * 1.5, 0.5), 1.5);
    ctx.globalAlpha = glowStrength;
    ctx.drawImage(glowCanvas, 0, 0);
    ctx.globalAlpha = 1;
    
    // Aplicar detalhes invertidos com blend ADD (simulado com screen)
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(detailCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    
    // Aplicar inversão final se necessário
    if (shouldInvert) {
        const finalImageData = ctx.getImageData(0, 0, width, height);
        const finalData = finalImageData.data;
        
        for (let i = 0; i < finalData.length; i += 4) {
            finalData[i] = 255 - finalData[i];     // R
            finalData[i + 1] = 255 - finalData[i + 1]; // G
            finalData[i + 2] = 255 - finalData[i + 2]; // B
        }
        
        ctx.putImageData(finalImageData, 0, 0);
    }
    
    console.log('✅ Blur e Inversão aplicados');
}

// ===================================================================
// ETAPA 2: SMEAR (RASTRO)
// ===================================================================
function aplicarSmear(ctx, canvas, smearParams) {
    console.log('🌊 Aplicando Smear...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar canvas para smear
    const smearCanvas = document.createElement('canvas');
    const smearCtx = smearCanvas.getContext('2d');
    smearCanvas.width = width;
    smearCanvas.height = height;
    
    // Calcular número de camadas baseado no amount
    const numLayers = Math.floor(smearParams.amount * 39 + 1); // 1-40
    const smearAngle = smearParams.angle * Math.PI * 2;
    
    // Aplicar múltiplas camadas com offset
    smearCtx.globalCompositeOperation = 'screen';
    
    for (let i = 1; i <= numLayers; i++) {
        const offsetX = Math.cos(smearAngle) * i * 2;
        const offsetY = Math.sin(smearAngle) * i * 2;
        
        // Criar canvas temporário para esta camada
        const layerCanvas = document.createElement('canvas');
        const layerCtx = layerCanvas.getContext('2d');
        layerCanvas.width = width;
        layerCanvas.height = height;
        layerCtx.putImageData(sourceImageData, 0, 0);
        
        // Aplicar com transparência (simula tint(255, 50))
        smearCtx.globalAlpha = 0.2;
        smearCtx.drawImage(layerCanvas, offsetX, offsetY);
    }
    
    smearCtx.globalAlpha = 1;
    smearCtx.globalCompositeOperation = 'source-over';
    
    // Aplicar blur no smear
    smearCtx.filter = 'blur(4px)';
    smearCtx.drawImage(smearCanvas, 0, 0);
    smearCtx.filter = 'none';
    
    // Combinar com a imagem principal usando ADD (simulado com screen)
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(smearCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    
    console.log(`✅ Smear aplicado com ${numLayers} camadas`);
}

// ===================================================================
// ETAPA 3: CORREÇÃO DE COR FINAL
// ===================================================================
function aplicarColorCorrectionFinal(ctx, canvas, colorParams) {
    console.log('🎨 Aplicando correção de cor final...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // 1. Forçar o tom de cor usando HSL
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Força o matiz para a faixa do rosa/vermelho
        const newH = 0.95 + (colorParams.hueOffset - 0.5) * 0.1;
        
        // Ajusta a saturação
        const newS = Math.max(0, Math.min(1, s * (colorParams.saturation * 2)));
        
        // Ajusta o brilho
        const newL = Math.max(0, Math.min(1, l * (1.0 + (colorParams.brightness - 0.5))));
        
        const [newR, newG, newB] = hslToRgb(newH, newS, newL);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 2. Adicionar o "Glow" 
    const glowCanvas = document.createElement('canvas');
    const glowCtx = glowCanvas.getContext('2d');
    glowCanvas.width = width;
    glowCanvas.height = height;
    glowCtx.drawImage(canvas, 0, 0);
    
    // Aplicar blur para o glow
    glowCtx.filter = 'blur(15px)';
    glowCtx.drawImage(glowCanvas, 0, 0);
    glowCtx.filter = 'none';
    
    // Combinar com blend ADD (simulado com screen)
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.27; // Equivalente a tint(255, 70)
    ctx.drawImage(glowCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    // 3. Ajuste de contraste final
    const finalImageData = ctx.getImageData(0, 0, width, height);
    const finalData = finalImageData.data;
    
    const contrastValue = 1.0 + (colorParams.contrast - 0.5);
    
    for (let i = 0; i < finalData.length; i += 4) {
        finalData[i] = Math.max(0, Math.min(255, (finalData[i] - 128) * contrastValue + 128));
        finalData[i + 1] = Math.max(0, Math.min(255, (finalData[i + 1] - 128) * contrastValue + 128));
        finalData[i + 2] = Math.max(0, Math.min(255, (finalData[i + 2] - 128) * contrastValue + 128));
    }
    
    ctx.putImageData(finalImageData, 0, 0);
    
    console.log('✅ Correção de cor final aplicada');
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
    
    return [h, s, l];
}

// Conversão HSL para RGB
function hslToRgb(h, s, l) {
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
const devaneioDefinition = {
    title: "DEVANEIO DE BUFFER",
    definition: `→ <strong>Devaneio</strong>: estado de contemplação abstrata, onde a mente se desliga da realidade imediata para vagar em pensamentos soltos e imaginação livre.<br><br>→ <strong>Buffer</strong>: espaço temporário de armazenamento que mantém dados em espera, criando pausas e intervalos no fluxo de informação.`,
    poetry: "Pausa onírica.<br>Memória em espera.<br>Rastros de pensamento.<br>Glow contemplativo."
};