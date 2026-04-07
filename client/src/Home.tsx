import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Video, Plus, User, Stethoscope } from 'lucide-react';

const API_URL = 'http://localhost:5062';

const Home: React.FC = () => {
    const [name, setName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/token/provider`, {
                name: name || 'Dr. Smith',
                roomName: roomName || "provider"
            });
            const { token, roomName: finalRoomName } = response.data;
            
            navigate(`/room/${finalRoomName}`, { state: { token } });
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create meeting room. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="hero-section fade-in">
                <div className="badge flex items-center gap-2">
                    <Stethoscope size={14} /> Telehealth MVP
                </div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                    Virtual Consultations, <br />
                    <span style={{ color: 'var(--accent)' }}>Simplified.</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
                    Start a secure, 1:1 video consultation with your patient in seconds. No complex setup, no software to install.
                </p>

                <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Provider Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    className="input-field" 
                                    style={{ paddingLeft: '2.75rem' }}
                                    placeholder="e.g. Dr. Jane Smith" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Consultation ID (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <Plus size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    className="input-field" 
                                    style={{ paddingLeft: '2.75rem' }}
                                    placeholder="e.g. consult-1234" 
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', height: '3.2rem', fontSize: '1rem' }}>
                            {loading ? 'Starting...' : <> <Video size={20} /> Start Consultation </>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
