/* ==========================================================================
   MODULE: CERTIFICATES COMMAND CONTROLLER (GSAP STACK CAROUSEL)
   Project: Everton Mota - 3D Technological Portfolio
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Dados dos Certificados
    const certificates = [
        {
            title: "Getting Started with AWS CloudFormation",
            institution: "Amazon Web Services (AWS)",
            date: "2025",
            image: "Certificados/Certificado AWS.jpeg",
            pdf: "Certificados/Certificado AWS .pdf"
        },
        {
            title: "Crie um site simples usando HTML, CSS e JavaScript",
            institution: "Escola do Trabalhador 4.0 / Microsoft",
            date: "2025",
            image: "Certificados/Certificado EDT.jpeg",
            pdf: "Certificados/Certificate_645228_36_rc06d.pdf"
        },
        {
            title: "Machine Learning, LLMs, IA generativa & Agentes",
            institution: "Fundamentos da IA Moderna",
            date: "2026",
            image: "Certificados/VD4XSU1E.png",
            pdf: "Certificados/VD4XSU1E.pdf"
        },
        {
            title: "Fundamentos do Deep Learning",
            institution: "Inteligência Artificial Aplicada",
            date: "2026",
            image: "Certificados/KMNK6ZCP.png",
            pdf: "Certificados/KMNK6ZCP.pdf"
        },
        {
            title: "Aplicação em Java",
            institution: "Desenvolvimento de aplicações web",
            date: "2025",
            image: "Certificados/L5VZEXAI.png",
            pdf: "Certificados/L5VZEXAI.pdf"
        },
        {
            title: "Excel com Inteligência Artificial",
            institution: "Conceitos de IA e automação com Excel",
            date: "2025",
            image: "Certificados/XR3RFBW0.png",
            pdf: "Certificados/XR3RFBW0.pdf"
        },
        {
            title: "Docker Containers e Orquestração Local",
            institution: "DevOps & Cloud Alliance",
            date: "2025",
            image: "Certificados/OPFAGZF1.png",
            pdf: "Certificados/OPFAGZF1.pdf"
        },
        {
            title: "Versionamento de Código com Git e GitHub",
            institution: "Introdução à Engenharia de Software",
            date: "2025",
            image: "Certificados/NXJI9S65.png",
            pdf: "Certificados/NXJI9S65.pdf"
        },
        {
            title: "Administração de código-fonte HTML",
            institution: "Desenvolvimento de Aplicações Web",
            date: "2025",
            image: "Certificados/QXSOYJME.png",
            pdf: "Certificados/QXSOYJME.pdf"
        },
        {
            title: "Fundamentos frontend",
            institution: "Introdução à programação e desenvolvimento de software",
            date: "2025",
            image: "Certificados/91GWVJBO.png",
            pdf: "Certificados/91GWVJBO.pdf"
        },
        {
            title: "Desenvolvimento Web Seguro e WebGL",
            institution: "Laboratório de Engenharia Segura",
            date: "2026",
            image: "Certificados/J8VCVCMK.png",
            pdf: "Certificados/J8VCVCMK.pdf"
        },
        {
            title: "Metodologias Ágeis e Engenharia de Software",
            institution: "Desenvolvimento de Sistemas",
            date: "2025",
            image: "Certificados/PDYWN8UI.png",
            pdf: "Certificados/PDYWN8UI.pdf"
        },
        {
            title: "Power BI Aplicado a Negócios",
            institution: "Fundamentos de BI, Excel e Automação",
            date: "2026",
            image: "Certificados/Documento Escaneado 8.png",
            pdf: "Certificados/Documento Escaneado 8.pdf"
        }
    ];

    // 2. Elementos DOM e Estado
    const deck = document.getElementById("certificates-deck");
    const prevBtn = document.getElementById("cert-prev-btn");
    const nextBtn = document.getElementById("cert-next-btn");
    const prevBtnMobile = document.getElementById("cert-prev-btn-mobile");
    const nextBtnMobile = document.getElementById("cert-next-btn-mobile");
    const modal = document.getElementById("cyber-cert-modal");

    if (!deck) return;

    let activeIndex = 0;
    let isAnimating = false;
    let cards = [];

    // 3. Renderizar Cards no Deck
    function renderCards() {
        deck.innerHTML = "";
        cards = [];

        certificates.forEach((cert, idx) => {
            const card = document.createElement("div");
            card.className = "certificate-card";
            card.setAttribute("data-index", idx);

            // Determinar se usamos a imagem ou fallback
            // Como pré-extraímos todas as imagens como PNG, usamos o caminho da imagem direto
            const imgPath = cert.image;

            card.innerHTML = `
                <div class="cert-image-wrapper">
                    <img src="${imgPath}" alt="${cert.title}" loading="lazy" onerror="this.src='fts/ChatGPT Image 30 de mai. de 2026, 22_43_50.png';">
                    <div class="cert-scanner"></div>
                </div>
                <div class="cert-details">
                    <div class="cert-meta-row">
                        <span class="cert-institution">${cert.institution}</span>
                        <span class="cert-date">${cert.date}</span>
                    </div>
                    <h3 class="cert-title" title="${cert.title}">${cert.title}</h3>
                    <div class="cert-actions">
                        <button class="cyber-btn-mini view" data-sound="click">Visualizar</button>
                        <a href="${cert.pdf}" download="${cert.title}.pdf" class="cyber-btn-mini download" data-sound="click">Download PDF</a>
                    </div>
                </div>
            `;

            deck.appendChild(card);
            cards.push(card);

            // Hook som de clique nos botões internos
            card.querySelectorAll("[data-sound='click']").forEach(el => {
                el.addEventListener("click", () => {
                    if (window.CyberSynth && window.CyberSynth.playClick) {
                        window.CyberSynth.playClick();
                    }
                });
            });

            // Clique no próprio card ativo avança para o próximo
            card.addEventListener("click", (e) => {
                if (!card.classList.contains("active-card")) return;
                // Ignorar se clicou nos botões ou link
                if (e.target.closest(".cert-actions") || e.target.closest(".cyber-btn-mini")) {
                    return;
                }
                nextCertificate();
            });

            // Suporte a Swipe para dispositivos móveis
            initSwipeEvents(card);
        });
    }

    // 4. Atualizar Posições 3D da Pilha de Cards (GSAP)
    function updateDeck(direction = "next") {
        const len = cards.length;
        if (len === 0) return;

        cards.forEach((card, i) => {
            // Calcular a posição relativa do card em relação ao activeIndex
            let diff = (i - activeIndex + len) % len;

            if (diff === 0) {
                // Card ativo (Frente)
                card.classList.add("active-card");
                card.style.zIndex = 10;

                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    x: 0,
                    rotateX: 0,
                    rotateY: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            } else if (diff === 1) {
                // Card imediatamente atrás
                card.classList.remove("active-card");
                card.style.zIndex = 9;

                gsap.to(card, {
                    scale: 0.94,
                    y: -25,
                    x: 0,
                    rotateX: -2,
                    rotateY: 0,
                    opacity: 0.75,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            } else if (diff === 2) {
                // Terceiro card da pilha
                card.classList.remove("active-card");
                card.style.zIndex = 8;

                gsap.to(card, {
                    scale: 0.88,
                    y: -50,
                    x: 0,
                    rotateX: -4,
                    rotateY: 0,
                    opacity: 0.45,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            } else {
                // Demais cards ocultos no fundo
                card.classList.remove("active-card");
                card.style.zIndex = 5;

                gsap.to(card, {
                    scale: 0.82,
                    y: -75,
                    x: 0,
                    rotateX: -6,
                    rotateY: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }
        });
    }

    // 5. Navegar para Próximo Certificado
    function nextCertificate() {
        if (isAnimating || cards.length <= 1) return;
        isAnimating = true;

        if (window.CyberSynth && window.CyberSynth.playClick) {
            window.CyberSynth.playClick();
        }

        const activeCard = cards[activeIndex];

        // Animação de saída lateral do card ativo (passando página)
        gsap.to(activeCard, {
            x: -380,
            rotation: -12,
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Mandar de volta para a base da pilha
                gsap.set(activeCard, { x: 0, y: -75, scale: 0.82, rotation: 0, opacity: 0 });
                activeCard.classList.remove("active-card");
                isAnimating = false;
            }
        });

        // Avançar índice
        activeIndex = (activeIndex + 1) % cards.length;
        updateDeck("next");
    }

    // 6. Navegar para Certificado Anterior
    function prevCertificate() {
        if (isAnimating || cards.length <= 1) return;
        isAnimating = true;

        if (window.CyberSynth && window.CyberSynth.playClick) {
            window.CyberSynth.playClick();
        }

        // Decrementar índice
        const oldActiveIndex = activeIndex;
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
        const newActiveCard = cards[activeIndex];

        // Preparar novo active para deslizar de fora (puxando da lateral)
        gsap.set(newActiveCard, {
            x: 380,
            rotation: 12,
            opacity: 0,
            scale: 0.95,
            zIndex: 11
        });

        // Atualizar posições dos outros cards na pilha
        updateDeck("prev");

        // Deslizar o novo active para a frente
        gsap.to(newActiveCard, {
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                newActiveCard.classList.add("active-card");
                isAnimating = false;
            }
        });
    }

    // 7. Lógica de Swipe Touch (Mobile)
    function initSwipeEvents(card) {
        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let deltaY = 0;

        card.addEventListener("touchstart", (e) => {
            if (!card.classList.contains("active-card") || isAnimating) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            deltaX = 0;
            deltaY = 0;
        }, { passive: true });

        card.addEventListener("touchmove", (e) => {
            if (!card.classList.contains("active-card") || isAnimating) return;
            deltaX = e.touches[0].clientX - startX;
            deltaY = e.touches[0].clientY - startY;

            // Arrastar levemente a carta com o dedo
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                gsap.set(card, {
                    x: deltaX,
                    rotation: deltaX * 0.03,
                    ease: "none"
                });
            }
        }, { passive: true });

        card.addEventListener("touchend", () => {
            if (!card.classList.contains("active-card") || isAnimating) return;

            // Validar limiar de arraste (100px)
            if (deltaX < -90) {
                // Swipe para esquerda -> Próximo
                nextCertificate();
            } else if (deltaX > 90) {
                // Swipe para direita -> Anterior
                prevCertificate();
            } else {
                // Voltar para o centro
                gsap.to(card, {
                    x: 0,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }

    // 8. Lógica do Modal de Visualização Ampliada
    function initModal() {
        const modalImg = document.getElementById("modal-cert-img");
        const modalTitle = document.getElementById("modal-cert-title");
        const modalInst = document.getElementById("modal-cert-inst");
        const modalDownload = document.getElementById("modal-cert-download");
        const closeBtn = modal.querySelector(".modal-close-btn");

        if (!modal) return;

        // Abrir Modal
        deck.addEventListener("click", (e) => {
            const viewBtn = e.target.closest(".cyber-btn-mini.view");
            if (!viewBtn) return;

            const card = viewBtn.closest(".certificate-card");
            const index = parseInt(card.getAttribute("data-index"));
            const cert = certificates[index];

            if (modalImg) modalImg.src = cert.image;
            if (modalTitle) modalTitle.innerText = cert.title;
            if (modalInst) modalInst.innerText = cert.institution;
            if (modalDownload) {
                modalDownload.href = cert.pdf;
                modalDownload.setAttribute("download", `${cert.title}.pdf`);
            }

            modal.classList.add("open");

            if (window.CyberSynth && window.CyberSynth.playSuccess) {
                window.CyberSynth.playSuccess();
            }
        });

        // Fechar Modal
        const closeModalFunc = () => {
            modal.classList.remove("open");
            if (window.CyberSynth && window.CyberSynth.playClick) {
                window.CyberSynth.playClick();
            }
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModalFunc);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModalFunc();
        });

        // Fechar com tecla ESC
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("open")) {
                closeModalFunc();
            }
        });
    }

    // 9. Inicializar Controle do Deck
    renderCards();
    updateDeck();
    initModal();

    // Hook nos botões de navegação
    if (prevBtn) prevBtn.addEventListener("click", prevCertificate);
    if (nextBtn) nextBtn.addEventListener("click", nextCertificate);
    if (prevBtnMobile) prevBtnMobile.addEventListener("click", prevCertificate);
    if (nextBtnMobile) nextBtnMobile.addEventListener("click", nextCertificate);
});
