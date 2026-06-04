// page.tsx

"use client";

import { type FC, useEffect, useRef, useState, FormEvent } from "react";
import Chat from "../components/Chat";
import { useChat } from "ai/react";
import InstructionModal from "../components/InstructionModal";
import { AiFillGithub, AiOutlineInfoCircle } from "react-icons/ai";

const Page: FC = () => {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async () => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  return (
    <div className="flex flex-col justify-center h-screen max-w-full p-2 mx-auto bg-gray-800">
      {/* <Header className="my-5" /> */}

      <div className="flex justify-end gap-x-1">
        <button
          onClick={() => {
            window.open("https://github.com/rami-maalouf/journal-genius", "_blank");
          }}
          className=""
        >
          <AiFillGithub />
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="animate-pulse-once"
        >
          <AiOutlineInfoCircle />
        </button>
      </div>

      <InstructionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div className="relative flex flex-grow w-full overflow-hidden">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
          messages={messages}
        />
        {/* <div className="absolute right-0 w-2/3 h-full overflow-y-auto transition-transform duration-500 ease-in-out transform translate-x-full bg-gray-700 rounded-lg lg:static lg:translate-x-0 lg:w-2/5 lg:mx-2">
          <Context className="" selected={context} />
        </div>
        <button
          type="button"
          className="absolute px-4 py-2 text-white transform -translate-x-12 bg-gray-800 rounded-l left-20 lg:hidden"
          onClick={(e) => {
            e.currentTarget.parentElement
              ?.querySelector(".transform")
              ?.classList.toggle("translate-x-full");
          }}
        >
          ☰
        </button>*/}
      </div>
    </div>
  );
};

export default Page;
