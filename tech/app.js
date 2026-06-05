/* ==========================================================================
   PORTFOLIO CONTROLLER: BOOT SEQUENCE, INTERACTION MATRIX & HUD LOGIC
   Project: Everton Mota - 3D Technological Portfolio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Iniciar relógio do HUD
    initSystemClock();

    // 2. Iniciar Cursor Holográfico
    initCyberCursor();

    // 3. Inicializar Efeitos Sonoros e Audio Switcher
    initAudioController();

    // 4. Executar Boot Sequence do Decrypter Loader
    executeBootSequence();

    // 5. Iniciar Efeito de Inclinação 3D (Tilt Cards)
    initTiltCards();

    // 6. Configurar Filtros das Habilidades
    initSkillsFilters();

    // 7. Iniciar Gráfico de AI em Tempo Real no Dashboard
    initAiRealtimeChart();

    // 8. Iniciar Painel de Logs de Cybersecurity
    initCyberSecurityLogs();

    // 9. Configurar Formulário de Contato Criptografado
    initContactForm();

    // 10. Configurar Revelação de Seções no Scroll (Scroll Reveal)
    initScrollReveal();

    // 11. Custom Ambient Particle Layer (WebGL/Canvas secundário)
    initAmbientParticles();
});


/* ==========================================================================
   1. SYSTEM CLOCK
   ========================================================================== */
function initSystemClock() {
    const clockEl = document.getElementById("hud-time");
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.innerText = `${hrs}:${mins}:${secs}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}


/* ==========================================================================
   2. HOLOGRAPHIC CYBER CURSOR
   ========================================================================== */
function initCyberCursor() {
    const cursor = document.getElementById("cyber-cursor");
    if (!cursor) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Acompanhar o mouse
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animação suave de lag (interpolação linear)
    function updateCursorPosition() {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;

        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;

        requestAnimationFrame(updateCursorPosition);
    }
    updateCursorPosition();

    // Eventos de clique (Encolher e expandir)
    window.addEventListener("mousedown", () => {
        cursor.classList.add("clicking");
        cursor.style.transform = "translate(-50%, -50%) scale(0.85)";
    });

    window.addEventListener("mouseup", () => {
        cursor.classList.remove("clicking");
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });

    // Detectar Hover em links e botões interativos
    const interactiveElements = document.querySelectorAll("a, button, .tilt-card, .filter-btn, .cyber-btn-mini");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("hovering");
        });
    });
}


/* ==========================================================================
   3. AUDIO CONTROLLER PROTOCOL
   ========================================================================== */
function initAudioController() {
    const audioBtn = document.getElementById("audio-toggle");
    const iconOn = document.getElementById("audio-icon-on");
    const iconOff = document.getElementById("audio-icon-off");
    const btnText = audioBtn ? audioBtn.querySelector(".btn-text") : null;

    if (!audioBtn) return;

    // Atualizar UI com base no estado inicial do sintetizador
    function updateAudioUI(active) {
        if (active) {
            iconOn.classList.remove("hidden");
            iconOff.classList.add("hidden");
            if (btnText) btnText.innerText = "ÁUDIO: ATIVO";
            audioBtn.style.borderColor = "var(--color-neon-cyan)";
            audioBtn.style.color = "var(--color-neon-cyan)";
        } else {
            iconOn.classList.add("hidden");
            iconOff.classList.remove("hidden");
            if (btnText) btnText.innerText = "ÁUDIO: MUTADO";
            audioBtn.style.borderColor = "rgba(255,255,255,0.08)";
            audioBtn.style.color = "var(--color-text-gray)";
        }
    }

    updateAudioUI(window.CyberSynth.enabled);

    audioBtn.addEventListener("click", () => {
        const isEnabled = window.CyberSynth.toggle();
        updateAudioUI(isEnabled);
    });

    // Adicionar som automático de hover/click em todos os elementos marcados
    document.querySelectorAll("[data-sound='hover']").forEach(el => {
        el.addEventListener("mouseenter", () => {
            window.CyberSynth.playHover();
        });
    });

    document.querySelectorAll("[data-sound='click']").forEach(el => {
        el.addEventListener("click", () => {
            window.CyberSynth.playClick();
        });
    });
}


/* ==========================================================================
   4. SYSTEM DECRYPTION SEQUENCE (BOOT SEQUENCE)
   ========================================================================== */
function executeBootSequence() {
    const loader = document.getElementById("cyber-loader");
    const progressBar = document.getElementById("loader-progress-bar");
    const percentEl = document.getElementById("loader-percent");
    const terminalBody = document.getElementById("loader-terminal-body");

    if (!loader) return;

    // Logs adicionais que surgem durante a descriptografia
    const cyberLogs = [
        ">> CHECKING MEMORY CACHE MAP...",
        ">> PROTOCOL HANDSHAKE VERIFIED: SUCCESS",
        ">> PARSING DIRECTORIES AND ASSETS...",
        ">> INJECTING GLITCH SECURITY PROTOCOLS...",
        ">> SECURITY AUDIT: NO THREATS IDENTIFIED",
        ">> OPENING SECURE CONNECTION CORE...",
        ">> BOOT SYSTEM ONLINE. INITIALIZING VIEWPORT..."
    ];

    let progress = 0;
    let logIndex = 0;

    // Tocar áudio de boot no primeiro clique ou movimento da página para desbloquear AudioContext
    function unlockAndPlayBoot() {
        window.CyberSynth.init();
        window.CyberSynth.playBoot();
        window.removeEventListener("click", unlockAndPlayBoot);
        window.removeEventListener("keydown", unlockAndPlayBoot);
    }
    window.addEventListener("click", unlockAndPlayBoot);
    window.addEventListener("keydown", unlockAndPlayBoot);

    const interval = setInterval(() => {
        // Incremento matemático da descriptografia
        progress += Math.floor(Math.random() * 4) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Conclusão
            setTimeout(() => {
                // Tocar sinal sonoro de sucesso
                window.CyberSynth.playSuccess();

                // Animar desvanecimento do loader
                loader.classList.add("fade-out");

                // Ativar primeira animação de fade-in do Hero
                setTimeout(() => {
                    loader.style.display = "none";
                    revealHeroElements();
                }, 800);
            }, 500);
        }

        // Atualizar barra e texto de progresso
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentEl) percentEl.innerText = `${String(progress).padStart(2, '0')}%`;

        // Acrescentar logs periodicamente conforme avanço do carregador
        if (progress > (logIndex + 1) * 14 && logIndex < cyberLogs.length) {
            const p = document.createElement("p");
            p.className = "term-line loading-text";
            p.innerText = cyberLogs[logIndex];
            if (terminalBody) {
                terminalBody.appendChild(p);
                // Rolar automático do terminal de boot
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
            logIndex++;
            window.CyberSynth.playHover();
        }
    }, 45);
}

// Animar revelação cinematográfica dos elementos do Hero
function revealHeroElements() {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();

        // Revelar HUD principal
        tl.fromTo(".hud-header", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" });

        // Glitch Name e Infos do Hero
        tl.fromTo(".cyber-pretitle-container", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.6");
        tl.fromTo(".hero-name", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
        tl.fromTo(".hero-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
        tl.fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
        tl.fromTo(".hero-actions", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");
        tl.fromTo(".hero-footer-diagnostics", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4");

        // Revelar moldura 3D do Holograma
        tl.fromTo(".hud-frame-3d", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=1.2");
    }

    // Aplicar glitch de texto
    const glitchTitle = document.getElementById("hero-title-glitch");
    if (glitchTitle) {
        glitchTitle.classList.add("glitch");
    }
}


/* ==========================================================================
   5. 3D TILT CARDS & LIGHT REFLECTION
   ========================================================================== */
function initTiltCards() {
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();

            // Posição relativa do cursor dentro do card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Converter para porcentagem
            const percentX = x / rect.width;
            const percentY = y / rect.height;

            // Calcular ângulos de inclinação física (máx 12 graus)
            const rotateY = (percentX - 0.5) * 16;
            const rotateX = (0.5 - percentY) * 16;

            // Aplicar matriz tridimensional
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            // Setar variáveis CSS customizadas para guiar o reflexo de gradiente radial
            card.style.setProperty("--mouse-x", `${percentX * 100}%`);
            card.style.setProperty("--mouse-y", `${percentY * 100}%`);
        });

        card.addEventListener("mouseleave", () => {
            // Resetar posição
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}


/* ==========================================================================
   6. SKILLS GRID FILTER SYSTEM
   ========================================================================== */
function initSkillsFilters() {
    const filters = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".skill-card");

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            // Mudar classe ativa do botão
            filters.forEach(f => f.classList.remove("active"));
            filter.classList.add("active");

            const filterVal = filter.getAttribute("data-filter");

            cards.forEach(card => {
                const category = card.getAttribute("data-category");

                if (filterVal === "all" || category === filterVal) {
                    card.style.display = "flex";
                    card.style.animation = "fadeIn 0.5s ease-out forwards";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}


/* ==========================================================================
   7. REALTIME AI ACCURACY CHART (2D CANVAS)
   ========================================================================== */
function initAiRealtimeChart() {
    const canvas = document.getElementById("ai-training-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;

    // Configurar dimensões físicas baseadas na escala real
    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const points = [];
    const maxPoints = 50;

    // Popular pontos iniciais simulando aprendizado inicial (flutuações subindo)
    for (let i = 0; i < maxPoints; i++) {
        const factor = i / maxPoints;
        const baseVal = 0.65 + factor * 0.3; // Convergindo para 0.95
        const noise = Math.sin(i * 0.8) * 0.04 * (1 - factor);
        points.push(baseVal + noise);
    }

    const lossText = document.getElementById("loss-value");
    let currentLoss = 0.084;

    // Loop de redesenho do gráfico
    function drawChart() {
        if (!canvas) return;

        // Limpar canvas anterior
        ctx.clearRect(0, 0, width, height);

        // Atualizar dimensões para caso ocorra resize
        if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        // Adicionar novo ponto de accuracy em tempo real (oscilando no topo)
        points.shift();
        const baseTarget = 0.965; // Convergindo próximo a 97%
        const finalNoise = Math.sin(Date.now() * 0.003) * 0.006 + (Math.random() - 0.5) * 0.004;
        points.push(baseTarget + finalNoise);

        // Atualizar valor do loss de cibersegurança e IA
        currentLoss += (0.004 + (Math.random() - 0.5) * 0.002 - currentLoss) * 0.02;
        if (lossText) {
            lossText.innerText = currentLoss.toFixed(4);
        }

        // Desenhar Grid HUD no fundo do gráfico
        ctx.strokeStyle = "rgba(0, 229, 255, 0.05)";
        ctx.lineWidth = 1;

        // Linhas Horizontais
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        // Linhas Verticais
        for (let x = 0; x < width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Desenhar Curva de Conexão Neural (Acurácia)
        ctx.strokeStyle = "var(--color-neon-cyan)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const stepX = width / (maxPoints - 1);

        points.forEach((val, idx) => {
            // Mapear valor de acurácia 0.0 a 1.0 para coordenadas y físicas do canvas (com padding vertical)
            const x = idx * stepX;
            const y = height - (val * (height - 60) + 30); // 30px padding

            if (idx === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0, 229, 255, 0.6)";
        ctx.stroke();

        // Preenchimento de Gradiente Translúcido abaixo da curva
        ctx.shadowBlur = 0; // Desativar shadow para preenchimento rápido
        const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
        fillGrad.addColorStop(0, "rgba(0, 229, 255, 0.15)");
        fillGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = fillGrad;
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Desenhar indicador da ponta ativa (Ponto pulsando)
        const lastX = width;
        const lastVal = points[points.length - 1];
        const lastY = height - (lastVal * (height - 60) + 30);

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "var(--color-neon-cyan)";
        ctx.beginPath();
        ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset
    }

    // Loop lento (Redesenhar a cada 100ms para poupar ciclos de CPU)
    setInterval(drawChart, 100);
}


/* ==========================================================================
   8. REAL-TIME CYBER SECURITY LOGS TERMINAL FEED
   ========================================================================== */
function initCyberSecurityLogs() {
    const cli = document.getElementById("threat-logs-cli");
    const countEl = document.getElementById("blocked-attacks-count");
    if (!cli) return;

    // Pool de eventos de logs cibernéticos
    const logTemplates = [
        { type: "info", text: "[SECURE] SSL/TLS handshake estabelecido com IP 184.22.109.4" },
        { type: "success", text: "[OK] Firewall OWASP analisou input form. Status: Sanitizado." },
        { type: "warn", text: "[BLOQUEADO] Port scanning detectado e mitigado no IP 104.244.42.1" },
        { type: "success", text: "[RELOG] Integridade de Banco de Dados indexada 100% íntegra" },
        { type: "alert", text: "[ALERTA] XSS payload tentado no campo query. Sanitização aplicada com sucesso." },
        { type: "info", text: "[TUNNEL] Canal VPN de desenvolvimento fechado por tempo inativo" },
        { type: "success", text: "[OK] Certificados SSL de domínios em produção revalidados." },
        { type: "warn", text: "[CORS] Acesso negado a API v2 de origem não-homologada" },
        { type: "alert", text: "[AUDITORIA] Injeção SQL mitigada na rota /auth/access-code" }
    ];

    let blockedCount = 542;

    function addLog() {
        const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];

        // Formatar horário do log
        const t = new Date();
        const timeStr = `[${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}]`;

        const line = document.createElement("div");
        line.className = `cli-line ${template.type}`;
        line.innerText = `${timeStr} ${template.text}`;

        cli.appendChild(line);

        // Manter limite máximo de 14 linhas no terminal do HUD
        if (cli.children.length > 14) {
            cli.removeChild(cli.firstChild);
        }

        // Rolar terminal para a base
        cli.scrollTop = cli.scrollHeight;

        // Incrementar estatísticas de ameaças em caso de alertas/avisos
        if (template.type === "alert" || template.type === "warn") {
            blockedCount += Math.floor(Math.random() * 3) + 1;
            if (countEl) {
                countEl.innerText = blockedCount;
                countEl.classList.add("danger");
                setTimeout(() => countEl.classList.remove("danger"), 300);
            }
            window.CyberSynth.playHover();
        }
    }

    // Preencher logs iniciais rapidamente
    for (let i = 0; i < 6; i++) {
        addLog();
    }

    // Loop contínuo de logs simulados a cada 2.5 segundos
    setInterval(addLog, 2500);
}


/* ==========================================================================
   9. DECRYPTION CONTACT FORM TERMINAL
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("cyber-contact-form");
    const statusAlert = document.getElementById("form-status-alert");
    const statusText = document.getElementById("form-status-text");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Ativar alerta de envio
        statusAlert.className = "form-status-alert info";
        statusAlert.classList.remove("hidden");
        statusText.innerText = "ESTABELECENDO PROTOCOLO DE TRANSMISSÃO TLS SECURE...";
        window.CyberSynth.playClick();

        const submitBtn = document.getElementById("btn-submit-form");
        if (submitBtn) submitBtn.disabled = true;

        const phases = [
            { t: 600, txt: "ISOLANDO CANAL DE ENVELOPE..." },
            { t: 1200, txt: "CRIPTOGRAFANDO CHAVE E DADOS DA TRANSMISSÃO..." },
            { t: 1800, txt: "ENVIANDO PAYLOAD VIA HOLOGRAPHIC PIPELINE..." },
            { t: 2400, txt: "CONFIRMANDO VALIDAÇÃO DE PROTOCOLO: DADOS TRANSMITIDOS." }
        ];

        phases.forEach(phase => {
            setTimeout(() => {
                statusText.innerText = phase.txt;
                window.CyberSynth.playHover();
            }, phase.t);
        });

        // Conclusão com sucesso
        setTimeout(() => {
            statusAlert.className = "form-status-alert success";
            statusText.innerText = "ENVELOPE SECURELY TRANSMITTED. RESPONSE PROTOCOL INITIALIZED.";
            window.CyberSynth.playSuccess();

            // Resetar formulário
            form.reset();
            if (submitBtn) submitBtn.disabled = false;

            // Sumir com alerta após 5 segundos
            setTimeout(() => {
                statusAlert.classList.add("hidden");
            }, 6000);

        }, 3000);
    });
}


/* ==========================================================================
   10. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealedElements = document.querySelectorAll(".scroll-reveal");

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    // Opcionalmente remover observer após reveal
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // Revelar quando 15% do elemento estiver visível
            rootMargin: "0px 0px -40px 0px"
        });

        revealedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback simples sem observer
        revealedElements.forEach(el => el.classList.add("revealed"));
    }
}


/* ==========================================================================
   11. AMBIENT PARTICLES (SECONDARY WebGL-LIKE 2D CANVAS)
   ========================================================================== */
function initAmbientParticles() {
    const canvas = document.getElementById("ambient-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const count = 70;

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // Spawn aleatório na altura no primeiro boot
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 10;
            this.size = Math.random() * 1.8 + 0.5;
            this.speed = Math.random() * 0.4 + 0.15;
            this.alpha = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.y -= this.speed;
            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animateBg() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateBg);
    }
    animateBg();

    window.addEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}
