/**
 * HCF Analytics — GA4 Event Tracking
 * Centralised helper for all custom GA4 events on the HCF website.
 */

(function () {
    'use strict';

    /** Safe wrapper: only fires when gtag is available */
    function track(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    /** Navigation click — triggered by data-scroll-target links */
    function trackNavigation(targetSection) {
        track('page_navigation', {
            target_section: targetSection,
            duration_ms: 800,
            timestamp: new Date().toISOString()
        });
    }

    /** FAQ accordion open */
    function trackFAQExpanded(questionIndex, questionText) {
        track('faq_expanded', {
            question_index: questionIndex,
            question_text: questionText
        });
    }

    /** Coach card viewed / clicked */
    function trackCoachProfileView(coachName) {
        track('coach_profile_view', {
            coach_name: coachName
        });
    }

    /** Booking CTA button clicked */
    function trackBookingCTA(coachName, sourceSection) {
        track('click_booking_cta', {
            coach_name: coachName,
            source_section: sourceSection
        });
    }

    /** Google Maps interaction */
    function trackMapInteraction(action) {
        track('map_interaction', {
            action: action  // e.g. 'view_map', 'view_directions'
        });
    }

    /** AI chat query */
    function trackAIQuery(querySource) {
        track('ai_query', {
            query_source: querySource  // e.g. 'faq_section', 'floating_shark'
        });
    }

    // Expose the API globally so inline onclick handlers can call it
    window.HCFAnalytics = {
        trackNavigation,
        trackFAQExpanded,
        trackCoachProfileView,
        trackBookingCTA,
        trackMapInteraction,
        trackAIQuery
    };
})();
