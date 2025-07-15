// ===================================================================
// RUPTURA DE CAMADAS - Arquivo Instável
// ===================================================================

function aplicarRuptura(ctx, canvas) {
    console.log('💥 Aplicando RUPTURA DE CAMADAS...');
    
    // PARÂMETROS BASE (valores aprovados no testador)
    const baseParams = {
        // Slices (Etapa 1)
        slicesAmount: 0.4,          // Intensidade do deslocamento
        slicesCount: 200,           // Número de fatias
        slicesAngle: 0.07,          // Ângulo das fatias
        slicesSeed: 0,              // Seed fixo
        
        // Transform (Etapa 2)
        transformPositionX: 0.41,   // Ponto de ancoragem X
        transformPositionY: 0.15,   // Ponto de ancoragem Y
        transformScaleX: 2.98,      // Escala horizontal
        transformScaleY: 1.71,      // Escala vertical
        
        // Color Correction (Etapa 3)
        brightness: 0.5,            // Brilho
        contrast: 2.93,             // Contraste
        saturation: 0.47,           // Saturação
        
        // Estados (sempre ativos)
        aplicarSlicesAtivo: true,
        aplicarTransformAtivo: true,
        aplicarColorCorrectionAtivo: true
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% nos parâmetros selecionados
    const params = {
        // Slices - com variação
        slicesAmount: baseParams.slicesAmount * (0.8 + Math.random() * 0.4),         // 0.32-0.48
        slicesCount: Math.floor(baseParams.slicesCount * (0.8 + Math.random() * 0.4)), // 160-240
        slicesAngle: baseParams.slicesAngle * (0.8 + Math.random() * 0.4),           // 0.056-0.084
        slicesSeed: baseParams.slicesSeed,                                            // FIXO
        
        // Transform - com variação
        transformPositionX: baseParams.transformPositionX * (0.8 + Math.random() * 0.4), // 0.328-0.492
        transformPositionY: baseParams.transformPositionY * (0.8 + Math.random() * 0.4), // 0.12-0.18
        transformScaleX: baseParams.transformScaleX * (0.8 + Math.random() * 0.4),       // 2.384-3.576
        transformScaleY: baseParams.transformScaleY * (0.8 + Math.random() * 0.4),       // 1.368-2.052
        
        // Color Correction - com variação
        brightness: baseParams.brightness * (0.8 + Math.random() * 0.4),            // 0.4-0.6
        contrast: baseParams.contrast * (0.8 + Math.random() * 0.4),                // 2.344-3.516
        saturation: baseParams.saturation * (0.8 + Math.random() * 0.4),            // 0.376-0.564
        
        // Estados fixos (sempre ativos)
        aplicarSlicesAtivo: baseParams.aplicarSlicesAtivo,
        aplicarTransformAtivo: baseParams.aplicarTransformAtivo,
        aplicarColorCorrectionAtivo: baseParams.aplicarColorCorrectionAtivo
    };
    
    console.log('📐 Parâmetros Ruptura (com variação ±20%):', params);
    console.log(`🎲 Slices Amount: ${params.slicesAmount.toFixed(2)} (base: ${baseParams.slicesAmount})`);
    console.log(`🎲 Slices Count: ${params.slicesCount} (base: ${baseParams.slicesCount})`);
    console.log(`🎲 Slices Angle: ${params.slicesAngle.toFixed(3)} (base: ${baseParams.slicesAngle})`);
    console.log(`🎲 Transform Position X: ${params.transformPositionX.toFixed(3)} (base: ${baseParams.transformPositionX})`);
    console.log(`🎲 Transform Position Y: ${params.transformPositionY.toFixed(3)} (base: ${baseParams.transformPositionY})`);
    console.log(`🎲 Transform Scale X: ${params.transformScaleX.toFixed(2)} (base: ${baseParams.transformScaleX})`);
    console.log(`🎲 Transform Scale Y: ${params.transformScaleY.toFixed(2)} (base: ${baseParams.transformScaleY})`);
    console.log(`🎲 Brightness: ${params.brightness.toFixed(2)} (base: ${baseParams.brightness})`);
    console.log(`🎲 Contrast: ${params.contrast.toFixed(2)} (base: ${baseParams.contrast})`);
    console.log(`🎲 Saturation: ${params.saturation.toFixed(3)} (base: ${baseParams.saturation})`);
    
    // APLICAR EFEITO EM 3 ETAPAS (ORDEM CORRETA DO P5.JS ORIGINAL!)
    seedRandom(Math.floor(Math.random() * 1000));
    
    // ETAPA 1: Slices (aplicar no buffer temporário)
    let slicesCanvas = null;
    if (params.aplicarSlicesAtivo) {
        slicesCanvas = aplicarSlices(ctx, canvas, params);
    }
    
    // ETAPA 2: Transform (aplicar no canvas principal com fundo branco)
    if (params.aplicarTransformAtivo && slicesCanvas) {
        aplicarTransform(ctx, canvas, slicesCanvas, params);
    } else if (slicesCanvas) {
        // Se não há transform, usar slices diretamente
        ctx.drawImage(slicesCanvas, 0, 0);
    }
    
    // ETAPA 3: Color Correction (aplicar sobre o resultado final)
    if (params.aplicarColorCorrectionAtivo) {
        aplicarColorCorrection(ctx, canvas, params);
    }
    
    console.log('✅ Ruptura de Camadas aplicada com variação única');
}

// ===================================================================
// ETAPA 1: SLICES
// ===================================================================
function aplicarSlices(ctx, canvas, params) {
    console.log('🔀 Aplicando Slices...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Criar canvas para slices
    const slicesCanvas = document.createElement('canvas');
    slicesCanvas.width = width;
    slicesCanvas.height = height;
    const slicesCtx = slicesCanvas.getContext('2d');
    
    // Fundo branco (como no p5.js original)
    slicesCtx.fillStyle = 'white';
    slicesCtx.fillRect(0, 0, width, height);
    
    // Capturar imagem original
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    
    // Configurar parâmetros das fatias
    const maxDisplacement = params.slicesAmount * 250;
    const sliceHeight = 4;
    
    console.log(`🔀 Criando ${params.slicesCount} fatias com deslocamento máximo de ${maxDisplacement.toFixed(1)}px`);
    
    // Aplicar seed para reprodutibilidade
    seedRandom(params.slicesSeed);
    
    // Criar fatias
    for (let i = 0; i < params.slicesCount; i++) {
        const yPos = seededRandom() * height;
        const displacement = seededRandom() * maxDisplacement;
        
        // Salvar estado do contexto
        slicesCtx.save();
        
        // Aplicar transformações
        slicesCtx.translate(0, yPos);
        slicesCtx.rotate(params.slicesAngle);
        
        // Criar clipping mask para a fatia
        slicesCtx.beginPath();
        slicesCtx.rect(-width, -sliceHeight / 2, width * 2, sliceHeight);
        slicesCtx.clip();
        
        // Resetar transformações para desenhar a imagem
        slicesCtx.rotate(-params.slicesAngle);
        slicesCtx.translate(0, -yPos);
        
        // Desenhar imagem original
        slicesCtx.drawImage(canvas, 0, 0);
        
        // Desenhar imagem deslocada
        slicesCtx.drawImage(canvas, displacement, 0);
        
        // Restaurar estado do contexto
        slicesCtx.restore();
    }
    
    console.log('✅ Slices aplicados');
    return slicesCanvas;
}

// ===================================================================
// ETAPA 2: TRANSFORM
// ===================================================================
function aplicarTransform(ctx, canvas, slicesCanvas, params) {
    console.log('🔄 Aplicando Transform...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpar canvas com fundo branco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Salvar estado
    ctx.save();
    
    // Calcular ponto de ancoragem
    const anchorX = params.transformPositionX * width;
    const anchorY = params.transformPositionY * height;
    
    console.log(`🔄 Transform: anchorX=${anchorX.toFixed(1)}, anchorY=${anchorY.toFixed(1)}, scaleX=${params.transformScaleX.toFixed(2)}, scaleY=${params.transformScaleY.toFixed(2)}`);
    
    // Aplicar escala
    ctx.scale(params.transformScaleX, params.transformScaleY);
    
    // Aplicar translação (negativa para reposicionar)
    ctx.translate(-anchorX, -anchorY);
    
    // Desenhar imagem com slices
    ctx.drawImage(slicesCanvas, 0, 0);
    
    // Restaurar estado
    ctx.restore();
    
    console.log('✅ Transform aplicado');
}

// ===================================================================
// ETAPA 3: COLOR CORRECTION
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
        
        // Aplicar contraste (contrast * 2)
        const contrastMultiplier = params.contrast * 2;
        r = ((r / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        g = ((g / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        b = ((b / 255 - 0.5) * contrastMultiplier + 0.5) * 255;
        
        // Aplicar saturação (saturation * 2)
        const saturationMultiplier = params.saturation * 2;
        const gray = (r + g + b) / 3;
        r = gray + (r - gray) * saturationMultiplier;
        g = gray + (g - gray) * saturationMultiplier;
        b = gray + (b - gray) * saturationMultiplier;
        
        // Clamp valores
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Color Correction aplicada');
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

// Ruptura: quebra súbita ou interrupção violenta de continuidade, 
// causando fragmentação e deslocamento de elementos estruturais