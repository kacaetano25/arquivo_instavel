// ===================================================================
// SOLASTALGIA PIXELIZADA - Arquivo Instável
// ===================================================================

function aplicarSolastalgia(ctx, canvas) {
    console.log('🌿 Aplicando SOLASTALGIA PIXELIZADA...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Pixelate (Etapa 3)
        pixelateAmount: 0.67,       // Intensidade da pixelização
        pixelateHorizPixels: 25,    // Blocos horizontais
        pixelateVertPixels: 25,     // Blocos verticais
        
        // Melt (Etapa 2)
        meltAmount: 0.3,            // Intensidade do derretimento
        meltScale: 1,               // Escala do noise
        meltSpeed: 0.1,             // Velocidade do efeito
        meltSeed: 8,                // Seed específico
        
        // Decimate (Etapa 4)
        decimateAmount: 0.5,        // Quantidade de glitches
        decimateWashoutAmount: 0.6, // Intensidade do wash out
        
        // Holes (Etapa 5)
        holesAmount: 0.25,          // Quantidade de buracos
        holesSize: 20,              // Tamanho dos buracos
        holesNoiseScale: 0.05,      // Escala do noise dos buracos
        
        // Color Correction (Etapa 1 - PRIMEIRO!)
        brightness: 0.65,           // Brilho
        contrast: 0.8,              // Contraste
        saturation: 0.8,            // Saturação
        hueOffset: -0.02,           // Shift para vermelho
        
        // Estados (sempre ativos)
        aplicarColorCorrectionAtivo: true,
        aplicarMeltAtivo: true,
        aplicarPixelateAtivo: true,
        aplicarDecimateAtivo: true,
        aplicarHolesAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% nos parâmetros selecionados
    const params = {
        // Pixelate - com variação
        pixelateAmount: baseParams.pixelateAmount * (0.8 + Math.random() * 0.4),         // 0.536-0.804
        pixelateHorizPixels: Math.floor(baseParams.pixelateHorizPixels * (0.8 + Math.random() * 0.4)), // 20-30
        pixelateVertPixels: Math.floor(baseParams.pixelateVertPixels * (0.8 + Math.random() * 0.4)),   // 20-30
        
        // Melt - com variação
        meltAmount: baseParams.meltAmount * (0.8 + Math.random() * 0.4),               // 0.24-0.36
        meltScale: baseParams.meltScale * (0.8 + Math.random() * 0.4),                 // 0.8-1.2
        meltSpeed: baseParams.meltSpeed * (0.8 + Math.random() * 0.4),                 // 0.08-0.12
        meltSeed: baseParams.meltSeed,                                                  // FIXO
        
        // Decimate - com variação
        decimateAmount: baseParams.decimateAmount * (0.8 + Math.random() * 0.4),       // 0.4-0.6
        decimateWashoutAmount: baseParams.decimateWashoutAmount * (0.8 + Math.random() * 0.4), // 0.48-0.72
        
        // Holes - com variação
        holesAmount: baseParams.holesAmount * (0.8 + Math.random() * 0.4),             // 0.2-0.3
        holesSize: Math.floor(baseParams.holesSize * (0.8 + Math.random() * 0.4)),     // 16-24
        holesNoiseScale: baseParams.holesNoiseScale * (0.8 + Math.random() * 0.4),     // 0.04-0.06
        
        // Color Correction - com variação
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),              // 0.52-0.78
        contrast: baseParams.contrast * (0.8 + Math.random() * 0.4),                  // 0.64-0.96
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),              // 0.64-0.96
        hueOffset: baseParams.hueOffset * (0.8 + Math.random() * 0.4),                // -0.016 a -0.024
        
        // Estados fixos (sempre ativos)
        aplicarColorCorrectionAtivo: baseParams.aplicarColorCorrectionAtivo,
        aplicarMeltAtivo: baseParams.aplicarMeltAtivo,
        aplicarPixelateAtivo: baseParams.aplicarPixelateAtivo,
        aplicarDecimateAtivo: baseParams.aplicarDecimateAtivo,
        aplicarHolesAtivo: baseParams.aplicarHolesAtivo
    };
    
    console.log('📐 Parâmetros Solastalgia (com variação ±20%):', params);
    console.log(`🎲 Pixelate Amount: ${params.pixelateAmount.toFixed(3)} (base: ${baseParams.pixelateAmount})`);
    console.log(`🎲 Pixelate Horiz Pixels: ${params.pixelateHorizPixels} (base: ${baseParams.pixelateHorizPixels})`);
    console.log(`🎲 Pixelate Vert Pixels: ${params.pixelateVertPixels} (base: ${baseParams.pixelateVertPixels})`);
    console.log(`🎲 Melt Amount: ${params.meltAmount.toFixed(2)} (base: ${baseParams.meltAmount})`);
    console.log(`🎲 Melt Scale: ${params.meltScale.toFixed(2)} (base: ${baseParams.meltScale})`);
    console.log(`🎲 Melt Speed: ${params.meltSpeed.toFixed(3)} (base: ${baseParams.meltSpeed})`);
    console.log(`🎲 Decimate Amount: ${params.decimateAmount.toFixed(2)} (base: ${baseParams.decimateAmount})`);
    console.log(`🎲 Decimate Washout: ${params.decimateWashoutAmount.toFixed(2)} (base: ${baseParams.decimateWashoutAmount})`);
    console.log(`🎲 Holes Amount: ${params.holesAmount.toFixed(2)} (base: ${baseParams.holesAmount})`);
    console.log(`🎲 Holes Size: ${params.holesSize} (base: ${baseParams.holesSize})`);
    console.log(`🎲 Holes Noise Scale: ${params.holesNoiseScale.toFixed(3)} (base: ${baseParams.holesNoiseScale})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Contrast: ${params.contrast.toFixed(2)} (base: ${baseParams.contrast})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(2)} (base: ${baseParams.saturation})`);
    console.log(`🎲 Hue Offset: ${params.hueOffset.toFixed(3)} (base: ${baseParams.hueOffset})`);
    
    // APLICAR EFEITO EM 5 ETAPAS (ORDEM CORRETA DO P5.JS ORIGINAL!)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // Criar canvas temporário para processar etapas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copiar imagem original para o canvas temporário
    tempCtx.drawImage(canvas, 0, 0);
    
    // ETAPA 1: Color Correction (PRIMEIRO!)
    if (params.aplicarColorCorrectionAtivo) {
        aplicarColorCorrection(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 2: Melt
    if (params.aplicarMeltAtivo) {
        aplicarMelt(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 3: Pixelate
    if (params.aplicarPixelateAtivo) {
        aplicarPixelate(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 4: Decimate (Datamosh com Wash Out)
    if (params.aplicarDecimateAtivo) {
        aplicarDecimate(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 5: Holes (Buracos Brancos)
    if (params.aplicarHolesAtivo) {
        aplicarHoles(tempCtx, tempCanvas, params);
    }
    
    // Desenhar resultado final
    ctx.drawImage(tempCanvas, 0, 0);
    
    console.log('✅ Solastalgia Pixelizada aplicada com variação única');
}

// ===================================================================
// ETAPA 1: COLOR CORRECTION (PRIMEIRO!)
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
        
        // Aplicar brilho (brightness * 2)
        const brightnessMultiplier = params.brightness * 2;
        r *= brightnessMultiplier;
        g *= brightnessMultiplier;
        b *= brightnessMultiplier;
        
        // Aplicar contraste (1 + contrast)
        const contrastMultiplier = 1 + params.contrast;
        r = ((r / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        g = ((g / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        b = ((b / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        
        // Aplicar saturação (saturation * 2)
        const saturationMultiplier = params.saturation * 2;
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturationMultiplier;
        g = gray + (g - gray) * saturationMultiplier;
        b = gray + (b - gray) * saturationMultiplier;
        
        // Aplicar rotação de matiz (hueOffset * 360)
        const hueRotation = params.hueOffset * 360;
        if (Math.abs(hueRotation) > 1) {
            // Converter RGB para HSV
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;
            
            if (diff > 10) {
                let h, s, v;
                
                // Calcular matiz
                if (max === r) h = ((g - b) / diff) % 6;
                else if (max === g) h = (b - r) / diff + 2;
                else h = (r - g) / diff + 4;
                
                h = h * 60;
                if (h < 0) h += 360;
                
                // Aplicar rotação
                h = (h + hueRotation) % 360;
                if (h < 0) h += 360;
                
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
    
    console.log('✅ Color Correction aplicada');
}

// ===================================================================
// ETAPA 2: MELT
// ===================================================================
function aplicarMelt(ctx, canvas, params) {
    console.log('🌊 Aplicando Melt...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    const sourceData = sourceImageData.data;
    
    // Criar nova imageData para resultado
    const meltImageData = ctx.createImageData(width, height);
    const meltData = meltImageData.data;
    
    // Configurar noise seed
    seedRandom(params.meltSeed);
    
    // Calcular parâmetros
    const noiseScale = (1 - params.meltScale) * 0.001 + params.meltScale * 0.0275;
    const displacement = params.meltAmount * 100;
    const time = params.meltSpeed;
    
    console.log(`🌊 Melt: noiseScale=${noiseScale.toFixed(6)}, displacement=${displacement.toFixed(1)}, time=${time}`);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Calcular offsets com noise
            const offsetX = (noise(x * noiseScale, y * noiseScale, time) * 2 - 1) * displacement;
            const offsetY = (noise(x * noiseScale, y * noiseScale, time + 1000) * 2 - 1) * displacement;
            
            // Calcular posição de amostragem
            const sampleX = Math.max(0, Math.min(width - 1, Math.floor(x + offsetX)));
            const sampleY = Math.max(0, Math.min(height - 1, Math.floor(y + offsetY)));
            
            // Copiar pixel
            const sourceIndex = (sampleY * width + sampleX) * 4;
            const destIndex = (y * width + x) * 4;
            
            meltData[destIndex] = sourceData[sourceIndex];
            meltData[destIndex + 1] = sourceData[sourceIndex + 1];
            meltData[destIndex + 2] = sourceData[sourceIndex + 2];
            meltData[destIndex + 3] = sourceData[sourceIndex + 3];
        }
    }
    
    ctx.putImageData(meltImageData, 0, 0);
    
    console.log('✅ Melt aplicado');
}

// ===================================================================
// ETAPA 3: PIXELATE
// ===================================================================
function aplicarPixelate(ctx, canvas, params) {
    console.log('🔲 Aplicando Pixelate...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar canvas para pixelização
    const pixelCanvas = document.createElement('canvas');
    pixelCanvas.width = width;
    pixelCanvas.height = height;
    const pixelCtx = pixelCanvas.getContext('2d');
    
    // Calcular tamanho dos blocos
    const blockWidth = width / params.pixelateHorizPixels;
    const blockHeight = height / params.pixelateVertPixels;
    
    console.log(`🔲 Pixelate: blockWidth=${blockWidth.toFixed(1)}, blockHeight=${blockHeight.toFixed(1)}`);
    
    // Gerar blocos pixelizados
    for (let y = 0; y < height; y += blockHeight) {
        for (let x = 0; x < width; x += blockWidth) {
            // Obter cor do centro do bloco
            const sampleX = Math.floor(x + blockWidth / 2);
            const sampleY = Math.floor(y + blockHeight / 2);
            
            if (sampleX < width && sampleY < height) {
                const pixelIndex = (sampleY * width + sampleX) * 4;
                const r = sourceImageData.data[pixelIndex];
                const g = sourceImageData.data[pixelIndex + 1];
                const b = sourceImageData.data[pixelIndex + 2];
                
                // Desenhar bloco
                pixelCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                pixelCtx.fillRect(x, y, blockWidth, blockHeight);
            }
        }
    }
    
    // Aplicar overlay com transparência
    const alpha = params.pixelateAmount;
    ctx.globalAlpha = 1 - alpha;
    ctx.drawImage(canvas, 0, 0);
    ctx.globalAlpha = alpha;
    ctx.drawImage(pixelCanvas, 0, 0);
    ctx.globalAlpha = 1;
    
    console.log('✅ Pixelate aplicado');
}

// ===================================================================
// ETAPA 4: DECIMATE (DATAMOSH COM WASH OUT)
// ===================================================================
function aplicarDecimate(ctx, canvas, params) {
    console.log('💥 Aplicando Decimate...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    const sourceData = sourceImageData.data;
    
    // Criar nova imageData para resultado
    const decimateImageData = ctx.createImageData(width, height);
    const decimateData = decimateImageData.data;
    
    // Copiar dados originais
    for (let i = 0; i < sourceData.length; i++) {
        decimateData[i] = sourceData[i];
    }
    
    // Calcular número de glitches
    const numGlitches = Math.floor(params.decimateAmount * 20);
    
    console.log(`💥 Decimate: criando ${numGlitches} glitches`);
    
    for (let i = 0; i < numGlitches; i++) {
        const glitchX = Math.floor(Math.random() * width);
        const glitchY = Math.floor(Math.random() * height);
        const glitchW = Math.floor(Math.random() * 150 + 50); // 50-200
        const glitchH = Math.floor(Math.random() * 40 + 10);  // 10-50
        const glitchType = Math.floor(Math.random() * 3);
        
        if (glitchType === 0) {
            // Tipo 0: Shift displacement
            const shiftX = Math.floor(Math.random() * 100 - 50); // -50 a +50
            const shiftY = Math.floor(Math.random() * 40 - 20);  // -20 a +20
            
            for (let y = glitchY; y < Math.min(glitchY + glitchH, height); y++) {
                for (let x = glitchX; x < Math.min(glitchX + glitchW, width); x++) {
                    const srcX = Math.max(0, Math.min(width - 1, x + shiftX));
                    const srcY = Math.max(0, Math.min(height - 1, y + shiftY));
                    
                    const srcIndex = (srcY * width + srcX) * 4;
                    const dstIndex = (y * width + x) * 4;
                    
                    decimateData[dstIndex] = sourceData[srcIndex];
                    decimateData[dstIndex + 1] = sourceData[srcIndex + 1];
                    decimateData[dstIndex + 2] = sourceData[srcIndex + 2];
                }
            }
        } else if (glitchType === 1) {
            // Tipo 1: Wash Out (mistura com branco)
            for (let y = glitchY; y < Math.min(glitchY + glitchH, height); y++) {
                for (let x = glitchX; x < Math.min(glitchX + glitchW, width); x++) {
                    const idx = (y * width + x) * 4;
                    
                    const r = decimateData[idx];
                    const g = decimateData[idx + 1];
                    const b = decimateData[idx + 2];
                    
                    // Misturar com branco
                    const washout = params.decimateWashoutAmount;
                    decimateData[idx] = r + (255 - r) * washout;
                    decimateData[idx + 1] = g + (255 - g) * washout;
                    decimateData[idx + 2] = b + (255 - b) * washout;
                }
            }
        } else {
            // Tipo 2: Line repetition
            const srcY = glitchY;
            for (let y = glitchY; y < Math.min(glitchY + glitchH, height); y++) {
                if (srcY >= height) continue;
                for (let x = glitchX; x < Math.min(glitchX + glitchW, width); x++) {
                    const srcIndex = (srcY * width + x) * 4;
                    const dstIndex = (y * width + x) * 4;
                    
                    decimateData[dstIndex] = sourceData[srcIndex];
                    decimateData[dstIndex + 1] = sourceData[srcIndex + 1];
                    decimateData[dstIndex + 2] = sourceData[srcIndex + 2];
                }
            }
        }
    }
    
    ctx.putImageData(decimateImageData, 0, 0);
    
    console.log('✅ Decimate aplicado');
}

// ===================================================================
// ETAPA 5: HOLES (BURACOS BRANCOS)
// ===================================================================
function aplicarHoles(ctx, canvas, params) {
    console.log('⚪ Aplicando Holes...');
    
    const width = canvas.width;
    const height = canvas.height;
    const blockSize = params.holesSize;
    
    // Seed para consistência
    seedRandom(123);
    
    console.log(`⚪ Holes: blockSize=${blockSize}, amount=${params.holesAmount.toFixed(2)}, noiseScale=${params.holesNoiseScale.toFixed(3)}`);
    
    // Configurar desenho
    ctx.fillStyle = 'white';
    
    // Criar buracos baseados em noise
    for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
            const noiseValue = noise(x * params.holesNoiseScale, y * params.holesNoiseScale);
            
            if (noiseValue < params.holesAmount) {
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
    }
    
    console.log('✅ Holes aplicados');
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

// Solastalgia: neologismo que descreve a angústia mental causada por mudanças ambientais 
// em lugares que se ama, como a nostalgia sentida pelo lar que ainda se habita mas que foi alterado