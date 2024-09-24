import React, { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  Send,
  Smile,
  Plus,
  MessageSquare,
  Bug,
  X,
  Check,
  Trash2,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { io, Socket } from "socket.io-client";
import Message from "./Message";

type Team = {
  id: string;
  name: string;
  isCreator: boolean;
};

type PendingInvite = {
  id: number;
  teamName: string;
};

// -----------------------

type Message = {
  fullName: string;
  message: string;
  timestamp: Date;
  self: string;
};

type ChatInfo = {
  _id: string;
  title: string;
  messages?: Message[];
  users?: string[];
  creatorId?: string;
  icon?: string;
};

type Chat = {
  global: ChatInfo[];
  personal: ChatInfo[];
};

type TeamProps = {
  token: string;
  chats: Chat;
  createTeam: (teamName: string) => Promise<void>;
};

const globalIcons: { [x: string]: any } = {
  MessageSquare: <MessageSquare size={18} />,
  Bug: <Bug size={18} />,
};

const Teams: React.FC<TeamProps> = ({ token, chats, createTeam }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");

  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    { id: 1, teamName: "Team Or" },
    { id: 2, teamName: "Team Beni" },
  ]);
  const [showCreateTeamInput, setShowCreateTeamInput] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitingTeamId, setInvitingTeamId] = useState<string | null>(null);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", { chatId: selectedChannel, token });

    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("history", (chatHistory) => {
      setMessages(chatHistory);

      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 0);
    });

    socket.on("user", (id) => {
      setUserId(id);
    });

    return () => {
      socket.off("message");
      socket.off("history");
    };
  }, [socket, selectedChannel]);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("message", { chatId: selectedChannel, message, token });
      setMessage("");
    }
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleCreateTeam = async () => {
    if (newTeamName.trim()) {
      await createTeam(newTeamName.trim());
      setNewTeamName("");
      setShowCreateTeamInput(false);
    }
  };

  const handleAddPeopleToTeam = (teamId: string) => {
    setInvitingTeamId(teamId);
    setShowInviteInput(true);
  };

  const handleSendInvite = () => {
    if (inviteEmail.trim()) {
      console.log(`Inviting ${inviteEmail} to team ${invitingTeamId}`);
      setInviteEmail("");
      setShowInviteInput(false);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId));
  };

  const handleAcceptInvite = (inviteId: number) => {
    console.log(`Accepted invite ${inviteId}`);
    setPendingInvites(
      pendingInvites.filter((invite) => invite.id !== inviteId)
    );
  };

  const handleRejectInvite = (inviteId: number) => {
    console.log(`Rejected invite ${inviteId}`);
    setPendingInvites(
      pendingInvites.filter((invite) => invite.id !== inviteId)
    );
  };

  return (
    <div className="flex h-full border-gray-200 dark:border-slate-700 border-2 shadow-md rounded-lg dark:shadow-gray-400/30">
      <div className="w-64 bg-gray-100 dark:bg-slate-800 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold dark:text-gray-200 mb-2">
            Channels
          </h2>
          {chats.global.map((channel) => (
            <button
              key={channel._id}
              onClick={() => handleChannelSelect(channel._id)}
              className={`flex items-center py-2 px-4 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 w-full text-left ${
                selectedChannel === channel._id
                  ? "dark:bg-slate-500 bg-gray-200"
                  : ""
              }`}
            >
              {channel.icon && globalIcons[channel.icon]}
              <span className="ml-2">{channel.title}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              My Teams
            </h2>
            <button
              onClick={() => setShowCreateTeamInput(true)}
              className="text-blue-500"
            >
              <Plus size={18} className="mt-2" />
            </button>
          </div>
          {showCreateTeamInput && (
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-grow p-1 text-sm dark:bg-slate-700 dark:text-gray-200"
                placeholder="Enter team name"
              />
              <button
                onClick={handleCreateTeam}
                className="ml-2 text-green-500"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => setShowCreateTeamInput(false)}
                className="ml-2 text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          )}
          {chats.personal.map((channel) => (
            <div
              key={channel._id}
              className="flex items-center justify-between py-2 px-4 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <button
                onClick={() => handleChannelSelect(channel._id)}
                className={`flex-grow text-left ${
                  selectedChannel === channel._id ? "font-bold" : ""
                }`}
              >
                {channel.title}
              </button>
              <div>
                <button
                  onClick={() => handleAddPeopleToTeam(channel._id)}
                  className="text-blue-500 mr-2"
                >
                  <UserPlus size={14} />
                </button>
                {channel.users && channel?.creatorId === channel.users[0] && (
                  <button
                    onClick={() => handleDeleteTeam(channel._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-gray-200 mb-2">
            Pending Invites
          </h2>
          {pendingInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between py-2 px-4 dark:text-gray-200"
            >
              <span>{invite.teamName}</span>
              <div>
                <button
                  onClick={() => handleAcceptInvite(invite.id)}
                  className="text-green-500 mr-2"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => handleRejectInvite(invite.id)}
                  className="text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col relative">
        {showInviteInput && (
          <div className="absolute top-4 right-4 bg-white dark:bg-slate-700 p-4 rounded-lg shadow-lg z-10">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="p-2 border rounded-lg dark:bg-slate-600 dark:text-gray-200"
              placeholder="Enter email to invite"
            />
            <button
              onClick={handleSendInvite}
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              Send Invite
            </button>
            <button
              onClick={() => setShowInviteInput(false)}
              className="ml-2 text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {selectedChannel ? (
          <>
            <div
              className="flex flex-col flex-1 p-4 overflow-y-scroll gap-y-3 dark:text-gray-200"
              ref={chatRef}
            >
              {messages.map((msg: Message, index: number) => (
                <Message
                  key={index}
                  fullName={msg.fullName}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  self={userId === msg.self}
                />
              ))}
            </div>
            <div className="border-t p-4 flex items-center relative">
              <button
                className="mr-2 dark:text-gray-200"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={24} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-l-lg p-2 dark:bg-slate-600 dark:text-gray-200"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg"
              >
                <Send size={30} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-200">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
