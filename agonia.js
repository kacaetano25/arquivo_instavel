// ===================================================================
// AGONIA INTERMITENTE - Efeito Puro com Aleatoriedade
// Slices horizontais + Pixel Sort vertical
// Tradução do p5.js para Canvas2D puro
// Versão com variação ±20% para resultados únicos
// ===================================================================

function aplicarAgonia(ctx, canvas) {
    console.log('💀 Aplicando AGONIA INTERMITENTE...');
    
    // PARÂMETROS BASE
    const baseParams = {
        slices: {
            amount: 0.03,    // 3% de deslocamento máximo
            count: 150,      // 150 fatias horizontais base
            seed: 0          // Seed base (será aleatorizada)
        },
        pixelSort: {
            amount: 0.68,    // 68% chance por coluna base
            threshold: 0.5,  // Limiar de brilho (mantido fixo para estabilidade)
            vertical: true   // Ordenação vertical
        }
    };
    
    // APLICAR VARIAÇÃO ALEATÓRIA ±20% PARA RESULTADOS ÚNICOS
    const params = {
        slices: {
            amount: baseParams.slices.amount, // Mantido fixo (mais seguro)
            count: Math.floor(baseParams.slices.count * (0.8 + Math.random() * 0.4)), // 120-180
            seed: Math.floor(Math.random() * 1000) // Seed aleatória para cada execução
        },
        pixelSort: {
            amount: baseParams.pixelSort.amount * (0.8 + Math.random() * 0.4), // 0.54-0.82
            threshold: baseParams.pixelSort.threshold, // Mantido fixo (mais seguro)
            vertical: baseParams.pixelSort.vertical
        }
    };
    
    console.log('📐 Parâmetros Agonia (com variação ±20%):', params);
    console.log(`🎲 Slices: ${params.slices.count} fatias (base: ${baseParams.slices.count})`);
    console.log(`🎲 PixelSort: ${params.pixelSort.amount.toFixed(2)} amount (base: ${baseParams.pixelSort.amount})`);
    console.log(`🎲 Seed: ${params.slices.seed} (aleatória)`);
    
    // FASE 1: Aplicar Slices (fatias horizontais deslocadas)
    aplicarSlicesAgonia(ctx, canvas, params.slices);
    
    // FASE 2: Aplicar Pixel Sort (ordenação vertical por brilho)
    aplicarPixelSortAgonia(ctx, canvas, params.pixelSort);
    
    console.log('✅ Agonia Intermitente aplicada com variação única');
}

// ===================================================================
// FASE 1: SLICES - Fatias horizontais com deslocamento
// ===================================================================
function aplicarSlicesAgonia(ctx, canvas, slicesParams) {
    console.log(`🔪 Aplicando ${slicesParams.count} Slices...`);
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Capturar imagem original
    const originalImageData = ctx.getImageData(0, 0, width, height);
    
    // Criar canvas temporário para as fatias
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Desenhar imagem original no temporário
    tempCtx.putImageData(originalImageData, 0, 0);
    
    // Aplicar seed para reprodutibilidade (simular randomSeed do p5.js)
    seedRandom(slicesParams.seed);
    
    // Limpar canvas principal
    ctx.clearRect(0, 0, width, height);
    
    // Desenhar imagem base
    ctx.putImageData(originalImageData, 0, 0);
    
    // Aplicar fatias deslocadas
    for (let i = 0; i < slicesParams.count; i++) {
        const y = seededRandom() * height;                    // Posição Y aleatória
        const sliceHeight = seededRandom() * 7 + 1;          // Altura da fatia (1-8px)
        const maxDisplacement = slicesParams.amount * width; // Deslocamento máximo
        const displacement = (seededRandom() - 0.5) * 2 * maxDisplacement; // -max a +max
        
        // Desenhar fatia deslocada
        ctx.drawImage(
            tempCanvas,                    // Source
            0, y, width, sliceHeight,      // Source rect
            displacement, y, width, sliceHeight // Dest rect
        );
    }
}

// ===================================================================
// FASE 2: PIXEL SORT - Ordenação vertical por brilho
// ===================================================================
function aplicarPixelSortAgonia(ctx, canvas, pixelSortParams) {
    console.log(`📊 Aplicando Pixel Sort (${(pixelSortParams.amount * 100).toFixed(0)}% das colunas)...`);
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Usar mesma seed para consistência
    seedRandom(0);
    
    // Capturar pixels atuais
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    let colunasAfetadas = 0;
    
    // Iterar por cada coluna
    for (let x = 0; x < width; x++) {
        // Chance variável de aplicar o efeito nesta coluna
        if (seededRandom() > pixelSortParams.amount) {
            continue; // Pula para próxima coluna
        }
        
        colunasAfetadas++;
        
        // Iterar por cada pixel da coluna (de cima para baixo)
        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Calcular brilho do pixel (0-1)
            const brilho = (r / 255 + g / 255 + b / 255) / 3;
            
            // Se brilho for MENOR que threshold, início de faixa para ordenar
            if (brilho < pixelSortParams.threshold) {
                let endY = y;
                
                // Encontrar onde a faixa termina (brilho volta a ser >= threshold)
                for (let j = y; j < height; j++) {
                    const endIndex = (j * width + x) * 4;
                    const endR = data[endIndex];
                    const endG = data[endIndex + 1];
                    const endB = data[endIndex + 2];
                    const endBrilho = (endR / 255 + endG / 255 + endB / 255) / 3;
                    
                    if (endBrilho >= pixelSortParams.threshold) {
                        break;
                    }
                    endY = j;
                }
                
                // Extrair todos os pixels da faixa
                let faixaDePixels = [];
                for (let j = y; j <= endY; j++) {
                    const pixelIndex = (j * width + x) * 4;
                    faixaDePixels.push({
                        r: data[pixelIndex],
                        g: data[pixelIndex + 1],
                        b: data[pixelIndex + 2],
                        a: data[pixelIndex + 3],
                        brilho: (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
                    });
                }
                
                // Ordenar faixa por brilho (escuro → claro)
                faixaDePixels.sort((a, b) => a.brilho - b.brilho);
                
                // Colocar pixels ordenados de volta
                for (let j = 0; j < faixaDePixels.length; j++) {
                    const pixelIndex = ((y + j) * width + x) * 4;
                    const pixel = faixaDePixels[j];
                    
                    data[pixelIndex] = pixel.r;
                    data[pixelIndex + 1] = pixel.g;
                    data[pixelIndex + 2] = pixel.b;
                    data[pixelIndex + 3] = pixel.a;
                }
                
                // Pular para depois da faixa ordenada
                y = endY;
            }
        }
    }
    
    console.log(`📊 Pixel Sort aplicado em ${colunasAfetadas}/${width} colunas (${(colunasAfetadas/width*100).toFixed(1)}%)`);
    
    // Aplicar pixels modificados
    ctx.putImageData(imageData, 0, 0);
}

// ===================================================================
// UTILITÁRIOS - Gerador de números aleatórios com seed
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
// EXPORTAR FUNÇÃO PRINCIPAL
// ===================================================================
// Para uso no web app principal:
// aplicarAgonia(ctx, processingCanvas);

// ===================================================================
// DEFINIÇÃO DO AFETO PARA TOOLTIP
// ===================================================================
const agoniaDefinition = {
    title: "AGONIA INTERMITENTE",
    definition: `→ <strong>Agonia</strong>: estado extremo de desconforto físico ou emocional, caracterizado por tensão intensa, dor ou perturbação profunda, frequentemente associado a processos de esgotamento ou dissolução.<br><br>→ <strong>Intermitente</strong>: aquilo que ocorre de maneira descontínua, com interrupções regulares ou irregulares, marcado por pulsos ou oscilações entre presença e ausência.`,
    poetry: "Padrão quebrado.<br>Tempo fragmentado.<br>Presa em um ciclo de desconstrução repetitiva.<br>Irregular."
};