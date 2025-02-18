let client;
//let conversation_data;

const init = async () => {
    try {
        client = await window.frsh_init();

        let conversationId = null;
        try{
            const conversationData = await client.data.get('conversation');
            console.log('--- conversationData 2', JSON.stringify(conversationData, null, 2));
            conversationId = conversationData.conversation.conversation_id;
            console.log('--- conversationId', conversationId);

            const logged_in_agent_data = await client.data.get('loggedInAgent');
            console.log('--- logged_in_agent_id 1', logged_in_agent_data);
            console.log('--- logged_in_agent_id 2', JSON.stringify(logged_in_agent_data, null, 2));
            console.log('--- logged_in_agent_id 3', logged_in_agent_data.loggedInAgent.id);
        }catch(e){
            console.log('--- LINE conversationData not found', e);
        }

        if(conversationId){ // LINE
            showLineConversation(conversationId);
        }

        let ticketData = null
        try {
            const data = await client.data.get('ticket');
            ticketData = data;
            console.log('--- ticketData found')
        }
        catch (e) {
            console.log('--- ticketData not found', e);
        }

        console.log('--- ticketData:', ticketData);
        console.log('--- ticketData.ticket.custom_fields:', ticketData.ticket.custom_fields);
        if(ticketData.ticket.custom_fields.cf_ota_name56079 === "Booking.com"){
            //Booking.com
            bcomTicketData = {
                otaName: data.ticket.custom_fields.cf_ota_name56079,
                otaBookingId: data.ticket.custom_fields.cf_booking_id,
                propertyId: data.ticket.custom_fields.cf_property_id
            };

            if(bcomTicketData){
                showBcomInfo(ticketData);
            }
        }
        else{
            //Email
            ticketId = ticketData.ticket.id;

            if(ticketId){
                showEmailInfo(ticketId);
            }

        }

        const getSuggestionButton = document.getElementById('getSuggestionButton');
        getSuggestionButton.addEventListener('click', getReplySuggestion);
    } catch (error) {
        console.log('--- Error while Modal Init', error);
    }
};

async function showLineConversation(conversationId){
    try {
        const textElement = document.getElementById('conversationTitle');
        textElement.innerHTML = 'Recent LINE Conversations (last 50)'

        console.log('-- Show conversation');
        const response = await fetch('http://localhost:3221/freshchat/conversations/'+ conversationId,{
            method: 'GET'
        });
        if(response.ok){
            const data = await response.json();
            //            conversation_data = data;
            console.log('-- Show conversation response', data);
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = ''; // Clear existing messages

            // Render each message
            data.forEach((item) => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');

                if (item.actor === 'user') {
                    messageDiv.classList.add('user');
                } else {
                    messageDiv.classList.add('agent');
                }

                // Add the message content
                const messageContent = document.createElement('div');
                messageContent.textContent = item.message;
                messageDiv.appendChild(messageContent);

                // Add metadata (actor and created_time)
                const metadata = document.createElement('div');
                metadata.classList.add('message-meta');

                const actor = item.actor === 'user' ? 'User' : 'Agent';
                const createdTime = item.created_time
                ? new Date(item.created_time).toLocaleString()
                : 'Unknown time';

                metadata.textContent = `${actor} • ${createdTime}`;
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

function showBcomInfo(ticketData){
    const textElement0 = document.getElementById('conversationTitle');
    textElement0.innerHTML = 'Booking.Com Chat Conversations'

    const textElement = document.getElementById('sourcetext');
    textElement.innerHTML = `<pre><code>${JSON.stringify(ticketData, null, 2)}</code></pre>`;
    console.log('--- ticketData:', ticketData);
}

async function showEmailInfo(ticketId){
    try {
        const textElement = document.getElementById('conversationTitle');
        textElement.innerHTML = 'Whole Email Conversation'

        console.log('-- Show Email conversation for ticketId:', ticketId);
        const response = await fetch('http://localhost:3221/freshdesk/tickets/'+ticketId,{
            method: 'GET'
        });
        if(response.ok){
            const data = await response.json();
            //            conversation_data = data;
            console.log('-- Show conversation response', data);
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.innerHTML = ''; // Clear existing messages

            // Render each message
            data.forEach((item) => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');

                if (item.actor === 'user') {
                    messageDiv.classList.add('user');
                } else {
                    messageDiv.classList.add('agent');
                }

                // Add the message content
                const messageContent = document.createElement('div');
                messageContent.textContent = item.message;
                messageDiv.appendChild(messageContent);

                // Add metadata (actor and created_time)
                const metadata = document.createElement('div');
                metadata.classList.add('message-meta');

                const actorType = item.actor === 'user' ? 'User' : 'Agent';
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

async function getReplySuggestion(){
    try {
        console.log("--- inside getReplysuggestion");
        const response = await fetch('http://localhost:3221/properties/responses', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                request_id: "1",
                property_id: "N01HASH",
                hotel_name: "TABIST ASAHIKAWA STATION HOTEL",
                conversation: [
                    {
                        "actor": "user",
                        "message": "What time is check in?"
                    },
                    {
                        "actor": "agent",
                        "message": "it is 15:00 onwards"
                    }
                ]
            })
        });
        if(response.ok){
            const data = await response.json();

            const textElement = document.getElementById('sourcetext');
            textElement.innerHTML = `<pre><code>${JSON.stringify(data.response.en, null, 2)}</code></pre>`;
        } else {
            console.log('-- getReplySuggestion response not OK', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

init();