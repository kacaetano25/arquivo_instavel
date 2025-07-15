// ===================================================================
// MELANCOLIA RENDERIZADA - Arquivo Instável
// ===================================================================

function aplicarMelancolia(ctx, canvas) {
    console.log('🌫️ Aplicando MELANCOLIA RENDERIZADA...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Solarize
        solarizeAmount: 1,          // Intensidade máxima
        solarizeBrightness: 1.5,    // Brilho pré-inversão
        solarizePower: 1.8,         // Curva gamma
        solarizeColorize: 0,        // Desligado (cinza)
        
        // VHS
        vhsText: 0,                 // Sem texto
        vhsStatic: 1,               // Ruído máximo
        vhsBars: 0,                 // Sem barras
        vhsSeed: 0.15,              // Seed do ruído
        
        // Blur
        blurAmount: 0.05,           // Muito sutil
        blurDistance: 0.2,          // Raio pequeno
        
        // Estados dos efeitos (sempre ativos)
        aplicarSolarizeAtivo: true,
        aplicarVHSAtivo: true,
        aplicarBlurAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% nos parâmetros selecionados
    const params = {
        // Solarize
        solarizeAmount: baseParams.solarizeAmount * (0.8 + Math.random() * 0.4),         // 0.8-1.2
        solarizeBrightness: baseParams.solarizeBrightness * (0.8 + Math.random() * 0.4), // 1.2-1.8
        solarizePower: baseParams.solarizePower * (0.8 + Math.random() * 0.4),           // 1.44-2.16
        solarizeColorize: baseParams.solarizeColorize, // FIXO (zero)
        
        // VHS
        vhsText: baseParams.vhsText,        // FIXO (zero)
        vhsStatic: baseParams.vhsStatic * (0.8 + Math.random() * 0.4),       // 0.8-1.2
        vhsBars: baseParams.vhsBars,        // FIXO (zero)
        vhsSeed: baseParams.vhsSeed * (0.8 + Math.random() * 0.4),           // 0.12-0.18
        
        // Blur
        blurAmount: baseParams.blurAmount * (0.8 + Math.random() * 0.4),     // 0.04-0.06
        blurDistance: baseParams.blurDistance * (0.8 + Math.random() * 0.4), // 0.16-0.24
        
        // Estados fixos (sempre ativos)
        aplicarSolarizeAtivo: baseParams.aplicarSolarizeAtivo,
        aplicarVHSAtivo: baseParams.aplicarVHSAtivo,
        aplicarBlurAtivo: baseParams.aplicarBlurAtivo
    };
    
    console.log('📐 Parâmetros Melancolia (com variação ±20%):', params);
    console.log(`🎲 Solarize Amount: ${params.solarizeAmount.toFixed(2)} (base: ${baseParams.solarizeAmount})`);
    console.log(`🎲 Solarize Brightness: ${params.solarizeBrightness.toFixed(2)} (base: ${baseParams.solarizeBrightness})`);
    console.log(`🎲 Solarize Power: ${params.solarizePower.toFixed(2)} (base: ${baseParams.solarizePower})`);
    console.log(`🎲 VHS Static: ${params.vhsStatic.toFixed(2)} (base: ${baseParams.vhsStatic})`);
    console.log(`🎲 VHS Seed: ${params.vhsSeed.toFixed(2)} (base: ${baseParams.vhsSeed})`);
    console.log(`🎲 Blur Amount: ${params.blurAmount.toFixed(2)} (base: ${baseParams.blurAmount})`);
    console.log(`🎲 Blur Distance: ${params.blurDistance.toFixed(2)} (base: ${baseParams.blurDistance})`);
    
    // APLICAR EFEITO EM 3 ETAPAS (ordem do código original)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // ETAPA 1: Solarize
    if (params.aplicarSolarizeAtivo) {
        aplicarSolarize(ctx, canvas, params.solarizeAmount, params.solarizeBrightness, params.solarizePower);
    }
    
    // ETAPA 2: Blur
    if (params.aplicarBlurAtivo) {
        aplicarBlur(ctx, canvas, params.blurAmount, params.blurDistance);
    }
    
    // ETAPA 3: VHS (por último)
    if (params.aplicarVHSAtivo) {
        aplicarVHS(ctx, canvas, params.vhsStatic, params.vhsSeed);
    }
    
    console.log('✅ Melancolia Renderizada aplicada com variação única');
}

// ===================================================================
// ETAPA 1: SOLARIZE
// ===================================================================
function aplicarSolarize(ctx, canvas, amount, brightness, power) {
    console.log('☀️ Aplicando Solarize...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calcular luminância
        let lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        
        // 1. Aplicar power (gamma) antes da solarização
        lum = Math.pow(lum, power);
        
        // 2. Aplicar brightness antes da inversão
        lum *= brightness * 2;
        lum = Math.max(0, Math.min(1, lum));
        
        // 3. Solarização com threshold (inverte só valores acima de 0.5)
        let solarizedLum = lum;
        if (lum > 0.5) {
            solarizedLum = 1 - lum; // Inverte apenas valores acima do threshold
        }
        
        // 4. Misturar com original baseado no amount
        const finalLum = lum + (solarizedLum - lum) * amount;
        
        // 5. Desaturar para cinza (colorize = 0)
        const gray = Math.floor(finalLum * 255);
        
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Solarize aplicado com threshold');
}

// ===================================================================
// ETAPA 2: BLUR
// ===================================================================
function aplicarBlur(ctx, canvas, amount, distance) {
    console.log('🌊 Aplicando Blur...');
    
    if (amount <= 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const originalImageData = ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;
    
    // Criar cópia para processamento
    const blurredImageData = ctx.createImageData(width, height);
    const blurredData = blurredImageData.data;
    
    // Calcular raio do blur
    const radius = Math.floor(distance * 10 * amount);
    if (radius < 1) return;
    
    // Aplicar blur gaussiano
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
            let totalWeight = 0;
            
            // Amostrar pixels ao redor
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        
                        // Peso gaussiano
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const weight = Math.exp(-(distance * distance) / (2 * radius * radius));
                        
                        r += originalData[index] * weight;
                        g += originalData[index + 1] * weight;
                        b += originalData[index + 2] * weight;
                        totalWeight += weight;
                    }
                }
            }
            
            const index = (y * width + x) * 4;
            blurredData[index] = r / totalWeight;
            blurredData[index + 1] = g / totalWeight;
            blurredData[index + 2] = b / totalWeight;
            blurredData[index + 3] = originalData[index + 3];
        }
    }
    
    ctx.putImageData(blurredImageData, 0, 0);
    
    console.log('✅ Blur aplicado');
}

// ===================================================================
// ETAPA 3: VHS (POR ÚLTIMO)
// ===================================================================
function aplicarVHS(ctx, canvas, vhsStatic, vhsSeed) {
    console.log('📼 Aplicando VHS...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Seed sempre diferente baseada no tempo + parâmetro
    const randomVHSSeed = Date.now() * 0.001 + vhsSeed * 1000;
    seedRandom(Math.floor(randomVHSSeed));
    
    // Número de linhas afetadas baseado no static
    const numLines = Math.floor(vhsStatic * 30); // 0 a 30 linhas
    
    console.log(`📼 VHS: Aplicando ${numLines} linhas glitchadas`);
    
    for (let i = 0; i < numLines; i++) {
        // Escolher linha aleatória
        const y = Math.floor(seededRandom() * (height - 3));
        const alturaLinha = Math.floor(seededRandom() * 3) + 1; // 1 a 3 pixels de altura
        
        // Definir deslocamento horizontal
        const deslocamento = Math.floor(seededRandom() * 60) - 30; // -30 a +30
        
        // Copiar as linhas afetadas
        const linhaOriginal = [];
        
        for (let dy = 0; dy < alturaLinha; dy++) {
            if (y + dy < height) {
                for (let x = 0; x < width; x++) {
                    const index = ((y + dy) * width + x) * 4;
                    linhaOriginal.push({
                        r: data[index],
                        g: data[index + 1],
                        b: data[index + 2],
                        a: data[index + 3]
                    });
                }
            }
        }
        
        // Aplicar deslocamento com wraparound
        for (let dy = 0; dy < alturaLinha; dy++) {
            if (y + dy < height) {
                for (let x = 0; x < width; x++) {
                    // Posição de origem com wraparound
                    let sourceX = (x - deslocamento + width) % width;
                    if (sourceX < 0) sourceX += width;
                    
                    const sourceIndex = dy * width + sourceX;
                    
                    // Posição de destino
                    const destIndex = ((y + dy) * width + x) * 4;
                    
                    if (sourceIndex < linhaOriginal.length) {
                        const pixel = linhaOriginal[sourceIndex];
                        
                        // Adicionar ruído cromático sutil
                        const ruido = (seededRandom() - 0.5) * 40; // -20 a +20
                        
                        data[destIndex] = Math.max(0, Math.min(255, pixel.r + ruido));
                        data[destIndex + 1] = Math.max(0, Math.min(255, pixel.g + ruido));
                        data[destIndex + 2] = Math.max(0, Math.min(255, pixel.b + ruido));
                        data[destIndex + 3] = pixel.a;
                    }
                }
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log(`✅ VHS aplicado com ${numLines} linhas deslocadas`);
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS
// ===================================================================

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

// Melancolia: estado de tristeza vaga e pensativa, frequentemente acompanhado 
// por uma sensação de desconexão com o mundo e perda de interesse nas atividades cotidianas