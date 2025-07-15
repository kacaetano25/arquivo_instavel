// ===================================================================
// FADIGA DE RENDERIZAÇÃO - Efeito Puro com Aleatoriedade
// Grain + Color Correction + Decimate (Corrupção de Blocos)
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarFadiga(ctx, canvas) {
    console.log('💻 Aplicando FADIGA DE RENDERIZAÇÃO...');
    
    // PARÂMETROS BASE (valores que funcionaram perfeitamente)
    const baseParams = {
        decimateAmount: 0.6,   // 60% intensidade da corrupção de blocos
        grainAmount: 3,        // 3x intensidade do ruído
        brightness: 1,         // 100% brilho da imagem
        contrast: 2,           // 2x contraste
        saturation: 0.6,       // 60% saturação das cores
        hueOffset: 0.31,       // 31% rotação das cores (verde/ciano)
        
        // Estados dos efeitos (sempre ativos para máximo impacto)
        aplicarDecimateAtivo: true,
        aplicarGrainAtivo: true,
        aplicarColorAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        decimateAmount: baseParams.decimateAmount * (0.8 + Math.random() * 0.4), // 0.48-0.72
        grainAmount: baseParams.grainAmount * (0.8 + Math.random() * 0.4),       // 2.4-3.6
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),         // 0.8-1.2
        contrast: baseParams.contrast * (0.8 + Math.random() * 0.4),             // 1.6-2.4
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),         // 0.48-0.72
        hueOffset: baseParams.hueOffset * (0.8 + Math.random() * 0.4),           // 0.25-0.37
        
        // Estados fixos (sempre ativos)
        aplicarDecimateAtivo: baseParams.aplicarDecimateAtivo,
        aplicarGrainAtivo: baseParams.aplicarGrainAtivo,
        aplicarColorAtivo: baseParams.aplicarColorAtivo,
        
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Fadiga (com variação ±20%):', params);
    console.log(`🎲 Decimate Amount: ${params.decimateAmount.toFixed(2)} (base: ${baseParams.decimateAmount})`);
    console.log(`🎲 Grain Amount: ${params.grainAmount.toFixed(2)} (base: ${baseParams.grainAmount})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Contrast: ${params.contrast.toFixed(2)} (base: ${baseParams.contrast})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(2)} (base: ${baseParams.saturation})`);
    console.log(`🎲 Hue Offset: ${params.hueOffset.toFixed(2)} (base: ${baseParams.hueOffset})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // APLICAR EFEITO EM 3 ETAPAS (ordem do código original que funcionou)
    seedRandom(params.seed);
    
    // ETAPA 1: Grain (ruído pixelado)
    if (params.aplicarGrainAtivo) {
        aplicarGrain(ctx, canvas, params.grainAmount);
    }
    
    // ETAPA 2: Color Correction (brilho, contraste, saturação, hue shift)
    if (params.aplicarColorAtivo) {
        aplicarColorCorrection(ctx, canvas, params.brightness, params.contrast, params.saturation, params.hueOffset);
    }
    
    // ETAPA 3: Decimate (corrupção de blocos) - por último para máximo impacto visual
    if (params.aplicarDecimateAtivo) {
        aplicarDecimate(ctx, canvas, params.decimateAmount);
    }
    
    console.log('✅ Fadiga de Renderização aplicada com variação única');
}

// ===================================================================
// ETAPA 1: GRAIN (RUÍDO PIXELADO)
// ===================================================================
function aplicarGrain(ctx, canvas, grainAmount) {
    console.log('📺 Aplicando Grain...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Adiciona ruído suave a todos os canais RGB
        const noise = (seededRandom() - 0.5) * grainAmount * 50;
        
        data[i] = Math.max(0, Math.min(255, data[i] + noise));         // R
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        // Alpha permanece inalterado
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log(`✅ Grain aplicado com intensidade: ${grainAmount.toFixed(2)}`);
}

// ===================================================================
// ETAPA 2: COLOR CORRECTION (BRILHO, CONTRASTE, SATURAÇÃO, HUE SHIFT)
// ===================================================================
function aplicarColorCorrection(ctx, canvas, brightness, contrast, saturation, hueOffset) {
    console.log('🎨 Aplicando Color Correction...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Ajusta brilho
        r *= brightness;
        g *= brightness;
        b *= brightness;
        
        // Ajusta contraste
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;
        
        // Ajusta saturação
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;
        
        // Rotação de matiz (hue offset) para tons verde/ciano
        if (hueOffset > 0) {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;
            
            if (diff > 10) {
                let h, s, v;
                
                // Calcula matiz atual
                if (max === r) h = ((g - b) / diff) % 6;
                else if (max === g) h = (b - r) / diff + 2;
                else h = (r - g) / diff + 4;
                
                h = h * 60;
                if (h < 0) h += 360;
                
                // Roda a matiz
                h = (h + hueOffset * 360) % 360;
                
                s = diff / max;
                v = max / 255;
                
                // Converte de volta para RGB
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
// ETAPA 3: DECIMATE (CORRUPÇÃO DE BLOCOS) - O CORAÇÃO DO EFEITO
// ===================================================================
function aplicarDecimate(ctx, canvas, decimateAmount) {
    console.log('🔥 Aplicando Decimate (corrupção de blocos)...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let blocosAlterados = 0;
    
    // DECIMATE POR BLOCOS QUADRADOS com tamanhos aleatórios
    for (let x = 0; x < width; x += Math.floor(seededRandom() * 12 + 4)) {  // Steps de 4-16px
        for (let y = 0; y < height; y += Math.floor(seededRandom() * 12 + 4)) {  // Steps de 4-16px
            
            // Decide se este bloco será corrompido
            if (seededRandom() < decimateAmount * 0.08) {
                const blockSize = Math.floor(seededRandom() * 25 + 15);  // Blocos de 15-40px
                const corruptionType = seededRandom();
                
                if (corruptionType < 0.98) {
                    // SHIFT DE BLOCO - 98% dos casos
                    // Pega bloco de outro lugar da imagem
                    const offsetX = Math.floor((seededRandom() - 0.5) * 200);  // -100 a +100px
                    const offsetY = Math.floor((seededRandom() - 0.5) * 200);  // -100 a +100px
                    
                    for (let bx = 0; bx < blockSize; bx++) {
                        for (let by = 0; by < blockSize; by++) {
                            const currentX = x + bx;
                            const currentY = y + by;
                            const sourceX = Math.max(0, Math.min(width - 1, currentX + offsetX));
                            const sourceY = Math.max(0, Math.min(height - 1, currentY + offsetY));
                            
                            if (currentX < width && currentY < height) {
                                const currentIndex = (currentY * width + currentX) * 4;
                                const sourceIndex = (sourceY * width + sourceX) * 4;
                                
                                data[currentIndex] = data[sourceIndex];         // R
                                data[currentIndex + 1] = data[sourceIndex + 1]; // G
                                data[currentIndex + 2] = data[sourceIndex + 2]; // B
                                // Alpha permanece inalterado
                            }
                        }
                    }
                } else if (corruptionType < 0.9) {
                    // BLOCO PRETO - casos raros mas impactantes
                    for (let bx = 0; bx < blockSize; bx++) {
                        for (let by = 0; by < blockSize; by++) {
                            const px = x + bx;
                            const py = y + by;
                            
                            if (px < width && py < height) {
                                const index = (py * width + px) * 4;
                                data[index] = 0;     // R
                                data[index + 1] = 0; // G
                                data[index + 2] = 0; // B
                            }
                        }
                    }
                } else {
                    // BLOCO COM COR ALEATÓRIA - casos muito raros
                    const r = Math.floor(seededRandom() * 255);
                    const g = Math.floor(seededRandom() * 255);
                    const b = Math.floor(seededRandom() * 255);
                    
                    for (let bx = 0; bx < blockSize; bx++) {
                        for (let by = 0; by < blockSize; by++) {
                            const px = x + bx;
                            const py = y + by;
                            
                            if (px < width && py < height) {
                                const index = (py * width + px) * 4;
                                data[index] = r;
                                data[index + 1] = g;
                                data[index + 2] = b;
                            }
                        }
                    }
                }
                
                blocosAlterados++;
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log(`✅ Decimate: ${blocosAlterados} blocos corrompidos`);
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
const fadigaDefinition = {
    title: "FADIGA DE RENDERIZAÇÃO",
    definition: `→ <strong>Fadiga</strong>: estado de esgotamento físico ou mental resultante de esforço prolongado, caracterizado por diminuição da capacidade de resposta e deterioração da performance.<br><br>→ <strong>Renderização</strong>: processo computacional de geração de imagem final a partir de dados digitais, envolvendo cálculos intensivos de cor, luz e geometria.`,
    poetry: "Hardware exausto.<br>Pixels corrompidos.<br>Memória fragmentada.<br>Sistema sobrecarregado."
};