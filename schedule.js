/* HCF Interactive Schedule
   Adds day-filter tabs + 'today' highlight to any #schedule .sched-table.
   Shared by index.html (homepage) and faq.html. */
// === Interactive Schedule (day filter tabs + today highlight) ===
(function() {
    function initSchedTable(table) {
        if (!table || table.dataset.schedInit) return;
        const headRow = table.tHead && table.tHead.rows[0];
        const body = table.tBodies && table.tBodies[0];
        if (!headRow || !body) return;
        table.dataset.schedInit = '1';

        const dayCount = headRow.cells.length - 1; // exclude TIME column
        if (dayCount < 1) return;

        const labels = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
        const todayIdx = new Date().getDay(); // 0 Sun .. 6 Sat; Mon=1..Fri=5 -> column index

        // Build the day-filter bar
        const bar = document.createElement('div');
        bar.className = 'sched-daybar';
        bar.setAttribute('role', 'tablist');
        bar.setAttribute('aria-label', '課表星期篩選');

        const allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.dataset.day = 'all';
        allBtn.textContent = '全部';
        bar.appendChild(allBtn);

        for (let i = 1; i <= dayCount; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.day = String(i);
            btn.innerHTML = (labels[i - 1] || ('DAY ' + i)) + '<span class="dot" aria-hidden="true"></span>';
            if (i === todayIdx) btn.classList.add('is-today');
            bar.appendChild(btn);
        }

        const wrapper = table.closest('.overflow-x-auto') || table.parentElement;
        wrapper.parentElement.insertBefore(bar, wrapper);

        // Highlight today's column
        if (todayIdx >= 1 && todayIdx <= dayCount) {
            if (headRow.cells[todayIdx]) headRow.cells[todayIdx].classList.add('sched-today');
            Array.from(body.rows).forEach(function(r) {
                if (r.cells[todayIdx]) r.cells[todayIdx].classList.add('sched-today-cell');
            });
        }

        function applyFilter(day) {
            const showAll = (day === 'all');
            Array.from(headRow.cells).forEach(function(c, i) {
                if (i === 0) return;
                c.classList.toggle('sched-hide', !showAll && i !== day);
            });
            Array.from(body.rows).forEach(function(r) {
                Array.from(r.cells).forEach(function(c, i) {
                    if (i === 0) return;
                    c.classList.toggle('sched-hide', !showAll && i !== day);
                });
            });
            Array.from(bar.children).forEach(function(b) {
                const active = b.dataset.day === String(day);
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
        }

        bar.addEventListener('click', function(e) {
            const b = e.target.closest('button');
            if (!b) return;
            const d = b.dataset.day;
            applyFilter(d === 'all' ? 'all' : parseInt(d, 10));
        });

        // Default view: focus on today for small screens, show everything on larger ones
        const isSmall = window.matchMedia('(max-width: 640px)').matches;
        if (isSmall && todayIdx >= 1 && todayIdx <= dayCount) {
            applyFilter(todayIdx);
        } else {
            applyFilter('all');
        }
    }

    function init() {
        document.querySelectorAll('#schedule .sched-table').forEach(initSchedTable);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
