document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const longUrlInput = document.getElementById('long-url');
    const customAliasInput = document.getElementById('custom-alias');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const shortUrlLink = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const errorMsg = document.getElementById('error-message');
    const clicksCount = document.getElementById('clicks-count');
    const refreshStatsBtn = document.getElementById('refresh-stats');

    let currentUrlCode = '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const longUrl = longUrlInput.value.trim();
        const customAlias = customAliasInput.value.trim();
        
        if (!longUrl) return;

        // Reset UI
        errorMsg.classList.add('hidden');
        resultContainer.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Shortening...';

        try {
            const payload = { longUrl };
            if (customAlias) payload.customAlias = customAlias;

            const response = await fetch('/api/url/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data || 'Failed to shorten URL');
            }

            // Success
            currentUrlCode = data.urlCode;
            shortUrlLink.href = data.shortUrl;
            shortUrlLink.textContent = data.shortUrl;
            clicksCount.textContent = data.clicks || 0;
            
            resultContainer.classList.remove('hidden');
            
        } catch (err) {
            errorMsg.textContent = err.message;
            errorMsg.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Shorten URL';
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortUrlLink.href);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });

    refreshStatsBtn.addEventListener('click', async () => {
        if (!currentUrlCode) return;
        
        refreshStatsBtn.disabled = true;
        refreshStatsBtn.textContent = 'Refreshing...';
        
        try {
            const response = await fetch(`/api/url/stats/${currentUrlCode}`);
            const data = await response.json();
            
            if (response.ok) {
                clicksCount.textContent = data.clicks;
            }
        } catch (err) {
            console.error('Failed to refresh stats', err);
        } finally {
            refreshStatsBtn.disabled = false;
            refreshStatsBtn.textContent = 'Refresh Stats';
        }
    });
});
