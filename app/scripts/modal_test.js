const init = async () => {
    try {
        const client = await window.frsh_init();
        const data = await client.data.get('conversation');

        const textElement = document.getElementById('sourcetext');
        textElement.innerHTML = `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;
        console.log('Child:DataApi', data);

        const getSuggestionButton = document.getElementById('getSuggestionButton');
        getSuggestionButton.addEventListener('click', getSuggestion);
    } catch (error) {
        console.log('Child:DataApi', error);
    }
};

async function getSuggestion() {
    try {
        const response = await fetch('https://private-internal.internal.dev.tabist.co.jp/v1/properties/B13HUSA/faqs');
        const data = await response.json();

        const textElement = document.getElementById('apptext');
        textElement.innerHTML = `
            <button id="copyButton">Copy</button>
            <pre><code>${JSON.stringify(data, null, 2)}</code></pre>
        `;

        const copyButton = document.getElementById('copyButton');
        copyButton.addEventListener('click', copyToClipboard);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

init();