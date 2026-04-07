import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { User, LogIn, Stethoscope } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;;

const Join: React.FC = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const roomName = searchParams.get('room');

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName) return;
        
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/token/patient`, {
                name: name || 'Patient',
                roomName: roomName
            });
            const { token } = response.data;
            
            navigate(`/room/${roomName}`, { state: { token } });
        } catch (error) {
            console.error('Error joining room:', error);
            alert('Failed to join meeting. Please check the link.');
        } finally {
            setLoading(false);
        }
    };

    if (!roomName) {
        return (
            <div className="container">
                <div className="hero-section">
                    <h2 className="mb-4">Invalid Meeting Link</h2>
                    <p className="text-muted">Please ask your provider for a new invitation link.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="hero-section fade-in">
                <div className="badge flex items-center gap-2">
                    <Stethoscope size={14} /> Telehealth MVP
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                    Join Your <span style={{ color: 'var(--accent)' }}>Virtual Consultation</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
                    You're about to join a secure meeting with your provider. Enter your name below to continue.
                </p>

                <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Your Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    className="input-field" 
                                    style={{ paddingLeft: '2.75rem' }}
                                    placeholder="e.g. John Doe" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', height: '3.2rem', fontSize: '1rem' }}>
                            {loading ? 'Connecting...' : <><LogIn size={20} /> Join Meeting</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Join;
