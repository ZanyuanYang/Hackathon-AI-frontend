import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Avatar,
  ChatContainer,
  Message,
  MessageList,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import SuggestItem from './components/SuggestItem';

type Props = {
  open: boolean;
  onClose: () => void;
};

function ChatboxModal(props: Props) {
  const { open, onClose } = props;
  const [messages, setMessages] = useState<any[]>([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: 'just now',
      sender: 'ChatGPT',
    },
  ]);
  const [userMessage, setUserMessage] = useState<string>('');
  const systemMessage = {
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: 'system',
    content:
      "Explain things like you're talking to a software professional with 2 years of experience.",
  };

  const [isTyping, setIsTyping] = useState(false);

  const handleSendOnChange = (message: any) => {
    setUserMessage(message);
  };

  const processMessageToChatGPT = async (chatMessages: any) => {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    const apiMessages = chatMessages.map((messageObject: any) => {
      let role = '';
      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    setMessages([
      ...chatMessages,
      {
        message: 'chatgpt answer',
        sender: 'assistant',
      },
    ]);
    setIsTyping(false);

    // await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + API_KEY,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(apiRequestBody),
    // })
    //   .then((data) => {
    //     return data.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setMessages([
    //       ...chatMessages,
    //       {
    //         message: data.choices[0].message.content,
    //         sender: 'ChatGPT',
    //       },
    //     ]);
    //     setIsTyping(false);
    //   });
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    const newMessage = {
      message: userMessage,
      direction: 'outgoing',
      sender: 'user',
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setUserMessage('');
    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-scroll">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full flex flex-col gap-2 max-w-screen-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="mb-2 text-lg text-gray-900">
                  FindEasy GPT
                </Dialog.Title>
                <div className="mt-2 flex flex-col gap-1 border border-gray-200 bg-gray-100 rounded-xl p-2">
                  <h2 className="text-gray-800">AI Notes</h2>
                  <p className="text-xs max-w-md space-y-1 text-gray-500 list-inside break-all">
                    1. What is the best way to find a
                    job?fnekjwafnewkafnewjnfewjaf ewkjaf
                  </p>
                  <p className="text-xs max-w-md space-y-1 text-gray-500 list-inside break-all">
                    2. What is the best way to find a
                    job?fnekjwafnewkafnewjnfewjaf ewkjaf
                  </p>
                </div>

                <div className="border border-slate-400 rounded-2xl h-[30em] overflow-auto">
                  <div className="p-4">
                    <ChatContainer>
                      <MessageList
                        scrollBehavior="smooth"
                        typingIndicator={
                          isTyping ? (
                            <TypingIndicator content="ChatGPT is typing" />
                          ) : null
                        }
                      >
                        {messages.map((message, i) => {
                          return <Message key={i} model={message} />;
                        })}
                      </MessageList>
                    </ChatContainer>
                    <SuggestItem />
                  </div>
                </div>

                <form className="flex items-center" onSubmit={handleSend}>
                  <label htmlFor="simple-search" className="sr-only">
                    Chat here...
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Chat here..."
                      value={userMessage}
                      required
                      onChange={(e: any) => handleSendOnChange(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSend}
                  >
                    <SendRoundedIcon />
                    <span className="sr-only">Search</span>
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ChatboxModal;
