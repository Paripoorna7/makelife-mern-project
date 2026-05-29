import React, { useState, useEffect } from 'react';
import { Heart, Users, Home, Mail, Phone, MapPin, Calendar, Gift, HandHeart, BookOpen, ChevronRight, Plus, Trash2 } from 'lucide-react';

const isValidUrl = (str) => {
  try { return str && (str.startsWith('http') || str.startsWith('/')); } catch { return false; }
};
const isEmoji = (str) => {
  if (!str) return false;
  const emojiRegex = /\p{Emoji}/u;
  return emojiRegex.test(str) && str.length <= 4;
};

const inputStyle = {
  width: '100%',
  padding: '1.2rem',
  fontSize: '1.05rem',
  border: '2px solid #e8d5c4',
  borderRadius: '15px',
  fontFamily: "'Crimson Pro', 'Georgia', serif",
  outline: 'none',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box'
};

const OrphanageWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [children, setChildren] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [donorName, setDonorName] = useState('');
  const [sponsorChildId, setSponsorChildId] = useState(null);
  const [sponsorChildName, setSponsorChildName] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [tempDonationAmount, setTempDonationAmount] = useState(0);

  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adoptChild, setAdoptChild] = useState(null);
  const [adoptSubmitting, setAdoptSubmitting] = useState(false);
  const [adoptSuccess, setAdoptSuccess] = useState(false);
  const [adoptForm, setAdoptForm] = useState({
    applicantName: '', address: '', annualIncome: '',
    familyMembers: '', phone: '', email: '', reason: ''
  });

  const [expandedChildren, setExpandedChildren] = useState({});

  useEffect(() => { fetchChildren(); fetchDonations(); }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {const response = await fetch('https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/children');
      const data = await response.json();
      setChildren(data);
    } catch (error) {
      setChildren([
        { _id: '1', name: 'Sarah', age: 8, story: 'Loves painting and dreams of becoming an artist', photo: '🎨' },
        { _id: '2', name: 'Michael', age: 10, story: 'Passionate about science and wants to be a doctor', photo: '🔬' },
        { _id: '3', name: 'Emma', age: 6, story: 'Enjoys reading and playing with friends', photo: '📚' },
        { _id: '4', name: 'David', age: 12, story: 'Talented musician learning to play the guitar', photo: '🎸' },
        { _id: '5', name: 'Sofia', age: 7, story: 'Loves animals and wants to be a veterinarian', photo: '🐾' },
        { _id: '6', name: 'James', age: 9, story: 'Enjoys sports and dreams of becoming an athlete', photo: '⚽' }
      ]);
    }
    setLoading(false);
  };

  const fetchDonations = async () => {
    try {
const response = await fetch('https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/donations');
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      setDonations([]);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const photoFile = formData.get('photo');
      if (!photoFile || photoFile.size === 0) { alert('Please select a photo'); return; }
      const uploadData = new FormData();
      uploadData.append('photo', photoFile);
      const uploadResponse = await fetch('https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/upload', { method: 'POST', body: uploadData });
      if (!uploadResponse.ok) throw new Error('Upload failed: ' + await uploadResponse.text());
      const uploadResult = await uploadResponse.json();
      if (!uploadResult.url) throw new Error('No URL returned from upload');
      const childData = { name: formData.get('name'), age: parseInt(formData.get('age')), story: formData.get('story'), photo: uploadResult.url };
    const response = await fetch('https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/children', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(childData) });
      if (!response.ok) throw new Error('Failed to save child: ' + await response.text());
      const newChild = await response.json();
      setChildren([...children, newChild]);
      setShowAddForm(false);
      e.target.reset();
      const preview = document.getElementById('photo-preview');
      if (preview) preview.style.display = 'none';
      alert('Child profile added successfully!');
    } catch (error) { alert('Error: ' + error.message); }
  };

  const deleteChild = async (id) => {
    if (!window.confirm('Are you sure you want to delete this child profile?')) return;
    try {
    await fetch(`https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/children/${id}`, { method: 'DELETE' });
      setChildren(children.filter(c => c._id !== id));
      alert('Child profile deleted successfully!');
    } catch (error) { alert('Failed to delete child.'); }
  };

  const handleDonation = (donationAmount) => { setTempDonationAmount(donationAmount); setShowDonationModal(true); };

  const handleSponsorChild = (child) => {
    const amount = prompt(`Enter sponsorship amount for ${child.name} (Rs.):`);
    if (amount && !isNaN(amount) && amount > 0) {
      setSponsorChildId(child._id); setSponsorChildName(child.name);
      setTempDonationAmount(parseFloat(amount)); setShowDonationModal(true);
    }
  };

  const submitDonation = async () => {
    if (!donorName.trim()) { alert('Please enter your name'); return; }
    try {
      const donationData = { donorName: donorName.trim(), amount: tempDonationAmount };
      if (sponsorChildId) { donationData.childId = sponsorChildId; donationData.childName = sponsorChildName; }
    const response = await fetch(
  'https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/donations',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(donationData)
  }
);
      if (response.ok) {
        alert(sponsorChildId ? `Thank you ${donorName} for sponsoring ${sponsorChildName}!` : `Thank you ${donorName} for your donation!`);
        setDonorName(''); setSponsorChildId(null); setSponsorChildName(''); setShowDonationModal(false); setTempDonationAmount(0);
        fetchDonations();
      }
    } catch (error) { alert('Failed to process donation.'); }
  };

  const handleAdoptClick = (child) => {
    setAdoptChild(child);
    setAdoptForm({ applicantName: '', address: '', annualIncome: '', familyMembers: '', phone: '', email: '', reason: '' });
    setAdoptSuccess(false);
    setShowAdoptModal(true);
  };

  const handleAdoptFormChange = (e) => {
    const { name, value } = e.target;
    setAdoptForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setAdoptSubmitting(true);
    try {
      const payload = {
        childId: adoptChild._id, childName: adoptChild.name,
        ...adoptForm,
        annualIncome: parseFloat(adoptForm.annualIncome),
        familyMembers: parseInt(adoptForm.familyMembers)
      };
const res = await fetch('https://5923d61f-7322-4393-a25c-ae99b910d170-00-1loycy3gk6sb.sisko.replit.dev/api/adoptions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Server error');
      setAdoptSuccess(true);
    } catch (err) { alert('Failed to submit: ' + err.message); }
    finally { setAdoptSubmitting(false); }
  };

  const closeAdoptModal = () => {
    setShowAdoptModal(false); setAdoptChild(null); setAdoptSuccess(false);
    setAdoptForm({ applicantName: '', address: '', annualIncome: '', familyMembers: '', phone: '', email: '', reason: '' });
  };

  const toggleChildDetails = (id) => setExpandedChildren(prev => ({ ...prev, [id]: !prev[id] }));

  const handleContactSubmit = (e) => { e.preventDefault(); alert('Message sent!'); e.target.reset(); };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fdf8f4 0%, #fef9f6 100%)', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>

      {/* Donation Modal */}
      {showDonationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '3px solid #f0e4d7', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#2c1810', textAlign: 'center' }}>
              {sponsorChildId ? `Sponsor ${sponsorChildName}` : 'Complete Your Donation'}
            </h3>
            {sponsorChildId && (
              <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '2px solid #ffc107', textAlign: 'center' }}>
                <strong>You are sponsoring {sponsorChildName}!</strong>
              </div>
            )}
            <p style={{ fontSize: '1.1rem', color: '#6b5446', marginBottom: '2rem', textAlign: 'center' }}>
              Amount: <strong style={{ color: '#d97757', fontSize: '1.5rem' }}>Rs. {tempDonationAmount}</strong>
            </p>
            <input type="text" placeholder="Enter your name" value={donorName} onChange={(e) => setDonorName(e.target.value)}
              style={{ ...inputStyle, marginBottom: '1.5rem' }}
              onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={submitDonation} style={{ flex: 1, background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Donate Now</button>
              <button onClick={() => { setShowDonationModal(false); setDonorName(''); setSponsorChildId(null); setSponsorChildName(''); setTempDonationAmount(0); }}
                style={{ background: 'white', color: '#d97757', border: '2px solid #d97757', padding: '1.3rem 2rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Adoption Modal */}
      {showAdoptModal && adoptChild && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '30px', boxShadow: '0 25px 80px rgba(0,0,0,0.35)', border: '3px solid #f0e4d7', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeInUp 0.3s ease-out' }}>
            {adoptSuccess ? (
              <div style={{ padding: '4rem 3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#2c1810', marginBottom: '1rem' }}>Application Submitted!</h3>
                <p style={{ fontSize: '1.15rem', color: '#6b5446', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Thank you <strong>{adoptForm.applicantName}</strong>! Your adoption application for <strong>{adoptChild.name}</strong> has been received. Our team will contact you within 7-10 business days.
                </p>
                <button onClick={closeAdoptModal} style={{ background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', padding: '2.5rem 3rem 2rem', borderRadius: '27px 27px 0 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏠</div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0 }}>Adopt {adoptChild.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.5rem', fontSize: '1.05rem', marginBottom: 0 }}>Fill in your details to apply for adoption</p>
                </div>
                <div style={{ padding: '2.5rem 3rem' }}>
                  <div style={{ background: '#fff8f4', border: '2px solid #f0d5c4', borderRadius: '15px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>
                      {isValidUrl(adoptChild.photo) ? <img src={adoptChild.photo} alt={adoptChild.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} /> : '👶'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#2c1810' }}>{adoptChild.name}, Age {adoptChild.age}</div>
                      <div style={{ fontSize: '0.95rem', color: '#8b6f5c' }}>{adoptChild.story}</div>
                    </div>
                  </div>
                  <form onSubmit={handleAdoptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Full Name *</label>
                      <input type="text" name="applicantName" placeholder="Your full legal name" value={adoptForm.applicantName} onChange={handleAdoptFormChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Home Address *</label>
                      <textarea name="address" placeholder="Your complete home address" value={adoptForm.address} onChange={handleAdoptFormChange} required rows="3" style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Annual Income (Rs.) *</label>
                        <input type="number" name="annualIncome" placeholder="e.g. 500000" value={adoptForm.annualIncome} onChange={handleAdoptFormChange} required min="0" style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Family Members *</label>
                        <input type="number" name="familyMembers" placeholder="e.g. 4" value={adoptForm.familyMembers} onChange={handleAdoptFormChange} required min="1" style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Phone Number *</label>
                        <input type="tel" name="phone" placeholder="+91 99999 99999" value={adoptForm.phone} onChange={handleAdoptFormChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Email Address *</label>
                        <input type="email" name="email" placeholder="your@email.com" value={adoptForm.email} onChange={handleAdoptFormChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#4a3428', marginBottom: '0.4rem' }}>Why do you want to adopt {adoptChild.name}? *</label>
                      <textarea name="reason" placeholder={`Tell us why you'd like to adopt ${adoptChild.name}...`} value={adoptForm.reason} onChange={handleAdoptFormChange} required rows="4" style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                    </div>
                    <div style={{ background: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: '12px', padding: '1rem 1.2rem', fontSize: '0.95rem', color: '#0369a1' }}>
                      Your application will be reviewed. We will contact you within 7-10 business days.
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" disabled={adoptSubmitting}
                        style={{ flex: 1, background: adoptSubmitting ? '#ccc' : 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: adoptSubmitting ? 'not-allowed' : 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>
                        {adoptSubmitting ? 'Submitting...' : '🏠 Submit Application'}
                      </button>
                      <button type="button" onClick={closeAdoptModal}
                        style={{ background: 'white', color: '#d97757', border: '2px solid #d97757', padding: '1.3rem 2rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Cancel</button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '2px solid #e8d5c4', padding: '1.5rem 0', zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Heart style={{ color: '#d97757', width: '48px', height: '48px' }} fill="#d97757" />
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#d97757', letterSpacing: '-0.02em' }}>MakeLife</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#8b6f5c', fontStyle: 'italic' }}>Nurturing Dreams, Building Futures</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {['Home', 'Children', 'About', 'Donate', 'Contact'].map(section => (
              <button key={section} onClick={() => setActiveSection(section.toLowerCase())}
                style={{ background: 'none', border: 'none', fontSize: '1.05rem', fontWeight: activeSection === section.toLowerCase() ? 700 : 500, color: activeSection === section.toLowerCase() ? '#d97757' : '#4a3428', cursor: 'pointer', padding: '0.5rem 0', borderBottom: activeSection === section.toLowerCase() ? '3px solid #d97757' : '3px solid transparent', transition: 'all 0.3s ease', fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                onMouseEnter={(e) => { e.target.style.color = '#d97757'; }}
                onMouseLeave={(e) => { if (activeSection !== section.toLowerCase()) e.target.style.color = '#4a3428'; }}
              >{section}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* HOME */}
      {activeSection === 'home' && (
        <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
          <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: '#2c1810', letterSpacing: '-0.03em' }}>
                Every Child Deserves a{' '}
                <span style={{ color: '#d97757', position: 'relative' }}>
                  Loving Home
                  <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '12px' }} viewBox="0 0 300 12">
                    <path d="M5,6 Q150,12 295,6" stroke="#f4a582" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
              <p style={{ fontSize: '1.35rem', lineHeight: 1.8, color: '#5a463a', marginBottom: '2.5rem' }}>At MakeLife, we provide a safe, nurturing environment where children can grow, learn, and thrive.</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                <button onClick={() => setActiveSection('donate')} style={{ background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.2rem 2.5rem', fontSize: '1.15rem', fontWeight: 700, borderRadius: '50px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(217,119,87,0.35)', fontFamily: "'Crimson Pro', 'Georgia', serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Make a Donation <Heart size={20} fill="white" /></button>
                <button onClick={() => setActiveSection('children')} style={{ background: 'white', color: '#d97757', border: '2px solid #d97757', padding: '1.2rem 2.5rem', fontSize: '1.15rem', fontWeight: 700, borderRadius: '50px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Meet Our Children <ChevronRight size={20} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.7)', borderRadius: '20px', border: '2px solid #f0e4d7' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97757' }}>{children.length}+</div><div style={{ color: '#6b5446' }}>Children Helped</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97757' }}>234</div><div style={{ color: '#6b5446' }}>Active Donors</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97757' }}>15</div><div style={{ color: '#6b5446' }}>Years of Service</div></div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', borderRadius: '30px', padding: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '3px solid #e8d5c4' }}>
              <div style={{ fontSize: '8rem', textAlign: 'center', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', color: '#2c1810', marginBottom: '1rem' }}>Building Families</h3>
              <p style={{ fontSize: '1.15rem', textAlign: 'center', color: '#5a463a', lineHeight: 1.7 }}>We believe every child deserves the warmth of a family, quality education, and the opportunity to pursue their dreams.</p>
            </div>
          </section>
          <section style={{ maxWidth: '1400px', margin: '4rem auto', padding: '0 2rem' }}>
            <h3 style={{ fontSize: '3rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', color: '#2c1810' }}>How We Make a Difference</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
              {[
                { icon: <Home size={48} />, title: 'Safe Housing', desc: 'Comfortable living spaces where children feel secure and loved' },
                { icon: <BookOpen size={48} />, title: 'Quality Education', desc: 'Access to excellent schools and learning resources for bright futures' },
                { icon: <Gift size={48} />, title: 'Healthcare', desc: 'Comprehensive medical care and mental health support' },
                { icon: <Users size={48} />, title: 'Community', desc: 'Strong bonds with peers, mentors, and caring staff members' },
                { icon: <HandHeart size={48} />, title: 'Life Skills', desc: 'Training programs that prepare children for independent living' },
                { icon: <Heart size={48} />, title: 'Emotional Support', desc: 'Professional counseling and nurturing relationships' }
              ].map((feature, idx) => (
                <div key={idx} style={{ background: 'white', padding: '2.5rem', borderRadius: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '2px solid #f0e4d7', transition: 'all 0.4s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(217,119,87,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)'; }}>
                  <div style={{ color: '#d97757', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', color: '#2c1810' }}>{feature.title}</h4>
                  <p style={{ fontSize: '1.05rem', color: '#6b5446', textAlign: 'center', lineHeight: 1.6 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* CHILDREN */}
      {activeSection === 'children' && (
        <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
          <section style={{ maxWidth: '1400px', margin: '4rem auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 700, color: '#2c1810', marginBottom: '0.5rem' }}>Meet Our Beautiful Children</h2>
                <p style={{ fontSize: '1.25rem', color: '#6b5446' }}>Each child has a unique story and dreams waiting to be realized.</p>
              </div>
              <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '50px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(217,119,87,0.35)', fontFamily: "'Crimson Pro', 'Georgia', serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} /> Add Child
              </button>
            </div>

            {showAddForm && (
              <div style={{ background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.12)', border: '3px solid #f0e4d7', marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#2c1810' }}>Add New Child Profile</h3>
                <form onSubmit={handleAddChild} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <input type="text" name="name" placeholder="Child's Name" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                    <input type="number" name="age" placeholder="Age" required min="1" max="18" style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '1.05rem', color: '#6b5446', fontWeight: 600 }}>Child's Photo (JPG/PNG)</label>
                    <input type="file" name="photo" accept=".jpg,.jpeg,.png" required style={{ padding: '1rem', fontSize: '1.05rem', border: '2px solid #e8d5c4', borderRadius: '15px', cursor: 'pointer', background: 'white' }}
                      onChange={(e) => { const file = e.target.files[0]; if (file) { const preview = document.getElementById('photo-preview'); preview.src = URL.createObjectURL(file); preview.style.display = 'block'; } }} />
                    <img id="photo-preview" style={{ display: 'none', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e8d5c4' }} alt="preview" />
                  </div>
                  <textarea name="story" placeholder="Child's Story" required rows="4" style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Add Child Profile</button>
                    <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'white', color: '#d97757', border: '2px solid #d97757', padding: '1.3rem 2rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.5rem', color: '#8b6f5c' }}>Loading children's profiles...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                {children.map((child) => (
                  <div key={child._id} style={{ background: 'white', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '3px solid #f0e4d7', transition: 'all 0.4s ease', position: 'relative' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(217,119,87,0.25)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'; }}>

                    <button onClick={() => deleteChild(child._id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.95)', border: '2px solid #e63946', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                      <Trash2 size={18} color="#e63946" />
                    </button>

                    <div style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '3px solid #e8d5c4', overflow: 'hidden' }}>
                      {isValidUrl(child.photo) ? (
                        <img src={child.photo} alt={child.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="font-size:6rem">👶</div>'; }} />
                      ) : isEmoji(child.photo) ? (
                        <div style={{ fontSize: '6rem' }}>{child.photo}</div>
                      ) : (
                        <div style={{ fontSize: '6rem' }}>👶</div>
                      )}
                    </div>

                    <div style={{ padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#2c1810' }}>{child.name}, {child.age}</h3>

                      {/* Expandable details — hidden by default */}
                      {expandedChildren[child._id] && (
                        <div style={{ animation: 'fadeIn 0.3s ease', marginBottom: '0.5rem' }}>
                          <p style={{ fontSize: '1.05rem', color: '#6b5446', lineHeight: 1.7, marginBottom: '0.8rem' }}>{child.story}</p>
                          {child.healthStatus && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#8b6f5c', marginBottom: '0.3rem', paddingBottom: '0.3rem', borderBottom: '1px solid #f0e4d7' }}><span style={{ fontWeight: 600 }}>Health</span><span>{child.healthStatus}</span></div>}
                          {child.educationLevel && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#8b6f5c', marginBottom: '0.3rem', paddingBottom: '0.3rem', borderBottom: '1px solid #f0e4d7' }}><span style={{ fontWeight: 600 }}>Education</span><span>{child.educationLevel}</span></div>}
                          {child.background && <div style={{ fontSize: '0.9rem', color: '#8b6f5c', marginTop: '0.3rem' }}><span style={{ fontWeight: 600 }}>Background: </span>{child.background}</div>}
                        </div>
                      )}

                      {/* Three buttons: View Profile | Sponsor | Adopt */}
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem' }}>
                        <button onClick={() => toggleChildDetails(child._id)}
                          style={{ flex: 1, background: '#f4e8de', color: '#4a3428', border: '2px solid #e8d5c4', padding: '0.75rem 0.4rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                          onMouseEnter={(e) => e.target.style.background = '#e8d5c4'}
                          onMouseLeave={(e) => e.target.style.background = '#f4e8de'}>
                          {expandedChildren[child._id] ? '🔼 Hide' : '👁 Profile'}
                        </button>
                        <button onClick={() => handleSponsorChild(child)}
                          style={{ flex: 1, background: '#d97757', color: 'white', border: 'none', padding: '0.75rem 0.4rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                          onMouseEnter={(e) => { e.target.style.background = '#c65d3f'; e.target.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.target.style.background = '#d97757'; e.target.style.transform = 'translateY(0)'; }}>
                          💝 Sponsor
                        </button>
                        <button onClick={() => handleAdoptClick(child)}
                          style={{ flex: 1, background: 'white', color: '#2a7d4f', border: '2px solid #2a7d4f', padding: '0.75rem 0.4rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                          onMouseEnter={(e) => { e.target.style.background = '#2a7d4f'; e.target.style.color = 'white'; e.target.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#2a7d4f'; e.target.style.transform = 'translateY(0)'; }}>
                          🏠 Adopt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ABOUT */}
      {activeSection === 'about' && (
        <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
          <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem', color: '#2c1810' }}>Our Story</h2>
            <div style={{ background: 'white', padding: '4rem', borderRadius: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.1)', border: '3px solid #f0e4d7', marginBottom: '3rem' }}>
              <p style={{ fontSize: '1.35rem', lineHeight: 2, color: '#5a463a', marginBottom: '2rem' }}>Founded in 2010, MakeLife has been a beacon of hope for children who have lost their parents or been abandoned.</p>
              <p style={{ fontSize: '1.35rem', lineHeight: 2, color: '#5a463a', marginBottom: '2rem' }}>Our mission is simple yet profound: to provide every child with a safe, loving environment where they can heal, grow, and discover their full potential.</p>
              <p style={{ fontSize: '1.35rem', lineHeight: 2, color: '#5a463a' }}>Through dedicated staff, generous donors, and community support, we have created more than just an orphanage — we have built a family.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
              {[
                { number: '15', label: 'Years of Service', icon: <Calendar size={40} /> },
                { number: `${children.length}+`, label: 'Children Helped', icon: <Users size={40} /> },
                { number: '25', label: 'Staff Members', icon: <HandHeart size={40} /> },
                { number: '95%', label: 'Success Rate', icon: <Heart size={40} /> }
              ].map((stat, idx) => (
                <div key={idx} style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', padding: '2.5rem 2rem', borderRadius: '20px', textAlign: 'center', border: '3px solid #e8d5c4' }}>
                  <div style={{ color: '#d97757', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97757', marginBottom: '0.5rem' }}>{stat.number}</div>
                  <div style={{ fontSize: '1rem', color: '#6b5446', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* DONATE */}
      {activeSection === 'donate' && (
        <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
          <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', color: '#2c1810' }}>Make a Difference Today</h2>
            <p style={{ fontSize: '1.25rem', textAlign: 'center', color: '#6b5446', marginBottom: '3rem' }}>Your generosity changes lives.</p>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.12)', border: '3px solid #f0e4d7', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', color: '#2c1810' }}>Choose Your Donation Amount</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[50, 100, 250, 500].map(amount => (
                  <button key={amount} onClick={() => handleDonation(amount)}
                    style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', border: '3px solid #d97757', padding: '2rem 1rem', borderRadius: '20px', fontSize: '2rem', fontWeight: 800, color: '#d97757', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                    onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)'; e.target.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)'; e.target.style.color = '#d97757'; }}>
                    RS. {amount}
                  </button>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', padding: '2rem', borderRadius: '20px', border: '2px solid #e8d5c4', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#2c1810' }}>Current Campaign Progress</h4>
                <div style={{ background: 'white', height: '30px', borderRadius: '15px', overflow: 'hidden', marginBottom: '1rem', border: '2px solid #d97757' }}>
                  <div style={{ background: 'linear-gradient(90deg, #d97757 0%, #f4a582 100%)', height: '100%', width: '70%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1rem', color: 'white', fontWeight: 700 }}>70%</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#6b5446', fontWeight: 600 }}>
                  <span>Rs. 35,000 raised</span><span>Goal: Rs. 50,000</span>
                </div>
              </div>
              <button onClick={() => { const a = prompt('Enter your donation amount:'); if (a && !isNaN(a) && a > 0) handleDonation(parseFloat(a)); }}
                style={{ width: '100%', background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.5rem', fontSize: '1.3rem', fontWeight: 700, borderRadius: '20px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                <Heart size={24} fill="white" /> Enter Custom Amount
              </button>
            </div>
          </section>
        </div>
      )}

      {/* CONTACT */}
      {activeSection === 'contact' && (
        <div style={{ animation: 'fadeIn 0.8s ease-in' }}>
          <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', color: '#2c1810' }}>Get in Touch</h2>
            <p style={{ fontSize: '1.25rem', textAlign: 'center', color: '#6b5446', marginBottom: '4rem' }}>Have questions? Want to volunteer? We would love to hear from you.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div style={{ background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.1)', border: '3px solid #f0e4d7' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#2c1810' }}>Send Us a Message</h3>
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input type="text" name="name" placeholder="Your Name" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  <input type="email" name="email" placeholder="Your Email" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  <input type="tel" name="phone" placeholder="Phone Number (Optional)" style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  <textarea name="message" placeholder="Your Message" required rows="5" style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#d97757'} onBlur={(e) => e.target.style.borderColor = '#e8d5c4'} />
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #d97757 0%, #c65d3f 100%)', color: 'white', border: 'none', padding: '1.3rem', fontSize: '1.2rem', fontWeight: 700, borderRadius: '15px', cursor: 'pointer', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>Send Message</button>
                </form>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '2px solid #f0e4d7' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#2c1810' }}>Contact Information</h3>
                  {[
                    { icon: <MapPin size={24} />, label: 'Address', value: '123 Hope Street, Compassion City' },
                    { icon: <Phone size={24} />, label: 'Phone', value: '+1 (555) 123-4567' },
                    { icon: <Mail size={24} />, label: 'Email', value: 'info@makelife.org' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ color: '#d97757', flexShrink: 0, marginTop: '0.2rem' }}>{item.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2c1810', marginBottom: '0.3rem' }}>{item.label}</div>
                        <div style={{ fontSize: '1.05rem', color: '#6b5446' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f4e8de 0%, #ead7c8 100%)', padding: '2.5rem', borderRadius: '25px', border: '3px solid #e8d5c4' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#2c1810' }}>Visit Us</h3>
                  <p style={{ fontSize: '1.05rem', color: '#6b5446', lineHeight: 1.7, marginBottom: '1rem' }}>We welcome visitors!</p>
                  <div style={{ fontSize: '1.05rem', color: '#6b5446', fontWeight: 600 }}>
                    <div>Monday - Friday: 9:00 AM - 5:00 PM</div>
                    <div>Saturday: 10:00 AM - 3:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: 'linear-gradient(135deg, #2c1810 0%, #4a3428 100%)', color: 'white', padding: '4rem 2rem 2rem', marginTop: '6rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Heart size={36} fill="white" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>MakeLife</h3>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#e8d5c4' }}>Transforming lives and building brighter futures for children in need.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Home', 'Children', 'About', 'Donate', 'Contact'].map(link => (
                <button key={link} onClick={() => setActiveSection(link.toLowerCase())} style={{ background: 'none', border: 'none', color: '#e8d5c4', fontSize: '1.05rem', cursor: 'pointer', textAlign: 'left', padding: '0.3rem 0', fontFamily: "'Crimson Pro', 'Georgia', serif" }}>{link}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Connect With Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Mail size={20} /><span style={{ fontSize: '1.05rem', color: '#e8d5c4' }}>info@makelife.org</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Phone size={20} /><span style={{ fontSize: '1.05rem', color: '#e8d5c4' }}>+1 (555) 123-4567</span></div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(232,213,196,0.3)', textAlign: 'center', fontSize: '1rem', color: '#e8d5c4' }}>
          2026 MakeLife Orphanage. All rights reserved. Built with love for the children.
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default OrphanageWebsite;
