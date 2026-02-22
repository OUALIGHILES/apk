'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuthStore } from '@/store/authStore';
import { addressesAPI, UserAddress } from '@/lib/api/extended';
import { MapPin, Home, Building, Plus, Trash2, Edit2, Star, Navigation, Check } from 'lucide-react';

export default function AddressesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    building_no: '',
    floor_no: '',
    appartment_no: '',
    address_type: 'home' as 'home' | 'work' | 'other',
    lat: '',
    lon: '',
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await addressesAPI.getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          lat: latitude.toString(),
          lon: longitude.toString(),
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            }));
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setFormData(prev => ({
            ...prev,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        }

        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        alert('Failed to get location. Please enter address manually.');
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleAddAddress = async () => {
    if (!user || !formData.address || !formData.lat || !formData.lon) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addressesAPI.addAddress({
        user_id: user.id,
        address: formData.address,
        lat: formData.lat,
        lon: formData.lon,
        building_no: formData.building_no,
        floor_no: formData.floor_no,
        appartment_no: formData.appartment_no,
        address_type: formData.address_type,
      });

      setShowAddForm(false);
      loadAddresses();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addressesAPI.updateAddress({
        id: editingAddress.id,
        address: formData.address,
        lat: formData.lat || editingAddress.lat,
        lon: formData.lon || editingAddress.lon,
        building_no: formData.building_no,
        floor_no: formData.floor_no,
        appartment_no: formData.appartment_no,
        address_type: formData.address_type,
      });

      setEditingAddress(null);
      setShowAddForm(false);
      loadAddresses();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await addressesAPI.deleteAddress(addressId);
      loadAddresses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetAsDefault = async (addressId: string) => {
    try {
      await addressesAPI.setAsDefault(addressId);
      loadAddresses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to set as default');
    }
  };

  const resetForm = () => {
    setFormData({
      address: '',
      building_no: '',
      floor_no: '',
      appartment_no: '',
      address_type: 'home',
      lat: '',
      lon: '',
    });
  };

  const openEditForm = (address: UserAddress) => {
    setEditingAddress(address);
    setFormData({
      address: address.address,
      building_no: address.building_no || '',
      floor_no: address.floor_no || '',
      appartment_no: address.appartment_no || '',
      address_type: (address.address_type as any) || 'home',
      lat: address.lat,
      lon: address.lon,
    });
    setShowAddForm(true);
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="page-root pb-24">
      <style>{css}</style>
      <Header title="My Addresses" />

      <main className="w-full">
        {/* Header Actions */}
        <section className="px-4 mt-4">
          <div className="page-header">
            <div>
              <h2 className="section-title">Saved Addresses</h2>
              <p className="section-sub">{addresses.length} address{addresses.length !== 1 ? 'es' : ''}</p>
            </div>
            <button onClick={() => { setShowAddForm(true); setEditingAddress(null); resetForm(); }} className="add-new-btn">
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </section>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <section className="px-4 mt-4">
            <div className="section-card">
              <h3 className="section-label-title">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>

              <div className="form-fields">
                <button
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="locate-btn"
                >
                  {gettingLocation ? (
                    <><div className="loader-sm" />Getting location...</>
                  ) : (
                    <><Navigation className="w-5 h-5" />📍 Use Current Location</>
                  )}
                </button>

                <div className="form-field">
                  <label className="field-label">Address *</label>
                  <div className="field-wrap">
                    <MapPin className="field-icon" />
                    <input
                      type="text"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-field">
                    <label className="field-label">Building</label>
                    <input
                      type="text"
                      placeholder="Bldg"
                      value={formData.building_no}
                      onChange={(e) => setFormData({ ...formData, building_no: e.target.value })}
                      className="field-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Floor</label>
                    <input
                      type="text"
                      placeholder="Floor"
                      value={formData.floor_no}
                      onChange={(e) => setFormData({ ...formData, floor_no: e.target.value })}
                      className="field-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Apt</label>
                    <input
                      type="text"
                      placeholder="Apt"
                      value={formData.appartment_no}
                      onChange={(e) => setFormData({ ...formData, appartment_no: e.target.value })}
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Address Type</label>
                  <div className="type-grid">
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, address_type: type })}
                        className={`type-btn ${formData.address_type === type ? 'type-active' : ''}`}
                      >
                        {type === 'home' && <Home className="w-5 h-5" />}
                        {type === 'work' && <Building className="w-5 h-5" />}
                        {type === 'other' && <MapPin className="w-5 h-5" />}
                        <span>{type}</span>
                        {formData.address_type === type && <span className="type-check"><Check className="w-3 h-3" /></span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={editingAddress ? handleUpdateAddress : handleAddAddress} className="save-btn-sm">
                    {editingAddress ? 'Update' : 'Save'} Address
                  </button>
                  <button onClick={() => { setShowAddForm(false); setEditingAddress(null); resetForm(); }} className="cancel-btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Addresses List */}
        <section className="px-4 mt-4 mb-6">
          {loading ? (
            <div className="loading-state">
              <div className="loader" />
              <p className="loading-text">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="empty-full">
              <div className="empty-icon-wrap">
                <MapPin className="w-10 h-10 empty-icon" />
              </div>
              <p className="empty-title">No Addresses Yet</p>
              <p className="empty-sub">Add your first delivery address</p>
              <button onClick={() => { setShowAddForm(true); setEditingAddress(null); resetForm(); }} className="pill-btn mt-6">
                Add Address
              </button>
            </div>
          ) : (
            <div className="addresses-list">
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-body">
                    <div className="address-header">
                      <div className="address-type-wrap">
                        {address.address_type === 'home' && <Home className="w-4 h-4" />}
                        {address.address_type === 'work' && <Building className="w-4 h-4" />}
                        {address.address_type === 'other' && <MapPin className="w-4 h-4" />}
                        <span className="address-type">{address.address_type}</span>
                      </div>
                      {address.is_default === '1' && (
                        <div className="default-badge">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Default</span>
                        </div>
                      )}
                    </div>
                    <p className="address-text">{address.address}</p>
                    {(address.building_no || address.floor_no || address.appartment_no) && (
                      <p className="address-details">
                        {[
                          address.building_no && `Bldg: ${address.building_no}`,
                          address.floor_no && `Floor: ${address.floor_no}`,
                          address.appartment_no && `Apt: ${address.appartment_no}`,
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    )}
                  </div>
                  <div className="address-actions">
                    {address.is_default !== '1' && (
                      <button onClick={() => handleSetAsDefault(address.id)} className="action-btn" title="Set as default">
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => openEditForm(address)} className="action-btn" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAddress(address.id)} className="action-btn delete" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #F7F6F2; --surface: #FFFFFF; --primary: #0A1628;
    --accent: #3D6FFF; --accent2: #FF5C3A; --green: #1DB87A;
    --muted: #8B8FA8; --border: #ECEDF2; --radius: 20px; --radius-sm: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .page-root { min-height: 100vh; background: var(--bg); }
  .loader { width: 40px; height: 40px; border: 3px solid rgba(61,111,255,.15); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  .loader-sm { width: 18px; height: 18px; border: 2px solid rgba(10,22,40,.2); border-top-color: var(--primary); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty State */
  .empty-full{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;padding:24px}
  .empty-icon-wrap{width:80px;height:80px;border-radius:24px;background:rgba(10,22,40,.06);display:flex;align-items:center;justify-content:center;margin-bottom:20px}
  .empty-icon{color:var(--muted)}
  .empty-title{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:6px}
  .empty-sub{font-size:13px;color:var(--muted)}
  .pill-btn{padding:12px 28px;background:var(--primary);color:#fff;border-radius:100px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;border:none;cursor:pointer}

  /* Loading State */
  .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; }
  .loading-text { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 16px; }

  /* Page Header */
  .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 4px; }
  .section-title { font-family: 'Sora',sans-serif; font-size: 18px; font-weight: 800; color: var(--primary); }
  .section-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .add-new-btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; background: var(--primary); color: #fff; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all .2s; }
  .add-new-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,22,40,.15); }

  /* Section Card */
  .section-card { background: var(--surface); border-radius: var(--radius); padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
  .section-label-title { display: flex; align-items: center; gap: 8px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 16px; }

  /* Form Fields */
  .form-fields { display: flex; flex-direction: column; gap: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); }
  .field-wrap { position: relative; }
  .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--muted); pointer-events: none; }
  .field-input { width: 100%; padding: 12px 14px 12px 44px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--primary); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color .15s; }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted); }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  /* Locate Button */
  .locate-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; background: rgba(61,111,255,.08); border: 1.5px dashed rgba(61,111,255,.3); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--accent); cursor: pointer; transition: all .2s; }
  .locate-btn:hover:not(:disabled) { background: rgba(61,111,255,.12); }
  .locate-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* Type Grid */
  .type-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .type-btn { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--bg); color: var(--muted); font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; text-transform: capitalize; }
  .type-btn:hover { border-color: rgba(61,111,255,.4); }
  .type-active { border-color: var(--accent); background: rgba(61,111,255,.08); color: var(--accent); }
  .type-check { position: absolute; top: 6px; right: 6px; width: 16px; height: 16px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }

  /* Form Actions */
  .form-actions { display: flex; gap: 10px; padding-top: 8px; }
  .save-btn-sm { flex: 1; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
  .save-btn-sm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,22,40,.15); }
  .cancel-btn-sm { flex: 1; padding: 12px; background: var(--surface); color: var(--muted); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
  .cancel-btn-sm:hover { background: var(--bg); }

  /* Addresses List */
  .addresses-list { display: flex; flex-direction: column; gap: 10px; }
  .address-card { display: flex; background: var(--surface); border-radius: var(--radius); padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); transition: all .2s; }
  .address-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .address-body { flex: 1; min-width: 0; }
  .address-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .address-type-wrap { display: flex; align-items: center; gap: 6px; }
  .address-type { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: var(--primary); text-transform: capitalize; }
  .default-badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(245,158,11,.08); border-radius: 100px; font-size: 11px; font-weight: 600; color: #b45309; }
  .address-text { font-size: 13px; color: var(--primary); margin-bottom: 6px; line-height: 1.4; }
  .address-details { font-size: 11px; color: var(--muted); }
  .address-actions { display: flex; flex-direction: column; gap: 6px; margin-left: 12px; }
  .action-btn { width: 32px; height: 32px; border-radius: 9px; background: var(--bg); color: var(--muted); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all .2s; }
  .action-btn:hover { background: rgba(10,22,40,.1); color: var(--primary); }
  .action-btn.delete:hover { background: rgba(255,92,58,.1); color: var(--accent2); }
`;
