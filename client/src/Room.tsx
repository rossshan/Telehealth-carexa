import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Check, LogOut, Share2 } from 'lucide-react';

const LIVEKIT_URL = 'wss://telehealth.staging.carexa.ai';

const Room: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = location.state || {};
    const [error, setError] = useState<Error | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    if (!token) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2 className="mb-4">No Token Found</h2>
                    <p className="text-muted mb-6">Please join through the proper flow.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
                    <h2 className="mb-4">Connection Failed</h2>
                    <p className="text-muted mb-6">{error.message}</p>
                    <div style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'left', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {/* <p style={{ fontSize: '0.875rem', margin: 0 }}>
                            <strong>Diagnostic Tip:</strong> Ensure the <code>LIVEKIT_URL</code> in <code>Room.tsx</code> is correct and that the <code>ApiKey</code> and <code>ApiSecret</code> in <code>appsettings.json</code> match your LiveKit server.
                        </p> */}
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
                </div>
            </div>
        );
    }

    const joinLink = `${window.location.origin}/join?room=${roomName}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(joinLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
            <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                zIndex: 100, 
                display: 'flex', 
                gap: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <button 
                    onClick={copyToClipboard}
                    style={{ 
                        background: copied ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? 'Copied!' : 'Copy Patient Link'}
                </button>
                <button 
                    onClick={() => navigate('/')}
                    style={{ 
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <LogOut size={16} /> End Meeting
                </button>
            </div>

            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={LIVEKIT_URL}
                data-lk-theme="default"
                onDisconnected={() => navigate('/')}
                onError={(err) => setError(err)}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
};

export default Room;
