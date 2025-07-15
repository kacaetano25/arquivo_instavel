// ===================================================================
// REMORSO EM LOOP - Arquivo Instável
// ===================================================================

function aplicarRemorso(ctx, canvas) {
    console.log('💔 Aplicando REMORSO EM LOOP...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Feedback (Etapa 1)
        feedbackAmount: 0.75,       // Quantidade de partículas
        feedbackScale: 0.5,         // Tempo de vida
        feedbackRotate: 0.5,        // Rotação do vórtice
        feedbackWarp: 0.79,         // Força do vórtice
        
        // Color Correction (Etapa 2)
        brightness: 0.5,            // Brilho
        contrast: 0.0,              // Contraste
        saturation: 0.5,            // Saturação
        hueOffset: 0.53,            // Rotação de matiz
        
        // ASCII (Etapa 3)
        asciiAmount: 0.38,          // Intensidade ASCII
        asciiSize: 2.5,             // Tamanho da fonte
        asciiCharSet: "`.:-=+*#%@0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        
        // Noise (Etapa 4)
        noiseAmount: 0.4,           // Intensidade do ruído
        
        // Scanlines (Etapa 5)
        scanlinesAmount: 1,         // Espaçamento das linhas
        scanlinesWidth: 1,          // Largura das linhas
        scanlinesAngle: 0.11,       // Ângulo das scanlines
        
        // Estados (sempre ativos)
        aplicarFeedbackAtivo: true,
        aplicarColorCorrectionAtivo: true,
        aplicarAsciiAtivo: true,
        aplicarNoiseAtivo: true,
        aplicarScanlinesAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% nos parâmetros selecionados
    const params = {
        // Feedback - com variação
        feedbackAmount: baseParams.feedbackAmount * (0.8 + Math.random() * 0.4),     // 0.6-0.9
        feedbackScale: baseParams.feedbackScale * (0.8 + Math.random() * 0.4),       // 0.4-0.6
        feedbackRotate: baseParams.feedbackRotate * (0.8 + Math.random() * 0.4),     // 0.4-0.6
        feedbackWarp: baseParams.feedbackWarp * (0.8 + Math.random() * 0.4),         // 0.632-0.948
        
        // Color Correction - com variação
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),            // 0.4-0.6
        contrast: baseParams.contrast,                                                // FIXO
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),            // 0.4-0.6
        hueOffset: baseParams.hueOffset * (0.8 + Math.random() * 0.4),               // 0.424-0.636
        
        // ASCII - com variação
        asciiAmount: baseParams.asciiAmount * (0.8 + Math.random() * 0.4),          // 0.304-0.456
        asciiSize: baseParams.asciiSize * (0.8 + Math.random() * 0.4),               // 2.0-3.0
        asciiCharSet: baseParams.asciiCharSet,                                        // FIXO
        
        // Noise - com variação
        noiseAmount: baseParams.noiseAmount * (0.8 + Math.random() * 0.4),          // 0.32-0.48
        
        // Scanlines - com variação
        scanlinesAmount: baseParams.scanlinesAmount * (0.8 + Math.random() * 0.4),  // 0.8-1.2
        scanlinesWidth: baseParams.scanlinesWidth,                                    // FIXO
        scanlinesAngle: baseParams.scanlinesAngle * (0.8 + Math.random() * 0.4),     // 0.088-0.132
        
        // Estados fixos (sempre ativos)
        aplicarFeedbackAtivo: baseParams.aplicarFeedbackAtivo,
        aplicarColorCorrectionAtivo: baseParams.aplicarColorCorrectionAtivo,
        aplicarAsciiAtivo: baseParams.aplicarAsciiAtivo,
        aplicarNoiseAtivo: baseParams.aplicarNoiseAtivo,
        aplicarScanlinesAtivo: baseParams.aplicarScanlinesAtivo
    };
    
    console.log('📐 Parâmetros Remorso (com variação ±20%):', params);
    console.log(`🎲 Feedback Amount: ${params.feedbackAmount.toFixed(2)} (base: ${baseParams.feedbackAmount})`);
    console.log(`🎲 Feedback Scale: ${params.feedbackScale.toFixed(2)} (base: ${baseParams.feedbackScale})`);
    console.log(`🎲 Feedback Rotate: ${params.feedbackRotate.toFixed(2)} (base: ${baseParams.feedbackRotate})`);
    console.log(`🎲 Feedback Warp: ${params.feedbackWarp.toFixed(3)} (base: ${baseParams.feedbackWarp})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(2)} (base: ${baseParams.saturation})`);
    console.log(`🎲 Hue Offset: ${params.hueOffset.toFixed(3)} (base: ${baseParams.hueOffset})`);
    console.log(`🎲 ASCII Amount: ${params.asciiAmount.toFixed(3)} (base: ${baseParams.asciiAmount})`);
    console.log(`🎲 ASCII Size: ${params.asciiSize.toFixed(1)} (base: ${baseParams.asciiSize})`);
    console.log(`🎲 Noise Amount: ${params.noiseAmount.toFixed(2)} (base: ${baseParams.noiseAmount})`);
    console.log(`🎲 Scanlines Amount: ${params.scanlinesAmount.toFixed(2)} (base: ${baseParams.scanlinesAmount})`);
    console.log(`🎲 Scanlines Angle: ${params.scanlinesAngle.toFixed(3)} (base: ${baseParams.scanlinesAngle})`);
    
    // APLICAR EFEITO EM 5 ETAPAS (ORDEM CORRETA DO P5.JS ORIGINAL!)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // Criar canvas temporário para processar etapas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copiar imagem original para o canvas temporário
    tempCtx.drawImage(canvas, 0, 0);
    
    // ETAPA 1: Feedback (Partículas em vórtice)
    if (params.aplicarFeedbackAtivo) {
        aplicarFeedback(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 2: Color Correction
    if (params.aplicarColorCorrectionAtivo) {
        aplicarColorCorrection(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 3: ASCII
    let asciiCanvas = null;
    if (params.aplicarAsciiAtivo) {
        asciiCanvas = aplicarASCII(tempCtx, tempCanvas, params);
    }
    
    // ETAPA 4: Composição com Blend Modes (ORDEM CORRETA!)
    if (asciiCanvas) {
        // 1. Desenhar a imagem processada (feedback + color correction)
        ctx.drawImage(tempCanvas, 0, 0);
        
        // 2. Aplicar blend multiply + fundo cinza (como no p5.js original)
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#b4b4b4'; // 180 em RGB
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        
        // 3. Aplicar ASCII com transparência baseada no amount
        const asciiAlpha = params.asciiAmount; // 0.304-0.456
        ctx.globalAlpha = asciiAlpha;
        ctx.drawImage(asciiCanvas, 0, 0);
        ctx.globalAlpha = 1;
    } else {
        // Se não há ASCII, usar a imagem processada diretamente
        ctx.drawImage(tempCanvas, 0, 0);
    }
    
    // ETAPA 5: Noise
    if (params.aplicarNoiseAtivo) {
        aplicarNoise(ctx, canvas, params);
    }
    
    // ETAPA 6: Scanlines
    if (params.aplicarScanlinesAtivo) {
        aplicarScanlines(ctx, canvas, params);
    }
    
    console.log('✅ Remorso em Loop aplicado com variação única');
}

// ===================================================================
// ETAPA 1: FEEDBACK (PARTÍCULAS EM VÓRTICE)
// ===================================================================
function aplicarFeedback(ctx, canvas, params) {
    console.log('🌀 Aplicando Feedback...');
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Capturar imagem original para sampling
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    const sourceData = sourceImageData.data;
    
    // Reduzir número de partículas para performance (mas ainda substancial)
    const numParticles = Math.floor(15000 * params.feedbackAmount); // Era 30000, agora 15000
    const particleSize = 8;
    const maxSpeed = 3;
    const vortexStrength = params.feedbackWarp * 0.1;
    const rotationBias = (params.feedbackRotate - 0.5) * 0.5;
    
    console.log(`🌀 Gerando ${numParticles} partículas de feedback...`);
    
    // Configurar desenho das partículas
    ctx.globalAlpha = 0.02; // Transparência muito baixa para acumular
    
    for (let i = 0; i < numParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        
        // Obter cor inicial do pixel
        const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
        const initialR = sourceData[pixelIndex];
        const initialG = sourceData[pixelIndex + 1];
        const initialB = sourceData[pixelIndex + 2];
        
        // Calcular tempo de vida da partícula
        const lifeSpan = Math.floor((seededRandom() * 80 + 20) * params.feedbackScale);
        
        // Definir cor da partícula
        ctx.fillStyle = `rgb(${initialR}, ${initialG}, ${initialB})`;
        
        // Traçar o caminho da partícula
        for (let t = 0; t < lifeSpan; t++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
            const angle = tangentAngle + rotationBias;
            
            // Mover partícula
            x += Math.cos(angle) * maxSpeed * vortexStrength;
            y += Math.sin(angle) * maxSpeed * vortexStrength;
            
            // Verificar limites
            if (x < 0 || x > width || y < 0 || y > height) break;
            
            // Desenhar partícula
            ctx.beginPath();
            ctx.arc(x, y, particleSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.globalAlpha = 1; // Resetar transparência
    
    console.log('✅ Feedback aplicado');
}

// ===================================================================
// ETAPA 2: COLOR CORRECTION
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
        
        // Aplicar saturação
        const saturationMultiplier = params.saturation * 2;
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturationMultiplier;
        g = gray + (g - gray) * saturationMultiplier;
        b = gray + (b - gray) * saturationMultiplier;
        
        // Aplicar rotação de matiz
        const hueRotation = params.hueOffset * 360;
        if (hueRotation > 0) {
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
// ETAPA 3: ASCII
// ===================================================================
function aplicarASCII(ctx, canvas, params) {
    console.log('📝 Aplicando ASCII...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Criar canvas para ASCII
    const asciiCanvas = document.createElement('canvas');
    asciiCanvas.width = width;
    asciiCanvas.height = height;
    const asciiCtx = asciiCanvas.getContext('2d');
    
    // Capturar imagem atual
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Configurar fonte
    const fontSize = Math.floor((params.asciiSize / 2.5) * 16 + 4); // Mapear 0.5-2.5 para 4-20
    const stepSize = Math.floor(fontSize * 0.8);
    
    asciiCtx.font = `bold ${fontSize}px monospace`;
    asciiCtx.textAlign = 'center';
    asciiCtx.textBaseline = 'middle';
    asciiCtx.fillStyle = 'white';
    
    console.log(`📝 ASCII: fontSize=${fontSize}, stepSize=${stepSize}`);
    
    // Gerar caracteres ASCII
    for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {
            // Obter brilho do pixel
            const pixelIndex = (y * width + x) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            
            // Calcular luminância
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            // Mapear brilho para caractere
            const charIndex = Math.floor((1 - brightness) * (params.asciiCharSet.length - 1));
            const char = params.asciiCharSet.charAt(charIndex);
            
            // Desenhar caractere
            asciiCtx.fillText(char, x + stepSize / 2, y + stepSize / 2);
        }
    }
    
    console.log('✅ ASCII aplicado');
    return asciiCanvas;
}

// ===================================================================
// ETAPA 4: NOISE
// ===================================================================
function aplicarNoise(ctx, canvas, params) {
    console.log('📺 Aplicando Noise...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Calcular força do ruído
    const noiseStrength = params.noiseAmount * 150;
    
    for (let i = 0; i < data.length; i += 4) {
        // Gerar ruído
        const grain = (Math.random() - 0.5) * noiseStrength;
        
        // Aplicar ruído a todos os canais
        data[i] = Math.max(0, Math.min(255, data[i] + grain));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        // Alpha inalterado
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Noise aplicado');
}

// ===================================================================
// ETAPA 5: SCANLINES
// ===================================================================
function aplicarScanlines(ctx, canvas, params) {
    console.log('📺 Aplicando Scanlines...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Criar canvas para scanlines
    const scanlineCanvas = document.createElement('canvas');
    scanlineCanvas.width = width;
    scanlineCanvas.height = height;
    const scanlineCtx = scanlineCanvas.getContext('2d');
    
    // Configurar scanlines (cinza claro para reduzir brilho)
    scanlineCtx.strokeStyle = 'rgb(180, 180, 180)';
    scanlineCtx.lineWidth = params.scanlinesWidth;
    
    // Calcular espaçamento
    const spacing = 30 - (params.scanlinesAmount - 1) * 26; // 1.0 → 4, 0.8 → ~9.2
    const angle = params.scanlinesAngle * Math.PI;
    
    console.log(`📺 Scanlines: spacing=${spacing.toFixed(1)}, angle=${angle.toFixed(3)}`);
    
    // Desenhar scanlines com rotação
    scanlineCtx.save();
    scanlineCtx.translate(width / 2, height / 2);
    scanlineCtx.rotate(angle);
    
    const lineLength = width * 1.5;
    
    for (let i = -lineLength / 2; i < lineLength / 2; i += spacing) {
        scanlineCtx.beginPath();
        scanlineCtx.moveTo(i, -lineLength);
        scanlineCtx.lineTo(i, lineLength);
        scanlineCtx.stroke();
    }
    
    scanlineCtx.restore();
    
    // Aplicar scanlines com blend mode ADD (simulação)
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.3; // Reduzir intensidade
    ctx.drawImage(scanlineCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    console.log('✅ Scanlines aplicadas');
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

// Remorso: sentimento doloroso de arrependimento por ações passadas, 
// acompanhado por desejo de ter agido diferentemente e culpa persistente