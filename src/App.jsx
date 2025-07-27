// App.jsx
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// 🔑 Supabase Project Credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const ai = new GoogleGenAI( {apiKey : process.env.REACT_APP_GEMINI_API_KEY} );
// export default function ChatApp() {
  // const [messages, setMessages] = useState([]);
  // const [input, setInput] = useState('');
  
  // // 📥 Fetch messages on load
  // useEffect(() => {
    //   fetchMessages();

  //   // 🔁 Realtime listener
  //   const subscription = supabase
  //     .channel('public:messages')
  //     .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
  //       if (payload.eventType === 'INSERT') {
  //         setMessages((msgs) => [...msgs, payload.new]);
  //       }
  //     })
  //     .subscribe();

  //   return () => supabase.removeChannel(subscription);
  // }, []);

  // const fetchMessages = async () => {
  //   const { data, error } = await supabase.from('messages').select('*').order('created_at');
  //   if (!error) setMessages(data);
  // };

  // const sendMessage = async () => {
  //   if (!input.trim()) return;
  //   await supabase.from('messages').insert([{ content: input }]);
  //   setInput('');
  // };

//   const sendMessage = async () => {
//   if (!input.trim()) return;

//   const userMessage = input;
//   setInput('');

//   // Insert user message
//   await supabase.from('messages').insert([{ content: userMessage }]);

//   // Bot replies after a short delay
//   setTimeout(async () => {
//     const botReply = generateBotReply(userMessage);
//     await supabase.from('messages').insert([{ content: `🤖 ${botReply}` }]);
//   }, 1000);
// };

// // Basic bot logic (customize as you like)
// const generateBotReply = (msg) => {
//   if (msg.toLowerCase().includes('hello')) return 'Hi there! How can I help you?';
//   if (msg.toLowerCase().includes('time')) return `The current time is ${new Date().toLocaleTimeString()}`;
//   return "I'm just a demo bot! Ask me anything.";
// };

// const sendMessage = async () => {
//   if (!input.trim()) return;

//   // Insert user message
//   const { data: userMsg, error } = await supabase.from('messages').insert([{ content: input }]).select().single();
//   setInput('');

//   if (!error) {
//     // Insert auto-reply after a short delay
//     setTimeout(async () => {
//       const replyText = `You said: "${userMsg.content}"`; // Simple bot response
//       await supabase.from('messages').insert([{ content: replyText }]);
//     }, 500);
//   }
// };

// // Basic bot logic (customize as you like)
// const generateBotReply = (msg) => {
//   if (msg.toLowerCase().includes('hello')) return 'Hi there! How can I help you?';
//   if (msg.toLowerCase().includes('time')) return `The current time is ${new Date().toLocaleTimeString()}`;
//   return "I'm just a demo bot! Ask me anything.";
// };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
//         <h1 className="text-2xl font-bold mb-4">💬 Supabase Chatbot</h1>

//         <div className="space-y-2 h-80 overflow-y-scroll border p-3 rounded">
//           {messages.map((msg) => (
//             <div key={msg.id} className="bg-gray-200 p-2 rounded">
//               <span>{msg.content}</span>
//             </div>
//           ))}
//         </div>

//         <div className="flex mt-4 gap-2">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 p-2 border rounded"
//           />
//           <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // 📥 Fetch messages on load
  useEffect(() => {
    fetchMessages();

    // 🔁 Realtime listener
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((msgs) => [...msgs, payload.new]);
          }
          if (payload.eventType === 'DELETE') {
            setMessages((msgs) => msgs.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  
  const fetchMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at');
    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input;
  setInput('');

  // Insert user message
  const { data, error } = await supabase.from('messages').insert([{ content: userMessage }]).select().single();
  if (!error && data) {
    setMessages((msgs) => [...msgs, data]);
  }
  // Get AI reply using Gemini Pro
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const result = await model.generateContent(userMessage);
  // const response = result.response.text();
  // await supabase.from('messages').insert([{ content: `🤖 ${response}` }]);
  // try {
      // 🤖 Generate AI reply
      // const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });
      // // const result = await model.generateContent(userMessage);
      // const result = await model.generateContent([ { role: "user", parts: [{ text: prompt }] } ]);
      // const response = result.response.text();


      // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      // const result = await model.generateContent("Tell me a joke about JavaScript");
      // const response = await result.response;
      // console.log(response.text());

      // console.log("Calling model:", model);
      // console.log(genAI);

      // async function main() {
        // const response = await ai.models.generateContent({
        //   model: "gemini-2.5-flash",
        //   contents: "Explain how AI works in a few words",
        // });
        // // const response = result.response;
        // console.log(await response.text);
      // }
    //   const { data: botData, error: botError } = await supabase
    //     .from('messages')
    //     .insert([{ content: `🤖 ${response}` }])
    //     .select()
    //     .single();
    //   if (!botError && botData) {
    //     setMessages((msgs) => [...msgs, botData]);
    //   }
    // } catch (err) {
    //   console.error('Gemini error:', err);
    // }

  // Bot replies after a short delay
  setTimeout(async () => {
  const botReply = await generateBotReply(userMessage); // ✅ Await the Promise

  const { data: botData, error: botError } = await supabase
    .from('messages')
    .insert([{ content: `🤖 ${botReply}` }])
    .select()
    .single();

  if (!botError && botData) {
    setMessages((msgs) => [...msgs, botData]);
  }
}, 1000);
};

  // Basic bot logic (customize as needed)
  // const generateBotReply = (msg) => {
  //   if (msg.toLowerCase().includes('hello')) return 'Hi there! How can I help you?';
  //   if (msg.toLowerCase().includes('time')) return `The current time is ${new Date().toLocaleTimeString()}`;
  //   return "I'm just a demo bot! Ask me anything.";
  // };
  const generateBotReply = async (msg) => {
    if (msg.toLowerCase().includes('time')) return `The current time is ${new Date().toLocaleTimeString()}`;
  try {
    // const result = await ai.models.generateContent(msg);
      const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: msg }] }],
    });
    // const response = await result.response.text();
    // return response;
    const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error("No reply text found in response.");
    }

return replyText;
    // return await response.text();

    // const { data: botData, error: botError } = await supabase
    //     .from('messages')
    //     .insert([{ content: `🤖 ${response}` }])
    //     .select()
    //     .single();
    //   if (!botError && botData) {
    //     setMessages((msgs) => [...msgs, botData]);
    //   }
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, I had trouble generating a response.";
  }
};

  //   const clearChat = async () => {
  //   const { error } = await supabase.from('messages').delete().neq('id', 0); // Deletes all
  //   if (!error) setMessages([]);
  // };

// const clearChat = async () => {
//   if (window.confirm('Are you sure you want to clear the chat?')) {
//     const { data, error } = await supabase.from('messages').delete().select();
//     console.log('Deleted:', data, 'Error:', error);
//     if (!error) {
//       setMessages([]);
//     } else {
//       console.error('Failed to delete messages:', error.message);
//     }
//   }
// };
const clearChat = async () => {
  if (window.confirm('Are you sure you want to clear the chat?')) {
    const ids = messages.map(msg => msg.id);
    if (ids.length === 0) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .in('id', ids);

    if (!error) {
      setMessages([]);
    } else {
      console.error('Failed to delete messages:', error.message);
    }
  }
};





useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);


  
  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">💬 Supabase Chatbot v1</h1>

        <div className="space-y-2 h-80 overflow-y-scroll border p-3 rounded">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-200 p-2 rounded">
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>

        <div className="flex mt-4 gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
          />
          <button onClick={clearChat} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear Chat
          </button>
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}





















// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           {/* Edit <code>src/App.js</code> and save to reload. */}
// //           Hello, Tailwind!
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;




// // App.jsx
// import { useEffect, useState, useRef } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Auth } from '@supabase/auth-ui-react';
// // import { ThemeSupa } from '@supabase/auth-ui-shared';
// // import { ThemeSupa } from '@supabase/auth-ui-react';


// // 🔑 Supabase Project Credentials
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
// const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// export default function ChatApp() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [session, setSession] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!session) return;
//     fetchMessages();

//     const subscription = supabase
//       .channel('public:messages')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'messages' },
//         (payload) => {
//           if (payload.eventType === 'INSERT') {
//             setMessages((msgs) => [...msgs, payload.new]);
//           }
//           if (payload.eventType === 'DELETE') {
//             setMessages((msgs) => msgs.filter((msg) => msg.id !== payload.old.id));
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [session]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   const fetchMessages = async () => {
//     const { data, error } = await supabase.from('messages').select('*').order('created_at');
//     if (!error) setMessages(data);
//   };

//   // const sendMessage = async () => {
//   //   if (!input.trim()) return;

//   //   const userMessage = input;
//   //   setInput('');

//   //   await supabase.from('messages').insert([{ content: userMessage }]);

//   //   setTimeout(async () => {
//   //     const botReply = generateBotReply(userMessage);
//   //     await supabase.from('messages').insert([{ content: `🤖 ${botReply}` }]);
//   //   }, 1000);
//   // };

//   const sendMessage = async () => {
//   if (!input.trim()) return;

//   const userMessage = input;
//   setInput('');

//   // Insert user message
//   const { data, error } = await supabase.from('messages').insert([{ content: userMessage }]).select().single();
//   if (!error && data) {
//     setMessages((msgs) => [...msgs, data]);
//   }
//   // Get AI reply using Gemini Pro
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//   const result = await model.generateContent(userMessage);
//   const response = result.response.text();

//   await supabase.from('messages').insert([{ content: `🤖 ${response}` }]);
//   // Bot replies after a short delay
//   setTimeout(async () => {
//     const botReply = generateBotReply(userMessage);
//     const { data: botData, error: botError } = await supabase
//       .from('messages')
//       .insert([{ content: `🤖 ${botReply}` }])
//       .select()
//       .single();
//     if (!botError && botData) {
//       setMessages((msgs) => [...msgs, botData]);
//     }
//   }, 1000);
// };

//   const generateBotReply = (msg) => {
//     if (msg.toLowerCase().includes('hello')) return 'Hi there! How can I help you?';
//     if (msg.toLowerCase().includes('time')) return `The current time is ${new Date().toLocaleTimeString()}`;
//     return "I'm just a demo bot! Ask me anything.";
//   };

//   const clearChat = async () => {
//     if (window.confirm('Are you sure you want to clear the chat?')) {
//       const ids = messages.map((msg) => msg.id);
//       if (ids.length === 0) return;

//       const { error } = await supabase.from('messages').delete().in('id', ids);
//       if (!error) {
//         setMessages([]);
//       } else {
//         console.error('Failed to delete messages:', error.message);
//       }
//     }
//   };
// // const clearChat = async () => {
// //   if (window.confirm('Are you sure you want to clear the chat?')) {
// //     const ids = messages.map(msg => msg.id);
// //     if (ids.length === 0) return;

// //     const { error } = await supabase
// //       .from('messages')
// //       .delete()
// //       .in('id', ids);

// //     if (!error) {
// //       setMessages([]);
// //     } else {
// //       console.error('Failed to delete messages:', error.message);
// //     }
// //   }
// // };

//   if (!session) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-100">
//         <div className="max-w-md w-full p-6 bg-white rounded shadow">
//           {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} /> */}
//           <Auth supabaseClient={supabase} providers={['google']} />
//         </div>
//       </div>
//     );
//   }

//   // return (
//   //   <div className="min-h-screen bg-gray-100 p-4">
//   //     <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
//   //       <h1 className="text-2xl font-bold mb-4">💬 Supabase Chatbot</h1>

//   //       <div className="space-y-2 h-80 overflow-y-scroll border p-3 rounded">
//   //         {messages.map((msg) => (
//   //           <div key={msg.id} className="bg-gray-200 p-2 rounded">
//   //             <span>{msg.content}</span>
//   //           </div>
//   //         ))}
//   //         <div ref={messagesEndRef} />
//   //       </div>

//   //       <div className="flex mt-4 gap-2">
//   //         <input
//   //           value={input}
//   //           onChange={(e) => setInput(e.target.value)}
//   //           placeholder="Type your message..."
//   //           className="flex-1 p-2 border rounded"
//   //         />
//   //         <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//   //           Send
//   //         </button>
//   //         <button onClick={clearChat} className="bg-red-500 text-white px-4 py-2 rounded">
//   //           Clear
//   //         </button>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   return (
//   <div className="min-h-screen bg-gray-100 p-4">
//     <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
//       <div className="mb-4 flex justify-between items-center">
//         <p className="text-gray-700">Signed in as <strong>{session.user.email}</strong></p>
//         <button
//           onClick={() => supabase.auth.signOut()}
//           className="bg-red-500 text-white px-3 py-1 rounded"
//         >
//           Sign Out
//         </button>
//       </div>

//       <h1 className="text-2xl font-bold mb-4">💬 Supabase Chatbot</h1>

//       <div className="space-y-2 h-80 overflow-y-scroll border p-3 rounded">
//         {messages.map((msg) => (
//           <div key={msg.id} className="bg-gray-200 p-2 rounded">
//             <span>{msg.content}</span>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex mt-4 gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 p-2 border rounded"
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Send
//         </button>
//         <button onClick={clearChat} className="bg-red-500 text-white px-4 py-2 rounded">
//           Clear
//         </button>
//       </div>
//     </div>
//   </div>
//   );
// }

