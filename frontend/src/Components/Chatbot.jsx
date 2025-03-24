import 'regenerator-runtime/runtime';
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Mic, MicOff, Send, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Initialize GoogleGenerativeAI using your environment API key.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// System prompt for structured responses.
const SYSTEM_PROMPT = `You are GreenAI, a trusted environmental guide for our India-based website. Respond to user queries about their issues in a clear, concise, and empathetic manner. Evaluate the user's problems to determine if they are minor or require urgent attention. For minor issues, offer brief tips. For serious or worsening issues, advise immediate complaint filing in the news tab.

Guidelines for your responses:
-Prescribe tips for saving energy and reducing carbon footprint.
- Provide a clear, direct main answer.
- Use bullet points or numbered steps only when necessary.
- Avoid jargon and complex terms.
- Use a friendly, empathetic tone.
- Encourage users to donate and direct them to our donation box.
- When asked for feedback redirect them to the news tab
- Offer general nature-care tips.
- Keep your responses short and to the point.
- Ask for clarification if needed.
- Do not include any formatting tags or labels in your output.
-The website has Waste classifier for user to recycle better.
-There is a community page where various activities are posted by people.
-The news tab contains news and user can also publish news or rise complaints if any in the same tab.
-The Carbon footprint Calculator gives insights of where user is spending and suggests how to reduce it.
-The carbon footprint tab also has the sources of courses where user can know more about environment through educational videos.
`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-speech function
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition.");
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      if (transcript) {
        setInput(transcript);
      }
    } else {
      resetTranscript();
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSend = async () => {
    const messageToSend = input.trim() || transcript.trim();
    if (!messageToSend) return;

    // Add the user's message to the conversation.
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setInput('');
    resetTranscript();
    setIsLoading(true);

    try {
      // Use the gemini-1.5-flash model and generate content using the combined prompt.
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // Combine the SYSTEM_PROMPT with the user's message.
      const prompt = `${SYSTEM_PROMPT}\nUser: ${messageToSend}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      speak(text);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-400 text-black p-4 rounded-full shadow-lg hover:bg-green-200 transition-all duration-300 z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-green-800 rounded-xl shadow-2xl flex flex-col z-50 border border-white-700">
          {/* Header */}
          <div className="p-4 border-b border-white-700 flex justify-between items-center">
            <h3 className="text-white font-bold">Eco.AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-400 text-black'
                      : 'bg-green-700 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-white-700">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoiceInput}
                className="p-2 text-white-400 hover:bg-green-400 rounded-full"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <input
                type="text"
                value={input || transcript}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                className="flex-1 bg-white-700 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleSend}
                className="p-2 text-black hover:bg-green-300 rounded-full disabled:text-black"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
