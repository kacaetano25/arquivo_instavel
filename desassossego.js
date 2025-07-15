// ===================================================================
// DESASSOSSEGO DE INTERFACE - Efeito Puro com Aleatoriedade
// Feedback + Jitter + Textura + Correção Elétrica
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarDesassossego(ctx, canvas) {
    console.log('⚡ Aplicando DESASSOSSEGO DE INTERFACE...');
    
    // PARÂMETROS BASE
    const baseParams = {
        feedback: {
            amount: 0.77,    // 77% para iterações (1-50)
            scale: 0.5,      // Fator de escala recursiva
            rotate: 0.5,     // Fator de rotação
            warp: 0.5,       // Não usado, mas mantido
            hueShift: 0      // Sem shift inicial
        },
        jitter: {
            amount: 0.34,    // 34% para slices (0-15)
            speed: 0.8,      // Velocidade (não usado diretamente)
            angle: 0,        // Ângulo fixo
            seed: 0,         // Seed para reprodutibilidade
            displacement: 70 // Deslocamento dos canais RGB
        },
        colorCorrection: {
            brightness: 0.5, // Não usado na lógica HSL
            contrast: 0.2,   // Não usado na lógica HSL
            saturation: 0.88,// Multiplicador de saturação
            hueOffset: 0.41  // Offset de matiz
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        feedback: {
            amount: baseParams.feedback.amount * (0.8 + Math.random() * 0.4),     // 0.62-0.92
            scale: baseParams.feedback.scale * (0.8 + Math.random() * 0.4),       // 0.4-0.6
            rotate: baseParams.feedback.rotate * (0.8 + Math.random() * 0.4),     // 0.4-0.6
            warp: baseParams.feedback.warp,       // Mantido fixo
            hueShift: baseParams.feedback.hueShift // Mantido fixo (zero)
        },
        jitter: {
            amount: baseParams.jitter.amount * (0.8 + Math.random() * 0.4),       // 0.27-0.41
            speed: baseParams.jitter.speed * (0.8 + Math.random() * 0.4),         // 0.64-0.96
            angle: baseParams.jitter.angle,       // Mantido fixo
            seed: baseParams.jitter.seed,         // Mantido fixo
            displacement: baseParams.jitter.displacement * (0.8 + Math.random() * 0.4) // 56-84
        },
        colorCorrection: {
            brightness: baseParams.colorCorrection.brightness, // Mantido fixo (não usado)
            contrast: baseParams.colorCorrection.contrast,     // Mantido fixo (não usado)
            saturation: baseParams.colorCorrection.saturation * (0.8 + Math.random() * 0.4), // 0.70-1.06
            hueOffset: baseParams.colorCorrection.hueOffset * (0.8 + Math.random() * 0.4)    // 0.33-0.49
        },
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Desassossego (com variação ±20%):', params);
    console.log(`🎲 Feedback Amount: ${params.feedback.amount.toFixed(2)} (base: ${baseParams.feedback.amount})`);
    console.log(`🎲 Feedback Scale: ${params.feedback.scale.toFixed(2)} (base: ${baseParams.feedback.scale})`);
    console.log(`🎲 Jitter Amount: ${params.jitter.amount.toFixed(2)} (base: ${baseParams.jitter.amount})`);
    console.log(`🎲 Jitter Displacement: ${params.jitter.displacement.toFixed(0)} (base: ${baseParams.jitter.displacement})`);
    console.log(`🎲 Saturation: ${params.colorCorrection.saturation.toFixed(2)} (base: ${baseParams.colorCorrection.saturation})`);
    console.log(`🎲 Hue Offset: ${params.colorCorrection.hueOffset.toFixed(2)} (base: ${baseParams.colorCorrection.hueOffset})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // Armazenar imagem original para etapa 3
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // APLICAR EFEITO EM 5 ETAPAS
    seedRandom(params.seed);
    
    // ETAPA 1: Feedback
    aplicarFeedback(ctx, canvas, params.feedback);
    
    // ETAPA 2: Jitter
    aplicarJitter(ctx, canvas, params.jitter);
    
    // ETAPA 3: Reintroduzir textura
    reintroduzirTextura(ctx, canvas, originalImageData);
    
    // ETAPA 4: Correção de cor elétrica
    aplicarColorCorrection(ctx, canvas, params.colorCorrection);
    
    console.log('✅ Desassossego de Interface aplicado com variação única');
}

// ===================================================================
// ETAPA 1: FEEDBACK - Efeito recursivo com escala e rotação
// ===================================================================
function aplicarFeedback(ctx, canvas, feedbackParams) {
    console.log('🔄 Aplicando Feedback...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Calcular número de iterações baseado no amount
    const iterations = Math.floor(feedbackParams.amount * 49 + 1); // 1-50
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Aplicar feedback iterativo
    for (let i = 0; i < iterations; i++) {
        // Capturar frame atual
        const currentImageData = ctx.getImageData(0, 0, width, height);
        
        // Criar canvas temporário para transformação
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.putImageData(currentImageData, 0, 0);
        
        // Aplicar transformação
        ctx.save();
        ctx.translate(centerX, centerY);
        
        const scaleFactor = 1.0 - (feedbackParams.scale * 0.02);
        const rotateFactor = (feedbackParams.rotate - 0.5) * 0.1;
        
        ctx.scale(scaleFactor, scaleFactor);
        ctx.rotate(rotateFactor);
        ctx.translate(-centerX, -centerY);
        
        // Desenhar com transparência (simula tint(255, 200))
        ctx.globalAlpha = 0.78;
        ctx.drawImage(tempCanvas, 0, 0);
        
        ctx.restore();
    }
    
    ctx.globalAlpha = 1; // Resetar transparência
    
    console.log(`✅ Feedback aplicado com ${iterations} iterações`);
}

// ===================================================================
// ETAPA 2: JITTER - Slices com separação de canais RGB
// ===================================================================
function aplicarJitter(ctx, canvas, jitterParams) {
    console.log('📺 Aplicando Jitter...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Calcular número de slices baseado no amount
    const numSlices = Math.floor(jitterParams.amount * 15); // 0-15
    
    seedRandom(jitterParams.seed);
    
    for (let i = 0; i < numSlices; i++) {
        const y = Math.floor(seededRandom() * height);
        const h = Math.floor(seededRandom() * 35 + 15); // 15-50px
        
        // Verificar se o slice está dentro dos limites
        if (y + h > height) continue;
        
        // Extrair slice da imagem
        const sliceImageData = ctx.getImageData(0, y, width, h);
        const sliceData = sliceImageData.data;
        
        // Criar canais separados
        const magentaData = new Uint8ClampedArray(sliceData);
        const greenData = new Uint8ClampedArray(sliceData);
        
        // Processar pixels para separar canais
        for (let j = 0; j < sliceData.length; j += 4) {
            const r = sliceData[j];
            const g = sliceData[j + 1];
            const b = sliceData[j + 2];
            const a = sliceData[j + 3];
            
            // Canal Magenta (R + B)
            magentaData[j] = r;     // R
            magentaData[j + 1] = 0; // G = 0
            magentaData[j + 2] = b; // B
            magentaData[j + 3] = a; // A
            
            // Canal Verde (G apenas)
            greenData[j] = 0;       // R = 0
            greenData[j + 1] = g;   // G
            greenData[j + 2] = 0;   // B = 0
            greenData[j + 3] = a;   // A
        }
        
        // Calcular deslocamento
        const displacement = (seededRandom() * 0.5 + 0.5) * jitterParams.displacement * (seededRandom() > 0.5 ? 1 : -1);
        const channelSeparation = 30;
        
        // Criar canvas temporários para os canais
        const magentaCanvas = document.createElement('canvas');
        const magentaCtx = magentaCanvas.getContext('2d');
        magentaCanvas.width = width;
        magentaCanvas.height = h;
        
        const greenCanvas = document.createElement('canvas');
        const greenCtx = greenCanvas.getContext('2d');
        greenCanvas.width = width;
        greenCanvas.height = h;
        
        // Colocar dados nos canvas
        const magentaImageData = magentaCtx.createImageData(width, h);
        const greenImageData = greenCtx.createImageData(width, h);
        
        magentaImageData.data.set(magentaData);
        greenImageData.data.set(greenData);
        
        magentaCtx.putImageData(magentaImageData, 0, 0);
        greenCtx.putImageData(greenImageData, 0, 0);
        
        // Aplicar com blend mode ADD (simulado com screen)
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(magentaCanvas, displacement + channelSeparation, y);
        ctx.drawImage(greenCanvas, displacement - channelSeparation, y);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    console.log(`✅ Jitter aplicado com ${numSlices} slices`);
}

// ===================================================================
// ETAPA 3: REINTRODUZIR TEXTURA - Multiply blend da imagem original
// ===================================================================
function reintroduzirTextura(ctx, canvas, originalImageData) {
    console.log('🖼️ Reintroduzindo textura...');
    
    // Criar canvas temporário com a imagem original
    const originalCanvas = document.createElement('canvas');
    const originalCtx = originalCanvas.getContext('2d');
    originalCanvas.width = canvas.width;
    originalCanvas.height = canvas.height;
    originalCtx.putImageData(originalImageData, 0, 0);
    
    // Aplicar blend multiply com baixa opacidade (simula tint(255, 15))
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.06;
    ctx.drawImage(originalCanvas, 0, 0);
    
    // Resetar blend modes
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    
    console.log('✅ Textura reintroduzida');
}

// ===================================================================
// ETAPA 4: CORREÇÃO DE COR ELÉTRICA - Manipulação HSL
// ===================================================================
function aplicarColorCorrection(ctx, canvas, colorParams) {
    console.log('🌈 Aplicando correção de cor elétrica...');
    
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
        
        // 1. Aplicar Hue Shift
        let newH = h + colorParams.hueOffset;
        if (newH > 1) newH -= 1;
        
        // 2. Aplicar Supersaturação (multiplicador forte para "eletrificar")
        let newS = s * (colorParams.saturation * 3);
        newS = Math.max(0, Math.min(1, newS)); // Constrain 0-1
        
        // Converter de volta para RGB
        const [newR, newG, newB] = hslToRgb(newH, newS, l);
        
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Correção de cor elétrica aplicada');
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
const desassossegoDefinition = {
    title: "DESASSOSSEGO DE INTERFACE",
    definition: `→ <strong>Desassossego</strong>: estado de inquietação, agitação interna e impossibilidade de encontrar tranquilidade ou estabilidade emocional.<br><br>→ <strong>Interface</strong>: camada de interação entre usuário e sistema, responsável por mediar a comunicação e controlar a experiência digital.`,
    poetry: "Inquietação elétrica.<br>Estabilidade negada.<br>Cores que não se acalmam.<br>Agitação permanente."
};