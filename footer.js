// ===========================================================================
// File:   footer.js
// Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
// Purpose: Common footer component for Georgia SKYWARN website
//          Dynamically loads footer with site info, quick links, and connect links
// Based on: Extracted from scripts.js footer injection logic
// Change-log:
//   • 2025-12-30 – Created footer component extracted from scripts.js
// ===========================================================================

// Common footer component for all pages
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (!footerPlaceholder) return;

    const footerHTML = `
        <footer class="site-footer" role="contentinfo">
            <div class="footer-content">
                <div class="footer-grid">
                    <div class="footer-section">
                        <h4>Georgia SKYWARN</h4>
                        <p>Linked repeater system for amateur radio weather spotters coordinating severe weather reporting with NWS Peachtree City across North and Central Georgia.</p>
                        <p>The WX4PTC team serves in direct coordination with the National Weather Service in Peachtree City, Georgia.</p>
                        <p style="margin-top: 1rem;">Maintained by <strong>Jack Parks (KQ4JP)</strong></p>
                    </div>

                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul class="footer-nav">
                            <li><a href="alerts.html">Weather Alerts</a></li>
                            <li><a href="repeaters.html">SKYWARN Repeaters</a></li>
                            <li><a href="wx4ptc.html">WX4PTC Station</a></li>
                            <li><a href="nwsffclinks.html">NWS Resources</a></li>
                            <li><a href="about.html">About This Site</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4>Connect</h4>
                        <ul class="footer-nav">
                            <li><a href="mailto:kq4jp&#64;pm&#46;me">Contact Webmaster</a></li>
                            <li><a href="https://www.weather.gov/ffc/" target="_blank" rel="noopener noreferrer">NWS Atlanta</a></li>
                            <li><a href="https://www.weather.gov/ffc/SKYWARNsched" target="_blank" rel="noopener noreferrer">Spotter Training</a></li>
                            <li><a href="https://www.weather.gov/ffc/strmsubm1" target="_blank" rel="noopener noreferrer">Submit Storm Report</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 Georgia SKYWARN &middot; All Rights Reserved &middot; Serving North and Central Georgia</p>
                </div>
            </div>
        </footer>
    `;

    footerPlaceholder.innerHTML = footerHTML;
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
