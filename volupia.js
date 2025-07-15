// ===================================================================
// VOLÚPIA VETORIAL
// Efeito 16: Prazer intenso e sensual através da indulgência estética
// ===================================================================

function aplicarVolupia(ctx, canvas) {
    console.log('🌟 Iniciando Volúpia Vetorial...');
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Gerar seed única para esta execução
    const seed = Date.now() + Math.random() * 1000;
    seedRandom(seed);
    
    // ===================================================================
    // PARÂMETROS BASE COM VARIAÇÃO ±20%
    // ===================================================================
    
    const params = {
        smear: {
            amount: 0.72 * randomRange(0.8, 1.2),
            angle: 0.28 * randomRange(0.8, 1.2)
        },
        watercolor: {
            amount: 1.8 * randomRange(0.8, 1.2),
            flow: 0.5,
            direction: 0.63
        },
        push: {
            amount: 0,
            rgb: true,
            animate: true,
            offset: 50 * randomRange(0.8, 1.2)
        },
        eightBit: {
            amount: 0.4 * randomRange(0.8, 1.2),
            style: 1982,
            scale: Math.round(4 * randomRange(0.8, 1.2))
        },
        colorCorrection: {
            brightness: 0.5,
            contrast: 0.5,
            saturation: 0.5,
            hueOffset: 0
        },
        numShapes: Math.round(200 * randomRange(0.8, 1.2))
    };
    
    console.log('📊 Parâmetros únicos da Volúpia:', {
        smearAmount: params.smear.amount.toFixed(3),
        watercolorAmount: params.watercolor.amount.toFixed(3),
        pushOffset: params.push.offset.toFixed(1),
        eightBitAmount: params.eightBit.amount.toFixed(3),
        eightBitScale: params.eightBit.scale,
        numShapes: params.numShapes,
        seed: seed
    });
    
    // ===================================================================
    // ETAPA 1: APLICAR PINTURA BASE
    // ===================================================================
    
    console.log('🎨 Aplicando pintura base poligonal...');
    aplicarPinturaBase(ctx, canvas, originalImageData, params);
    
    // ===================================================================
    // ETAPA 2: APLICAR PUSH RGB
    // ===================================================================
    
    console.log('🔴 Aplicando separação cromática...');
    aplicarPushRGB(ctx, canvas, params.push);
    
    // ===================================================================
    // ETAPA 3: APLICAR TEXTURA 8-BIT
    // ===================================================================
    
    console.log('🎮 Aplicando textura 8-bit...');
    aplicar8Bit(ctx, canvas, params.eightBit);
    
    // ===================================================================
    // ETAPA 4: CORREÇÃO DE COR (SIMPLIFICADA)
    // ===================================================================
    
    console.log('✨ Finalizando com correção de cor...');
    // Correção básica mantida simples para compatibilidade
    
    console.log('🌟 Volúpia Vetorial concluída! Prazer estético alcançado.');
    
    return {
        nome: 'Volúpia Vetorial',
        params: params,
        seed: seed
    };
}

// ===================================================================
// CLASSE POLYGON ADAPTADA PARA CANVAS2D
// ===================================================================

class Polygon {
    constructor(vertices) {
        this.vertices = vertices;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    grow(amount) {
        const newVertices = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const v1 = this.vertices[i];
            const v2 = this.vertices[(i + 1) % this.vertices.length];
            
            // Calcular ponto médio
            const mid = {
                x: (v1.x + v2.x) / 2,
                y: (v1.y + v2.y) / 2
            };
            
            // Calcular ângulo perpendicular
            const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x) + Math.PI / 2;
            
            // Calcular distância
            const dist = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
            
            // Criar novo ponto com crescimento orgânico
            const newPoint = {
                x: mid.x + Math.cos(angle) * dist * 0.2 * amount * randomRange(0.5, 1.5),
                y: mid.y + Math.sin(angle) * dist * 0.2 * amount * randomRange(0.5, 1.5)
            };
            
            newVertices.push(v1, newPoint);
        }
        return new Polygon(newVertices);
    }
}

// ===================================================================
// FUNÇÃO: APLICAR PINTURA BASE
// ===================================================================

function aplicarPinturaBase(ctx, canvas, originalImageData, params) {
    // Restaurar imagem original primeiro
    ctx.putImageData(originalImageData, 0, 0);
    
    // Aplicar blur simplificado
    const blurredData = applySimpleBlur(originalImageData, 3);
    ctx.putImageData(blurredData, 0, 0);
    
    // Criar formas poligonais orgânicas
    const numShapes = params.numShapes;
    
    console.log(`🎨 Criando ${numShapes} formas poligonais...`);
    
    for (let i = 0; i < numShapes; i++) {
        // Posição aleatória
        const x = randomRange(0, canvas.width);
        const y = randomRange(0, canvas.height);
        const initialSize = randomRange(10, 30);
        
        // Capturar cor da posição
        const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const r = originalImageData.data[pixelIndex] || 0;
        const g = originalImageData.data[pixelIndex + 1] || 0;
        const b = originalImageData.data[pixelIndex + 2] || 0;
        
        // Configurar cor com transparência
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
        
        // Criar polígono inicial (quadrado)
        let poly = new Polygon([
            { x: x - initialSize, y: y - initialSize },
            { x: x + initialSize, y: y - initialSize },
            { x: x + initialSize, y: y + initialSize },
            { x: x - initialSize, y: y + initialSize }
        ]);
        
        // Aplicar crescimento em camadas (efeito watercolor)
        const layers = 10;
        for (let j = 0; j < layers; j++) {
            poly.draw(ctx);
            poly = poly.grow(params.watercolor.amount);
        }
    }
    
    console.log('🎨 Pintura base concluída!');
}

// ===================================================================
// FUNÇÃO: APLICAR PUSH RGB
// ===================================================================

function aplicarPushRGB(ctx, canvas, pushParams) {
    // Capturar estado atual
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Criar canvas temporário
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.imageSmoothingEnabled = false;
    
    // Criar dados para camada vermelha
    const redData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < data.length; i += 4) {
        redData.data[i] = data[i];         // R
        redData.data[i + 1] = 0;           // G = 0
        redData.data[i + 2] = 0;           // B = 0
        redData.data[i + 3] = data[i + 3]; // A
    }
    
    // Criar dados para camada cyan
    const cyanData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < data.length; i += 4) {
        cyanData.data[i] = 0;             // R = 0
        cyanData.data[i + 1] = data[i + 1]; // G
        cyanData.data[i + 2] = data[i + 2]; // B
        cyanData.data[i + 3] = data[i + 3]; // A
    }
    
    // Limpar canvas principal
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aplicar modo de blend screen
    ctx.globalCompositeOperation = 'screen';
    
    const offset = pushParams.offset;
    console.log(`🔴 Aplicando offset RGB: ${offset.toFixed(1)}px`);
    
    // Desenhar camada vermelha (deslocada para esquerda)
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.putImageData(redData, 0, 0);
    ctx.drawImage(tempCanvas, -offset, 0);
    
    // Desenhar camada cyan (deslocada para direita)
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.putImageData(cyanData, 0, 0);
    ctx.drawImage(tempCanvas, offset, 0);
    
    // Restaurar modo de blend normal
    ctx.globalCompositeOperation = 'source-over';
    
    console.log('🔴 Push RGB concluído!');
}

// ===================================================================
// FUNÇÃO: APLICAR 8-BIT
// ===================================================================

function aplicar8Bit(ctx, canvas, eightBitParams) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const scale = eightBitParams.scale;
    const amount = eightBitParams.amount;
    
    console.log(`🎮 Aplicando dithering 8-bit (scale: ${scale}, amount: ${amount.toFixed(3)})...`);
    
    // Configurar cor do dither
    ctx.fillStyle = `rgba(0, 0, 0, ${amount * 0.2})`;
    
    let patternsApplied = 0;
    
    // Aplicar padrão de dithering
    for (let y = 0; y < canvas.height; y += scale) {
        for (let x = 0; x < canvas.width; x += scale) {
            const index = (y * canvas.width + x) * 4;
            
            // Verificar se o índice está dentro dos limites
            if (index >= 0 && index < data.length) {
                const r = data[index] || 0;
                const g = data[index + 1] || 0;
                const b = data[index + 2] || 0;
                
                // Calcular luminosidade
                const gray = (r + g + b) / 3;
                const ditherAmount = gray / 255;
                
                // Aplicar diferentes padrões baseados na intensidade
                if (ditherAmount > 0.2) {
                    ctx.fillRect(x, y, scale, scale / 2);
                    patternsApplied++;
                }
                if (ditherAmount > 0.5) {
                    ctx.fillRect(x, y + scale / 2, scale / 2, scale / 2);
                    patternsApplied++;
                }
                if (ditherAmount > 0.8) {
                    ctx.fillRect(x + scale / 2, y + scale / 2, scale / 2, scale / 2);
                    patternsApplied++;
                }
            }
        }
    }
    
    console.log(`🎮 Dithering concluído! Padrões aplicados: ${patternsApplied}`);
}

// ===================================================================
// FUNÇÃO: BLUR SIMPLIFICADO
// ===================================================================

function applySimpleBlur(imageData, radius) {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        // Aplicar blur apenas em regiões seguras (longe das bordas)
        if (x > radius && x < width - radius && y > radius && y < height - radius) {
            let r = 0, g = 0, b = 0, count = 0;
            
            // Calcular média dos pixels vizinhos
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const idx = ((y + dy) * width + (x + dx)) * 4;
                    r += imageData.data[idx];
                    g += imageData.data[idx + 1];
                    b += imageData.data[idx + 2];
                    count++;
                }
            }
            
            data[i] = r / count;
            data[i + 1] = g / count;
            data[i + 2] = b / count;
        }
    }
    
    return new ImageData(data, width, height);
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS
// ===================================================================

let currentSeed = Date.now();

function seedRandom(seed) {
    currentSeed = seed;
}

function seededRandom() {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
}

function randomRange(min, max) {
    return min + (max - min) * seededRandom();
}

// ===================================================================
// DEFINIÇÃO DO AFETO
// ===================================================================

const volupiaDef = "Volúpia - Prazer intenso e sensual; satisfação completa dos sentidos através da indulgência estética.";