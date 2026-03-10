/**
 * HCF Analytics - Custom GA4 Event Tracking System
 * Tracks: CTA clicks, form submissions, AI chat queries, page funnel
 *
 * NOTE: Set your GA4 Measurement ID (G-XXXXXXXXXX) in index.html
 * where the gtag script is initialized.
 */
(function () {
    'use strict';

    // ============================================================
    // Core tracking helper
    // ============================================================
    function trackEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, Object.assign({
                event_category: 'HCF',
                non_interaction: false
            }, params));
        }
        if (window.HCF_DEBUG) {
            console.log('[HCF Analytics]', eventName, params);
        }
    }

    // ============================================================
    // UTM Parameter Capture
    // ============================================================
    function captureUTMParams() {
        const params = new URLSearchParams(window.location.search);
        const utm = {
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || ''
        };

        // Store UTM params in sessionStorage for use across the session
        if (utm.utm_source) {
            sessionStorage.setItem('hcf_utm', JSON.stringify(utm));
        }

        return utm;
    }

    function getStoredUTM() {
        try {
            const stored = sessionStorage.getItem('hcf_utm');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    }

    // ============================================================
    // CTA Click Tracking
    // ============================================================
    function trackCTAClicks() {
        // Track all anchor links to #pricing (booking CTAs)
        document.querySelectorAll('a[href="#pricing"]').forEach(function (el) {
            el.addEventListener('click', function () {
                const ctaText = el.textContent.trim().substring(0, 50);
                const ctaLocation = el.closest('section')
                    ? (el.closest('section').id || 'unknown_section')
                    : 'nav_or_footer';

                trackEvent('cta_click', {
                    event_category: 'Conversion',
                    event_label: ctaText,
                    cta_location: ctaLocation,
                    cta_type: 'booking'
                });
            });
        });

        // Track LINE contact button clicks
        document.querySelectorAll('a[href*="lin.ee"]').forEach(function (el) {
            el.addEventListener('click', function () {
                trackEvent('cta_click', {
                    event_category: 'Conversion',
                    event_label: 'LINE Contact',
                    cta_location: el.closest('section') ? (el.closest('section').id || 'unknown') : 'nav_or_footer',
                    cta_type: 'line_contact'
                });
            });
        });

        // Track social media link clicks
        document.querySelectorAll('a[href*="instagram"], a[href*="facebook"], a[href*="youtube"]').forEach(function (el) {
            el.addEventListener('click', function () {
                const platform = el.href.includes('instagram') ? 'instagram'
                    : el.href.includes('facebook') ? 'facebook'
                    : 'youtube';
                trackEvent('social_click', {
                    event_category: 'Engagement',
                    event_label: platform,
                    platform: platform
                });
            });
        });
    }

    // ============================================================
    // Form Submission Tracking
    // ============================================================
    function trackFormSubmissions() {
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', function () {
                const utm = getStoredUTM();
                trackEvent('form_submit', {
                    event_category: 'Conversion',
                    event_label: 'Lead Form - $400 Trial',
                    form_id: 'lead-form',
                    utm_source: utm.utm_source || '(direct)',
                    utm_medium: utm.utm_medium || '(none)',
                    utm_campaign: utm.utm_campaign || '(none)',
                    value: 400,
                    currency: 'TWD'
                });
            });
        }
    }

    // ============================================================
    // AI Chat Query Tracking
    // ============================================================
    function trackAIQuery(question, source) {
        trackEvent('ai_query', {
            event_category: 'Engagement',
            event_label: question.substring(0, 100),
            query_source: source || 'main_terminal',
            question_length: question.length
        });
    }

    // ============================================================
    // Scroll Depth Tracking (Funnel)
    // ============================================================
    function trackScrollDepth() {
        const checkpoints = {
            news: false,
            classes: false,
            pricing: false,
            team: false,
            'social-proof': false
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (checkpoints.hasOwnProperty(sectionId) && !checkpoints[sectionId]) {
                        checkpoints[sectionId] = true;
                        trackEvent('scroll_depth', {
                            event_category: 'Funnel',
                            event_label: sectionId,
                            section_reached: sectionId,
                            non_interaction: true
                        });
                    }
                }
            });
        }, { threshold: 0.3 });

        Object.keys(checkpoints).forEach(function (id) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    // ============================================================
    // Page View with UTM
    // ============================================================
    function trackPageView() {
        const utm = captureUTMParams();
        if (utm.utm_source && typeof gtag === 'function') {
            gtag('set', 'campaign', {
                source: utm.utm_source,
                medium: utm.utm_medium,
                name: utm.utm_campaign,
                content: utm.utm_content,
                term: utm.utm_term
            });
        }
    }

    // ============================================================
    // Public API - expose to global scope for inline usage
    // ============================================================
    window.HCFAnalytics = {
        trackEvent: trackEvent,
        trackAIQuery: trackAIQuery,
        getUTM: getStoredUTM,
        captureUTM: captureUTMParams
    };

    // ============================================================
    // Initialize on DOM ready
    // ============================================================
    function init() {
        trackPageView();
        trackCTAClicks();
        trackFormSubmissions();
        trackScrollDepth();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
