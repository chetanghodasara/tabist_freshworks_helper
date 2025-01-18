//const init = async () => {
//    try {
//        console.log("--- 111");
//        console.log("--- document", document);
//        const getSuggestionButton = document.getElementById('getSuggestionButton');
//        console.log("--- getSuggestionButton", getSuggestionButton);
//    } catch (error) {
//        console.error(error);
//    }
//};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.isParent) {
            console.log("--- Same window context");
        } else {
            console.log("--- Different window context");
        }


        console.log("--- 111");
        console.log("--- document", document);
        const getSuggestionButton = document.getElementById('getSuggestionButton');
        console.log("--- getSuggestionButton", getSuggestionButton);
        getSuggestionButton.addEventListener('click', getSuggestion);

        console.log("--- 222");

        const context = await client.instance.context();
        console.log("--- context", context);

        const contactData = await client.data.get('conversation');
        console.log("--- 333");
        const textElement = document.getElementById('sourcetext');
        textElement.innerHTML = `<pre><code>${JSON.stringify(contactData, null, 2)}</code></pre>`;
    } catch (error) {
        console.error(error);
    }
});

async function getSuggestion() {
    console.log('---1 inside getSuggestion ---');
    try {
        const response = await fetch('https://private-internal.internal.dev.tabist.co.jp/v1/properties/B13HUSA/faqs');
        const data = await response.json();
        console.log('---2 inside getSuggestion ---');

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