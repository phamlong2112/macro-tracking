document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.nav-tab');
    const mobileTabLinks = document.querySelectorAll('.nav-tab-mobile');
    const tabContainer = document.getElementById('tab-container');

    // Tab state mapping to original HTML files
    const tabSources = {
        'tab-1': { url: './screen1-fullwidth.html', selector: 'section' }, // Gets the section with the 3x2 grid
        'tab-2': { url: './screen2-fullwidth.html', selector: '.horizontal-scroll' }, // Gets the 6 columns
        'tab-3': { url: './screen3-fullwidth.html', selector: '.grid.grid-cols-1.lg\\:grid-cols-3' } // Gets the 3 columns of context indicators
    };

    let cache = {};

    async function loadTab(tabId) {
        // Update Active States for Desktop Nav
        tabLinks.forEach(link => {
            if (link.dataset.tab === tabId) {
                link.classList.remove('border-transparent', 'text-on-surface-variant');
                link.classList.add('border-primary', 'text-primary', 'font-bold');
                link.classList.remove('font-medium');
            } else {
                link.classList.add('border-transparent', 'text-on-surface-variant', 'font-medium');
                link.classList.remove('border-primary', 'text-primary', 'font-bold');
            }
        });
        
        // Update Active States for Mobile Nav
        mobileTabLinks.forEach(link => {
            if (link.dataset.tab === tabId) {
                link.classList.remove('text-on-surface-variant');
                link.classList.add('text-primary');
            } else {
                link.classList.add('text-on-surface-variant');
                link.classList.remove('text-primary');
            }
        });

        // Add loading state
        tabContainer.innerHTML = '<div class="flex justify-center items-center h-64"><span class="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span></div>';

        try {
            let htmlContent;
            
            if (cache[tabId]) {
                htmlContent = cache[tabId];
            } else {
                const source = tabSources[tabId];
                if (!source) {
                    tabContainer.innerHTML = '<div class="p-10 text-center text-on-surface-variant">Coming soon...</div>';
                    return;
                }
                
                const response = await fetch(source.url);
                const text = await response.text();
                
                // Parse the fetched HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                // Extract the specific content based on selector
                const contentElement = doc.querySelector(source.selector);
                
                if (contentElement) {
                    // Extract styles if any specific styles are in head (like donut charts in tab 3)
                    const styles = doc.querySelectorAll('style');
                    let extraStyles = '';
                    styles.forEach(style => {
                        extraStyles += `<style>${style.innerHTML}</style>`;
                    });

                    // For Screen 2, we need the page header too
                    let headerElement = '';
                    if (tabId === 'tab-2') {
                        const header = doc.querySelector('.mb-6.shrink-0');
                        if (header) headerElement = header.outerHTML;
                    }
                    if (tabId === 'tab-3') {
                        const header = doc.querySelector('.mb-card-gap');
                        if (header) headerElement = header.outerHTML;
                    }

                    htmlContent = extraStyles + headerElement + contentElement.outerHTML;
                    cache[tabId] = htmlContent;
                } else {
                    htmlContent = '<div class="p-10 text-center text-error">Could not load content from ' + source.url + '</div>';
                }
            }

            // Inject the content
            tabContainer.innerHTML = htmlContent;
            
            // Re-bind events for newly injected content if needed (e.g. click to open modal)
            bindDynamicEvents();

        } catch (error) {
            console.error('Failed to load tab:', error);
            tabContainer.innerHTML = '<div class="p-10 text-center text-error">Error loading tab content.</div>';
        }
    }

    function bindDynamicEvents() {
        const rows = document.querySelectorAll('.indicator-row, .row-hover');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const title = row.querySelector('.font-semibold, .font-body-md')?.innerText || 'USD/VND';
                const value = row.querySelector('.font-data-number')?.innerText || '25,850';
                openModal(title, value);
            });
        });
    }

    function openModal(title, value) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
            <div class="relative w-full max-w-5xl bg-surface border border-surface-variant rounded-xl shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                <!-- Header -->
                <div class="p-6 border-b border-surface-variant flex justify-between items-start bg-surface-container-low">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-3xl font-headline-lg text-primary">${title}</h2>
                            <span class="px-2 py-1 bg-surface-variant rounded text-xs font-label-md text-on-surface-variant uppercase tracking-wider">Hàng ngày</span>
                            <span class="status-dot bg-semantic-green ml-2"></span>
                        </div>
                        <div class="font-data-number text-4xl text-on-surface">${value}</div>
                    </div>
                    <div class="flex gap-3">
                        <button class="px-4 py-2 bg-surface-variant hover:bg-outline-variant text-on-surface rounded-lg font-label-md text-sm transition-colors flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                            Export PDF
                        </button>
                        <button id="close-modal" class="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="p-6 overflow-y-auto flex-1 grid grid-cols-3 gap-6">
                    <div class="col-span-2 space-y-6">
                        <!-- Chart Placeholder -->
                        <div class="bg-surface-dim rounded-lg border border-surface-variant h-[320px] p-4 flex flex-col">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-headline-md text-sm text-on-surface-variant">Biểu đồ ${title} vs DXY Index</h3>
                                <div class="flex gap-4 text-xs font-label-md">
                                    <div class="flex items-center gap-2"><div class="w-3 h-1 bg-primary"></div>${title}</div>
                                    <div class="flex items-center gap-2"><div class="w-3 h-1 bg-tertiary"></div>DXY Index</div>
                                </div>
                            </div>
                            <div class="flex-1 border-b border-l border-surface-variant relative flex items-center justify-center">
                                <span class="text-outline-variant italic">Interactive Chart Area</span>
                            </div>
                        </div>
                        <!-- Performance -->
                        <div class="grid grid-cols-4 gap-4">
                            <div class="bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                                <div class="text-xs text-on-surface-variant mb-1">Tuần (W)</div>
                                <div class="font-data-number text-lg text-error">-0.1%</div>
                            </div>
                            <div class="bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                                <div class="text-xs text-on-surface-variant mb-1">Tháng (M)</div>
                                <div class="font-data-number text-lg text-error">-0.3%</div>
                            </div>
                            <div class="bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                                <div class="text-xs text-on-surface-variant mb-1">YTD</div>
                                <div class="font-data-number text-lg text-error">-1.2%</div>
                            </div>
                            <div class="bg-surface-container-low p-4 rounded-lg border border-surface-variant">
                                <div class="text-xs text-on-surface-variant mb-1">YoY</div>
                                <div class="font-data-number text-lg text-error">-2.1%</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-1 space-y-6">
                        <!-- Analysis -->
                        <div class="bg-surface-container p-5 rounded-lg border border-surface-variant">
                            <h3 class="font-headline-md text-sm text-primary mb-3">Diễn giải biến động</h3>
                            <p class="text-sm text-on-surface-variant leading-relaxed">Áp lực tỷ giá dịu lại do DXY hạ nhiệt. Ngân hàng nhà nước đã có các động thái điều tiết thanh khoản phù hợp, giúp thu hẹp chênh lệch lãi suất.</p>
                        </div>
                        <!-- Definition -->
                        <div class="bg-surface-container p-5 rounded-lg border border-surface-variant">
                            <h3 class="font-headline-md text-sm text-primary mb-3">Giải thích chỉ số</h3>
                            <ul class="text-sm text-on-surface-variant space-y-2">
                                <li><strong class="text-on-surface">Đo lường:</strong> Tỷ giá giao ngay giữa USD và VND.</li>
                                <li><strong class="text-on-surface">Quan trọng:</strong> Ảnh hưởng đến xuất nhập khẩu và lạm phát nhập khẩu.</li>
                                <li><strong class="text-on-surface">Ngưỡng rủi ro:</strong> Biến động >2% mỗi tháng.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modalContainer.classList.remove('hidden');
        
        // Close events
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    }

    function closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.add('hidden');
        modalContainer.innerHTML = '';
    }

    // Attach click listeners
    [...tabLinks, ...mobileTabLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            loadTab(tabId);
        });
    });

    // Load initial tab
    loadTab('tab-1');
});
