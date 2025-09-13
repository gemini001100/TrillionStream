/**
 * TrillionStream Landing Page - Production JavaScript
 * Handles form validation, video optimization, animations, and analytics
 */

class TrillionStreamApp {

    constructor() {
        this.isInitialized = false;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.submitCooldown = false;
        this.observers = new Map();
        
        // Bind methods to preserve context
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.handleVideoError = this.handleVideoError.bind(this);
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.performanceMetrics = { interactions: 0 };
        
        this.initWhenReady();
    }

    async initWhenReady() {
        // Wait for Firebase to be ready
        if (!window.firebaseManager) {
            console.log('⏳ Waiting for Firebase...');
            await new Promise(resolve => {
                window.addEventListener('firebaseReady', resolve, { once: true });
            });
        }
        
        console.log('🚀 Initializing app with Firebase ready');
        this.init();
    }


    //     // ADD AFTER constructor() method
    // async waitForFirebase() {
    //     return new Promise((resolve) => {
    //         const checkFirebase = () => {
    //             if (window.firebaseManager) {
    //                 resolve();
    //             } else {
    //                 setTimeout(checkFirebase, 100);
    //             }
    //         };
    //         checkFirebase();
    //     });
    // }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }




    // Initialize the application
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOM();
            this.setupEmailForm();
            this.setupVideoHandling();
            this.setupScrollAnimations();
            this.setupPerformanceOptimizations();
            this.setupAnalytics();
            this.setupAccessibility();
            
            this.isInitialized = true;
            console.log('TrillionStream app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize TrillionStream app:', error);
            this.handleError(error);
        }
    }

    // Wait for DOM to be ready
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // Email form handling with validation and submission
    setupEmailForm() {
        const emailInput = document.getElementById('requestaccessemail');
        const submitBtn = document.getElementById('getaccessbtn');
        const form = document.getElementById('requestaccessdiv');

        if (!emailInput || !submitBtn) {
            console.warn('Email form elements not found');
            return;
        }

        // Real-time email validation
        emailInput.addEventListener('input', (e) => {
            this.validateEmail(e.target);
        });

        emailInput.addEventListener('blur', (e) => {
            this.validateEmail(e.target, true);
        });

        // Form submission
        submitBtn.addEventListener('click', this.handleEmailSubmit);
        
        // Enter key submission
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleEmailSubmit(e);
            }
        });

        // Prevent form default submission if wrapped in form tag
        const formElement = emailInput.closest('form');
        if (formElement) {
            formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailSubmit(e);
            });
        }
    }

    // Email validation with visual feedback
    validateEmail(input, showError = false) {
        const email = input.value.trim();
        const isValid = this.emailRegex.test(email);
        const submitBtn = document.getElementById('getaccessbtn');

        // Remove previous validation classes
        input.classList.remove('valid', 'invalid');
        
        if (email.length === 0) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Request Access';
            return null;
        }

        if (isValid) {
            input.classList.add('valid');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Access';
            this.removeErrorMessage(input);
            return true;
        } else {
            input.classList.add('invalid');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Invalid Email';
            
            if (showError) {
                this.showErrorMessage(input, 'Please enter a valid email address');
            }
            return false;
        }
    }

    // Handle email form submission
    async handleEmailSubmit(e) {
        e.preventDefault();
        
        if (this.submitCooldown) return;
        
        const emailInput = document.getElementById('requestaccessemail');
        const submitBtn = document.getElementById('getaccessbtn');
        
        if (!this.validateEmail(emailInput, true)) {
            this.trackEvent('form_validation_failed', { error: 'invalid_email' });
            return;
        }

        // Prevent double submissions
        this.submitCooldown = true;
        const originalText = submitBtn.textContent;



        this.performanceMetrics.interactions++;
        this.announceToScreenReader('Submitting email request...');





        
        try {
            // Update UI to show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Requesting...';
            submitBtn.classList.add('loading');



            





            // Simulate API call (replace with actual endpoint)
            const response = await this.submitEmailToAPI(emailInput.value.trim());
            
            if (response.success) {
                this.showSuccessMessage(emailInput);
                submitBtn.textContent = 'Access Requested!';
                submitBtn.classList.add('success');
                emailInput.value = '';
                
                // Track successful submission
                this.trackEvent('email_submitted', { 
                    email: this.hashEmail(emailInput.value.trim()),
                    timestamp: new Date().toISOString()
                });
                
                // Reset form after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('success', 'loading');
                    submitBtn.disabled = false;
                }, 3000);
                
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Email submission error:', error);
            this.showErrorMessage(emailInput, 'Something went wrong. Please try again.');
            submitBtn.textContent = 'Try Again';
            submitBtn.classList.add('error');
            
            this.trackEvent('email_submission_failed', { 
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('error', 'loading');
                submitBtn.disabled = false;
            }, 3000);
        }
        
        // Reset cooldown
        setTimeout(() => {
            this.submitCooldown = false;
        }, 2000);
    }

    // Simulate API submission (replace with actual implementation)
    // async submitEmailToAPI(email) {
    //     // Replace this with your actual API endpoint
    //     const response = await window.firebaseManager.submitEmail(email);
        
    //     try {
    //         const response = await fetch(apiEndpoint, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-Requested-With': 'XMLHttpRequest'
    //             },
    //             body: JSON.stringify({ 
    //                 email: email,
    //                 source: 'landing_page',
    //                 timestamp: new Date().toISOString()
    //             })
    //         });
            
    //         const data = await response.json();
            
    //         if (!response.ok) {
    //             throw new Error(data.message || `HTTP ${response.status}`);
    //         }
            
    //         return { success: true, data };
            
    //     } catch (error) {
    //         // Fallback: simulate success for demo (remove in production)
    //         if (error.message.includes('fetch')) {
    //             console.warn('API endpoint not available, simulating success');
    //             await new Promise(resolve => setTimeout(resolve, 1000));
    //             return { success: true, data: { message: 'Demo mode' } };
    //         }
    //         throw error;
    //     }
    // }
   async submitEmailToAPI(email) {
    try {
        console.log('Attempting to submit email:', email);
        
        // Check if Firebase is ready
        if (!window.firebaseManager) {
            console.error('Firebase Manager not found');
            throw new Error('Firebase not initialized. Please refresh the page.');
        }
        
        // Submit to Firebase
        const response = await window.firebaseManager.submitEmail(email);
        
        if (response.success) {
            console.log('Email submission successful:', response);
            return { success: true, data: response };
        } else {
            throw new Error(response.error || 'Failed to submit email');
        }
        
    } catch (error) {
        console.error('Email submission failed:', error);
        throw error;
    }
}




    // Add this method to your TrillionStreamApp class
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('status-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Also create temporary announcement for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'assertive');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            // Clean up after announcement
            setTimeout(() => {
                if (announcement.parentNode) {
                    announcement.parentNode.removeChild(announcement);
                }
            }, 1000);
        }
    }



    // Video handling and optimization
    setupVideoHandling() {
        const video = document.getElementById('video1');
        
        if (!video) {
            console.warn('Video element not found');
            return;
        }

        // Optimize video loading
        video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });

        video.addEventListener('canplay', () => {
            console.log('Video can start playing');
            video.classList.add('loaded');
        });

        video.addEventListener('error', this.handleVideoError);
        
        // Pause video when not visible (performance optimization)
        this.setupVideoVisibilityHandling(video);
        
        // Handle video playback issues
        this.setupVideoFallback(video);
    }

    // // Handle video visibility for performance
    // setupVideoVisibilityHandling(video) {
    //     const observer = new IntersectionObserver((entries) => {
    //         entries.forEach(entry => {
    //             if (entry.isIntersecting) {
    //                 video.play().catch(this.handleVideoError);
    //             } else {
    //                 video.pause();
    //             }
    //         });
    //     }, { threshold: 0.1 });

    //     observer.observe(video);
    //     this.observers.set('video', observer);
    // }

    // // // Video error handling with fallback
    // // handleVideoError(error) {
    // //     console.error('Video error:', error);
    // //     const video = document.getElementById('video1');
    // //     const videoContainer = document.getElementById('proofvideo');
        
    // //     if (video && videoContainer) {
    // //         // Create fallback background
    // //         videoContainer.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)';
    // //         video.style.display = 'none';
            
    // //         // Add fallback content
    // //         const fallback = document.createElement('div');
    // //         fallback.className = 'video-fallback';
    // //         fallback.innerHTML = `
    // //             <div style="
    // //                 position: absolute;
    // //                 top: 50%;
    // //                 left: 50%;
    // //                 width:100%;
    // //                 height:100%;
    // //                 transform: translate(-50%, -50%);
    // //                 text-align: center;
    // //                 color: white;
    // //                 display:flex;
    // //                 align-items:center;
    // //                 justify-content:center;
    // //                 font-family: 'Space Grotesk', sans-serif;
    // //             ">
    // //                <img src="Fallback-image.jpg" 
    // //                  alt="TrillionStream Gaming Experience" 
    // //                 style="
    // //                     width: 100%;
    // //                     height: 100%;
    // //                     object-fit: cover;
    // //                     object-position: center;
    // //                     opacity: 0.8;
    // //                 "
    // //                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
    // //             >
    // //             <div style="
    // //                 display: none;
    // //                 color: white;
    // //                 font-family: 'Space Grotesk', sans-serif;
    // //                 text-align: center;
    // //             ">
    // //                 <h3>Experience Ultra-Low Latency Gaming</h3>
    // //                 <p>Revolutionary cloud gaming technology</p>
    // //             </div>
    // //         </div>




    // //         //         // <h3>Experience Ultra-Low Latency Gaming</h3>
    // //         //         // <p>Revolutionary cloud gaming technology</p>
    // //         //         video
    // //         //     </div>
    // //         // `;
    // //         // videoContainer.appendChild(fallback);
    // //     }
        
    // //     this.trackEvent('video_error', { error: error.message || 'Unknown error' });
    // // }
            //         class VideoManager {
            //             constructor(videoId) {
            //                 this.video = document.getElementById(videoId);
            //                 this.videoContainer = document.getElementById('proofvideo');
            //                 this.retryCount = 0;
            //                 this.maxRetries = 3;
            //                 this.retryDelay = 2000;
            //                 this.isPlaying = false;
            //                 this.loadTimeout = null;
            //                 this.fallbackShown = false;
                            
            //                 this.init();
            //             }

            //             init() {
            //                 if (!this.video) return;
                            
            //                 // Start 2-second timer immediately
            //                 this.startLoadTimer();
                            
            //                 this.video.addEventListener('error', this.handleVideoError.bind(this));
            //                 this.video.addEventListener('stalled', this.handleStalled.bind(this));
            //                 this.video.addEventListener('waiting', this.handleWaiting.bind(this));
            //                 this.video.addEventListener('canplay', this.handleCanPlay.bind(this));
            //                 this.video.addEventListener('loadeddata', this.handleLoadedData.bind(this));
            //                 this.video.addEventListener('ended', this.handleEnded.bind(this));
            //                 this.video.addEventListener('pause', this.handlePause.bind(this));
                            
            //                 this.video.muted = true;
            //                 this.video.playsInline = true;
            //                 this.video.preload = 'auto';
                            
            //                 this.attemptPlay();
            //                 this.setupVisibilityObserver();
            //                 this.startHealthCheck();
            //             }

            //             // 2-second timer for fallback
            //             startLoadTimer() {
            //                 this.loadTimeout = setTimeout(() => {
            //                     if (!this.isPlaying && !this.fallbackShown) {
            //                         console.log('Video failed to load within 2 seconds, showing fallback');
            //                         this.showFallback();
            //                     }
            //                 }, 2000);
            //             }

            //             // Clear timer when video loads successfully
            //             clearLoadTimer() {
            //                 if (this.loadTimeout) {
            //                     clearTimeout(this.loadTimeout);
            //                     this.loadTimeout = null;
            //                 }
            //             }

            //             handleCanPlay() {
            //                 console.log('Video can play');
            //                 this.retryCount = 0;
            //                 this.clearLoadTimer(); // Clear timer since video loaded
            //                 this.attemptPlay();
            //             }

            //             handleLoadedData() {
            //                 console.log('Video data loaded');
            //                 this.clearLoadTimer(); // Clear timer since video loaded
            //                 this.attemptPlay();
            //             }

            //             async attemptPlay() {
            //                 try {
            //                     if (this.video.readyState >= 2) {
            //                         const playPromise = this.video.play();
            //                         if (playPromise !== undefined) {
            //                             await playPromise;
            //                             this.isPlaying = true;
            //                             this.clearLoadTimer(); // Clear timer since video is playing
            //                             console.log('Video playing successfully');
            //                         }
            //                     }
            //                 } catch (error) {
            //                     console.error('Play attempt failed:', error);
            //                     setTimeout(() => {
            //                         if (!this.isPlaying) {
            //                             this.attemptPlay();
            //                         }
            //                     }, 1000);
            //                 }
            //             }

            //             // Video error handling with fallback
            //             handleVideoError(error) {
            //                 console.error('Video error:', error);
            //                 this.clearLoadTimer(); // Clear timer since we're handling error
            //                 this.showFallback();
            //                 this.trackEvent('video_error', { error: error.message || 'Unknown error' });
            //             }

            //             handleStalled() {
            //                 console.warn('Video stalled, attempting recovery');
            //                 setTimeout(() => {
            //                     if (this.video.readyState < 3 && !this.fallbackShown) {
            //                         this.video.load();
            //                         this.attemptPlay();
            //                     }
            //                 }, 1000);
            //             }

            //             showFallback() {
            //                 if (this.fallbackShown) return; // Prevent multiple fallbacks
                            
            //                 this.fallbackShown = true;
            //                 console.log('Showing video fallback image');
                            
            //                 if (this.video && this.videoContainer) {
            //                     // Hide video
            //                     this.video.style.display = 'none';
                                
            //                     // Create fallback with image
            //                     const fallback = document.createElement('div');
            //                     fallback.className = 'video-fallback';
            //                     fallback.innerHTML = `
            //                         <div style="
            //                             position: absolute;
            //                             top: 0;
            //                             left: 0;
            //                             width: 100%;
            //                             height: 100%;
            //                             display: flex;
            //                             align-items: center;
            //                             justify-content: center;
            //                         ">
            //                             <img src="Fallback-image.jpg" 
            //                                 alt="TrillionStream Gaming Experience" 
            //                                 style="
            //                                     width: 100%;
            //                                     height: 100%;
            //                                     object-fit: cover;
            //                                     object-position: center;
            //                                     opacity: 0.8;
            //                                 "
            //                                 onerror="this.style.display='none';"
            //                             >
            //                         </div>
            //                     `;
                                
            //                     this.videoContainer.appendChild(fallback);
            //                 }
            //             }
            //             handleEnded() {
            //                 if (!this.fallbackShown) {
            //                     this.video.currentTime = 0;
            //                     this.attemptPlay();
            //                 }
            //             }

            //             handlePause() {
            //                 if (this.isPlaying && !document.hidden && !this.fallbackShown) {
            //                     setTimeout(() => {
            //                         this.attemptPlay();
            //                     }, 100);
            //                 }
            //             }

            //             setupVisibilityObserver() {
            //                 const observer = new IntersectionObserver((entries) => {
            //                     entries.forEach(entry => {
            //                         if (entry.isIntersecting && !this.fallbackShown) {
            //                             this.isPlaying = true;
            //                             this.attemptPlay();
            //                         } else {
            //                             this.isPlaying = false;
            //                             if (!this.fallbackShown) {
            //                                 this.video.pause();
            //                             }
            //                         }
            //                     });
            //                 }, { threshold: 0.1 });
                            
            //                 observer.observe(this.video);
                            
            //                 document.addEventListener('visibilitychange', () => {
            //                     if (document.hidden) {
            //                         this.isPlaying = false;
            //                         if (!this.fallbackShown) {
            //                             this.video.pause();
            //                         }
            //                     } else {
            //                         this.isPlaying = true;
            //                         if (!this.fallbackShown) {
            //                             this.attemptPlay();
            //                         }
            //                     }
            //                 });
            //             }

            //             startHealthCheck() {
            //                 setInterval(() => {
            //                     if (this.isPlaying && this.video.paused && !document.hidden && !this.fallbackShown) {
            //                         console.log('Health check: Video should be playing but is paused');
            //                         this.attemptPlay();
            //                     }
                                
            //                     if (this.video.readyState === 2 && this.video.networkState === 2 && !this.fallbackShown) {
            //                         console.log('Health check: Video appears stuck, reloading');
            //                         this.video.load();
            //                         this.attemptPlay();
            //                     }
            //                 }, 5000);
            //             }

            //             trackEvent(eventName, properties = {}) {
            //                 console.log('Analytics Event:', eventName, properties);
            //                 // Add your analytics tracking here
            //             }

            //             // Cleanup method
            //             destroy() {
            //                 this.clearLoadTimer();
            //                 // Other cleanup code...
            //             }
            //         }

            //         // Initialize when DOM is ready
            //         document.addEventListener('DOMContentLoaded', () => {
            //             new VideoManager('video1');
            //         });
// Video handling and optimization
setupVideoHandling() {
    const video = document.getElementById('video1');
    
    if (!video) {
        console.warn('Video element not found');
        return;
    }

    // ADD THIS: Timer properties
    this.loadTimeout = null;
    this.fallbackShown = false;

    // ADD THIS: Start 2-second timer immediately
    this.startLoadTimer();

    // Optimize video loading
    video.addEventListener('loadstart', () => {
        console.log('Video loading started');
    });

    video.addEventListener('canplay', () => {
        console.log('Video can start playing');
        video.classList.add('loaded');
        // ADD THIS: Clear timer when video can play
        this.clearLoadTimer();
    });

    video.addEventListener('error', this.handleVideoError);
    
    // Pause video when not visible (performance optimization)
    this.setupVideoVisibilityHandling(video);
    
    // Handle video playback issues
    this.setupVideoFallback(video);
}

// ADD THESE THREE NEW METHODS:

// 2-second timer for fallback
startLoadTimer() {
    this.loadTimeout = setTimeout(() => {
        if (!this.fallbackShown) {
            console.log('Video failed to load within 2 seconds, showing fallback');
            this.handleVideoError({ message: 'Load timeout' });
        }
    }, 2000);
}

// Clear timer when video loads successfully
clearLoadTimer() {
    if (this.loadTimeout) {
        clearTimeout(this.loadTimeout);
        this.loadTimeout = null;
    }
}

// Video error handling with fallback
handleVideoError(error) {
    if (this.fallbackShown) return; // Prevent multiple fallbacks
    
    console.error('Video error:', error);
    this.clearLoadTimer(); // Clear timer since we're handling error
    this.fallbackShown = true;
    
    const video = document.getElementById('video1');
    const videoContainer = document.getElementById('proofvideo');
    
    if (video && videoContainer) {
        // Hide video
        video.style.display = 'none';
        
        // Create fallback with image
        const fallback = document.createElement('div');
        fallback.className = 'video-fallback';
        fallback.innerHTML = `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <img src="Fallback-image.jpg" 
                     alt="TrillionStream Gaming Experience" 
                     style="
                         width: 100%;
                         height: 100%;
                         object-fit: cover;
                         object-position: center;
                         opacity: 0.8;
                     "
                     onerror="this.style.display='none';"
                >
            </div>
        `;
        
        videoContainer.appendChild(fallback);
    }
    
    this.trackEvent('video_error', { error: error.message || 'Unknown error' });
}

// Handle video visibility for performance
setupVideoVisibilityHandling(video) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(this.handleVideoError);
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(video);
    this.observers.set('video', observer);
}    // Setup video fallback options
    setupVideoFallback(video) {
        // Try to reload video if it fails
        let retryCount = 0;
        const maxRetries = 3;
        
        video.addEventListener('error', () => {
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying video load (${retryCount}/${maxRetries})`);
                setTimeout(() => {
                    video.load();
                }, 1000 * retryCount);
            }
        });
    }

    // Scroll animations and effects
    setupScrollAnimations() {
        // Animate metrics cards on scroll
        const metricsCards = document.querySelectorAll('#pm1, #pm2, #pm3');
        
        if (metricsCards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 150);
                    }
                });
            }, { 
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            metricsCards.forEach(card => observer.observe(card));
            this.observers.set('metrics', observer);
        }

        // Parallax effect for background video
        window.addEventListener('scroll', this.handleScroll);
    }

    // Handle scroll effects
    handleScroll() {
        const scrolled = window.pageYOffset;
        const video = document.getElementById('video1');
        
        if (video) {
            // Subtle parallax effect
            const parallaxSpeed = 0.5;
            video.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
        
        // Update logo background blend mode based on scroll
        const logo = document.querySelector('.textlogodiv');
        if (logo) {
            if (scrolled > 100) {
                // logo.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                logo.style.backdropFilter = 'blur(10px)';
            } else {
                logo.style.backgroundColor = 'transparent';
                logo.style.backdropFilter = 'none';
            }
        }
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Preload critical fonts
        this.preloadFonts([
            'https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap',
            'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
            'https://fonts.googleapis.com/css2?family=Questrial&display=swap'
        ]);

        // Lazy load non-critical elements
        this.setupLazyLoading();
        
        // Optimize images if any are added later
        this.optimizeImages();
    }

    // Preload critical fonts
    preloadFonts(fontUrls) {
        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // Setup lazy loading for future elements
    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if (lazyElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.dataset.lazy;
                        
                        if (element.tagName === 'IMG') {
                            element.src = src;
                        } else {
                            element.style.backgroundImage = `url(${src})`;
                        }
                        
                        element.classList.add('loaded');
                        observer.unobserve(element);
                    }
                });
            });

            lazyElements.forEach(el => observer.observe(el));
            this.observers.set('lazy', observer);
        }
    }

    // Optimize any images on the page
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    // Analytics tracking
    setupAnalytics() {
        // Track page load
        this.trackEvent('page_loaded', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });

        // Track scroll depth
        this.setupScrollDepthTracking();
        
        // Track time on page
        this.startTimeTracking();
    }

    // Track scroll depth
    setupScrollDepthTracking() {
        const scrollMarkers = [25, 50, 75, 100];
        const trackedMarkers = new Set();
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollMarkers.forEach(marker => {
                if (scrollPercent >= marker && !trackedMarkers.has(marker)) {
                    trackedMarkers.add(marker);
                    this.trackEvent('scroll_depth', { percent: marker });
                }
            });
        }, 100));
    }    // Track time on page
    startTimeTracking() {
        const startTime = Date.now();
        
        // Track time when user leaves
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', { seconds: timeSpent });
        });
    }

    // Generic event tracking (replace with your analytics service)
    trackEvent(eventName, properties = {}) {
        console.log('Analytics Event:', eventName, properties);
        
        // Example implementations:
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, properties);
        }
        
        // Custom analytics endpoint
    //     try {
    //         fetch('/api/analytics', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 event: eventName,
    //                 properties,
    //                 timestamp: new Date().toISOString(),
    //                 url: window.location.href
    //             })
    //         }).catch(err => console.warn('Analytics error:', err));
    //     } catch (error) {
    //         console.warn('Analytics tracking failed:', error);
    //     }
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Ensure proper focus management
        this.setupFocusManagement();
        
        // Add ARIA labels where needed
        this.enhanceARIA();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    // Focus management
    setupFocusManagement() {
        const emailInput = document.getElementById('requestaccessemail');
        const submitBtn = document.getElementById('getaccessbtn');
        
        if (emailInput && submitBtn) {
            // Ensure focus is visible
            emailInput.addEventListener('focus', () => {
                emailInput.setAttribute('aria-describedby', 'email-help');
            });
            
            // Add focus indicators
            [emailInput, submitBtn].forEach(element => {
                element.addEventListener('focus', () => {
                    element.style.outline = '2px solid #96b3f9';
                    element.style.outlineOffset = '2px';
                });
                
                element.addEventListener('blur', () => {
                    element.style.outline = '';
                    element.style.outlineOffset = '';
                });
            });
        }
     }

    // Enhance ARIA attributes
    enhanceARIA() {
        const emailInput = document.getElementById('requestaccessemail');
        const submitBtn = document.getElementById('getaccessbtn');
        
        if (emailInput) {
            emailInput.setAttribute('aria-label', 'Email address for early access');
            emailInput.setAttribute('aria-required', 'true');
        }
        
        if (submitBtn) {
            submitBtn.setAttribute('aria-describedby', 'email-input');
        }
        
        // Add live region for status updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'status-live-region';
        document.body.appendChild(liveRegion);
        }

    // Keyboard navigation
    setupKeyboardNavigation() {
        // Escape key to clear form
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const emailInput = document.getElementById('requestaccessemail');
                if (emailInput && document.activeElement === emailInput) {
                    emailInput.value = '';
                    this.validateEmail(emailInput);
                }
            }
        });
    }    // Utility methods
    
    // Show error message
    showErrorMessage(input, message) {
        this.removeErrorMessage(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: #ff0033;
        color: black;
        padding: 1.2rem;
        border-radius: 0.5rem;
        z-index: 99;
        font-family: 'Sora', sans-serif;
    `;

        
        input.parentNode.appendChild(errorDiv);
        
        // Update live region
        const liveRegion = document.getElementById('status-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // Show success message
    showSuccessMessage(input) {
        this.removeErrorMessage(input);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'ACCESS REQUEST VERIFIED.';
        successDiv.setAttribute('role', 'alert');
        successDiv.style.cssText = `
            color: black;
            font-size: 0.9rem;
            margin-top: 0rem;
            margin-left:0.5rem;
            font-family: 'space grotesk', sans-serif;
            background-color: rgb(143 , 211 , 41);
            border-radius: 0.3rem;
            text-align: center;
            height:3.3rem;
            padding:0.5rem;
        `;
        
        input.parentNode.appendChild(successDiv);
        
        // Update live region
        const liveRegion = document.getElementById('status-live-region');
        if (liveRegion) {
            liveRegion.textContent = 'Access requested successfully!';
        }
        
        // Remove success message after delay
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    // Remove error message
    removeErrorMessage(input) {
        const existing = input.parentNode.querySelector('.error-message, .success-message');
        if (existing) {
            existing.parentNode.removeChild(existing);
        }
    }

    // Hash email for privacy-safe analytics
    hashEmail(email) {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Error handling
    handleError(error) {
        console.error('Application error:', error);
        
        // Track error
        this.trackEvent('application_error', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        // Could show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: greenyellow;
            color: black;
            padding: 1.2rem;
            border-radius: 0.5rem;
            z-index: 9999;
            font-family: 'Sora', sans-serif;
        `;
        errorDiv.textContent = 'Something went wrong. Please refresh the page.';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Cleanup method
    destroy() {
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        console.log('TrillionStream app destroyed');
    }
}

// CSS additions for enhanced functionality
const additionalStyles = `
<style>
/* Loading states */
#getaccessbtn.loading {
    opacity: 0.7;
    cursor: not-allowed;
}

#getaccessbtn.success {
    background-color: rgb(143, 211, 41) !important;
    color: black !important;
}

#getaccessbtn.error {
    background-color: #ff0033 !important;
    animation: shake 0.5s ease-in-out;
}

/* Email validation styles */
#requestaccessemail.valid {
    border: 2px solid rgb(143, 211, 41);
}

#requestaccessemail.invalid {
    border: 2px solid #ff0033;
}

/* Animation keyframes */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Metrics cards animation */
#pm1, #pm2, #pm3 {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

#pm1.animate-in, #pm2.animate-in, #pm3.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Video loaded state */
#video1.loaded {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
}

/* Screen reader only content */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Focus styles */
button:focus-visible,
input:focus-visible {
    outline: 2px solid #96b3f9 !important;
    outline-offset: 2px !important;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    #requestaccessdiv {
        flex-direction: column;
        gap: 1rem;
    }
    
    #requestaccessemail {
        border-radius: 0.5rem;
        width: 100%;
    }
    
    #getaccessbtn {
        border-radius: 0.5rem;
        width: 100%;
    }
}
</style>
`;

// Initialize the application
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialize the app when DOM is ready
let trillionStreamApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        trillionStreamApp = new TrillionStreamApp();
    });
} else {
    trillionStreamApp = new TrillionStreamApp();
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (trillionStreamApp) {
        trillionStreamApp.handleError(event.error);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (trillionStreamApp) {
        trillionStreamApp.handleError(new Error(event.reason));
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrillionStreamApp;
}class SuggestionManager {
    constructor() {
        this.form = document.getElementById('suggestionform');
        this.submitBtn = document.getElementById('submitsuggestion');
        this.statusDiv = document.getElementById('suggestionstatus');
        this.messageTextarea = document.getElementById('suggestionmessage');
        this.charCounter = document.getElementById('charcount');
        
        this.maxChars = 500;
        this.submitCooldown = false;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Character counter
        this.messageTextarea.addEventListener('input', this.updateCharCount.bind(this));
        
        // Real-time validation
        this.setupValidation();
        
        console.log('Suggestion form initialized');
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    updateCharCount() {
        const currentLength = this.messageTextarea.value.length;
        this.charCounter.textContent = currentLength;
        
        const counterDiv = this.charCounter.parentElement;
        counterDiv.classList.remove('warning', 'danger');
        
        if (currentLength > this.maxChars * 0.8) {
            counterDiv.classList.add('warning');
        }
        
        if (currentLength >= this.maxChars) {
            counterDiv.classList.add('danger');
            this.messageTextarea.value = this.messageTextarea.value.substring(0, this.maxChars);
            this.charCounter.textContent = this.maxChars;
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        // Remove previous error styles
        field.classList.remove('error');
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            field.style.borderColor = '#ff0033';
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                field.style.borderColor = '#ff0033';
                return false;
            }
        }
        
        // Reset border if valid
        field.style.borderColor = '';
        return true;
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.submitCooldown) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.showStatus('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Prevent double submission
        this.submitCooldown = true;
        const originalText = this.submitBtn.textContent;
        
        try {
            // Update UI
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Sending...';
            this.submitBtn.classList.add('loading');
            this.hideStatus();
            
            // Collect form data
            const formData = new FormData(this.form);
            const suggestionData = {
                name: formData.get('name') || 'Anonymous',
                email: formData.get('email') || '',
                type: formData.get('type'),
                message: formData.get('message'),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            // Submit suggestion
            const success = await this.submitSuggestion(suggestionData);
            
            if (success) {
                this.showStatus('Thank you for your suggestion! We appreciate your feedback.', 'success');
                this.submitBtn.textContent = 'Sent Successfully!';
                this.submitBtn.classList.remove('loading');
                this.submitBtn.classList.add('success');
                
                // Reset form
                this.form.reset();
                this.updateCharCount();
                
                // Track success
                this.trackEvent('suggestion_submitted', suggestionData.type);
                
                // Reset button after delay
                setTimeout(() => {
                    this.submitBtn.textContent = originalText;
                    this.submitBtn.classList.remove('success');
                    this.submitBtn.disabled = false;
                }, 3000);
                
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Suggestion submission error:', error);
            this.showStatus('Sorry, there was an error sending your suggestion. Please try again.', 'error');
            
            this.submitBtn.textContent = 'Try Again';
            this.submitBtn.classList.remove('loading');
            this.submitBtn.classList.add('error');
            
            setTimeout(() => {
                this.submitBtn.textContent = originalText;
                this.submitBtn.classList.remove('error');
                this.submitBtn.disabled = false;
            }, 3000);
        }
        
        // Reset cooldown
        setTimeout(() => {
            this.submitCooldown = false;
        }, 2000);
    }
    
    // async submitSuggestion(data) {
    //     // Replace with your actual API endpoint
    //     const apiEndpoint = '/api/suggestions';
        
    //     try {
    //         const response = await fetch(apiEndpoint, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-Requested-With': 'XMLHttpRequest'
    //             },
    //             body: JSON.stringify(data)
    //         });
            
    //         if (!response.ok) {
    //             throw new Error(`HTTP ${response.status}`);
    //         }
            
    //         return true;
            
    //     } catch (error) {
    //         // Fallback: Log to console and simulate success (for demo)
    //         console.log('Suggestion submitted (demo mode):', data);
            
    //         // Simulate API delay
    //         await new Promise(resolve => setTimeout(resolve, 1000));
            
    //         // Simulate success for demo
    //         return true;
    //     }
    // }
    




        // Replace this entire method in SuggestionManager class
    async submitSuggestion(data) {
        try {
            // Use Firebase instead of API endpoint
            const response = await window.firebaseManager.submitSuggestion(data);
            
            if (response.success) {
                return true;
            } else {
                throw new Error(response.error || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Firebase suggestion error:', error);
            return false;
        }
    }    showStatus(message, type) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `status-message ${type}`;
        this.statusDiv.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideStatus();
            }, 5000);
        }
    }
    
    hideStatus() {
        this.statusDiv.style.display = 'none';
    }
    
    trackEvent(eventName, category) {
        console.log('Event tracked:', eventName, category);
        
        // Add your analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'suggestions',
                'event_label': category
            });
        }
    }
}

// Initialize suggestion form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SuggestionManager();
});






window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Optionally show user message
});
