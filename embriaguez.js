// ===================================================================
// EMBRIAGUEZ DE OVERFLOW - Efeito Puro com Aleatoriedade
// Ondulação + Atmosfera + Correção + Transformação Final
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarEmbriaguez(ctx, canvas) {
    console.log('🍷 Aplicando EMBRIAGUEZ DE OVERFLOW...');
    
    // PARÂMETROS BASE
    const baseParams = {
        wave: {
            amount: 1,       // 100% força da ondulação
            size: 0.72,      // 72% tamanho das ondas (frequência)
            position: 0.6,   // 60% posição da onda
            angle: 0.04,     // 4% ângulo da distorção
            seed: 0          // Seed base (será aleatorizada)
        },
        bleach: {
            amount: 0.69     // 69% intensidade do bleach
        },
        blur: {
            amount: 0.47,    // 47% intensidade do blur
            distance: 0.09   // 9% distância do blur
        },
        colorCorrection: {
            brightness: 0.5, // 50% brilho
            contrast: 0.55,  // 55% contraste
            saturation: 0.9, // 90% saturação
            hueOffset: 0.8   // 80% offset de matiz
        },
        transform: {
            angle: -11.9,    // -11.9° rotação
            scaleX: 1.5,     // 1.5x escala horizontal
            scaleY: 1.1      // 1.1x escala vertical
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        wave: {
            amount: baseParams.wave.amount * (0.8 + Math.random() * 0.4),           // 0.8-1.2
            size: baseParams.wave.size * (0.8 + Math.random() * 0.4),               // 0.58-0.86
            position: baseParams.wave.position * (0.8 + Math.random() * 0.4),       // 0.48-0.72
            angle: baseParams.wave.angle * (0.8 + Math.random() * 0.4),             // 0.032-0.048
            seed: baseParams.wave.seed // Mantido fixo
        },
        bleach: {
            amount: baseParams.bleach.amount * (0.8 + Math.random() * 0.4)          // 0.55-0.83
        },
        blur: {
            amount: baseParams.blur.amount * (0.8 + Math.random() * 0.4),           // 0.38-0.56
            distance: baseParams.blur.distance * (0.8 + Math.random() * 0.4)        // 0.072-0.108
        },
        colorCorrection: {
            brightness: baseParams.colorCorrection.brightness * (0.8 + Math.random() * 0.4), // 0.40-0.60
            contrast: baseParams.colorCorrection.contrast * (0.8 + Math.random() * 0.4),     // 0.44-0.66
            saturation: baseParams.colorCorrection.saturation * (0.8 + Math.random() * 0.4), // 0.72-1.08
            hueOffset: baseParams.colorCorrection.hueOffset * (0.8 + Math.random() * 0.4)    // 0.64-0.96
        },
        transform: {
            angle: baseParams.transform.angle * (0.8 + Math.random() * 0.4),        // -14.28 a -9.52
            scaleX: baseParams.transform.scaleX * (0.8 + Math.random() * 0.4),      // 1.2-1.8
            scaleY: baseParams.transform.scaleY * (0.8 + Math.random() * 0.4)       // 0.88-1.32
        },
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Embriaguez (com variação ±20%):', params);
    console.log(`🎲 Wave Amount: ${params.wave.amount.toFixed(2)} (base: ${baseParams.wave.amount})`);
    console.log(`🎲 Wave Size: ${params.wave.size.toFixed(2)} (base: ${baseParams.wave.size})`);
    console.log(`🎲 Bleach Amount: ${params.bleach.amount.toFixed(2)} (base: ${baseParams.bleach.amount})`);
    console.log(`🎲 Blur Amount: ${params.blur.amount.toFixed(2)} (base: ${baseParams.blur.amount})`);
    console.log(`🎲 Saturation: ${params.colorCorrection.saturation.toFixed(2)} (base: ${baseParams.colorCorrection.saturation})`);
    console.log(`🎲 Hue Offset: ${params.colorCorrection.hueOffset.toFixed(2)} (base: ${baseParams.colorCorrection.hueOffset})`);
    console.log(`🎲 Transform Angle: ${params.transform.angle.toFixed(1)}° (base: ${baseParams.transform.angle}°)`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // APLICAR EFEITO EM 5 ETAPAS
    seedRandom(params.seed);
    
    // ETAPA 1: Geometria bêbada (ondulação)
    aplicarGeometriaBebada(ctx, canvas, params.wave);
    
    // ETAPA 2: Atmosfera etérea (bleach + blur)
    aplicarAtmosfera(ctx, canvas, params.bleach, params.blur);
    
    // ETAPA 3: Correção de cor
    aplicarColorCorrection(ctx, canvas, params.colorCorrection);
    
    // ETAPA 4: Transformação final (rotação + escala com overflow intencional)
    aplicarTransformacaoFinal(ctx, canvas, params.transform);
    
    console.log('✅ Embriaguez de Overflow aplicada com variação única (overflow intencional)');
}

// ===================================================================
// ETAPA 1: GEOMETRIA BÊBADA (ONDULAÇÃO)
// ===================================================================
function aplicarGeometriaBebada(ctx, canvas, waveParams) {
    console.log('🌊 Aplicando Geometria Bêbada...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar stage triplo (3x width para evitar bordas durante ondulação)
    const stageWidth = width * 3;
    const stageCanvas = document.createElement('canvas');
    const stageCtx = stageCanvas.getContext('2d');
    stageCanvas.width = stageWidth;
    stageCanvas.height = height;
    
    // Preencher com branco e colocar imagem 3x lado a lado
    stageCtx.fillStyle = 'white';
    stageCtx.fillRect(0, 0, stageWidth, height);
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(originalImageData, 0, 0);
    
    stageCtx.drawImage(tempCanvas, 0, 0);
    stageCtx.drawImage(tempCanvas, width, 0);
    stageCtx.drawImage(tempCanvas, width * 2, 0);
    
    // Aplicar ondulação pixel por pixel
    const resultImageData = ctx.createImageData(width, height);
    const stageImageData = stageCtx.getImageData(0, 0, stageWidth, height);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const normalizedX = x / width;
            const frequency = (1.1 - waveParams.size) * 20;
            const angle = normalizedX * frequency + waveParams.position;
            const waveValue = Math.sin(angle * Math.PI);
            const displacement = waveValue * waveParams.amount * width * 0.5;
            
            const sourceX = width + x - displacement;
            const sourceY = y;
            
            const clampedX = Math.max(0, Math.min(stageWidth - 1, Math.floor(sourceX)));
            const clampedY = Math.max(0, Math.min(height - 1, Math.floor(sourceY)));
            
            const sourceIndex = (clampedY * stageWidth + clampedX) * 4;
            const destIndex = (y * width + x) * 4;
            
            resultImageData.data[destIndex] = stageImageData.data[sourceIndex];
            resultImageData.data[destIndex + 1] = stageImageData.data[sourceIndex + 1];
            resultImageData.data[destIndex + 2] = stageImageData.data[sourceIndex + 2];
            resultImageData.data[destIndex + 3] = 255;
        }
    }
    
    ctx.putImageData(resultImageData, 0, 0);
    
    console.log('✅ Geometria Bêbada aplicada');
}

// ===================================================================
// ETAPA 2: ATMOSFERA ETÉREA (BLEACH + BLUR)
// ===================================================================
function aplicarAtmosfera(ctx, canvas, bleachParams, blurParams) {
    console.log('👻 Aplicando Atmosfera Etérea...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // BLEACH: Aplicar camada cinza com overlay
    const grayCanvas = document.createElement('canvas');
    const grayCtx = grayCanvas.getContext('2d');
    grayCanvas.width = width;
    grayCanvas.height = height;
    
    // Copiar imagem atual
    grayCtx.drawImage(canvas, 0, 0);
    
    // Aplicar filtro cinza
    grayCtx.filter = 'grayscale(100%)';
    grayCtx.drawImage(grayCanvas, 0, 0);
    grayCtx.filter = 'none';
    
    // Aplicar com blend overlay e transparência (simula p5.js overlay)
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = bleachParams.amount;
    ctx.drawImage(grayCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    // BLUR: Aplicar desfoque atmosférico
    const blurIntensity = blurParams.amount * 10;
    ctx.filter = `blur(${blurIntensity}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    
    console.log('✅ Atmosfera Etérea aplicada');
}

// ===================================================================
// ETAPA 3: CORREÇÃO DE COR
// ===================================================================
function aplicarColorCorrection(ctx, canvas, colorParams) {
    console.log('🎨 Aplicando Correção de Cor...');
    
    // Mapear parâmetros p5.js para filtros CSS
    const brightness = colorParams.brightness * 2;
    const contrast = 1 + (colorParams.contrast - 0.5) * 2;
    const saturation = colorParams.saturation * 2;
    const hue = colorParams.hueOffset * 360;
    
    const filterString = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) hue-rotate(${hue}deg)`;
    
    // Aplicar filtros combinados
    ctx.filter = filterString;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
    
    console.log('✅ Correção de Cor aplicada');
}

// ===================================================================
// ETAPA 4: TRANSFORMAÇÃO FINAL (ROTAÇÃO + ESCALA COM OVERFLOW)
// ===================================================================
function aplicarTransformacaoFinal(ctx, canvas, transformParams) {
    console.log('🔄 Aplicando Transformação Final (overflow intencional)...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const currentImageData = ctx.getImageData(0, 0, width, height);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(currentImageData, 0, 0);
    
    // Limpar canvas (fundo preto para overflow)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Aplicar transformação
    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    // Converter ângulo de graus para radianos
    const angleRad = (transformParams.angle * Math.PI) / 180;
    ctx.rotate(angleRad);
    
    // Aplicar escala não-uniforme (pode causar overflow intencional)
    ctx.scale(transformParams.scaleX, transformParams.scaleY);
    
    // Desenhar imagem transformada (overflow é parte do conceito)
    ctx.drawImage(tempCanvas, -width / 2, -height / 2);
    
    ctx.restore();
    
    console.log('✅ Transformação Final aplicada (overflow preservado como conceito)');
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS - Gerador de números aleatórios
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
const embriaguezDefinition = {
    title: "EMBRIAGUEZ DE OVERFLOW",
    definition: `→ <strong>Embriaguez</strong>: estado alterado de consciência caracterizado por desinibição, distorção perceptiva e perda de controle motor.<br><br>→ <strong>Overflow</strong>: transbordamento de dados além dos limites estabelecidos, causando comportamento inesperado no sistema.`,
    poetry: "Limites rompidos.<br>Controle perdido.<br>Realidade ondulada.<br>Transbordamento digital."
};