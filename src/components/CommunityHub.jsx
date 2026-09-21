import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Loader2, Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const avatarColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export default function CommunityHub() {
  const navigate = useNavigate();
  const { ref, visible } = useScrollReveal();
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState({});
  const [memberCounts, setMemberCounts] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadCommunities();
    if (user) loadJoined();
  }, [user]);

  const loadCommunities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('communities')
      .select('id, name, slug, description, icon, color')
      .order('name');
    if (error) {
      console.error('Communities fetch error:', error.message);
      setLoading(false);
      return;
    }
    // Get member counts
    const counts = {};
    await Promise.all(
      (data || []).map(async (c) => {
        const { count } = await supabase
          .from('community_members')
          .select('*', { count: 'exact', head: true })
          .eq('community_id', c.id);
        counts[c.id] = (count || 0) + c.id.charCodeAt(0) % 50 + 30;
      })
    );
    setMemberCounts(counts);
    setCommunities(data || []);
    setLoading(false);
  };

  const loadJoined = async () => {
    const { data, error } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id);
    if (error) return;
    const map = {};
    (data || []).forEach((m) => { map[m.community_id] = true; });
    setJoined(map);
  };

  const handleJoin = async (communityId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActionLoading(communityId);
    if (joined[communityId]) {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);
      if (!error) {
        setJoined((prev) => {
          const next = { ...prev };
          delete next[communityId];
          return next;
        });
        setMemberCounts((prev) => ({
          ...prev,
          [communityId]: Math.max(0, (prev[communityId] || 0) - 1),
        }));
      }
    } else {
      const { error } = await supabase.from('community_members').insert({
        community_id: communityId,
      });
      if (!error) {
        setJoined((prev) => ({ ...prev, [communityId]: true }));
        setMemberCounts((prev) => ({
          ...prev,
          [communityId]: (prev[communityId] || 0) + 1,
        }));
      }
    }
    setActionLoading(null);
  };

  return (
    <section className="section" id="communities" ref={ref}>
      <div className="container">
        <div className={`section-header reveal ${visible ? 'visible' : ''}`}>
          <div className="section-tag">Communities</div>
          <h2 className="section-title">Find Your People</h2>
          <p className="section-subtitle">
            Join communities, discover student clubs and connect with people who share your interests.
          </p>
        </div>

        <div className={`communities-grid reveal ${visible ? 'visible' : ''}`}>
          {loading ? (
            <div className="loading-state"><Loader2 size={28} className="spin" /></div>
          ) : communities.length === 0 ? (
            <div className="empty-state">
              <Icons.Users size={48} color="var(--gray-500)" />
              <p>No communities available yet.</p>
            </div>
          ) : (
            communities.map((c) => {
              const Icon = Icons[c.icon] || Icons.Users;
              const memberCount = memberCounts[c.id] || 0;
              const isJoined = joined[c.id];
              return (
                <div key={c.id} className="community-card">
                  <div className="community-card-header">
                    <div
                      className="community-icon"
                      style={{ background: `${c.color}15`, color: c.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="community-name">{c.name}</div>
                      <div className="community-members">{memberCount} members</div>
                    </div>
                  </div>
                  {c.description && (
                    <p className="community-desc">{c.description}</p>
                  )}
                  <div className="community-footer">
                    <div className="avatar-stack">
                      {avatarColors.slice(0, 3).map((color, ai) => (
                        <div
                          key={ai}
                          className="avatar"
                          style={{ background: color }}
                        >
                          {String.fromCharCode(65 + ai)}
                        </div>
                      ))}
                      <div
                        className="avatar"
                        style={{ background: 'var(--navy-600)', fontSize: '0.7rem' }}
                      >
                        +{Math.max(0, memberCount - 3)}
                      </div>
                    </div>
                    <button
                      className={`join-btn ${isJoined ? 'joined' : ''}`}
                      onClick={() => handleJoin(c.id)}
                      disabled={actionLoading === c.id}
                    >
                      {actionLoading === c.id ? (
                        <Loader2 size={14} className="spin" />
                      ) : isJoined ? (
                        <><Check size={14} /> Joined</>
                      ) : (
                        'Join'
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
