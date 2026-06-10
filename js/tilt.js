// ==================== VANILLA 3D TILT EFFECT ====================
// Custom lightweight tilt implementation for 3D card hover effects

class VanillaTilt {
    constructor(element, options = {}) {
        this.element = element;
        this.settings = {
            maxTilt: options.maxTilt || 15,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.03,
            speed: options.speed || 400,
            glare: options.glare !== false,
            maxGlare: options.maxGlare || 0.3
        };
        this.init();
    }

    init() {
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = `transform ${this.settings.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

        if (this.settings.glare) {
            this.glareElement = document.createElement('div');
            this.glareElement.style.cssText = `
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                pointer-events: none;
                background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%);
                opacity: 0;
                transition: opacity ${this.settings.speed}ms ease;
                border-radius: inherit;
                z-index: 1;
                overflow: hidden;
            `;
            if (getComputedStyle(this.element).position === 'static') {
                this.element.style.position = 'relative';
            }
            this.element.style.overflow = this.element.style.overflow || 'hidden';
            this.element.appendChild(this.glareElement);
        }

        this.bindEvents();
    }

    bindEvents() {
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mousemove', this.onMouseMove);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
    }

    onMouseEnter() {
        this.element.style.willChange = 'transform';
        if (this.glareElement) this.glareElement.style.opacity = '1';
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const tiltX = -percentY * this.settings.maxTilt;
        const tiltY = percentX * this.settings.maxTilt;

        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
        `;

        if (this.glareElement) {
            const angle = Math.atan2(percentX, -percentY) * (180 / Math.PI);
            this.glareElement.style.backgroundImage = `linear-gradient(${angle}deg, rgba(255,255,255,${this.settings.maxGlare}) 0%, rgba(255,255,255,0) 80%)`;
        }
    }

    onMouseLeave() {
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
        if (this.glareElement) this.glareElement.style.opacity = '0';
    }

    static init(selector = '[data-tilt]', options = {}) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => new VanillaTilt(el, options));
    }
}

window.VanillaTilt = VanillaTilt;
