// ===================================================================
// HISTERIA DE PACOTES - Efeito Puro com Aleatoriedade
// Splitter (Fragmentação) + Color Correction
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarHisteria(ctx, canvas) {
    console.log('📦 Aplicando HISTERIA DE PACOTES...');
    
    // PARÂMETROS BASE (valores que funcionaram)
    const baseParams = {
        count: 42,          // 42 fatias horizontais
        shift: 1.7,         // 1.7x força do deslocamento
        offset: 0.0,        // 0% ponto de início
        scale: 1,           // Não usado no código
        angle: 0,           // Não usado no código
        
        // Color correction
        brightness: 0.9,    // 90% brilho
        contrast: 0,        // Desligado no código
        saturation: 1.99,   // 1.99x saturação
        hueOffset: 0.62,    // 62% rotação de matiz
        
        // Estados dos efeitos (sempre ativos)
        aplicarSplitterAtivo: true,
        aplicarColorAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        count: Math.floor(baseParams.count * (0.8 + Math.random() * 0.4)),           // 34-50
        shift: baseParams.shift * (0.8 + Math.random() * 0.4),                       // 1.36-2.04
        offset: baseParams.offset + Math.random() * 0.2,                             // 0.0-0.2
        scale: baseParams.scale,        // Mantido fixo (não usado)
        angle: baseParams.angle,        // Mantido fixo (não usado)
        
        // Color correction
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),            // 0.72-1.08
        contrast: baseParams.contrast,  // Mantido fixo (desligado)
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),            // 1.59-2.39
        hueOffset: baseParams.hueOffset * (0.8 + Math.random() * 0.4),               // 0.50-0.74
        
        // Estados fixos (sempre ativos)
        aplicarSplitterAtivo: baseParams.aplicarSplitterAtivo,
        aplicarColorAtivo: baseParams.aplicarColorAtivo,
        
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Histeria (com variação ±20%):', params);
    console.log(`🎲 Count: ${params.count} (base: ${baseParams.count})`);
    console.log(`🎲 Shift: ${params.shift.toFixed(2)} (base: ${baseParams.shift})`);
    console.log(`🎲 Offset: ${params.offset.toFixed(2)} (base: ${baseParams.offset})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(2)} (base: ${baseParams.saturation})`);
    console.log(`🎲 Hue Offset: ${params.hueOffset.toFixed(2)} (base: ${baseParams.hueOffset})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // APLICAR EFEITO EM 2 ETAPAS
    seedRandom(params.seed);
    
    // ETAPA 1: Splitter (fragmentação de pacotes)
    if (params.aplicarSplitterAtivo) {
        aplicarSplitter(ctx, canvas, params.count, params.shift, params.offset);
    }
    
    // ETAPA 2: Color Correction
    if (params.aplicarColorAtivo) {
        aplicarColorCorrection(ctx, canvas, params.brightness, params.saturation, params.hueOffset);
    }
    
    console.log('✅ Histeria de Pacotes aplicada com variação única');
}

// ===================================================================
// ETAPA 1: SPLITTER (FRAGMENTAÇÃO DE PACOTES)
// ===================================================================
function aplicarSplitter(ctx, canvas, count, shift, offset) {
    console.log('🌀 Aplicando Splitter...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, width, height);
    
    // Calcular altura de cada fatia
    const sliceHeight = Math.floor(height / count);
    
    console.log(`📦 Dividindo em ${count} fatias de ${sliceHeight} pixels de altura`);
    
    // Criar buffer temporário
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(originalImageData, 0, 0);
    
    // Limpar canvas original
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Processar cada fatia
    for (let slice = 0; slice < count; slice++) {
        // Calcular progresso desta fatia (0 a 1)
        const sliceProgress = slice / count;
        
        // Calcular quanto deslocar esta fatia
        let shiftAmount = 0;
        if (sliceProgress >= offset) {
            shiftAmount = (sliceProgress - offset) * shift * width;
        }
        
        const pixelShift = Math.floor(shiftAmount);
        
        console.log(`📦 Fatia ${slice}: deslocando ${pixelShift} pixels`);
        
        // Calcular coordenadas da fatia
        const startY = slice * sliceHeight;
        const endY = Math.min((slice + 1) * sliceHeight, height);
        const actualHeight = endY - startY;
        
        // Extrair fatia da imagem original
        const sliceImageData = tempCtx.getImageData(0, startY, width, actualHeight);
        
        // Criar canvas para esta fatia
        const sliceCanvas = document.createElement('canvas');
        const sliceCtx = sliceCanvas.getContext('2d');
        sliceCanvas.width = width;
        sliceCanvas.height = actualHeight;
        sliceCtx.putImageData(sliceImageData, 0, 0);
        
        // Aplicar deslocamento com wrap-around
        // Calcular posição X com wrap-around
        let xPos = pixelShift % width;
        if (xPos < 0) xPos += width;
        
        // Desenhar fatia na posição deslocada
        ctx.drawImage(sliceCanvas, xPos, startY);
        
        // Se o deslocamento for grande, precisamos desenhar a parte que "volta"
        if (pixelShift > 0 && xPos + width > width) {
            // Parte que sai pela direita volta pela esquerda
            ctx.drawImage(sliceCanvas, xPos - width, startY);
        }
        if (pixelShift < 0 && xPos < Math.abs(pixelShift)) {
            // Parte que sai pela esquerda volta pela direita
            ctx.drawImage(sliceCanvas, xPos + width, startY);
        }
        
        // Para deslocamentos muito grandes, desenhar múltiplas vezes
        if (Math.abs(pixelShift) > width) {
            const repeats = Math.ceil(Math.abs(pixelShift) / width);
            for (let r = 1; r <= repeats; r++) {
                if (pixelShift > 0) {
                    ctx.drawImage(sliceCanvas, xPos - (r * width), startY);
                } else {
                    ctx.drawImage(sliceCanvas, xPos + (r * width), startY);
                }
            }
        }
    }
    
    console.log('✅ Splitter aplicado');
}

// ===================================================================
// ETAPA 2: COLOR CORRECTION
// ===================================================================
function aplicarColorCorrection(ctx, canvas, brightness, saturation, hueOffset) {
    console.log('🎨 Aplicando Color Correction...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Ajustar brilho
        r *= brightness;
        g *= brightness;
        b *= brightness;
        
        // Ajustar saturação
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;
        
        // Rotação de matiz (mesmo algoritmo da Fadiga de Renderização)
        if (hueOffset > 0) {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;
            
            if (diff > 10) {
                let h, s, v;
                
                // Calcular matiz atual
                if (max === r) h = ((g - b) / diff) % 6;
                else if (max === g) h = (b - r) / diff + 2;
                else h = (r - g) / diff + 4;
                
                h = h * 60;
                if (h < 0) h += 360;
                
                // Rotacionar matiz
                h = (h + hueOffset * 360) % 360;
                
                s = diff / max;
                v = max / 255;
                
                // Converter de volta para RGB
                const c = v * s;
                const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
                const m = v - c;
                
                let rNew, gNew, bNew;
                if (h < 60) [rNew, gNew, bNew] = [c, x, 0];
                else if (h < 120) [rNew, gNew, bNew] = [x, c, 0];
                else if (h < 180) [rNew, gNew, bNew] = [0, c, x];
                else if (h < 240) [rNew, gNew, bNew] = [0, x, c];
                else if (h < 300) [rNew, gNew, bNew] = [x, 0, c];
                else [rNew, gNew, bNew] = [c, 0, x];
                
                r = (rNew + m) * 255;
                g = (gNew + m) * 255;
                b = (bNew + m) * 255;
            }
        }
        
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Color correction aplicada');
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS - Gerador de números aleatórios com seed
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

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================
const histeriaDefinition = {
    title: "HISTERIA DE PACOTES",
    definition: `→ <strong>Histeria</strong>: estado de agitação emocional extrema caracterizado por perda de autocontrole, ansiedade intensa e reações desproporcionais.<br><br>→ <strong>Pacotes</strong>: unidades discretas de dados transmitidos através de redes digitais, fragmentados e reorganizados durante a comunicação.`,
    poetry: "Dados fragmentados.<br>Transmissão nervosa.<br>Pacotes perdidos.<br>Comunicação histérica."
};