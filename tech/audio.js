/* ==========================================================================
   WEB AUDIO API SYNTHESIZER: DYNAMIC SCI-FI HUD AUDIO
   Project: Everton Mota - 3D Technological Portfolio
   ========================================================================== */

class CyberSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.gainNode = null;
        
        // Carregar preferência salva
        const savedAudioState = localStorage.getItem('cyber-hud-audio-active');
        if (savedAudioState !== null) {
            this.enabled = savedAudioState === 'true';
        }
    }

    // Inicialização tardia para respeitar políticas de Autoplay dos navegadores
    init() {
        if (this.ctx) return;
        
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            
            // Criar nó de controle principal de volume (Master Gain)
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime); // Volume padrão moderado (12%)
            this.gainNode.connect(this.ctx.destination);
            
            console.log('// WEB AUDIO SYNTH PROTOCOL INITIALIZED [STABLE]');
        } catch (e) {
            console.warn('// FAILED TO INITIALIZE AUDIO SYNTH: ', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('cyber-hud-audio-active', this.enabled);
        
        if (this.enabled) {
            this.init();
            this.resume();
            this.playClick();
        }
        return this.enabled;
    }

    /* --- SYNTH 1: INTERFACE CLICK ("PIP") --- */
    playClick() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Criar Oscilador e Gain
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        
        // Curva de Frequência: Queda rápida de 1200Hz para 400Hz para dar o efeito de click mecânico
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        
        // Curva de Ganho (Envelope): Ataque instantâneo, decay rápido
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        
        osc.connect(gain);
        gain.connect(this.gainNode);
        
        osc.start(now);
        osc.stop(now + 0.07);
    }

    /* --- SYNTH 2: INTERFACE HOVER ("SWEEP") --- */
    playHover() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Usar oscilador de onda triangular para um som sci-fi mais suave e filtrado
        osc.type = 'triangle';
        
        // Curva de Frequência: Rápida varredura para cima de 800Hz para 1800Hz
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.08);
        
        // Volume extremamente baixo para ser discreto no hover
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        
        osc.connect(gain);
        gain.connect(this.gainNode);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    /* --- SYNTH 3: SYSTEM DECRYPTION SUCCESS ("BING-BONG") --- */
    playSuccess() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Nota 1
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now); // E5
        gain1.gain.setValueAtTime(0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.gainNode);
        
        // Nota 2 (Atrasada)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(987.77, now + 0.08); // B5
        gain2.gain.setValueAtTime(0.5, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc2.connect(gain2);
        gain2.connect(this.gainNode);
        
        osc1.start(now);
        osc1.stop(now + 0.2);
        
        osc2.start(now + 0.08);
        osc2.stop(now + 0.3);
    }

    /* --- SYNTH 4: BOOT SYSTEM ENVELOPE ("SWELL & BELL") --- */
    playBoot() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // 1. Som de Rampa Grave (Swell)
        const swellOsc = this.ctx.createOscillator();
        const swellGain = this.ctx.createGain();
        swellOsc.type = 'sawtooth';
        
        // Filtro passa-baixa para remover a aspereza da onda dente-de-serra
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + 1.2);
        
        swellOsc.frequency.setValueAtTime(55, now); // La grave
        swellOsc.frequency.linearRampToValueAtTime(220, now + 1.2); // Subindo 2 oitavas
        
        swellGain.gain.setValueAtTime(0.01, now);
        swellGain.gain.exponentialRampToValueAtTime(0.6, now + 0.8);
        swellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
        
        swellOsc.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(this.gainNode);
        
        swellOsc.start(now);
        swellOsc.stop(now + 1.4);
        
        // 2. Chime Futurista de Conclusão (Bell)
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(1480, now + 1.1); // F#6
        
        chimeGain.gain.setValueAtTime(0.6, now + 1.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.gainNode);
        
        chimeOsc.start(now + 1.1);
        chimeOsc.stop(now + 2.0);
    }
}

// Exportar globalmente para acesso nos scripts app.js
window.CyberSynth = new CyberSynth();
