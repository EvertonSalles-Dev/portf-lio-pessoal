/* ==========================================================================
   THREE.JS ENGINE: HERO HOLOGRAM CORE & INTERACTIVE DATA GLOBE
   Project: Everton Mota - 3D Technological Portfolio
   ========================================================================== */

// Garantir que o Three.js e o GSAP estejam carregados
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar os elementos tridimensionais
    initHeroHologram();
    initNetworkGlobe();
});

/* --- PROCEDURAL TEXTURE: NEON CYAN PARTICLE --- */
function createNeonParticleTexture(colorHex = '#00E5FF') {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Desenhar gradiente radial suave de branco no centro para o neon-cyan nas bordas
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.2, colorHex);
    gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

/* ==========================================================================
   1. HERO HOLOGRAM CORE
   ========================================================================== */
function initHeroHologram() {
    const canvas = document.getElementById("hero-hologram-canvas");
    if (!canvas) return;

    // Dimensões do painel pai
    const container = canvas.parentElement;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Criar Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050505', 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Criar Elementos Tridimensionais do Core
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // -- A. A Esfera de Partículas (Rede Neural Core) --
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = []; // Para animações de dispersão

    const radius = 5.5;
    for (let i = 0; i < particleCount; i++) {
        // Distribuição esférica de Fibonacci para espaçamento premium uniforme
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions.push(new THREE.Vector3(x, y, z));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.18,
        map: createNeonParticleTexture('#00E5FF'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const corePoints = new THREE.Points(geometry, particleMaterial);
    hologramGroup.add(corePoints);

    // -- B. Anéis HUD Mecânicos (Giroscópios Neon) --
    const ringMaterialCyan = new THREE.LineBasicMaterial({
        color: 0x00E5FF,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
    });

    const ringMaterialBlue = new THREE.LineBasicMaterial({
        color: 0x0099FF,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    // Anel Externo 1
    const ringGeom1 = new THREE.TorusGeometry(7.2, 0.02, 16, 100);
    const ring1 = new THREE.Line(ringGeom1, ringMaterialCyan);
    hologramGroup.add(ring1);

    // Anel Interno 2 (Angulado)
    const ringGeom2 = new THREE.TorusGeometry(6.4, 0.015, 16, 100);
    const ring2 = new THREE.Line(ringGeom2, ringMaterialBlue);
    ring2.rotation.x = Math.PI / 3;
    hologramGroup.add(ring2);

    // Anel Interno 3 (Angulado Transversal)
    const ringGeom3 = new THREE.TorusGeometry(6.4, 0.015, 16, 100);
    const ring3 = new THREE.Line(ringGeom3, ringMaterialCyan);
    ring3.rotation.y = Math.PI / 3;
    hologramGroup.add(ring3);

    // -- C. Núcleo Interno Sólido Energético --
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x0099FF,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
    hologramGroup.add(energyCore);

    // -- D. Linhas de Conexão Internas Aleatórias --
    const lineCount = 30;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 6); // 2 pontos por linha (x,y,z)
    
    // Escolher vértices de partículas aleatórias e conectá-los
    for (let i = 0; i < lineCount; i++) {
        const p1Idx = Math.floor(Math.random() * particleCount);
        const p2Idx = Math.floor(Math.random() * particleCount);
        
        const p1 = originalPositions[p1Idx];
        const p2 = originalPositions[p2Idx];

        linePositions[i * 6] = p1.x;
        linePositions[i * 6 + 1] = p1.y;
        linePositions[i * 6 + 2] = p1.z;
        
        linePositions[i * 6 + 3] = p2.x;
        linePositions[i * 6 + 4] = p2.y;
        linePositions[i * 6 + 5] = p2.z;
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00E5FF,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });
    const neuralLines = new THREE.LineSegments(lineGeometry, lineMat);
    hologramGroup.add(neuralLines);

    // 3. Sistema de Interação do Mouse (Parallax)
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener("mousemove", (event) => {
        // Normalizar de -1 a 1
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 4. Integração GSAP ScrollTrigger para Efeito Cinemático
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Timeline de animação do Holograma vinculada ao scroll
        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5 // Suavização na resposta do scroll
            }
        });

        // Efeito: Rolar a página faz a câmera "entrar" no core e as partículas dispersarem
        scrollTimeline.to(camera.position, {
            z: 8,
            ease: "power1.inOut"
        }, 0);

        scrollTimeline.to(hologramGroup.rotation, {
            x: Math.PI * 1.5,
            y: Math.PI * 3.5,
            ease: "none"
        }, 0);

        // Dispersar as partículas
        scrollTimeline.to({ progress: 0 }, {
            progress: 1,
            ease: "power2.inOut",
            onUpdate: function() {
                const p = this.targets()[0].progress;
                const posAttr = corePoints.geometry.attributes.position;
                
                for (let i = 0; i < particleCount; i++) {
                    const orig = originalPositions[i];
                    // Multiplicador de dispersão conforme o scroll avança
                    const dispFactor = 1 + p * 2.2;
                    
                    posAttr.setXYZ(
                        i,
                        orig.x * dispFactor,
                        orig.y * dispFactor,
                        orig.z * dispFactor
                    );
                }
                posAttr.needsUpdate = true;
            }
        }, 0);
    }

    // Elementos HUD para reportar métricas em tempo real
    const hudScaleVal = document.getElementById("hologram-scale-val");
    const hudRotVal = document.getElementById("hologram-rot-val");
    const hudFps = document.getElementById("hologram-fps");

    // Monitor de FPS simples
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    // 5. Loop de Renderização
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotação contínua básica
        hologramGroup.rotation.y = elapsedTime * 0.12;

        // Rotações mecânicas diferenciais dos anéis HUD
        ring1.rotation.z = elapsedTime * 0.25;
        ring2.rotation.y = -elapsedTime * 0.35;
        ring3.rotation.x = elapsedTime * 0.2;
        energyCore.rotation.y = -elapsedTime * 0.5;

        // Interação com o Mouse suavizada (Lerp)
        targetX += (mouseX * 4 - targetX) * 0.05;
        targetY += (mouseY * 4 - targetY) * 0.05;

        hologramGroup.rotation.x = targetY * 0.15;
        hologramGroup.rotation.y += targetX * 0.15;

        // Renderizar
        renderer.render(scene, camera);

        // Atualizar métricas do HUD diagnóstico
        if (hudScaleVal) {
            // Escala aparente calculada com base no zoom
            const scale = (25 / camera.position.z).toFixed(3);
            hudScaleVal.innerText = scale;
        }
        if (hudRotVal) {
            const degrees = ((hologramGroup.rotation.y * 180) / Math.PI % 360).toFixed(1);
            hudRotVal.innerText = `${degrees}°`;
        }

        // Medição do FPS diagnóstico
        frameCount++;
        const time = performance.now();
        if (time >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (time - lastTime));
            if (hudFps) hudFps.innerText = `${fps} FPS`;
            frameCount = 0;
            lastTime = time;
        }
    }

    animate();

    // 6. Evento de Redimensionamento (Resize)
    window.addEventListener("resize", () => {
        width = container.clientWidth;
        height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
}


/* ==========================================================================
   2. INTERACTIVE CONNECTIVITY GLOBE
   ========================================================================== */
function initNetworkGlobe() {
    const canvas = document.getElementById("network-globe-canvas");
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Cena, Câmera e Renderizador
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Drag & Zoom OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Desativar scroll zoom para não interferir na página
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // 3. Criar a Terra Wireframe Holográfica
    const globeRadius = 5.0;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Esfera Externa Transparente com Grid Wireframe
    const sphereGeometry = new THREE.SphereGeometry(globeRadius, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x0099FF,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });
    const earthWireframe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(earthWireframe);

    // -- A. Adicionar Partículas de Superfície (Cidades / Servidores) --
    const pointsCount = 180;
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array(pointsCount * 3);
    const nodeCoords = []; // Salvar coordenadas Vector3 para criar conexões

    for (let i = 0; i < pointsCount; i++) {
        // Posicionar nós em locais pseudo-geográficos no hemisfério da esfera
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        const x = globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.sin(phi) * Math.sin(theta);
        const z = globeRadius * Math.cos(phi);

        pointsPositions[i * 3] = x;
        pointsPositions[i * 3 + 1] = y;
        pointsPositions[i * 3 + 2] = z;

        nodeCoords.push(new THREE.Vector3(x, y, z));
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.16,
        map: createNeonParticleTexture('#00E5FF'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const globeNodes = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(globeNodes);

    // -- B. Conexões de Arco Globais (Grandes Arcos de Dados) --
    const arcMaterial = new THREE.LineBasicMaterial({
        color: 0x0099FF,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
    });

    const activePackets = []; // Lista para atualizar pacotes em movimento

    // Gerar 20 arcos entre nós aleatórios
    const connectionCount = 18;
    for (let i = 0; i < connectionCount; i++) {
        const startNode = nodeCoords[Math.floor(Math.random() * pointsCount)];
        const endNode = nodeCoords[Math.floor(Math.random() * pointsCount)];

        if (startNode.distanceTo(endNode) < 2) continue; // Evitar conexões muito curtas

        // Criar vetor central elevado para formar a curva bezier (arco)
        const midPoint = new THREE.Vector3().addVectors(startNode, endNode).multiplyScalar(0.5);
        const distance = startNode.distanceTo(endNode);
        
        // Elevar o ponto médio proporcionalmente à distância para dar o efeito parabólico
        midPoint.normalize().multiplyScalar(globeRadius + distance * 0.25);

        // Criar Curva Bezier
        const curve = new THREE.QuadraticBezierCurve3(startNode, midPoint, endNode);
        const points = curve.getPoints(30);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const line = new THREE.Line(curveGeometry, arcMaterial);
        globeGroup.add(line);

        // Adicionar pacote de dados móvel ao longo deste arco
        activePackets.push({
            curve: curve,
            progress: Math.random(), // Progresso inicial aleatório
            speed: 0.008 + Math.random() * 0.012,
            mesh: null
        });
    }

    // Criar o Mesh do pacote de dados (pequeno ponto ciano brilhante)
    const packetGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const packetMaterial = new THREE.MeshBasicMaterial({
        color: 0x00E5FF,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    activePackets.forEach(packet => {
        const mesh = new THREE.Mesh(packetGeometry, packetMaterial);
        globeGroup.add(mesh);
        packet.mesh = mesh;
    });

    // 4. Loop de Animação
    function animateGlobe() {
        requestAnimationFrame(animateGlobe);

        // Atualizar as órbitas
        controls.update();

        // Atualizar a posição física dos pacotes de dados
        activePackets.forEach(packet => {
            packet.progress += packet.speed;
            if (packet.progress > 1) {
                packet.progress = 0;
            }

            // Descobrir coordenadas tridimensionais com base no progresso 0 a 1 do arco
            const pos = packet.curve.getPointAt(packet.progress);
            packet.mesh.position.set(pos.x, pos.y, pos.z);
        });

        // Renderizar
        renderer.render(scene, camera);
    }

    animateGlobe();

    // 5. Resize Event
    window.addEventListener("resize", () => {
        width = container.clientWidth;
        height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
}
