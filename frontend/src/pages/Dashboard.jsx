import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentEditor from '../components/editor/DocumentEditor';
import ChatPanel from '../components/chat/ChatPanel';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [workspace, setWorkspace] = useState({ documentId: null, channelId: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeWorkspace = async () => {
            if (!user) return;
            try {
                // 1. Fetch or create team
                let teamRoute = await axios.get('/api/teams');
                let teamId;
                if (teamRoute.data.length === 0) {
                    const newTeam = await axios.post('/api/teams', { name: 'My Personal Workspace', description: 'Default workspace' });
                    teamId = newTeam.data._id;
                } else {
                    teamId = teamRoute.data[0]._id;
                }

                // 2. Fetch or create channel
                let channelRoute = await axios.get('/api/channels/' + teamId);
                let channelId;
                if (channelRoute.data.length === 0) {
                    const newChannel = await axios.post('/api/channels', { name: 'General', team: teamId });
                    channelId = newChannel.data._id;
                } else {
                    channelId = channelRoute.data[0]._id;
                }

                // 3. Fetch or create document
                let docRoute = await axios.get('/api/documents');
                let documentId;
                if (docRoute.data.length === 0) {
                    const newDoc = await axios.post('/api/documents', { title: 'Welcome Document', team: teamId });
                    documentId = newDoc.data._id;
                } else {
                    documentId = docRoute.data[0]._id;
                }

                setWorkspace({ documentId, channelId });
            } catch (err) {
                console.error("Workspace initialization error", err);
            } finally {
                setLoading(false);
            }
        };

        initializeWorkspace();
    }, [user]);

    if (loading || !workspace.documentId) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] flex gap-6 pb-2">
            {/* Editor Area */}
            <div className="flex-1 h-full min-w-0">
                <DocumentEditor documentId={workspace.documentId} />
            </div>

            {/* Side Panel Area (Chat) */}
            <div className="w-80 lg:w-96 hidden md:block shrink-0 h-full">
                <ChatPanel channelId={workspace.channelId} />
            </div>
        </div>
    );
};

export default Dashboard;
