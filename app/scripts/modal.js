let client;

const init = async () => {
    try {
        client = await window.frsh_init();

        let conversationId = null;
        try{
            const conversationData = await client.data.get('conversation');
            conversationId = conversationData.conversation.conversation_id;
            console.log('--- conversationId', conversationId);
        }catch(e){
            console.log('--- conversationData not found', e);
        }

        if(conversationId){
            showConversation(conversationId);
        }

        let ticketData = null
        try {
            const data = await client.data.get('ticket');
            ticketData = {
                otaName: data.ticket.custom_fields.cf_ota_name56079,
                otaBookingId: data.ticket.custom_fields.cf_booking_id,
                propertyId: data.ticket.custom_fields.cf_property_id
            };
            console.log('--- ticketData found')
        }
        catch (e) {
            console.log('--- ticketData not found', e);
        }

        if(ticketData){
            showTicketInfo(ticketData);
        }

        const getSuggestionButton = document.getElementById('getSuggestionButton');
        getSuggestionButton.addEventListener('click', getSuggestion);
    } catch (error) {
        console.log('--- Error while Modal Init', error);
    }
};

async function showConversation(conversationId){
    try {
        console.log('-- Show conversation');
        const response = await fetch('http://localhost:3221/freshchat/conversations/'+ conversationId,{
            method: 'GET'
        });
        if(response.ok){
            const data = await response.json();
            console.log('-- Show conversation response', data);
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = ''; // Clear existing messages

            // Render each message
            data.forEach((item) => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');

                if (item.actor_type === 'user') {
                    messageDiv.classList.add('user');
                } else {
                    messageDiv.classList.add('agent');
                }

                // Add the message content
                const messageContent = document.createElement('div');
                messageContent.textContent = item.message;
                messageDiv.appendChild(messageContent);

                // Add metadata (actor_type and created_time)
                const metadata = document.createElement('div');
                metadata.classList.add('message-meta');

                const actorType = item.actor_type === 'user' ? 'User' : 'Agent';
                const createdTime = item.created_time
                ? new Date(item.created_time).toLocaleString()
                : 'Unknown time';

                metadata.textContent = `${actorType} • ${createdTime}`;
                messageDiv.appendChild(metadata);

                chatContainer.appendChild(messageDiv);
            });
        } else {
            console.log('-- Show conversation response not OK', response.status);
        }
    } catch (error) {
        console.log('-- Show conversation error', error);
    }
}

function showTicketInfo(ticketData){
    const textElement = document.getElementById('sourcetext');
    textElement.innerHTML = `<pre><code>${JSON.stringify(ticketData, null, 2)}</code></pre>`;
    console.log('--- ticketData:', ticketData);
}

async function getSuggestion() {
    try {
        const response = await fetch('https://private-internal.internal.dev.tabist.co.jp/v1/properties/B13HUSA/faqs', {
            method: 'GET'
        });
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