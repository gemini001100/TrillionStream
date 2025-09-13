class TrillionStreamResponsive {
    constructor() {
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            large: 1440,
            xlarge: 1920
        };
        
        this.elements = {
            textLogDiv: document.querySelector('.textlogodiv'),
            textLogo: document.getElementById('textlogo'),
            videoSection: document.getElementById('proofvideosection'),
            video: document.getElementById('video1'),
            benefitDiv: document.getElementById('accessbenefitdiv'),
            benefitInfo: document.getElementById('accessbenefitinfo'),
            benefitSubInfo: document.getElementById('accessbenefitsubinfo'),
            accessDiv: document.getElementById('requestaccessdiv'),
            accessEmail: document.getElementById('requestaccessemail'),
            accessBtn: document.getElementById('getaccessbtn'),
            metricsSection: document.getElementById('punchymetricssection'),
            metrics: document.getElementById('punchymetrics'),
            pm1: document.getElementById('pm1'),
            pm2: document.getElementById('pm2'),
            pm3: document.getElementById('pm3'),
            pm1Head: document.getElementById('pm1head1'),
            pm2Head: document.getElementById('pm2head1'),
            pm3Head: document.getElementById('pm3head1'),
            footer: document.getElementById('footer'),
            footerTitle: document.getElementById('footertitle'),
            emailDiv: document.querySelector('.emaildiv')
        };
        
        this.isInitialized = false;
        this.resizeTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing TrillionStream Responsive System');
        
        // Set initial viewport
        this.setViewportUnits();
        
        // Apply responsive styles immediately
        this.updateResponsiveStyles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Responsive system initialized');
    }
    
    setViewportUnits() {
        // Fix viewport height issues on mobile
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;
        
        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--vw', vw + 'px');
        document.documentElement.style.setProperty('--screen-width', window.innerWidth + 'px');
        document.documentElement.style.setProperty('--screen-height', window.innerHeight + 'px');
    }
    
    setupEventListeners() {
        // Resize handler with debounce
        window.addEventListener('resize', () => {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            
            this.resizeTimer = setTimeout(() => {
                this.setViewportUnits();
                this.updateResponsiveStyles();
            }, 100);
        });
        
        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setViewportUnits();
                this.updateResponsiveStyles();
            }, 200);
        });
        
        // Load handler for initial setup
        window.addEventListener('load', () => {
            this.updateResponsiveStyles();
        });
        
        // DOM content loaded backup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateResponsiveStyles();
            });
        }
    }
    
    getDeviceInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isLandscape = width > height;
        
        let device;
        if (width <= this.breakpoints.mobile) {
            device = 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            device = 'tablet';
        } else if (width <= this.breakpoints.desktop) {
            device = 'desktop';
        } else if (width <= this.breakpoints.large) {
            device = 'large';
        } else {
            device = 'xlarge';
        }
        
        return { width, height, device, isLandscape };
    }
    
    calculateFluidSize(currentWidth, minSize, maxSize, minWidth = 320, maxWidth = 1440) {
        if (currentWidth <= minWidth) return minSize;
        if (currentWidth >= maxWidth) return maxSize;
        
        const ratio = (currentWidth - minWidth) / (maxWidth - minWidth);
        return Math.round(minSize + (maxSize - minSize) * ratio);
    }
    
    updateResponsiveStyles() {
        const { width, height, device, isLandscape } = this.getDeviceInfo();
        
        console.log(`Updating styles for: ${device} (${width}x${height}) - ${isLandscape ? 'landscape' : 'portrait'}`);
        
        // Calculate responsive sizes
        const sizes = this.calculateSizes(width, height, device, isLandscape);
        
        // Apply to elements
        this.applyLogoStyles(sizes, device);
        this.applyVideoStyles(sizes, device);
        this.applyHeroStyles(sizes, device, isLandscape);
        this.applyFormStyles(sizes, device, isLandscape);
        this.applyMetricsStyles(sizes, device);
        this.applyFooterStyles(sizes, device);
        
        // Set CSS custom properties for advanced usage
        this.setCSSProperties(sizes, device);
    }
    
    calculateSizes(width, height, device, isLandscape) {
        return {
            // Logo sizes
            logoHeight: this.calculateFluidSize(width, 48, 64, 320, 1440),
            logoFontSize: this.calculateFluidSize(width, 24, 40, 320, 1440),
            logoPadding: this.calculateFluidSize(width, 8, 16, 320, 1440),
            
            // Hero text sizes
            heroTitleSize: this.calculateFluidSize(width, 20, 35, 320, 1440),
            heroSubtitleSize: this.calculateFluidSize(width, 14, 22, 320, 1440),
            heroWidth: Math.min(width * 0.9, device === 'mobile' ? width * 0.95 : 800),
            heroTopPosition: device === 'mobile' ? (isLandscape ? '25%' : '30%') : '36%',
            
            // Form sizes
            formWidth: Math.min(width * (device === 'mobile' ? 0.95 : 0.8), 600),
            inputHeight: this.calculateFluidSize(width, 48, 56, 320, 1440),
            inputFontSize: this.calculateFluidSize(width, 16, 22, 320, 1440),
            inputPadding: this.calculateFluidSize(width, 12, 24, 320, 1440),
            btnFontSize: this.calculateFluidSize(width, 14, 18, 320, 1440),
            btnWidth: this.calculateFluidSize(width, 120, 160, 320, 1440),
            formTopPosition: device === 'mobile' ? (isLandscape ? '65%' : '70%') : '65%',
            formGap: device === 'mobile' && !isLandscape ? '12px' : '0',
            
            // Metrics sizes
            metricsContainerWidth: Math.min(width * 0.95, 1400),
            metricsGap: this.calculateFluidSize(width, 8, 24, 320, 1440),
            metricsPadding: this.calculateFluidSize(width, 16, 32, 320, 1920),
            metricsHeight: this.calculateFluidSize(width, 300, 670, 320, 1440),
            metricsTitleSize: this.calculateFluidSize(width, 28, 43, 320, 1440),
            metricsTextSize: this.calculateFluidSize(width, 16, 32, 320, 1440),
            metricsSmallSize: this.calculateFluidSize(width, 22, 36, 320, 1440),
            
            // Footer sizes
            footerTitleSize: this.calculateFluidSize(width, 32, 48, 320, 1440),
            footerPadding: this.calculateFluidSize(width, 16, 32, 320, 1440),
            emailFontSize: this.calculateFluidSize(width, 16, 19, 320, 1440),
            
            // Spacing
            baseSpacing: this.calculateFluidSize(width, 8, 32, 320, 1440),
            sectionPadding: this.calculateFluidSize(width, 16, 64, 320, 1440),
        };
    }
    
    applyLogoStyles(sizes, device) {
        if (this.elements.textLogDiv) {
            this.elements.textLogDiv.style.height = sizes.logoHeight + 'px';
            this.elements.textLogDiv.style.padding = `${sizes.logoPadding}px ${sizes.logoPadding * 1.5}px`;
            
            if (device === 'mobile') {
                this.elements.textLogDiv.style.width = '100%';
                this.elements.textLogDiv.style.textAlign = 'center';
                this.elements.textLogDiv.style.left = '0';
                this.elements.textLogDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            } else {
                this.elements.textLogDiv.style.width = 'auto';
                this.elements.textLogDiv.style.textAlign = 'left';
                this.elements.textLogDiv.style.backgroundColor = 'transparent';
            }
        }
        
        if (this.elements.textLogo) {
            this.elements.textLogo.style.fontSize = sizes.logoFontSize + 'px';
        }
    }
    
    applyVideoStyles(sizes, device) {
        if (this.elements.videoSection) {
            if (device === 'mobile') {
                this.elements.videoSection.style.height = '70vh';
                this.elements.videoSection.style.minHeight = '400px';
            } else {
                this.elements.videoSection.style.height = '100vh';
                this.elements.videoSection.style.minHeight = '500px';
            }
        }
    }
    
    applyHeroStyles(sizes, device, isLandscape) {
        if (this.elements.benefitDiv) {
            this.elements.benefitDiv.style.width = sizes.heroWidth + 'px';
            this.elements.benefitDiv.style.top = sizes.heroTopPosition;
            this.elements.benefitDiv.style.padding = sizes.baseSpacing + 'px';
            
            if (device === 'mobile') {
                this.elements.benefitDiv.style.left = '50%';
                this.elements.benefitDiv.style.transform = 'translateX(-50%)';
            }
        }
        
        if (this.elements.benefitInfo) {
            this.elements.benefitInfo.style.fontSize = sizes.heroTitleSize + 'px';
            this.elements.benefitInfo.style.lineHeight = '1.3';
            this.elements.benefitInfo.style.marginBottom = (sizes.baseSpacing * 0.8) + 'px';
        }
        
        if (this.elements.benefitSubInfo) {
            this.elements.benefitSubInfo.style.fontSize = sizes.heroSubtitleSize + 'px';
            this.elements.benefitSubInfo.style.lineHeight = '1.4';
            this.elements.benefitSubInfo.style.marginTop = sizes.baseSpacing + 'px';
        }
    }
    
    applyFormStyles(sizes, device, isLandscape) {
        if (this.elements.accessDiv) {
            this.elements.accessDiv.style.width = sizes.formWidth + 'px';
            this.elements.accessDiv.style.top = sizes.formTopPosition;
            this.elements.accessDiv.style.gap = sizes.formGap;
            
            if (device === 'mobile' && !isLandscape) {
                this.elements.accessDiv.style.flexDirection = 'column';
            } else {
                this.elements.accessDiv.style.flexDirection = 'row';
            }
        }
        
        if (this.elements.accessEmail) {
            this.elements.accessEmail.style.height = sizes.inputHeight + 'px';
            this.elements.accessEmail.style.fontSize = sizes.inputFontSize + 'px';
            this.elements.accessEmail.style.padding = sizes.inputPadding + 'px';
            
            if (device === 'mobile' && !isLandscape) {
                this.elements.accessEmail.style.width = '100%';
                this.elements.accessEmail.style.borderRadius = '0.5rem';
            } else {
                this.elements.accessEmail.style.width = `${sizes.formWidth - sizes.btnWidth}px`;
                this.elements.accessEmail.style.borderRadius = '0.5rem 0 0 0.5rem';
            }
        }
        
        if (this.elements.accessBtn) {
            this.elements.accessBtn.style.height = sizes.inputHeight + 'px';
            this.elements.accessBtn.style.fontSize = sizes.btnFontSize + 'px';
            this.elements.accessBtn.style.padding = `${sizes.inputPadding * 0.5}px ${sizes.inputPadding}px`;
            
            if (device === 'mobile' && !isLandscape) {
                this.elements.accessBtn.style.width = '100%';
                this.elements.accessBtn.style.borderRadius = '0.5rem';
            } else {
                this.elements.accessBtn.style.width = sizes.btnWidth + 'px';
                this.elements.accessBtn.style.borderRadius = '0 0.5rem 0.5rem 0';
            }
        }
    }
    
    applyMetricsStyles(sizes, device) {
        if (this.elements.metricsSection) {
            this.elements.metricsSection.style.padding = `${sizes.sectionPadding}px 0`;
            this.elements.metricsSection.style.height = 'auto';
            this.elements.metricsSection.style.minHeight = '500px';
        }
        
        if (this.elements.metrics) {
            this.elements.metrics.style.maxWidth = sizes.metricsContainerWidth + 'px';
            this.elements.metrics.style.margin = '0 auto';
            this.elements.metrics.style.padding = `0 ${sizes.metricsGap}px`;
            this.elements.metrics.style.gap = sizes.metricsGap + 'px';
            
            if (device === 'mobile') {
                this.elements.metrics.style.flexDirection = 'column';
            } else {
                this.elements.metrics.style.flexDirection = 'row';
            }
        }
        
        // Apply to all metric cards
        [this.elements.pm1, this.elements.pm2, this.elements.pm3].forEach(card => {
            if (card) {
                card.style.padding = sizes.metricsPadding + 'px';
                card.style.minHeight = sizes.metricsHeight + 'px';
                card.style.height = 'auto';
                
                if (device === 'mobile') {
                    card.style.width = '100%';
                    card.style.flex = 'none';
                } else {
                    card.style.width = '30%';
                    card.style.flex = '1';
                }
            }
        });
        
        // Apply to metric titles
        [this.elements.pm1Head, this.elements.pm2Head, this.elements.pm3Head].forEach(title => {
            if (title) {
                title.style.fontSize = sizes.metricsTitleSize + 'px';
                title.style.lineHeight = '1.3';
                title.style.marginBottom = sizes.baseSpacing + 'px';
            }
        });
        
        // Apply to metric list items
        const listItems = document.querySelectorAll('.pm1li, .pm2li');
        listItems.forEach(item => {
            item.style.fontSize = sizes.metricsTextSize + 'px';
            item.style.lineHeight = '1.4';
            item.style.marginTop = (sizes.baseSpacing * 0.75) + 'px';
        });
        
        const smallItems = document.querySelectorAll('.pm3li');
        smallItems.forEach(item => {
            item.style.fontSize = sizes.metricsSmallSize + 'px';
            item.style.lineHeight = '1.4';
            item.style.marginTop = (sizes.baseSpacing * 0.75) + 'px';
        });
    }
    
    applyFooterStyles(sizes, device) {
        if (this.elements.footer) {
            this.elements.footer.style.padding = `${sizes.footerPadding}px ${sizes.footerPadding * 0.5}px`;
            this.elements.footer.style.height = 'auto';
            
            if (device === 'mobile') {
                this.elements.footer.style.textAlign = 'center';
                this.elements.footer.style.marginLeft = '0';
            } else {
                this.elements.footer.style.textAlign = 'left';
                this.elements.footer.style.marginLeft = '1.2rem';
            }
        }
        
        if (this.elements.footerTitle) {
            this.elements.footerTitle.style.fontSize = sizes.footerTitleSize + 'px';
        }
        
        if (this.elements.emailDiv) {
            this.elements.emailDiv.style.fontSize = sizes.emailFontSize + 'px';
            
            if (device === 'mobile') {
                this.elements.emailDiv.style.margin = `${sizes.baseSpacing}px 0`;
                this.elements.emailDiv.style.textAlign = 'center';
            } else {
                this.elements.emailDiv.style.margin = `0.2rem 0 0 1.2rem`;
                this.elements.emailDiv.style.textAlign = 'left';
            }
        }
    }
    
    setCSSProperties(sizes, device) {
        const root = document.documentElement;
        
        // Set all calculated sizes as CSS custom properties
        Object.entries(sizes).forEach(([key, value]) => {
            const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const cssValue = typeof value === 'number' ? value + 'px' : value;
            root.style.setProperty(cssVar, cssValue);
        });
        
        // Set device-specific properties
        root.style.setProperty('--device', device);
        root.style.setProperty('--is-mobile', device === 'mobile' ? '1' : '0');
        root.style.setProperty('--is-tablet', device === 'tablet' ? '1' : '0');
        root.style.setProperty('--is-desktop', device === 'desktop' ? '1' : '0');
    }
    
    // Public method to force update (useful for dynamic content)
    forceUpdate() {
        this.updateResponsiveStyles();
    }
    
    // Public method to get current device info
    getCurrentDevice() {
        return this.getDeviceInfo();
    }
    
    // Cleanup method
    destroy() {
        window.removeEventListener('resize', this.updateResponsiveStyles);
        window.removeEventListener('orientationchange', this.updateResponsiveStyles);
        
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        
        console.log('Responsive system destroyed');
    }
}

// Initialize the responsive system
let trillionResponsive;

// Wait for DOM to be ready
function initResponsive() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            trillionResponsive = new TrillionStreamResponsive();
        });
    } else {
        trillionResponsive = new TrillionStreamResponsive();
    }
}

// Initialize immediately
initResponsive();

// Expose globally for debugging
window.TrillionResponsive = trillionResponsive;

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && trillionResponsive) {
        setTimeout(() => {
            trillionResponsive.forceUpdate();
        }, 100);
    }
});
