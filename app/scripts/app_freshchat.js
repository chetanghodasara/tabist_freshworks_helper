let client;

window.isParent = true;

async function init() {
    client = await app.initialized();
    window.client = client;
    client.events.on('app.activated', renderText);

    const getSuggestionButton = document.getElementById('getSuggestionButton');
    getSuggestionButton.addEventListener('click', getSuggestion);

    const showFreshchatModalButton = document.getElementById('showFreshchatModalButton');
    showFreshchatModalButton.addEventListener('click', showFreshchatModal);
}

async function renderText() {
    const contactData = await client.data.get('conversation');
    const textElement = document.getElementById('sourcetext');
    textElement.innerHTML = `<pre><code>${JSON.stringify(contactData, null, 2)}</code></pre>`;
}

async function getSuggestion() {
    try {
        console.log('---1 inside getSuggestion');
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

function copyToClipboard() {
    //    const textElement = document.getElementById('apptext');
    //    const textToCopy = textElement.innerText;
    const copyButton = document.getElementById('copyButton');
    copyButton.textContent = 'Copied...';
    setTimeout(() => {
        copyButton.textContent = 'Copy';
    }, 2000);
}

async function showFreshchatModal() {
    try {
        const data = await client.data.get('conversation');
        console.log('-- data in parent', data);
        const triggerData = await client.interface.trigger('showModal', {
            title: 'Tabist Freshworks Helper',
            template: '../views/modal_freshchat.html',
            data: data
            //context: { client: window.client }
            //context: { clientData: { appId: client.appId, instanceId: client.instanceId } }
        });
        console.log('Parent:InterfaceAPI:showModal', triggerData);
    } catch (error) {
        console.log('Parent:InterfaceAPI:showModal', error);
    }
}

init();