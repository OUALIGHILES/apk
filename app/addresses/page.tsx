'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { addressesAPI, UserAddress } from '@/lib/api/extended';
import { MapPin, Home, Building, Plus, Trash2, Edit2, Star, Navigation } from 'lucide-react';

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

        // Try to get address from coordinates
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
    <div className="min-h-screen bg-screenback pb-20">
      <Header title="My Addresses" />

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Add Address Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary">Saved Addresses</h2>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingAddress(null);
              resetForm();
            }}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </Button>
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <Card className="mb-4">
            <h3 className="font-bold text-primary mb-3">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>

            <div className="space-y-3">
              <button
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-primary/30 rounded-lg text-button hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {gettingLocation ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Getting location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    <span>📍 Use Current Location</span>
                  </>
                )}
              </button>

              <Input
                label="Address *"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                icon={<MapPin className="w-5 h-5" />}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Building No"
                  placeholder="Bldg"
                  value={formData.building_no}
                  onChange={(e) => setFormData({ ...formData, building_no: e.target.value })}
                />
                <Input
                  label="Floor"
                  placeholder="Floor"
                  value={formData.floor_no}
                  onChange={(e) => setFormData({ ...formData, floor_no: e.target.value })}
                />
                <Input
                  label="Apt No"
                  placeholder="Apt"
                  value={formData.appartment_no}
                  onChange={(e) => setFormData({ ...formData, appartment_no: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-2 block">Address Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, address_type: type })}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                        formData.address_type === type
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      {type === 'home' && <Home className="w-5 h-5 mx-auto mb-1" />}
                      {type === 'work' && <Building className="w-5 h-5 mx-auto mb-1" />}
                      {type === 'other' && <MapPin className="w-5 h-5 mx-auto mb-1" />}
                      <span className="text-sm font-medium">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <Button
                  onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                  className="flex-1"
                  loading={gettingLocation}
                >
                  {editingAddress ? 'Update' : 'Save'} Address
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-greyunselect mt-2">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <Card className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-greyunselect/30 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No Addresses Yet</h3>
            <p className="text-greyunselect mb-6">Add your first delivery address</p>
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingAddress(null);
                resetForm();
              }}
            >
              Add Address
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card key={address.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {address.address_type === 'home' && <Home className="w-4 h-4 text-primary" />}
                      {address.address_type === 'work' && <Building className="w-4 h-4 text-primary" />}
                      {address.address_type === 'other' && <MapPin className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium text-primary capitalize">
                        {address.address_type}
                      </span>
                      {address.is_default === '1' && (
                        <span className="flex items-center text-xs text-yellow-600">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-greyunselect mb-2">{address.address}</p>
                    {(address.building_no || address.floor_no || address.appartment_no) && (
                      <p className="text-xs text-greyunselect">
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
                  <div className="flex space-x-2">
                    {address.is_default !== '1' && (
                      <button
                        onClick={() => handleSetAsDefault(address.id)}
                        className="p-2 text-greyunselect hover:text-yellow-600"
                        title="Set as default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(address)}
                      className="p-2 text-greyunselect hover:text-button"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-greyunselect hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
