/**
 * HCF Analytics - 自訂事件追蹤系統
 * 整合 Google Analytics 4 自訂事件
 */
(function () {
    'use strict';

    // ── UTM 參數解析 ─────────────────────────────────────────────────────────
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utmSource: params.get('utm_source') || '',
            utmMedium: params.get('utm_medium') || '',
            utmCampaign: params.get('utm_campaign') || '',
            utmContent: params.get('utm_content') || '',
            utmTerm: params.get('utm_term') || ''
        };
    }

    // 解析完成後存入 sessionStorage 供後續頁面使用
    var utm = getUTMParams();
    if (utm.utmSource) {
        try { sessionStorage.setItem('hcf_utm', JSON.stringify(utm)); } catch (e) {
            console.warn('HCF Analytics: UTM storage failed', e);
        }
    } else {
        try {
            var stored = sessionStorage.getItem('hcf_utm');
            if (stored) utm = JSON.parse(stored);
        } catch (e) {
            console.warn('HCF Analytics: UTM parsing failed', e);
        }
    }

    // 掛載到全域供其他腳本存取
    window.HCF_UTM = utm;

    // ── 來源自動偵測 ─────────────────────────────────────────────────────────
    function detectTrafficSource() {
        if (utm.utmSource) return utm.utmSource + '/' + (utm.utmMedium || 'unknown');
        var ref = document.referrer;
        if (!ref) return 'direct';
        if (/google|bing|yahoo|baidu/i.test(ref)) return 'organic_search';
        if (/facebook|fb\.com|instagram|line/i.test(ref)) return 'social';
        return 'referral';
    }

    // ── GA4 事件包裝器 ────────────────────────────────────────────────────────
    function trackEvent(eventName, params) {
        if (typeof window.gtag !== 'function') return;
        var enriched = Object.assign({}, params, {
            traffic_source: detectTrafficSource(),
            utm_source: utm.utmSource || 'direct',
            utm_medium: utm.utmMedium || 'none',
            utm_campaign: utm.utmCampaign || 'none'
        });
        window.gtag('event', eventName, enriched);
    }

    // ── 公開 API ─────────────────────────────────────────────────────────────
    window.HCFAnalytics = {
        // CTA 點擊追蹤
        trackCTAClick: function (ctaLabel, destination) {
            trackEvent('cta_click', {
                cta_label: ctaLabel || 'unknown',
                destination: destination || 'unknown',
                page_section: getCurrentSection()
            });
        },

        // 表單提交追蹤
        trackFormSubmit: function (formId, success) {
            trackEvent('form_submit', {
                form_id: formId || 'lead-form',
                success: success !== false,
                page_section: 'pricing'
            });
        },

        // AI 查詢追蹤
        trackAIQuery: function (question, responseSource) {
            trackEvent('ai_query', {
                question_length: question ? question.length : 0,
                response_source: responseSource || 'unknown'
            });
        },

        // 頁面區塊進入追蹤（轉換漏斗）
        trackSectionView: function (sectionId) {
            trackEvent('section_view', {
                section_id: sectionId
            });
        },

        // 影片互動追蹤
        trackVideoInteraction: function (action) {
            trackEvent('video_interaction', {
                action: action || 'play'
            });
        },

        // 取得 UTM 參數（供表單使用）
        getUTM: function () {
            return utm;
        }
    };

    // ── 自動追蹤：CTA 按鈕點擊 ────────────────────────────────────────────────
    document.addEventListener('click', function (e) {
        var el = e.target.closest('a[href*="#pricing"], button[data-cta]');
        if (!el) return;
        var label = el.textContent.trim().slice(0, 50) || el.getAttribute('data-cta') || 'CTA';
        var dest = el.getAttribute('href') || '';
        window.HCFAnalytics.trackCTAClick(label, dest);
    }, { passive: true });

    // ── 自動追蹤：轉換漏斗區塊可見度 ──────────────────────────────────────────
    var funnelSections = ['home', 'classes', 'pricing', 'team', 'faq'];
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    window.HCFAnalytics.trackSectionView(entry.target.id);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.addEventListener('DOMContentLoaded', function () {
            funnelSections.forEach(function (id) {
                var el = document.getElementById(id);
                if (el) observer.observe(el);
            });
        });
    }

    // ── 工具：取得目前可視區塊 ────────────────────────────────────────────────
    function getCurrentSection() {
        var sections = document.querySelectorAll('section[id]');
        var current = 'unknown';
        sections.forEach(function (sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                current = sec.id;
            }
        });
        return current;
    }
})();
