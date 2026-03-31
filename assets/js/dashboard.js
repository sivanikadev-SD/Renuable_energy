/**
 * SOLARVOLT – dashboard.js
 * Dashboard: sidebar, charts, live data simulation
 */

'use strict';

// ── Sidebar Toggle ────────────────────────────────────────────
const Sidebar = (() => {
    const sidebar = document.querySelector('.dash-sidebar');
    const main = document.querySelector('.dash-main');
    const toggle = document.querySelector('.dash-sidebar-toggle');
    const overlay = document.querySelector('.dash-overlay');

    function init() {
        if (!sidebar) return;

        // Desktop collapse
        if (toggle) {
            toggle.addEventListener('click', () => {
                if (window.innerWidth > 1024) {
                    sidebar.classList.toggle('collapsed');
                } else {
                    sidebar.classList.toggle('mobile-open');
                    overlay && overlay.classList.toggle('visible');
                }
            });
        }

        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('visible');
            });
        }

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('mobile-open');
                overlay && overlay.classList.remove('visible');
            }
        }, { passive: true });
    }

    return { init };
})();

// ── Chart Renderer (pure CSS bars) ───────────────────────────
const Charts = (() => {
    const monthlyData = [65, 72, 88, 95, 102, 118, 125, 119, 108, 96, 78, 69];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function renderBarChart(containerId, data, color = 'primary') {
        const container = document.getElementById(containerId);
        if (!container) return;
        const max = Math.max(...data);
        container.innerHTML = '';
        container.style.cssText = 'display:flex;align-items:flex-end;gap:8px;padding:16px;height:220px;background:var(--clr-bg-alt);border-radius:12px;overflow-x:auto;';
        data.forEach((val, i) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;min-width:0;height:100%;';
            const bar = document.createElement('div');
            const pct = (val / max) * 85;
            bar.style.cssText = `width:100%;border-radius:4px 4px 0 0;height:${pct}%;background:linear-gradient(180deg,var(--clr-${color}),var(--clr-${color}-dark));transition:opacity .2s;`;
            bar.addEventListener('mouseenter', () => bar.style.opacity = '.75');
            bar.addEventListener('mouseleave', () => bar.style.opacity = '1');
            bar.title = `${months[i] || i}: ${val} kWh`;
            const label = document.createElement('span');
            label.style.cssText = 'font-size:.65rem;color:var(--clr-text-muted);white-space:nowrap;';
            label.textContent = months[i] || i;
            wrap.appendChild(bar);
            wrap.appendChild(label);
            container.appendChild(wrap);
        });
    }

    function renderMiniChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const data = [40, 65, 55, 75, 60, 80, 70, 90, 85, 95, 88, 100];
        const max = Math.max(...data);
        container.innerHTML = '';
        container.style.cssText = 'display:flex;align-items:flex-end;gap:3px;height:40px;';
        data.forEach(val => {
            const bar = document.createElement('div');
            bar.style.cssText = `flex:1;height:${(val / max) * 100}%;border-radius:2px;background:var(--clr-primary);opacity:.7;`;
            container.appendChild(bar);
        });
    }

    function init() {
        renderBarChart('productionChart', monthlyData);
        renderBarChart('revenueChart', [1800, 2100, 2600, 2900, 3100, 3500, 3800, 3600, 3200, 2800, 2300, 2000], 'secondary');
        ['miniChart1', 'miniChart2', 'miniChart3', 'miniChart4'].forEach(id => renderMiniChart(id));
    }

    return { init };
})();

// ── Live Energy Data Simulation ───────────────────────────────
const LiveData = (() => {
    let interval;

    function randomBetween(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }

    function update() {
        const els = {
            liveOutput: document.getElementById('liveOutput'),
            liveSaved: document.getElementById('liveSaved'),
            liveTemp: document.getElementById('liveTemp'),
            liveGrid: document.getElementById('liveGrid'),
            liveTime: document.getElementById('liveTime'),
        };
        if (els.liveOutput) els.liveOutput.textContent = randomBetween(3.8, 6.2) + ' kW';
        if (els.liveSaved) els.liveSaved.textContent = '$' + randomBetween(2.1, 4.5);
        if (els.liveTemp) els.liveTemp.textContent = randomBetween(22, 35) + '°C';
        if (els.liveGrid) els.liveGrid.textContent = randomBetween(0.5, 1.8) + ' kW';
        if (els.liveTime) els.liveTime.textContent = new Date().toLocaleTimeString();
    }

    function init() {
        update();
        interval = setInterval(update, 3000);
    }

    return { init };
})();

// ── Progress Bars Animated ────────────────────────────────────
const ProgressBars = (() => {
    function init() {
        const bars = document.querySelectorAll('.progress-fill[data-width]');
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setTimeout(() => { e.target.style.width = e.target.getAttribute('data-width'); }, 200);
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        bars.forEach(bar => { bar.style.width = '0%'; io.observe(bar); });
    }
    return { init };
})();

// ── Date / Time Greeting ──────────────────────────────────────
const Greeting = (() => {
    function init() {
        const el = document.getElementById('dashGreeting');
        if (!el) return;
        const h = new Date().getHours();
        el.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    }
    return { init };
})();

// ── Client-side "Tabs" ────────────────────────────────────────
const Tabs = (() => {
    function init() {
        document.querySelectorAll('.tab-list').forEach(list => {
            list.querySelectorAll('[data-tab]').forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');
                    const parent = tab.closest('.tabs-wrapper') || document;
                    parent.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
                    parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                    tab.classList.add('active');
                    const panel = parent.querySelector(`[data-panel="${target}"]`);
                    if (panel) panel.classList.add('active');
                });
            });
        });
    }
    return { init };
})();

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    Sidebar.init();
    Charts.init();
    LiveData.init();
    ProgressBars.init();
    Greeting.init();
    Tabs.init();

    // Theme toggle (dashboard pages also include main.js, so this is redundant-safe)
    if (typeof Theme !== 'undefined') Theme.init();
});
