// ===================================================================
// NÁUSEA DE SCROLL - Arquivo Instável
// ===================================================================

function aplicarNausea(ctx, canvas) {
    console.log('🤢 Aplicando NÁUSEA DE SCROLL...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Distorção Geométrica
        wobbleAmount: 0.1,      // Intensidade wobble
        wobbleSize: 0.5,        // Escala do ruído
        waveAmount: 0.07,       // Força da onda
        waveSize: 0.74,         // Comprimento da onda
        wavePosition: 0.7,      // Posição da onda
        waveAngle: 0.59,        // Ângulo da onda
        
        // Light Streak
        lightStreakAmount: 0.97,  // Intensidade motion blur
        lightStreakAngle: 0.25,   // Direção do blur
        lightStreakSeed: 0.49,    // Seed do streak
        
        // Correção de Cor
        brightness: 0.5,        // 50% brilho
        contrast: 0.25,         // 25% contraste
        saturation: 0.3,        // 30% saturação
        hueOffset: 0.71,        // 71% rotação matiz (roxo)
        
        // Estados (sempre ativos)
        aplicarDistorcaoAtivo: true,
        aplicarLightStreakAtivo: true,
        aplicarCorrecaoAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% nos parâmetros selecionados
    const params = {
        // Distorção - com variação
        wobbleAmount: baseParams.wobbleAmount * (0.8 + Math.random() * 0.4),     // 0.08-0.12
        wobbleSize: baseParams.wobbleSize,                                        // FIXO
        waveAmount: baseParams.waveAmount * (0.8 + Math.random() * 0.4),         // 0.056-0.084
        waveSize: baseParams.waveSize,                                            // FIXO
        wavePosition: baseParams.wavePosition * (0.8 + Math.random() * 0.4),     // 0.56-0.84
        waveAngle: baseParams.waveAngle,                                          // FIXO
        
        // Light Streak - com variação
        lightStreakAmount: baseParams.lightStreakAmount * (0.8 + Math.random() * 0.4),  // 0.776-1.164
        lightStreakAngle: baseParams.lightStreakAngle * (0.8 + Math.random() * 0.4),    // 0.2-0.3
        lightStreakSeed: baseParams.lightStreakSeed * (0.8 + Math.random() * 0.4),      // 0.392-0.588
        
        // Correção de Cor - com variação
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),        // 0.4-0.6
        contrast: baseParams.contrast,                                            // FIXO
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),        // 0.24-0.36
        hueOffset: baseParams.hueOffset * (0.8 + Math.random() * 0.4),          // 0.568-0.852
        
        // Estados fixos (sempre ativos)
        aplicarDistorcaoAtivo: baseParams.aplicarDistorcaoAtivo,
        aplicarLightStreakAtivo: baseParams.aplicarLightStreakAtivo,
        aplicarCorrecaoAtivo: baseParams.aplicarCorrecaoAtivo
    };
    
    console.log('📐 Parâmetros Náusea (com variação ±20%):', params);
    console.log(`🎲 Wobble Amount: ${params.wobbleAmount.toFixed(3)} (base: ${baseParams.wobbleAmount})`);
    console.log(`🎲 Wave Amount: ${params.waveAmount.toFixed(3)} (base: ${baseParams.waveAmount})`);
    console.log(`🎲 Wave Position: ${params.wavePosition.toFixed(2)} (base: ${baseParams.wavePosition})`);
    console.log(`🎲 Light Streak Amount: ${params.lightStreakAmount.toFixed(2)} (base: ${baseParams.lightStreakAmount})`);
    console.log(`🎲 Light Streak Angle: ${params.lightStreakAngle.toFixed(2)} (base: ${baseParams.lightStreakAngle})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(2)} (base: ${baseParams.saturation})`);
    console.log(`🎲 Hue Offset: ${params.hueOffset.toFixed(2)} (base: ${baseParams.hueOffset})`);
    
    // APLICAR EFEITO EM 3 ETAPAS (ordem do código original)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // ETAPA 1: Distorção Geométrica
    if (params.aplicarDistorcaoAtivo) {
        aplicarDistorcaoGeometrica(ctx, canvas, params);
    }
    
    // ETAPA 2: Light Streak (Motion Blur)
    if (params.aplicarLightStreakAtivo) {
        aplicarLightStreak(ctx, canvas, params);
    }
    
    // ETAPA 3: Correção de Cor
    if (params.aplicarCorrecaoAtivo) {
        aplicarCorrecaoDeCor(ctx, canvas, params);
    }
    
    console.log('✅ Náusea de Scroll aplicada com variação única');
}

// ===================================================================
// ETAPA 1: DISTORÇÃO GEOMÉTRICA
// ===================================================================
function aplicarDistorcaoGeometrica(ctx, canvas, params) {
    console.log('🌀 Aplicando Distorção Geométrica...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const originalImageData = ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;
    
    // Criar nova imageData para resultado
    const distortedImageData = ctx.createImageData(width, height);
    const distortedData = distortedImageData.data;
    
    // Seed para ruído consistente
    seedRandom(42);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Wobble (ruído fractal)
            const noiseScale = (1.1 - params.wobbleSize) * 0.1;
            const qx = noise(x * noiseScale, y * noiseScale, 10);
            const qy = noise(x * noiseScale, y * noiseScale, 20);
            const rx = noise(x * noiseScale + qx, y * noiseScale + qy, 30);
            const ry = noise(x * noiseScale + qx, y * noiseScale + qy, 40);
            
            const wobbleX = (rx * 2 - 1);
            const wobbleY = (ry * 2 - 1);
            const wobbleAmount = params.wobbleAmount * width;
            
            // Wave (onda senoidal)
            const waveAngle = params.waveAngle * Math.PI * 2;
            const waveLength = (1.1 - params.waveSize) * height;
            const wavePosition = params.wavePosition * Math.PI * 2;
            
            const projection = x * Math.cos(waveAngle) + y * Math.sin(waveAngle);
            const waveValue = Math.sin(projection / waveLength + wavePosition);
            const waveAmountPixels = params.waveAmount * width;
            
            const waveX = waveValue * Math.cos(waveAngle) * waveAmountPixels;
            const waveY = waveValue * Math.sin(waveAngle) * waveAmountPixels;
            
            // Deslocamento total
            const totalDisplacementX = x + (wobbleX * wobbleAmount) + waveX;
            const totalDisplacementY = y + (wobbleY * wobbleAmount) + waveY;
            
            // Clamp coordinates
            const sourceX = Math.max(0, Math.min(width - 1, Math.floor(totalDisplacementX)));
            const sourceY = Math.max(0, Math.min(height - 1, Math.floor(totalDisplacementY)));
            
            // Copiar pixel
            const sourceIndex = (sourceY * width + sourceX) * 4;
            const destIndex = (y * width + x) * 4;
            
            distortedData[destIndex] = originalData[sourceIndex];
            distortedData[destIndex + 1] = originalData[sourceIndex + 1];
            distortedData[destIndex + 2] = originalData[sourceIndex + 2];
            distortedData[destIndex + 3] = originalData[sourceIndex + 3];
        }
    }
    
    ctx.putImageData(distortedImageData, 0, 0);
    
    console.log('✅ Distorção Geométrica aplicada');
}

// ===================================================================
// ETAPA 2: LIGHT STREAK (MOTION BLUR)
// ===================================================================
function aplicarLightStreak(ctx, canvas, params) {
    console.log('💫 Aplicando Light Streak...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const originalImageData = ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;
    
    // Criar nova imageData para resultado
    const streakImageData = ctx.createImageData(width, height);
    const streakData = streakImageData.data;
    
    // Calcular direção do motion blur
    const streakAngle = params.lightStreakAngle * Math.PI * 2;
    const cosAngle = Math.cos(streakAngle);
    const sinAngle = Math.sin(streakAngle);
    const maxStreakLength = params.lightStreakAmount * 100;
    
    console.log(`💫 Motion blur: ângulo ${(params.lightStreakAngle * 360).toFixed(1)}°, distância ${maxStreakLength.toFixed(1)}px`);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const currentIndex = (y * width + x) * 4;
            
            let r = originalData[currentIndex];
            let g = originalData[currentIndex + 1];
            let b = originalData[currentIndex + 2];
            let a = originalData[currentIndex + 3];
            let totalSamples = 1;
            
            // Amostrar pixels ao longo da direção do motion blur
            const numSamples = 10;
            for (let i = 1; i <= numSamples; i++) {
                const sampleDist = (i / numSamples) * maxStreakLength;
                const sampleX = Math.floor(x - cosAngle * sampleDist);
                const sampleY = Math.floor(y - sinAngle * sampleDist);
                
                if (sampleX >= 0 && sampleX < width && sampleY >= 0 && sampleY < height) {
                    const sampleIndex = (sampleY * width + sampleX) * 4;
                    
                    r += originalData[sampleIndex];
                    g += originalData[sampleIndex + 1];
                    b += originalData[sampleIndex + 2];
                    totalSamples++;
                }
            }
            
            // Média das amostras
            streakData[currentIndex] = r / totalSamples;
            streakData[currentIndex + 1] = g / totalSamples;
            streakData[currentIndex + 2] = b / totalSamples;
            streakData[currentIndex + 3] = a;
        }
    }
    
    ctx.putImageData(streakImageData, 0, 0);
    
    console.log('✅ Light Streak aplicado');
}

// ===================================================================
// ETAPA 3: CORREÇÃO DE COR
// ===================================================================
function aplicarCorrecaoDeCor(ctx, canvas, params) {
    console.log('🎨 Aplicando Correção de Cor...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Ajustar brilho (multiplicar por 2 para mapear 0.5 → 100%)
        const brightnessMultiplier = params.brightness * 2;
        r *= brightnessMultiplier;
        g *= brightnessMultiplier;
        b *= brightnessMultiplier;
        
        // Ajustar contraste (0.25 → 1.5)
        const contrastMultiplier = params.contrast * 2 + 1;
        r = ((r / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        g = ((g / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        b = ((b / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        
        // Ajustar saturação (multiplicar por 2 para mapear 0.3 → 60%)
        const saturationMultiplier = params.saturation * 2;
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturationMultiplier;
        g = gray + (g - gray) * saturationMultiplier;
        b = gray + (b - gray) * saturationMultiplier;
        
        // Rotação de matiz (0.71 → 255.6 graus)
        const hueRotation = params.hueOffset * 360;
        if (hueRotation > 0) {
            // Converter RGB para HSV
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;
            
            if (diff > 10) { // Só processar se há cor suficiente
                let h, s, v;
                
                // Calcular matiz
                if (max === r) h = ((g - b) / diff) % 6;
                else if (max === g) h = (b - r) / diff + 2;
                else h = (r - g) / diff + 4;
                
                h = h * 60;
                if (h < 0) h += 360;
                
                // Aplicar rotação
                h = (h + hueRotation) % 360;
                
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
        
        // Clamp valores
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Correção de Cor aplicada');
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

// Função de ruído simplificada (Perlin noise approximation)
function noise(x, y, z = 0) {
    // Implementação simplificada de ruído
    const p = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
        140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
        247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
        57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175
    ];
    
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;
    
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
    
    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);
    
    const aaa = p[p[p[xi] + yi] + zi];
    const aba = p[p[p[xi] + yi + 1] + zi];
    const aab = p[p[p[xi] + yi] + zi + 1];
    const abb = p[p[p[xi] + yi + 1] + zi + 1];
    const baa = p[p[p[xi + 1] + yi] + zi];
    const bba = p[p[p[xi + 1] + yi + 1] + zi];
    const bab = p[p[p[xi + 1] + yi] + zi + 1];
    const bbb = p[p[p[xi + 1] + yi + 1] + zi + 1];
    
    const x1 = lerp(grad(aaa, xf, yf, zf), grad(baa, xf - 1, yf, zf), u);
    const x2 = lerp(grad(aba, xf, yf - 1, zf), grad(bba, xf - 1, yf - 1, zf), u);
    const y1 = lerp(x1, x2, v);
    
    const x3 = lerp(grad(aab, xf, yf, zf - 1), grad(bab, xf - 1, yf, zf - 1), u);
    const x4 = lerp(grad(abb, xf, yf - 1, zf - 1), grad(bbb, xf - 1, yf - 1, zf - 1), u);
    const y2 = lerp(x3, x4, v);
    
    return (lerp(y1, y2, w) + 1) / 2;
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
    return a + t * (b - a);
}

function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================

// Náusea: sensação desagradável de mal-estar estomacal frequentemente acompanhada 
// por vontade de vomitar, causada por movimento, ansiedade ou perturbação sensorial