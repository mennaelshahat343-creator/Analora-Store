let spendingChartInstance = null;
let categoryChartInstance = null;
let behaviorChartInstance = null;
let analyticsAggregates = null;

function initAnalyticsPage() {
    analyticsAggregates = aggregateConsumerAnalytics();
    updateAnalyticsKPIs(analyticsAggregates);
    updateAnalyticsInsights(analyticsAggregates);
    updateBehaviorTable(analyticsAggregates);
    initSpendingChart('6months');
    initCategoryChart();
    initBehaviorChart();
}

function updateAnalyticsKPIs(agg) {
    if (!agg || agg.empty) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('kpi-orders', formatNumber(agg.purchases));
    set('kpi-spent', formatNumber(agg.purchasePageValue));
    set('kpi-wishlist', formatNumber(agg.returning));
    set('kpi-discount', formatPercent(agg.conversionRate));
}

function updateAnalyticsInsights(agg) {
    const cards = document.querySelectorAll('.insight-card .insight-text');
    if (!cards.length || !agg || agg.empty) return;

    const topVisitor = Object.entries(agg.byVisitor).sort((a, b) => b[1] - a[1])[0];
    const topPage = Object.entries(agg.pageTypes)
        .map(([k, v]) => ({ k, rate: v.visits ? (v.purchases / v.visits) * 100 : 0 }))
        .sort((a, b) => b.rate - a.rate)[0];

    cards[0].textContent = topVisitor
        ? `أغلب الجلسات من نوع «${VISITOR_LABELS_AR[topVisitor[0]] || topVisitor[0]}» بنسبة ${formatPercent((topVisitor[1] / agg.totalSessions) * 100)}.`
        : cards[0].textContent;
    cards[1].textContent = `معدل التحويل في عطلة نهاية الأسبوع ${formatPercent(agg.weekendConversion)} مقارنة بإجمالي ${formatPercent(agg.conversionRate)}.`;
    cards[2].textContent = topPage
        ? `أعلى تحويل في صفحات «${PAGE_TYPE_LABELS_AR[topPage.k]}» بمعدل تقريبي ${formatPercent(topPage.rate)}.`
        : cards[2].textContent;
}

function updateBehaviorTable(agg) {
    const tbody = document.getElementById('behavior-table-body');
    if (!tbody || !agg || agg.empty) return;

    tbody.innerHTML = Object.entries(agg.pageTypes).map(([key, stats]) => {
        const conversion = stats.visits ? (stats.purchases / stats.visits) * 100 : 0;
        const avgBounce = stats.count ? stats.bounceSum / stats.count : 0;
        const trend = conversion >= agg.conversionRate ? 'up' : 'down';
        const trendLabel = trend === 'up' ? 'صاعد' : 'هابط';
        return `<tr>
            <td>${PAGE_TYPE_LABELS_AR[key] || key}</td>
            <td>${formatNumber(stats.visits)}</td>
            <td>${formatNumber(stats.purchases)}</td>
            <td>${formatPercent(conversion)}</td>
            <td><span class="trend-indicator trend-${trend}"><i class="fas fa-arrow-${trend === 'up' ? 'up' : 'down'}"></i> ${trendLabel}</span></td>
        </tr>`;
    }).join('');
}

function getMonthChartData(range) {
    const agg = analyticsAggregates || aggregateConsumerAnalytics();
    const months = MONTH_ORDER.filter((m) => agg.byMonth[m]);
    const slice = range === 'year' ? months : months.slice(-6);
    return {
        labels: slice.map((m) => MONTH_LABELS_AR[m] || m),
        sessions: slice.map((m) => agg.byMonth[m].sessions),
        purchases: slice.map((m) => agg.byMonth[m].purchases),
        pageValue: slice.map((m) => Math.round(agg.byMonth[m].pageValue))
    };
}

function initSpendingChart(range) {
    const canvas = document.getElementById('spendingChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const data = getMonthChartData(range);
    if (spendingChartInstance) spendingChartInstance.destroy();
    spendingChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'جلسات التصفح',
                    data: data.sessions,
                    backgroundColor: 'rgba(74, 55, 40, 0.5)',
                    borderRadius: 6
                },
                {
                    label: 'عمليات شراء',
                    data: data.purchases,
                    backgroundColor: 'rgba(201, 168, 130, 0.9)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', rtl: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function updateSpendingChart(range, btn) {
    document.querySelectorAll('.chart-filter .filter-btn').forEach((b) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    initSpendingChart(range);
}

function initCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const agg = analyticsAggregates || aggregateConsumerAnalytics();
    const entries = Object.entries(agg.byVisitor).sort((a, b) => b[1] - a[1]);
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: entries.map(([k]) => VISITOR_LABELS_AR[k] || k),
            datasets: [{
                data: entries.map(([, v]) => v),
                backgroundColor: ['#4a3728', '#c9a882', '#8e7f74', '#d7ccc8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', rtl: true } }
        }
    });
}

function initBehaviorChart() {
    const canvas = document.getElementById('behaviorChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const agg = analyticsAggregates || aggregateConsumerAnalytics();
    const keys = ['Administrative', 'Informational', 'ProductRelated'];
    const browse = keys.map((k) => agg.pageTypes[k].visits);
    const buy = keys.map((k) => agg.pageTypes[k].purchases);
    if (behaviorChartInstance) behaviorChartInstance.destroy();
    behaviorChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: keys.map((k) => PAGE_TYPE_LABELS_AR[k]),
            datasets: [
                {
                    label: 'تصفح (صفحات)',
                    data: browse,
                    borderColor: '#4a3728',
                    backgroundColor: 'rgba(74,55,40,0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'شراء (صفحات مرتبطة)',
                    data: buy,
                    borderColor: '#c9a882',
                    backgroundColor: 'rgba(201,168,130,0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top', rtl: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
