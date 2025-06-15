interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessageBubble = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;