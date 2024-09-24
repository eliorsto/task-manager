import { useSelector } from 'react-redux';
import NotLogged from '../NotLogged/NotLogged';
import { UserPlus, Send, Smile, Plus, MessageSquare, Bug, X, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const Teams = () => {
    const { token } = useSelector((state) => state.user);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [teams, setTeams] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([
        { id: 1, teamName: 'Team Or' },
        { id: 2, teamName: 'Team Beni' },
    ]);
    const [showCreateTeamInput, setShowCreateTeamInput] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [showInviteInput, setShowInviteInput] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitingTeamId, setInvitingTeamId] = useState(null);

    const prefixedChannels = [
        { id: 'global', name: 'Global Chat', icon: <MessageSquare size={18} /> },
        { id: 'bug', name: 'Bug Report', icon: <Bug size={18} /> },
    ];

    const handleChannelSelect = (channelId) => {
        setSelectedChannel(channelId);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessage('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
    };

    const handleCreateTeam = () => {
        if (newTeamName.trim()) {
            const newTeam = {
                id: `team-${teams.length + 1}`,
                name: newTeamName.trim(),
                isCreator: true
            };
            setTeams([...teams, newTeam]);
            setNewTeamName('');
            setShowCreateTeamInput(false);
        }
    };

    const handleAddPeopleToTeam = (teamId) => {
        setInvitingTeamId(teamId);
        setShowInviteInput(true);
    };

    const handleSendInvite = () => {
        if (inviteEmail.trim()) {
            console.log(`Inviting ${inviteEmail} to team ${invitingTeamId}`);
            setInviteEmail('');
            setShowInviteInput(false);
        }
    };

    const handleDeleteTeam = (teamId) => {
        setTeams(teams.filter(team => team.id !== teamId));
    };

    const handleAcceptInvite = (inviteId) => {
        console.log(`Accepted invite ${inviteId}`);
        setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
    };

    const handleRejectInvite = (inviteId) => {
        console.log(`Rejected invite ${inviteId}`);
        setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
    };

    return <>
        {token ? <>
            <div className="flex h-full border-gray-200 dark:border-slate-700 border-2 shadow-md rounded-lg dark:shadow-gray-400/30">
                <div className="w-64 bg-gray-100 dark:bg-slate-800 p-4 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold dark:text-gray-200 mb-2">Channels</h2>
                        {prefixedChannels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => handleChannelSelect(channel.id)}
                                className={`flex items-center py-2 px-4 dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 w-full text-left ${selectedChannel === channel.id ? 'dark:bg-slate-500 bg-gray-200' : ''}`}
                            >
                                {channel.icon}
                                <span className="ml-2">{channel.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold dark:text-gray-200">My Teams</h2>
                            <button onClick={() => setShowCreateTeamInput(true)} className="text-blue-500">
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
                                <button onClick={handleCreateTeam} className="ml-2 text-green-500">
                                    <Check size={18} />
                                </button>
                                <button onClick={() => setShowCreateTeamInput(false)} className="ml-2 text-red-500">
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                        {teams.map((team) => (
                            <div key={team.id} className="flex items-center justify-between py-2 px-4 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <button
                                    onClick={() => handleChannelSelect(team.id)}
                                    className={`flex-grow text-left ${selectedChannel === team.id ? 'font-bold' : ''}`}
                                >
                                    {team.name}
                                </button>
                                <div>
                                    <button onClick={() => handleAddPeopleToTeam(team.id)} className="text-blue-500 mr-2">
                                        <UserPlus size={14} />
                                    </button>
                                    {team.isCreator && (
                                        <button onClick={() => handleDeleteTeam(team.id)} className="text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold dark:text-gray-200 mb-2">Pending Invites</h2>
                        {pendingInvites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between py-2 px-4 dark:text-gray-200">
                                <span>{invite.teamName}</span>
                                <div>
                                    <button onClick={() => handleAcceptInvite(invite.id)} className="text-green-500 mr-2">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => handleRejectInvite(invite.id)} className="text-red-500">
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
                            <button onClick={handleSendInvite} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
                                Send Invite
                            </button>
                            <button onClick={() => setShowInviteInput(false)} className="ml-2 text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    {selectedChannel ? <>
                        <div className="flex-1 p-4 overflow-y-auto dark:text-gray-200">
                            <p>Chat content for {selectedChannel}</p>
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
                    </> : <>
                        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-200">
                            Select a channel to start chatting
                        </div>
                    </>}
                </div>
            </div>
        </> : <>
            <NotLogged />
        </>
        }
    </>
}

export default Teams;