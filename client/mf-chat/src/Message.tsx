type MessageProps = {
  fullName: string;
  message: string;
  timestamp: Date;
  self: boolean;
};

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

function wrapText(text: string, maxLength: number): string {
  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine.length + word.length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = "";
    }
    currentLine += word + " ";

    while (currentLine.length > maxLength) {
      lines.push(currentLine.slice(0, maxLength).trim());
      currentLine = currentLine.slice(maxLength);
    }
  });

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines.join("\n");
}

const Message: React.FC<MessageProps> = ({
  fullName,
  message,
  timestamp,
  self,
}) => {
  const wrappedMessage = wrapText(message, 50);

  return (
    <div
      className={`w-[30%] flex ${self ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          self ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm">{fullName}</span>
          <span className="text-xs opacity-75 ml-2">
            {formatTime(new Date(timestamp))}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">
          {wrappedMessage}
        </p>
      </div>
    </div>
  );
};

export default Message;
