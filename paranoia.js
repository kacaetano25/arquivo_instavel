// ===================================================================
// PARANOIA ALGORÍTMICA - Arquivo Instável
// ===================================================================

function aplicarParanoia(ctx, canvas) {
    console.log('🤖 Aplicando PARANOIA ALGORÍTMICA...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Color Correction (Etapa 1)
        hueShift: -87,          // Rotação de matiz
        saturationChange: -41,  // Mudança de saturação
        
        // RGB Shift (Etapa 2)
        rgbAmount: 15.0,        // Intensidade do deslocamento
        rgbAngle: 0.91,         // Ângulo do deslocamento
        fatorDessaturacao: 0.55, // Dessaturação do shift
        
        // Mirror/Fantasma (Etapa 3)
        opacidadeBase: 0.4,     // Opacidade do fantasma
        offsetX: 250,           // Deslocamento horizontal
        offsetY: 0,             // Deslocamento vertical
        
        // Ajuste Final (Etapa 4)
        ajusteBrilho: -1.2,     // Brilho final
        ajusteContraste: 1,     // Contraste final
        ajusteSaturacao: -10,   // Saturação final
        
        // Estados (sempre ativos)
        aplicarColorCorrectionAtivo: true,
        aplicarRgbShiftAtivo: true,
        aplicarMirrorAtivo: true,
        aplicarAjusteFinalAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±30% nos parâmetros selecionados (MAIS VARIAÇÃO!)
    const params = {
        // Color Correction - com variação AUMENTADA
        hueShift: baseParams.hueShift * (0.7 + Math.random() * 0.6),                    // -60.9 a -113.1 (range maior!)
        saturationChange: baseParams.saturationChange * (0.7 + Math.random() * 0.6),    // -28.7 a -53.3 (range maior!)
        
        // RGB Shift - com variação AUMENTADA
        rgbAmount: baseParams.rgbAmount * (0.7 + Math.random() * 0.6),                  // 10.5-19.5 (range maior!)
        rgbAngle: Math.random() * Math.PI * 2,                                           // 0 a 2π (completamente aleatório!)
        fatorDessaturacao: baseParams.fatorDessaturacao * (0.5 + Math.random() * 1.0),  // 0.275-0.825 (range MUITO maior!)
        
        // Mirror - com variação AUMENTADA
        opacidadeBase: baseParams.opacidadeBase * (0.5 + Math.random() * 1.0),          // 0.2-0.6 (range maior!)
        offsetX: baseParams.offsetX * (0.5 + Math.random() * 1.0),                      // 125-375 (range maior!)
        offsetY: baseParams.offsetY,                                                     // FIXO (zero)
        
        // Ajuste Final - fixos
        ajusteBrilho: baseParams.ajusteBrilho,      // FIXO
        ajusteContraste: baseParams.ajusteContraste, // FIXO
        ajusteSaturacao: baseParams.ajusteSaturacao, // FIXO
        
        // Estados fixos (sempre ativos)
        aplicarColorCorrectionAtivo: baseParams.aplicarColorCorrectionAtivo,
        aplicarRgbShiftAtivo: baseParams.aplicarRgbShiftAtivo,
        aplicarMirrorAtivo: baseParams.aplicarMirrorAtivo,
        aplicarAjusteFinalAtivo: baseParams.aplicarAjusteFinalAtivo
    };
    
    console.log('📐 Parâmetros Paranoia (com variação ±30% AUMENTADA):', params);
    console.log(`🎲 Hue Shift: ${params.hueShift.toFixed(1)} (base: ${baseParams.hueShift}) - RANGE MAIOR!`);
    console.log(`🎲 Saturation Change: ${params.saturationChange.toFixed(1)} (base: ${baseParams.saturationChange}) - RANGE MAIOR!`);
    console.log(`🎲 RGB Amount: ${params.rgbAmount.toFixed(1)} (base: ${baseParams.rgbAmount}) - RANGE MAIOR!`);
    console.log(`🎲 RGB Angle: ${params.rgbAngle.toFixed(3)} (COMPLETAMENTE ALEATÓRIO: 0-6.28)`);
    console.log(`🎲 Fator Dessaturação: ${params.fatorDessaturacao.toFixed(2)} (base: ${baseParams.fatorDessaturacao}) - RANGE MUITO MAIOR!`);
    console.log(`🎲 Opacidade Base: ${params.opacidadeBase.toFixed(2)} (base: ${baseParams.opacidadeBase}) - RANGE MAIOR!`);
    console.log(`🎲 Offset X: ${params.offsetX.toFixed(0)} (base: ${baseParams.offsetX}) - RANGE MAIOR!`);
    
    // APLICAR EFEITO EM 4 ETAPAS (ordem do código original)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // ETAPA 1: Color Correction (Hue/Saturation)
    if (params.aplicarColorCorrectionAtivo) {
        aplicarColorCorrection(ctx, canvas, params);
    }
    
    // ETAPA 2: RGB Shift Dessaturado
    if (params.aplicarRgbShiftAtivo) {
        aplicarRgbShift(ctx, canvas, params);
    }
    
    // ETAPA 3: Mirror/Fantasma
    if (params.aplicarMirrorAtivo) {
        aplicarMirror(ctx, canvas, params);
    }
    
    // ETAPA 4: Ajuste Final
    if (params.aplicarAjusteFinalAtivo) {
        aplicarAjusteFinal(ctx, canvas, params);
    }
    
    console.log('✅ Paranoia Algorítmica aplicada com variação única');
}

// ===================================================================
// ETAPA 1: COLOR CORRECTION (HUE/SATURATION)
// ===================================================================
function aplicarColorCorrection(ctx, canvas, params) {
    console.log('🎨 Aplicando Color Correction...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Converter RGB para HSL
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Aplicar mudanças de matiz e saturação
        let newH = (h + params.hueShift) % 360;
        if (newH < 0) newH += 360;
        
        let newS = Math.max(0, Math.min(100, s + params.saturationChange));
        
        // Converter de volta para RGB
        const [newR, newG, newB] = hslToRgb(newH, newS, l);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Color Correction aplicada');
}

// ===================================================================
// ETAPA 2: RGB SHIFT DESSATURADO
// ===================================================================
function aplicarRgbShift(ctx, canvas, params) {
    console.log('🔴🟢🔵 Aplicando RGB Shift...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const originalImageData = ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;
    
    // Criar nova imageData para resultado
    const shiftImageData = ctx.createImageData(width, height);
    const shiftData = shiftImageData.data;
    
    // Calcular deslocamentos
    const dx = params.rgbAmount * Math.cos(params.rgbAngle);
    const dy = params.rgbAmount * Math.sin(params.rgbAngle);
    
    console.log(`🔴🟢🔵 Deslocamento: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Coordenadas para cada canal
            const rx = Math.max(0, Math.min(width - 1, Math.round(x + dx)));
            const ry = Math.max(0, Math.min(height - 1, Math.round(y + dy)));
            const gx = x;
            const gy = y;
            const bx = Math.max(0, Math.min(width - 1, Math.round(x - dx)));
            const by = Math.max(0, Math.min(height - 1, Math.round(y - dy)));
            
            // Índices dos pixels
            const rIndex = (ry * width + rx) * 4;
            const gIndex = (gy * width + gx) * 4;
            const bIndex = (by * width + bx) * 4;
            const outIndex = (y * width + x) * 4;
            
            // Extrair cores
            let r = originalData[rIndex];
            let g = originalData[gIndex + 1];
            let b = originalData[bIndex + 2];
            
            // Aplicar dessaturação
            const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
            r = luminancia + (r - luminancia) * params.fatorDessaturacao;
            g = luminancia + (g - luminancia) * params.fatorDessaturacao;
            b = luminancia + (b - luminancia) * params.fatorDessaturacao;
            
            // Armazenar resultado
            shiftData[outIndex] = r;
            shiftData[outIndex + 1] = g;
            shiftData[outIndex + 2] = b;
            shiftData[outIndex + 3] = 255;
        }
    }
    
    ctx.putImageData(shiftImageData, 0, 0);
    
    console.log('✅ RGB Shift aplicado');
}

// ===================================================================
// ETAPA 3: MIRROR/FANTASMA
// ===================================================================
function aplicarMirror(ctx, canvas, params) {
    console.log('👻 Aplicando Mirror/Fantasma...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const originalImageData = ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;
    
    // Criar nova imageData para resultado
    const mirrorImageData = ctx.createImageData(width, height);
    const mirrorData = mirrorImageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const currentIndex = (y * width + x) * 4;
            
            // Lógica do flip horizontal com deslocamento
            let sourceX = width - 1 - x - params.offsetX;
            let sourceY = y - params.offsetY;
            
            // Garantir que não saia dos limites
            sourceX = Math.max(0, Math.min(width - 1, Math.round(sourceX)));
            sourceY = Math.max(0, Math.min(height - 1, Math.round(sourceY)));
            
            const sourceIndex = (sourceY * width + sourceX) * 4;
            
            // Calcular opacidade que diminui suavemente
            const opacidade = Math.max(0, Math.min(1, 
                (params.opacidadeBase * (width - x)) / width
            ));
            
            // Cores do pixel original
            const r_orig = originalData[currentIndex];
            const g_orig = originalData[currentIndex + 1];
            const b_orig = originalData[currentIndex + 2];
            
            // Cores do pixel fantasma
            const r_fantasma = originalData[sourceIndex];
            const g_fantasma = originalData[sourceIndex + 1];
            const b_fantasma = originalData[sourceIndex + 2];
            
            // Misturar com opacidade variável
            mirrorData[currentIndex] = r_orig * (1 - opacidade) + r_fantasma * opacidade;
            mirrorData[currentIndex + 1] = g_orig * (1 - opacidade) + g_fantasma * opacidade;
            mirrorData[currentIndex + 2] = b_orig * (1 - opacidade) + b_fantasma * opacidade;
            mirrorData[currentIndex + 3] = 255;
        }
    }
    
    ctx.putImageData(mirrorImageData, 0, 0);
    
    console.log('✅ Mirror/Fantasma aplicado');
}

// ===================================================================
// ETAPA 4: AJUSTE FINAL
// ===================================================================
function aplicarAjusteFinal(ctx, canvas, params) {
    console.log('⚡ Aplicando Ajuste Final...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Converter para HSL para ajustes
        const [h, s, l] = rgbToHsl(r, g, b);
        
        // Aplicar ajustes finais
        let newS = Math.max(0, Math.min(100, s + params.ajusteSaturacao));
        let newL = Math.max(0, Math.min(100, l + params.ajusteBrilho));
        newL = Math.max(0, Math.min(100, (newL - 50) * params.ajusteContraste + 50));
        
        // Converter de volta para RGB
        const [newR, newG, newB] = hslToRgb(h, newS, newL);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Ajuste Final aplicado');
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS DE CONVERSÃO DE COR
// ===================================================================

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // Acromático
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

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // Acromático
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [r * 255, g * 255, b * 255];
}

// Gerador de números aleatórios com seed
let seedValue = 0;

function seedRandom(seed) {
    seedValue = seed;
}

function seededRandom() {
    seedValue = (seedValue * 1664525 + 1013904223) % 4294967296;
    return seedValue / 4294967296;
}

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================

// Paranoia: estado mental caracterizado por suspeitas persistentes e infundadas, 
// desconfiança excessiva e interpretação distorcida de eventos como ameaças pessoais