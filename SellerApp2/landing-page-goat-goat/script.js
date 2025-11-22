// SellerApp (Goat Goat) - Advanced Interactive Features
// Enhanced with Indian seller focus and multilingual support

// Global state management
const SellerApp = {
    state: {
        currentLanguage: 'en',
        isNavOpen: false,
        isDemoModalOpen: false,
        activeTestimonial: 0,
        activeLangTab: 'en',
        lastScrollY: 0,
        stickyLangVisible: false,
        mobileCTAVisible: false
    },
    
    // Language translations
    translations: {
        hi: {
            // Navigation
            'nav.home': 'होम',
            'nav.features': 'विशेषताएं',
            'nav.testimonials': 'सफलता की कहानियां',
            'nav.pricing': 'मूल्य निर्धारण',
            'nav.download': 'डाउनलोड',
            'nav.language': 'हिंदी',
            'nav.download_app': 'ऐप डाउनलोड करें',
            
            // Hero Section
            'hero.badge': 'भारत का #1 हाइपर-लोकल सेलर ऐप',
            'hero.title_new': 'गोट गोट सेलर ऐप: अपनी भाषा में ऑर्डर स्वीकार करें, फोन पर स्टॉक मैनेज करें, बकरे के पहुंचने से पहले डिलीवर करें।',
            'hero.title_1': 'अपनी',
            'hero.title_highlight': 'किराना दुकान को',
            'hero.title_2': 'स्मार्ट बिजनेस में बदलें',
            'hero.subtitle': 'सेलर्स के लिए, सेलर्स द्वारा, आपकी भाषा में',
            'hero.description': 'व्हाट्सऐप की अराजकता से व्यवस्थित ऑर्डर तक। मैन्युअल स्टॉक से AI अलर्ट तक। कैलकुलेटर बिल से GST-रेडी रिपोर्ट तक। सब कुछ आपकी भाषा में, एक ऐप में।',
            'hero.stat_sellers': 'सक्रिय सेलर्स',
            'hero.stat_rating': 'ऐप रेटिंग',
            'hero.stat_gmv': '2024 में GMV',
            'hero.stat_languages': 'भाषाएं',
            'hero.download_free': 'मुफ्त डाउनलोड करें',
            'hero.watch_demo': 'डेमो देखें',
            'hero.trust_secure': '100% सुरक्षित',
            'hero.trust_offline': 'ऑफलाइन काम करता है',
            'hero.trust_multilingual': '22+ भाषाएं',
            
            // Before/After Section
            'before_after.title': 'अराजकता से सफलता तक',
            'before_after.description': 'देखें कि SellerApp कैसे पारंपरिक भारतीय व्यवसायों को बदल देता है',
            'before_after.before': 'SellerApp से पहले',
            'before_after.after': 'SellerApp के बाद',
            
            // Features Section
            'features.badge': 'विशेषताएं',
            'features.title': 'तकनीक जो बस काम करती है',
            'features.description': 'भारतीय सेलर्स के लिए बनाया गया, ₹7k फ़ोन पर टेस्ट किया गया, 2G नेटवर्क पर काम करता है',
            'features.onboarding_title': '30-सेकंड ऑन-बोर्डिंग',
            'features.onboarding_desc': 'फोन → OTP → दुकान का नाम → लोकेशन पिन → पहला प्रोडक्ट लाइव। कोई प्रिंटर नहीं। कोई कागजी कार्रवाई नहीं।',
            'features.ai_title': 'AI प्रोडक्ट क्रिएटर',
            'features.ai_desc': 'कैमरा → AI नाम/श्रेणी सुझाता है → मूल्य → लाइव। Excel के माध्यम से बल्क-अपलोड बाद में।',
            'features.voice_title': 'वॉइस ऑर्डर नोट्स',
            'features.voice_desc': 'माइक लंबा दबाएं: "2 किलो आम पैक करें, मजबूत वाले" - डिलीवरी पार्टनर को भी सुनाई देता है।',
            'features.control_title': 'सेलर-फर्स्ट कंट्रोल',
            'features.control_desc': 'कस्टमर ऑर्डर करता है → सेलर "Accept" दबाता है → डिलीवरी असाइन। आप ही मालिक हैं।',
            'features.lite_title': 'अल्ट्रा-लाइट और ऑफलाइन',
            'features.lite_desc': '28MB APK। ऑफलाइन काम करता है। डेटा वापस आने पर सिंक। बैटरी एफिशिएंट।',
            'features.multilingual_title': 'सच्चा बहुभाषी',
            'features.multilingual_desc': '22 आधिकारिक भारतीय भाषाएं। वॉइस नोट्स, डेट फॉर्मेट, सब कुछ स्थानीयकृत।',
            
            // Languages Section
            'languages.title': 'सचमुच आपकी भाषा बोलता है',
            'languages.description': 'पूरा स्थानीयकरण जो वास्तव में स्थानीयकृत करता है',
            
            // Testimonials Section
            'testimonials.badge': 'सफलता की कहानियां',
            'testimonials.title': 'असली सेलर्स, असली सफलता',
            'testimonials.description': 'उन सेलर्स से सुनें जिन्होंने SellerApp के साथ अपना व्यवसाय बदला',
            
            // Pricing Section
            'pricing.badge': 'मूल्य निर्धारण',
            'pricing.title': 'मुफ्त शुरू करें, स्मार्ट स्केल करें',
            'pricing.description': 'कोई छुपी लागत नहीं। केवल तभी भुगतान करें जब आप अधिक कमाते हैं।',
            'pricing.free_title': 'शुरुआत',
            'pricing.free_desc': 'नए सेलर्स के लिए परफेक्ट',
            'pricing.pro_title': 'व्यापारी',
            'pricing.pro_desc': 'बढ़ते व्यवसायों के लिए',
            'pricing.enterprise_title': 'व्यापार',
            'pricing.enterprise_desc': 'बड़े व्यवसायों के लिए',
            'pricing.popular': 'सबसे लोकप्रिय',
            'pricing.get_started': 'शुरू करें',
            'pricing.start_trial': '30-दिन ट्रायल शुरू करें',
            'pricing.contact_sales': 'सेल्स से संपर्क करें',
            
            // Download Section
            'download.badge': 'अभी डाउनलोड करें',
            'download.title': 'अपना व्यवसाय बदलने के लिए तैयार हैं?',
            'download.description': '50,000+ सेलर्स में शामिल हों जिन्होंने SellerApp चुना। अभी डाउनलोड करें और 30 सेकंड में शुरू करें।',
            'download.google_subtitle': 'इसे प्राप्त करें',
            'download.apple_subtitle': 'डाउनलोड करें',
            'download.feature_1': 'किसी भी Android 6+ फोन पर काम करता है',
            'download.feature_2': '28MB डाउनलोड - डेटा फ्रेंडली',
            'download.feature_3': 'ऑफलाइन काम करता है - बाद में सिंक',
            'download.newsletter_title': 'अपडेट और टिप्स पाएं',
            'download.newsletter_desc': 'अपना व्यवसाय बढ़ाने के लिए साप्ताहिक टिप्स',
            'download.subscribe': 'सब्स्क्राइब करें',
            
            // Footer
            'footer.description': 'भारत का #1 हाइपर-लोकल सेलर ऐप। सेलर्स के लिए, सेलर्स द्वारा, आपकी भाषा में।',
            'footer.product': 'उत्पाद',
            'footer.features': 'विशेषताएं',
            'footer.pricing': 'मूल्य निर्धारण',
            'footer.integrations': 'एकीकरण',
            'footer.api': 'API डॉक्स',
            'footer.updates': 'अपडेट',
            'footer.support': 'सहायता',
            'footer.help': 'हेल्प सेंटर',
            'footer.contact': 'संपर्क करें',
            'footer.phone': '+91-63629-24334',
            'footer.tutorials': 'वीडियो ट्यूटोरियल',
            'footer.community': 'कम्युनिटी',
            'footer.company': 'कंपनी',
            'footer.about': 'हमारे बारे में',
            'footer.careers': 'करियर',
            'footer.blog': 'ब्लॉग',
            'footer.press': 'प्रेस किट',
            'footer.partner': 'पार्टनर प्रोग्राम',
            'footer.resources': 'संसाधन',
            'footer.case_studies': 'सफलता की कहानियां',
            'footer.webinars': 'वेबिनार',
            'footer.ebooks': 'बिजनेस गाइड',
            'footer.calculator': 'ROI कैलकुलेटर',
            'footer.status': 'सिस्टम स्टेटस',
            'footer.rights': 'सभी अधिकार सुरक्षित।',
            'footer.made_in_india': 'प्यार से भारत में बनाया गया',
            'footer.privacy': 'प्राइवेसी पॉलिसी',
            'footer.terms': 'सेवा की शर्तें',
            'footer.refund': 'रिफंड पॉलिसी',
            'footer.security': 'सुरक्षा',
            
            // Sticky CTA
            'sticky_cta.text': '30 सेकंड में बेचना शुरू करें'
        },
        
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.features': 'Features',
            'nav.testimonials': 'Success Stories',
            'nav.pricing': 'Pricing',
            'nav.download': 'Download',
            'nav.language': 'English',
            'nav.download_app': 'Download App',
            
            // Hero Section
            'hero.badge': 'India\'s #1 Hyper-Local Seller App',
            'hero.title_new': 'Goat Goat Seller App: Accept orders in your language, manage stock on your phone, deliver before the goat reaches the customer.',
            'hero.title_1': 'Transform Your',
            'hero.title_highlight': 'Kirana Store',
            'hero.title_2': 'Into a Smart Business',
            'hero.subtitle': 'Built by sellers, for sellers, in the language you speak',
            'hero.description': 'From WhatsApp chaos to organized orders. From manual stock to AI alerts. From calculator bills to GST-ready reports. All in your language, all in one app.',
            'hero.stat_sellers': 'Active Sellers',
            'hero.stat_rating': 'App Rating',
            'hero.stat_gmv': 'GMV in 2024',
            'hero.stat_languages': 'Languages',
            'hero.download_free': 'Download Free',
            'hero.watch_demo': 'Watch Demo',
            'hero.trust_secure': '100% Secure',
            'hero.trust_offline': 'Works Offline',
            'hero.trust_multilingual': '22+ Languages',
            
            // Before/After Section
            'before_after.title': 'From Chaos to Success',
            'before_after.description': 'See how SellerApp transforms traditional Indian businesses',
            'before_after.before': 'Before SellerApp',
            'before_after.after': 'After SellerApp',
            
            // Features Section
            'features.badge': 'Features',
            'features.title': 'Tech That Simply Works',
            'features.description': 'Built for Indian sellers, tested on ₹7k phones, works on 2G networks',
            'features.onboarding_title': '30-Second On-Boarding',
            'features.onboarding_desc': 'Phone → OTP → Store name → Location pin → First product live. No printers. No paperwork.',
            'features.ai_title': 'AI Product Creator',
            'features.ai_desc': 'Camera → AI suggests name/category → Price → Live. Bulk-upload via Excel later.',
            'features.voice_title': 'Voice Order Notes',
            'features.voice_desc': 'Long-press mic: "Pack 2 kg mangoes, firm ones" – delivery partner hears it too.',
            'features.control_title': 'Seller-First Control',
            'features.control_desc': 'Customer places → Seller taps "Accept" → Delivery assigned. You are the boss.',
            'features.lite_title': 'Ultra-Lite & Offline',
            'features.lite_desc': '28MB APK. Works offline. Syncs when data returns. Battery efficient.',
            'features.multilingual_title': 'True Multilingual',
            'features.multilingual_desc': '22 official Indian languages. Voice notes, date formats, everything localized.',
            
            // Languages Section
            'languages.title': 'Speaks Your Language, Literally',
            'languages.description': 'Complete localization that actually localizes',
            
            // Testimonials Section
            'testimonials.badge': 'Success Stories',
            'testimonials.title': 'Real Sellers, Real Success',
            'testimonials.description': 'Hear from sellers who transformed their business with SellerApp',
            
            // Pricing Section
            'pricing.badge': 'Pricing',
            'pricing.title': 'Start Free, Scale Smart',
            'pricing.description': 'No hidden charges. Pay only when you earn more.',
            'pricing.free_title': 'Starter',
            'pricing.free_desc': 'Perfect for new sellers',
            'pricing.pro_title': 'Business',
            'pricing.pro_desc': 'For growing businesses',
            'pricing.enterprise_title': 'Enterprise',
            'pricing.enterprise_desc': 'For large businesses',
            'pricing.popular': 'Most Popular',
            'pricing.get_started': 'Get Started',
            'pricing.start_trial': 'Start 30-Day Trial',
            'pricing.contact_sales': 'Contact Sales',
            
            // Download Section
            'download.badge': 'Download Now',
            'download.title': 'Ready to Transform Your Business?',
            'download.description': 'Join 50,000+ sellers who chose SellerApp. Download now and get started in 30 seconds.',
            'download.google_subtitle': 'Get it on',
            'download.apple_subtitle': 'Download on the',
            'download.feature_1': 'Works on any Android 6+ phone',
            'download.feature_2': '28MB download - data friendly',
            'download.feature_3': 'Works offline - syncs later',
            'download.newsletter_title': 'Get Updates & Tips',
            'download.newsletter_desc': 'Weekly tips to grow your business',
            'download.subscribe': 'Subscribe',
            
            // Footer
            'footer.description': 'India\'s #1 hyper-local seller app. Built by sellers, for sellers, in the language you speak.',
            'footer.product': 'Product',
            'footer.features': 'Features',
            'footer.pricing': 'Pricing',
            'footer.integrations': 'Integrations',
            'footer.api': 'API Docs',
            'footer.updates': 'Updates',
            'footer.support': 'Support',
            'footer.help': 'Help Center',
            'footer.contact': 'Contact Us',
            'footer.phone': '+91-63629-24334',
            'footer.tutorials': 'Video Tutorials',
            'footer.community': 'Community',
            'footer.company': 'Company',
            'footer.about': 'About Us',
            'footer.careers': 'Careers',
            'footer.blog': 'Blog',
            'footer.press': 'Press Kit',
            'footer.partner': 'Partner Program',
            'footer.resources': 'Resources',
            'footer.case_studies': 'Success Stories',
            'footer.webinars': 'Webinars',
            'footer.ebooks': 'Business Guides',
            'footer.calculator': 'ROI Calculator',
            'footer.status': 'System Status',
            'footer.rights': 'All rights reserved.',
            'footer.made_in_india': 'Made in India with love',
            'footer.privacy': 'Privacy Policy',
            'footer.refund': 'Refund Policy',
            'footer.terms': 'Terms of Service',
            'footer.security': 'Security',
            
            // Sticky CTA
            'sticky_cta.text': 'Start Selling in 30 Seconds',
            
            // Problems Section
            'problems.title': 'From Problems to Solutions',
            'problems.description': 'See how SellerApp solves your daily business challenges',
            'problems.orders_title': 'Order Management',
            'problems.orders_desc': 'One-tap order approval. Real-time updates. No missed orders.',
            'problems.tracking_title': 'Live Tracking',
            'problems.tracking_desc': 'Share location with customers. Reduce support calls.',
            'problems.billing_title': 'Smart Billing',
            'problems.billing_desc': 'Auto-generate GST bills. Digital receipts. Easy accounting.',
            
            // Testimonials
            'testimonial.ramesh.text': 'Before SellerApp, I used to get 20 phone calls daily. Now just one notification and work is done. My store sales increased by 40%.',
            'testimonial.priyanka.text': 'Everything is in my language. Bills are generated in Hindi too. Customers are happy, I am happy. GST filing became so easy.',
            'testimonial.suresh.text': 'The app alerts me before stock runs out. Never had to stop selling. Customer satisfaction increased significantly.'
        },
    },
    
    // Language demo data
    languageDemos: {
        hi: {
            date: 'दिनांक ३०/०६/२५',
            time: '२:३० PM',
            greeting: 'नमस्ते, रमेश जी',
            orderText: 'नया ऑर्डर - २ किलो आलू',
            acceptBtn: 'स्वीकार करें',
            features: [
                '100% स्क्रीन अनुवाद',
                'वॉइस नोट्स',
                'स्थानीय तारीख प्रारूप',
                'स्थानीय मुद्रा'
            ]
        },
        kn: {
            date: 'ತಾರೀಖು ೩೦/೦೬/೨೫',
            time: '೨:೩೦ PM',
            greeting: 'ನಮಸ್ಕಾರ, ರಮೇಶ್ ಗಾರು',
            orderText: 'ಹೊಸ ಆರ್ಡರ್ - ೨ ಕೆ.ಜಿ ಆಲೂಗಡ್ಡೆ',
            acceptBtn: 'ಸ್ವೀಕರಿಸಿ',
            features: [
                '100% ಪರದೆ ಅನುವಾದ',
                'ಧ್ವನಿ ಟಿಪ್ಪಣಿಗಳು',
                'ಸ್ಥಳೀಯ ದಿನಾಂಕ ಸ್ವರೂಪ',
                'ಸ್ಥಳೀಯ ಕರೆನ್ಸಿ'
            ]
        },
        ta: {
            date: 'தேதி ௩௦/௦௬/௨௫',
            time: '௨:௩௦ PM',
            greeting: 'வணக்கம், ரமேஷ் சார்',
            orderText: 'புதிய ஆர்டர் - ௨ கிலோ உருளைக்கிழங்கு',
            acceptBtn: 'ஏற்றுக்கொள்',
            features: [
                '100% திரை மொழிபெயர்ப்பு',
                'குரல் குறிப்புகள்',
                'உள்ளூர் தேதி வடிவம்',
                'உள்ளூர் நாணயம்'
            ]
        },
        te: {
            date: 'తేదీ ౩౦/౦౬/౨౫',
            time: '౨:౩౦ PM',
            greeting: 'నమస్కారం, రమేష్ గారు',
            orderText: 'కొత్త ఆర్డర్ - ౨ కిలో బంగాళాదుంపలు',
            acceptBtn: 'అంగీకరించు',
            features: [
                '100% స్క్రీన్ అనువాదం',
                'వాయిస్ నోట్స్',
                'స్థానిక తేదీ ఫార్మాట్',
                'స్థానిక కరెన్సీ'
            ]
        },
        mr: {
            date: 'दिनांक ३०/०६/२५',
            time: '२:३० PM',
            greeting: 'नमस्कार, रमेश जी',
            orderText: 'नवीन ऑर्डर - २ किलो बटाटे',
            acceptBtn: 'स्वीकार करा',
            features: [
                '100% स्क्रीन भाषांतर',
                'व्हॉइस नोट्स',
                'स्थानिक तारीख फॉर्मेट',
                'स्थानिक चलन'
            ]
        },
        gu: {
            date: 'તારીખ ૩૦/૦૬/૨૫',
            time: '૨:૩૦ PM',
            greeting: 'નમસ્તે, રમેશ ભાઈ',
            orderText: 'નવો ઓર્ડર - ૨ કિલો બટાકા',
            acceptBtn: 'સ્વીકારો',
            features: [
                '100% સ્ક્રીન અનુવાદ',
                'વૉઇસ નોટ્સ',
                'સ્થાનિક તારીખ ફોર્મેટ',
                'સ્થાનિક ચલણ'
            ]
        }
    }
};

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initNavigation();
    initHeroAnimations();
    initLanguageSelector();
    initLanguageTabs();
    initTestimonialCarousel();
    initCounterAnimations();
    initVideoModal();
    initNewsletterSignup();
    initScrollEffects();
    initStickyLanguageBar();
    initStickyMobileCTA();
    initPerformanceOptimizations();
    initAccessibilityFeatures();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 120,
            disable: window.innerWidth < 768
        });
    }
    
    // Load saved language preference
    loadLanguagePreference();
    
    console.log('✅ SellerApp (Goat Goat) initialized successfully!');
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = hamburger.classList.contains('active');
            
            if (isOpen) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });
    }

    function openNavMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        SellerApp.state.isNavOpen = true;
        
        // Animate menu items
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    function closeNavMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        SellerApp.state.isNavOpen = false;
        
        // Reset animations
        navLinks.forEach(link => {
            link.style.transition = '';
            link.style.opacity = '';
            link.style.transform = '';
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (SellerApp.state.isNavOpen) {
                closeNavMenu();
            }
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                smoothScrollToSection(targetId);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (SellerApp.state.isNavOpen && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeNavMenu();
        }
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (desktop only)
        if (window.innerWidth > 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    // ESC key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && SellerApp.state.isNavOpen) {
            closeNavMenu();
        }
    });
}

// Hero section animations
function initHeroAnimations() {
    // Parallax effect for shapes
    const shapes = document.querySelectorAll('.hero-shapes .shape, .download-shapes .shape');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * parallaxSpeed;
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
        });
    });

    // Typewriter effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.dataset.typewriter !== 'false') {
        // Add typewriter effect on load
        setTimeout(() => {
            heroTitle.classList.add('typewriter-complete');
        }, 1000);
    }

    // Floating elements animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.sin(Date.now() * 0.001 + index) * 5;
            const randomY = Math.cos(Date.now() * 0.0015 + index) * 3;
            card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 2000 + (index * 500));
    });
}

// Language selector functionality
function initLanguageSelector() {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleLanguageDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('active');
            }
        });
    }

    // Language option selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLang = this.dataset.lang;
            changeLanguage(selectedLang);
            languageDropdown.classList.remove('active');
        });
    });

    function toggleLanguageDropdown() {
        languageDropdown.classList.toggle('active');
    }
}

// Language switching functionality
function changeLanguage(langCode) {
    if (!SellerApp.translations[langCode]) {
        console.warn(`Language ${langCode} not supported`);
        return;
    }

    SellerApp.state.currentLanguage = langCode;
    
    // Update all text elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        const translation = SellerApp.translations[langCode][key];
        
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update language selector
    const languageBtn = document.querySelector('.language-btn span');
    const currentLangOption = document.querySelector(`[data-lang="${langCode}"]`);
    
    if (languageBtn && currentLangOption) {
        languageBtn.textContent = currentLangOption.querySelector('.lang-native').textContent;
    }

    // Update active language option
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === langCode);
    });

    // Update page language attribute
    document.documentElement.lang = langCode === 'hi' ? 'hi' : 'en';

    // Apply font family for Hindi
    if (langCode === 'hi') {
        document.body.classList.add('hindi-text');
    } else {
        document.body.classList.remove('hindi-text');
    }

    // Save language preference
    localStorage.setItem('sellerapp_language', langCode);

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: langCode }
    }));

    console.log(`🌐 Language changed to: ${langCode}`);
}

// Load saved language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('sellerapp_language');
    if (savedLang && SellerApp.translations[savedLang]) {
        changeLanguage(savedLang);
    }
}

// Language demonstration tabs
function initLanguageTabs() {
    const langTabs = document.querySelectorAll('.lang-tab');
    const demoDate = document.getElementById('demo-date');
    const demoGreeting = document.getElementById('demo-greeting');
    const demoOrderText = document.getElementById('demo-order-text');
    const demoAcceptBtn = document.getElementById('demo-accept-btn');
    const features = document.querySelectorAll('#feature-1, #feature-2, #feature-3, #feature-4');

    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.dataset.lang;
            updateLanguageDemo(lang);
            
            // Update active tab
            langTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function updateLanguageDemo(lang) {
        const demoData = SellerApp.languageDemos[lang];
        if (!demoData) return;

        // Animate text changes
        const elements = [
            { el: demoDate, text: demoData.date },
            { el: demoGreeting, text: demoData.greeting },
            { el: demoOrderText, text: demoData.orderText },
            { el: demoAcceptBtn, text: demoData.acceptBtn }
        ];

        elements.forEach(({ el, text }, index) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.textContent = text;
                        el.style.opacity = '1';
                    }, 150);
                }, index * 100);
            }
        });

        // Update feature list
        features.forEach((feature, index) => {
            if (feature && demoData.features[index]) {
                setTimeout(() => {
                    feature.style.opacity = '0';
                    setTimeout(() => {
                        feature.textContent = demoData.features[index];
                        feature.style.opacity = '1';
                    }, 150);
                }, (index + 4) * 100);
            }
        });
    }
}

// Testimonial carousel with Swiper
function initTestimonialCarousel() {
    if (typeof Swiper !== 'undefined') {
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                }
            },
            on: {
                slideChange: function() {
                    // Track testimonial views
                    trackEvent('testimonial_view', {
                        slide: this.activeIndex,
                        language: SellerApp.state.currentLanguage
                    });
                }
            }
        });

        // Pause autoplay on hover
        const swiperContainer = document.querySelector('.testimonials-swiper');
        if (swiperContainer) {
            swiperContainer.addEventListener('mouseenter', () => {
                testimonialsSwiper.autoplay.stop();
            });
            
            swiperContainer.addEventListener('mouseleave', () => {
                testimonialsSwiper.autoplay.start();
            });
        }
    }
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        const increment = target > 0 ? Math.ceil(target / (duration / 16)) : 0;
        
        const originalText = element.textContent;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format based on original text pattern
            let formattedText = current.toString();
            
            if (originalText.includes('K+')) {
                formattedText = Math.floor(current / 1000) + 'K+';
            } else if (originalText.includes('★')) {
                formattedText = (current / 10).toFixed(1) + '★';
            } else if (originalText.includes('Cr')) {
                formattedText = '₹' + Math.floor(current) + 'Cr';
            } else if (originalText.includes('₹')) {
                formattedText = '₹' + current.toLocaleString();
            }
            
            element.textContent = formattedText;
        }, 16);
    }
}

// Video modal functionality
function initVideoModal() {
    const demoBtn = document.getElementById('demo-btn');
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const demoVideo = document.getElementById('demo-video');

    if (demoBtn && videoModal) {
        demoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openVideoModal();
        });

        [modalClose, modalOverlay].forEach(element => {
            if (element) {
                element.addEventListener('click', closeVideoModal);
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && SellerApp.state.isDemoModalOpen) {
                closeVideoModal();
            }
        });
    }

    function openVideoModal() {
        SellerApp.state.isDemoModalOpen = true;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load video URL
        const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
        demoVideo.src = videoUrl;
        
        // Track video open
        trackEvent('demo_video_open', {
            language: SellerApp.state.currentLanguage
        });
    }

    function closeVideoModal() {
        SellerApp.state.isDemoModalOpen = false;
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop video
        demoVideo.src = '';
    }
}

// Newsletter signup functionality
function initNewsletterSignup() {
    const newsletterForm = document.querySelector('.signup-form');
    const emailInput = document.getElementById('newsletter-email');
    const phoneInput = document.getElementById('newsletter-phone');
    const submitBtn = document.getElementById('newsletter-submit');

    if (submitBtn && emailInput) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleNewsletterSignup();
        });

        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleNewsletterSignup();
            }
        });

        // Real-time email validation
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const isValid = validateEmail(email);
            
            this.classList.toggle('invalid', email.length > 0 && !isValid);
            this.classList.toggle('valid', isValid);
        });

        // Phone number formatting (basic)
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                this.value = value;
            });
        }
    }

    function handleNewsletterSignup() {
        const email = emailInput.value.trim();
        const phone = phoneInput ? phoneInput.value.trim() : '';

        if (!email) {
            showNotification('कृपया अपना ईमेल पता दर्ज करें', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showNotification('कृपया एक मान्य ईमेल पता दर्ज करें', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> सब्स्क्राइब कर रहे हैं...';

        // Simulate API call
        setTimeout(() => {
            // Store data
            const signupData = {
                email,
                phone,
                language: SellerApp.state.currentLanguage,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('newsletter_signup', JSON.stringify(signupData));
            
            // Success feedback
            showNotification('धन्यवाद! हम ऐप लॉन्च होने पर आपको सूचित करेंगे।', 'success');
            
            // Reset form
            emailInput.value = '';
            if (phoneInput) phoneInput.value = '';
            emailInput.classList.remove('valid', 'invalid');
            
            // Track signup
            trackEvent('newsletter_signup', {
                language: SellerApp.state.currentLanguage,
                hasPhone: !!phone
            });
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
        }, 1500);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Scroll effects and interactions
function initScrollEffects() {
    // Smooth scroll to section
    window.smoothScrollToSection = function(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Progress bar (optional)
    createScrollProgressBar();

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
}

function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b35, #f59e0b);
        z-index: 9999;
        transition: width 0.25s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
}

// Sticky Language Bar functionality
function initStickyLanguageBar() {
    const stickyLangBar = document.getElementById('sticky-language-bar');
    const langOptions = stickyLangBar.querySelectorAll('.lang-option');
    
    // Show/hide based on scroll position
    const toggleStickyLang = Utils.throttle(() => {
        const currentScrollY = window.scrollY;
        const heroSection = document.getElementById('home');
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;
        
        if (currentScrollY > heroHeight * 0.3 && !SellerApp.state.stickyLangVisible) {
            stickyLangBar.classList.add('show');
            SellerApp.state.stickyLangVisible = true;
        } else if (currentScrollY <= heroHeight * 0.3 && SellerApp.state.stickyLangVisible) {
            stickyLangBar.classList.remove('show');
            SellerApp.state.stickyLangVisible = false;
        }
    }, 100);
    
    window.addEventListener('scroll', toggleStickyLang);
    
    // Language switching
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            
            // Update active state
            langOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Switch language
            switchLanguage(lang);
            
            // Track event
            trackEvent('sticky_language_switch', { language: lang, location: 'sticky_bar' });
        });
    });
}

// Sticky Mobile CTA functionality
function initStickyMobileCTA() {
    const mobileCTA = document.getElementById('sticky-mobile-cta');
    
    if (!mobileCTA || !Utils.isMobile()) return;
    
    let lastScrollY = window.scrollY;
    
    const toggleMobileCTA = Utils.throttle(() => {
        const currentScrollY = window.scrollY;
        const heroSection = document.getElementById('home');
        const downloadSection = document.getElementById('download');
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;
        const downloadTop = downloadSection ? downloadSection.offsetTop - window.innerHeight : document.body.scrollHeight;
        
        // Show after hero section
        const shouldShow = currentScrollY > heroHeight * 0.5 && currentScrollY < downloadTop;
        
        // Hide when scrolling up fast, show when scrolling down or slow
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const scrollSpeed = Math.abs(currentScrollY - lastScrollY);
        
        if (shouldShow && (scrollDirection === 'down' || scrollSpeed < 20)) {
            if (!SellerApp.state.mobileCTAVisible) {
                mobileCTA.classList.add('show');
                mobileCTA.classList.remove('hide');
                SellerApp.state.mobileCTAVisible = true;
            }
        } else if (shouldShow && scrollDirection === 'up' && scrollSpeed > 20) {
            if (SellerApp.state.mobileCTAVisible) {
                mobileCTA.classList.add('hide');
                mobileCTA.classList.remove('show');
                SellerApp.state.mobileCTAVisible = false;
            }
        } else if (!shouldShow && SellerApp.state.mobileCTAVisible) {
            mobileCTA.classList.remove('show');
            mobileCTA.classList.add('hide');
            SellerApp.state.mobileCTAVisible = false;
        }
        
        lastScrollY = currentScrollY;
    }, 50);
    
    window.addEventListener('scroll', toggleMobileCTA);
    
    // Track clicks
    mobileCTA.addEventListener('click', () => {
        trackEvent('sticky_mobile_cta_click', { 
            scroll_position: window.scrollY,
            viewport_height: window.innerHeight
        });
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Preload critical assets
    const criticalAssets = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];

    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = asset;
        document.head.appendChild(link);
    });

    // Optimize scroll listeners
    let scrollTicking = false;
    const scrollListeners = [];

    function optimizedScroll() {
        scrollListeners.forEach(callback => callback());
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(optimizedScroll);
            scrollTicking = true;
        }
    });
}

// Accessibility features
function initAccessibilityFeatures() {
    // Focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: fixed;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modals with ESC
        if (e.key === 'Escape') {
            if (SellerApp.state.isNavOpen) {
                document.getElementById('nav-hamburger').click();
            }
            if (SellerApp.state.isDemoModalOpen) {
                document.getElementById('modal-close').click();
            }
        }

        // Navigation with arrow keys in carousels
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedElement = document.activeElement;
            if (focusedElement.closest('.testimonials-swiper')) {
                e.preventDefault();
                const button = e.key === 'ArrowLeft' ? '.swiper-button-prev' : '.swiper-button-next';
                document.querySelector(button)?.click();
            }
        }
    });

    // ARIA labels for dynamic content
    updateAriaLabels();
}

function updateAriaLabels() {
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const text = element.textContent || element.getAttribute('title') || element.getAttribute('alt');
            if (text) {
                element.setAttribute('aria-label', text.trim());
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Noto Sans Devanagari', sans-serif;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto; opacity: 0.8; padding: 0.25rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(45deg, #10b981, #059669)',
        error: 'linear-gradient(45deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(45deg, #f59e0b, #d97706)',
        info: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'
    };
    return colors[type] || colors.info;
}

// Analytics and tracking
function trackEvent(eventName, properties = {}) {
    // Enhanced tracking with more context
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        language: SellerApp.state.currentLanguage,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        ...properties
    };

    // Store locally (in production, send to analytics service)
    const events = JSON.parse(localStorage.getItem('sellerapp_events') || '[]');
    events.push(eventData);
    
    // Keep only last 100 events
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('sellerapp_events', JSON.stringify(events));
    
    console.log('📊 Event tracked:', eventData);

    // In production, send to analytics service
    // Example: gtag('event', eventName, properties);
    // Example: analytics.track(eventName, properties);
}

// Error handling and logging
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason?.toString() || 'Unknown'
    });
});

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Device detection
    isMobile: function() {
        return window.innerWidth <= 768;
    },

    // Format numbers for display
    formatNumber: function(num) {
        if (num >= 10000000) return Math.round(num / 10000000) + 'Cr';
        if (num >= 100000) return Math.round(num / 100000) + 'L';
        if (num >= 1000) return Math.round(num / 1000) + 'K';
        return num.toString();
    }
};

// Export for testing and external access
if (typeof window !== 'undefined') {
    window.SellerApp = SellerApp;
    window.SellerAppUtils = Utils;
}

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(registrationError => console.log('SW registration failed:', registrationError));
    });
}

console.log('🚀 SellerApp (Goat Goat) script loaded successfully!');