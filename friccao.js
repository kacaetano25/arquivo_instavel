// ===================================================================
// FRICÇÃO DE INPUT - Efeito Puro com Aleatoriedade
// Pintura de Fluxo + Textura CRT + Correção de Cor
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±30% para resultados únicos (suavizada)
// ===================================================================

function aplicarFriccao(ctx, canvas) {
    console.log('🎮 Aplicando FRICÇÃO DE INPUT...');
    
    // PARÂMETROS BASE (do código original aprovado)
    const baseParams = {
        smear: {
            amount: 0.72,    // 72% tempo de vida das partículas
            angle: 0.28      // 28% ângulo do fluxo
        },
        watercolor: {
            amount: 0.8,     // 80% densidade de partículas
            flow: 0.5        // 50% fluidez do noise
        },
        crt: {
            amount: 0.31,    // 31% intensidade CRT
            scale: 0.37,     // 37% tamanho dos pixels CRT
            vignette: 0      // Sem vinheta
        },
        color: {
            brightness: 0.53,// 53% brilho
            contrast: 0.38,  // 38% contraste (não usado na lógica final)
            saturation: 2.93 // 2.93x saturação
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±30% PARA RESULTADOS ÚNICOS
    const params = {
        smear: {
            amount: baseParams.smear.amount * (0.7 + Math.random() * 0.6),         // 0.50-0.93
            angle: baseParams.smear.angle * (0.7 + Math.random() * 0.6)            // 0.20-0.37
        },
        watercolor: {
            amount: baseParams.watercolor.amount * (0.7 + Math.random() * 0.6),    // 0.56-1.04
            flow: baseParams.watercolor.flow * (0.7 + Math.random() * 0.6)         // 0.35-0.65
        },
        crt: {
            amount: baseParams.crt.amount * (0.7 + Math.random() * 0.6),           // 0.22-0.40
            scale: baseParams.crt.scale * (0.7 + Math.random() * 0.6),             // 0.26-0.48
            vignette: baseParams.crt.vignette // Mantido fixo (zero)
        },
        color: {
            brightness: baseParams.color.brightness * (1.2 + Math.random() * 0.6), // 0.64-0.95
            contrast: baseParams.color.contrast * (0.7 + Math.random() * 0.6),     // 0.27-0.49
            saturation: baseParams.color.saturation * (0.8 + Math.random() * 0.8)  // 2.34-4.69
        },
        seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
    };
    
    console.log('📐 Parâmetros Fricção (com variação ±30% suavizada):', params);
    console.log(`🎲 Smear Amount: ${params.smear.amount.toFixed(2)} (base: ${baseParams.smear.amount})`);
    console.log(`🎲 Smear Angle: ${params.smear.angle.toFixed(2)} (base: ${baseParams.smear.angle})`);
    console.log(`🎲 Watercolor Amount: ${params.watercolor.amount.toFixed(2)} (base: ${baseParams.watercolor.amount})`);
    console.log(`🎲 Watercolor Flow: ${params.watercolor.flow.toFixed(2)} (base: ${baseParams.watercolor.flow})`);
    console.log(`🎲 CRT Amount: ${params.crt.amount.toFixed(2)} (base: ${baseParams.crt.amount})`);
    console.log(`🎲 CRT Scale: ${params.crt.scale.toFixed(2)} (base: ${baseParams.crt.scale})`);
    console.log(`🎲 Saturation: ${params.color.saturation.toFixed(2)} (base: ${baseParams.color.saturation})`);
    console.log(`🎲 Seed: ${params.seed}`);
    
    // APLICAR EFEITO EM 3 FASES
    seedRandom(params.seed);
    
    // FASE 1: Pintura de Fluxo (suavizada)
    aplicarPinturaBase(ctx, canvas, params.smear, params.watercolor);
    
    // FASE 2: Textura CRT (suavizada)
    aplicarEfeitoCRT(ctx, canvas, params.crt);
    
    // FASE 3: Correção de Cor (controlada)
    aplicarCorrecaoDeCor(ctx, canvas, params.color);
    
    console.log('✅ Fricção de Input aplicada com variação única (versão suavizada)');
}

// ===================================================================
// FASE 1: PINTURA DE FLUXO (WATERCOLOR PARTICLES) - SUAVIZADA
// ===================================================================
function aplicarPinturaBase(ctx, canvas, smearParams, watercolorParams) {
    console.log('🎨 Aplicando Pintura de Fluxo (suavizada)...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual como source
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    
    // Calcular número de partículas (REDUZIDO para ser mais sutil)
    const numParticles = Math.floor(8000 * watercolorParams.amount); // Era 20000, agora 8000
    const particleSize = 6; // Era 10, agora 6 (menores)
    const maxSpeed = 3; // Era 5, agora 3 (mais lentas)
    
    console.log(`🎨 Gerando ${numParticles} partículas de watercolor (suavizadas)...`);
    
    // Criar partículas que fluem pela imagem
    for (let i = 0; i < numParticles; i++) {
        let x = seededRandom() * width;
        let y = seededRandom() * height;
        
        // Obter cor inicial do pixel
        const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
        const initialR = sourceImageData.data[pixelIndex];
        const initialG = sourceImageData.data[pixelIndex + 1];
        const initialB = sourceImageData.data[pixelIndex + 2];
        
        // Calcular tempo de vida da partícula
        const lifeSpan = Math.floor((seededRandom() * 80 + 20) * smearParams.amount);
        
        // Traçar o caminho da partícula
        for (let t = 0; t < lifeSpan; t++) {
            // Calcular ângulo baseado em noise
            const noiseValue = noise(x * 0.01 * watercolorParams.flow, y * 0.01 * watercolorParams.flow);
            const angle = noiseValue * Math.PI * 2 * smearParams.angle;
            
            // Mover partícula
            x += Math.cos(angle) * maxSpeed;
            y += Math.sin(angle) * maxSpeed;
            
            // Verificar limites
            if (x < 0 || x > width || y < 0 || y > height) break;
            
            // Desenhar partícula com transparência MUITO baixa
            ctx.globalAlpha = 0.015; // Era 0.031, agora ainda mais sutil
            ctx.fillStyle = `rgb(${initialR}, ${initialG}, ${initialB})`;
            
            ctx.beginPath();
            ctx.arc(x, y, particleSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.globalAlpha = 1; // Resetar transparência
    
    console.log('✅ Pintura de Fluxo aplicada (suavizada)');
}

// ===================================================================
// FASE 2: TEXTURA CRT - SUAVIZADA
// ===================================================================
function aplicarEfeitoCRT(ctx, canvas, crtParams) {
    console.log('📺 Aplicando Textura CRT (suavizada)...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem atual
    const sourceImageData = ctx.getImageData(0, 0, width, height);
    
    // Calcular tamanho do pixel CRT (MENOR para ser mais sutil)
    const pixelSize = Math.floor((1 - crtParams.scale) * 8 + 2); // Era 16+4, agora 8+2 (2-10px)
    const subPixelWidth = pixelSize / 3;
    
    // Calcular intensidade do stain (MAIS SUAVE)
    const stainAmount = 0.92 - (crtParams.amount * 0.08); // Era 0.98-0.13, agora range menor
    
    // Aplicar blend multiply simulado de forma MUITO mais suave
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.4; // Era 0.7, agora muito mais sutil
    
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            // Obter cor do pixel source
            const sourceIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
            const r = sourceImageData.data[sourceIndex];
            const g = sourceImageData.data[sourceIndex + 1];
            const b = sourceImageData.data[sourceIndex + 2];
            
            // Calcular stains mais suaves
            const stainR = Math.floor((r * 0.9 + 255 * 0.1) * stainAmount);
            const stainG = Math.floor((g * 0.9 + 255 * 0.1) * stainAmount);
            const stainB = Math.floor((b * 0.9 + 255 * 0.1) * stainAmount);
            
            // Desenhar subpixels RGB com menos branco
            // Subpixel R 
            ctx.fillStyle = `rgb(${Math.min(255, stainR + 20)}, ${Math.max(150, stainR)}, ${Math.max(150, stainR)})`;
            ctx.fillRect(x, y, subPixelWidth, pixelSize);
            
            // Subpixel G 
            ctx.fillStyle = `rgb(${Math.max(150, stainG)}, ${Math.min(255, stainG + 20)}, ${Math.max(150, stainG)})`;
            ctx.fillRect(x + subPixelWidth, y, subPixelWidth, pixelSize);
            
            // Subpixel B 
            ctx.fillStyle = `rgb(${Math.max(150, stainB)}, ${Math.max(150, stainB)}, ${Math.min(255, stainB + 20)})`;
            ctx.fillRect(x + subPixelWidth * 2, y, subPixelWidth, pixelSize);
        }
    }
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    
    // Aplicar scanlines mais sutis
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const scanlineStrength = 0.98; // Era 0.95, agora mais sutil
    
    for (let y = 0; y < height; y++) {
        if (y % 3 === 0) { // Era y % 2, agora y % 3 (menos scanlines)
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                data[index] *= scanlineStrength;     // R
                data[index + 1] *= scanlineStrength; // G
                data[index + 2] *= scanlineStrength; // B
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Textura CRT aplicada (suavizada)');
}

// ===================================================================
// FASE 3: CORREÇÃO DE COR - CONTROLADA
// ===================================================================
function aplicarCorrecaoDeCor(ctx, canvas, colorParams) {
    console.log('🌈 Aplicando Correção de Cor (controlada)...');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Ajustar brilho
        r *= colorParams.brightness;
        g *= colorParams.brightness;
        b *= colorParams.brightness;
        
        // Ajustar saturação (REDUZIDA para ser mais natural)
        const gray = (r + g + b) / 3;
        const saturationReduced = Math.min(colorParams.saturation, 2.5); // Limita saturação máxima
        r = gray + (r - gray) * saturationReduced;
        g = gray + (g - gray) * saturationReduced;
        b = gray + (b - gray) * saturationReduced;
        
        // Limitar valores
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    console.log('✅ Correção de Cor aplicada (controlada)');
}

// ===================================================================
// FUNÇÕES UTILITÁRIAS - Gerador de números aleatórios e noise
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

// Implementação de noise (Perlin noise simplificado)
function noise(x, y) {
    // Implementação simplificada de noise 2D
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = fade(x);
    const v = fade(y);
    
    const A = perm[X] + Y;
    const AA = perm[A];
    const AB = perm[A + 1];
    const B = perm[X + 1] + Y;
    const BA = perm[B];
    const BB = perm[B + 1];
    
    return lerp(lerp(grad(perm[AA], x, y),
                   grad(perm[BA], x - 1, y), u),
               lerp(grad(perm[AB], x, y - 1),
                   grad(perm[BB], x - 1, y - 1), u), v);
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
    return a + t * (b - a);
}

function grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

// Tabela de permutação para noise
const perm = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================
const friccaoDefinition = {
    title: "FRICÇÃO DE INPUT",
    definition: `→ <strong>Fricção</strong>: resistência ao movimento entre superfícies em contato, gerando calor, desgaste e perda de energia cinética.<br><br>→ <strong>Input</strong>: entrada de dados ou comandos em um sistema digital, processo de interface entre usuário e máquina.`,
    poetry: "Resistência ao toque.<br>Fluxo interrompido.<br>Interface que hesita.<br>Comando perdido."
};