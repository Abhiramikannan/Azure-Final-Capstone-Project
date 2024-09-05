// import React, { useState } from 'react';
// import './ChatBox.css'; // Ensure this file exists and contains relevant styling
// import axios from 'axios';

// const ChatBox = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSend = async () => {
//         if (input.trim() === '') return;

//         const newMessage = { text: input, sender: 'user' };
//         setMessages([...messages, newMessage]);
//         setInput('');
//         setLoading(true);

//         try {
//             const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyACCXtkVaP3Se390sgYMobo8nCRK4aDIBo', {
//                 contents: [
//                     {
//                         parts: [
//                             {
//                                 text: input
//                             }
//                         ]
//                     }
//                 ]
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             // Access response data directly
//             console.log(response.data); // Log the response for debugging

//             // Check for expected response structure
//             if (response.data && response.data.candidates && response.data.candidates.length > 0) {
//                 const botMessage = { text: response.data.candidates[0].content.parts[0].text, sender: 'bot' };
//                 setMessages([...messages, newMessage, botMessage]);
//             } else {
//                 throw new Error('Invalid response format');
//             }
//         } catch (error) {
//             console.error('Error:', error.message);
//             setMessages([...messages, newMessage, { text: 'Error: Could not retrieve response', sender: 'bot' }]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     function toggleChatbot() {
//         const chatbotWindow = document.getElementById('chatbot-window');
//         const chatbotLogo = document.getElementById('chatbot-logo');
      
//         if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
//           chatbotWindow.style.display = 'block';
//           chatbotLogo.style.display = 'none';
//         } else {
//           chatbotWindow.style.display = 'none';
//           chatbotLogo.style.display = 'block';
//         }
//     }
      

//     return (
//         <div className='chatbox'>
//             <div className='chatbox-title'>GAMA</div> {/* Added title bar */}
//             <div className='chatbox-messages'>
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender}`}>
//                         {msg.text}
//                     </div>
//                 ))}
//                 {loading && <div className='message bot'>...typing</div>}
//             </div>
//             <div className='chatbox-input'>
//                 <input
//                     type='text'
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder='Type a message...'
//                 />
//                 <button onClick={handleSend}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default ChatBox;
import React, { useState } from 'react';
import './ChatBox.css'; // Ensure this file exists and contains relevant styling
import axios from 'axios';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyACCXtkVaP3Se390sgYMobo8nCRK4aDIBo', {
                contents: [
                    {
                        parts: [
                            {
                                text: input
                            }
                        ]
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Check for expected response structure
            if (response.data && response.data.candidates && response.data.candidates.length > 0) {
                const botMessage = { text: response.data.candidates[0].content.parts[0].text, sender: 'bot' };
                setMessages([...messages, newMessage, botMessage]);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error.message);
            setMessages([...messages, newMessage, { text: 'Error: Could not retrieve response', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleChatbot = () => {
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotLogo = document.getElementById('chatbot-logo');

        if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
            chatbotWindow.style.display = 'block';
            chatbotLogo.style.display = 'none';
        } else {
            chatbotWindow.style.display = 'none';
            chatbotLogo.style.display = 'block';
        }
    };

    return (
        <div id="chatbot-container">
            <div id="chatbot-logo" onClick={toggleChatbot}>
                <img src="download.png" alt="Chatbot Logo" width="50"/>
            </div>

            <div id="chatbot-window" style={{ display: 'none' }}>
                <div className='chatbox'>
                    <div className='chatbox-title'>
                        GAMA
                        <button id="minimize-btn" onClick={toggleChatbot}>_</button>
                    </div>
                    <div className='chatbox-messages'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className='message bot'>...typing</div>}
                    </div>
                    <div className='chatbox-input'>
                        <input
                            type='text'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Type a message...'
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
