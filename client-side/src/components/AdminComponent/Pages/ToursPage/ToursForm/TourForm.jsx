import React, { useState, useEffect } from 'react';
import { X, Save, Building2, Image, Calendar, Loader, Check } from 'lucide-react';
import axios from '../../../../../utils/axiosCustomize';
import { toast } from 'react-toastify';
import styles from './TourForm.module.scss';
import GeneralInfoTab from './GeneralInfoTab';
import GalleryTab from './GalleryTab';
import ItineraryTab from './ItineraryTab';

const TourForm = ({ tourId, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locations, setLocations] = useState([]);
  const [tourData, setTourData] = useState(null); // Store full tour data
  
  // Separate state for each tab
  const [formData, setFormData] = useState({
    tourName: '',
    tourCode: '',
    duration: '',
    transportation: '',
    startLocationId: '',
    endLocationId: '',
    attractions: '',
    meals: '',
    idealTime: '',
    tripTransportation: '',
    suitableCustomer: '',
    hotel: '',
    status: true
  });

  const [images, setImages] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [errors, setErrors] = useState({});

  // Track which tabs have been saved
  const [savedTabs, setSavedTabs] = useState({
    general: false,
    gallery: false,
    itinerary: false
  });

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (tourId && locations.length > 0) {
      loadTourData();
    }
  }, [tourId, locations]);

  const loadLocations = async () => {
    try {
      const response = await axios.get('/admin/tours/locations');
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Không thể tải danh sách địa điểm');
    }
  };

  const loadTourData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/tours/${tourId}`);
      if (response.data.success) {
        const tour = response.data.data;
        setTourData(tour);
        
        setFormData({
          tourName: tour.tourName || '',
          tourCode: tour.tourCode || '',
          duration: tour.duration || '',
          transportation: tour.transportation || '',
          startLocationId: tour.startLocationId ? String(tour.startLocationId) : '',
          endLocationId: tour.endLocationId ? String(tour.endLocationId) : '',
          attractions: tour.attractions || '',
          meals: tour.meals || '',
          idealTime: tour.idealTime || '',
          tripTransportation: tour.tripTransportation || '',
          suitableCustomer: tour.suitableCustomer || '',
          hotel: tour.hotel || '',
          status: tour.status ?? true
        });

        setImages(tour.images || []);
        setMediaList(tour.mediaList || []);
        setItineraryDays(tour.itineraryDays || []);

        // Mark all tabs as saved initially for edit mode
        setSavedTabs({
          general: true,
          gallery: true,
          itinerary: true
        });
      }
    } catch (error) {
      console.error('Error loading tour:', error);
      toast.error('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const validateGeneralInfo = () => {
    const newErrors = {};
    
    if (!formData.tourName.trim()) {
      newErrors.tourName = 'Tên tour không được để trống';
    }
    if (!formData.tourCode.trim()) {
      newErrors.tourCode = 'Mã tour không được để trống';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'Thời gian không được để trống';
    }
    if (!formData.transportation.trim()) {
      newErrors.transportation = 'Phương tiện không được để trống';
    }
    if (!formData.startLocationId) {
      newErrors.startLocationId = 'Vui lòng chọn điểm khởi hành';
    }
    if (!formData.endLocationId) {
      newErrors.endLocationId = 'Vui lòng chọn điểm đến';
    }
    if (!formData.attractions.trim()) {
      newErrors.attractions = 'Điểm tham quan không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save General Info Tab
  const handleSaveGeneralInfo = async () => {
    if (!validateGeneralInfo()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        startLocationId: Number(formData.startLocationId),
        endLocationId: Number(formData.endLocationId)
      };

      let response;
      if (tourId) {
        // Update existing tour - general info only
        response = await axios.put(`/admin/tours/${tourId}/general-info`, payload);
      } else {
        // Create new tour with general info only
        response = await axios.post('/admin/tours', {
          generalInfo: payload,
          images: [],
          mediaList: [],
          itineraryDays: []
        });
        
        // If this is a new tour, we need to update the tourId
        if (response.data.data && response.data.data.tourID) {
          // Update parent component or navigate to edit mode
          window.location.href = `/admin/tours/edit/${response.data.data.tourID}`;
          return;
        }
      }

      if (response.data.success) {
        toast.success('Lưu thông tin chung thành công!');
        setSavedTabs(prev => ({ ...prev, general: true }));
        
        // Reload tour data to get updated info
        if (tourId) {
          loadTourData();
        }
      }
    } catch (error) {
      console.error('Error saving general info:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Save Gallery Tab
  const handleSaveGallery = async () => {
    if (!tourId) {
      toast.warning('Vui lòng lưu thông tin chung trước!');
      setActiveTab('general');
      return;
    }

    setSaving(true);
    try {
      // Filter out empty images/media
      const validImages = images.filter(img => img.imageURL?.trim() || img.file);
      const validMedia = mediaList.filter(m => m.mediaUrl?.trim() || m.file);

      // Save images
      await axios.put(`/admin/tours/${tourId}/images`, validImages.map(img => ({
        imageURL: img.imageURL || '', // Will be updated after file upload
        isMainImage: img.isMainImage || false
      })));

      // Save media
      await axios.put(`/admin/tours/${tourId}/media`, validMedia.map(m => ({
        mediaUrl: m.mediaUrl || '', // Will be updated after file upload
        thumbnailUrl: m.thumbnailUrl || '',
        title: m.title || '',
        description: m.description || '',
        isPrimary: m.isPrimary || false
      })));

      toast.success('Lưu hình ảnh & media thành công!');
      setSavedTabs(prev => ({ ...prev, gallery: true }));
      
      // Reload tour data
      loadTourData();
    } catch (error) {
      console.error('Error saving gallery:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Save Itinerary Tab
  const handleSaveItinerary = async () => {
    if (!tourId) {
      toast.warning('Vui lòng lưu thông tin chung trước!');
      setActiveTab('general');
      return;
    }

    // Validate itinerary
    const validDays = itineraryDays.filter(day => {
      const plainText = day.details?.replace(/<[^>]*>/g, '').trim();
      return day.title?.trim() && day.meals?.trim() && plainText;
    });

    if (validDays.length === 0 && itineraryDays.length > 0) {
      toast.error('Vui lòng điền đầy đủ thông tin cho các ngày!');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/admin/tours/${tourId}/itinerary`, validDays);

      toast.success('Lưu lịch trình thành công!');
      setSavedTabs(prev => ({ ...prev, itinerary: true }));
      
      // Reload tour data
      loadTourData();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra!';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Get save handler based on active tab
  const getSaveHandler = () => {
    switch (activeTab) {
      case 'general':
        return handleSaveGeneralInfo;
      case 'gallery':
        return handleSaveGallery;
      case 'itinerary':
        return handleSaveItinerary;
      default:
        return null;
    }
  };

  const handleSaveCurrentTab = () => {
    const handler = getSaveHandler();
    if (handler) {
      handler();
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges = !savedTabs.general || !savedTabs.gallery || !savedTabs.itinerary;
    
    if (hasUnsavedChanges && tourId) {
      const confirm = window.confirm('Có thay đổi chưa được lưu. Bạn có chắc muốn đóng?');
      if (!confirm) return;
    }
    
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: Building2 },
    { id: 'gallery', label: 'Hình ảnh & Media', icon: Image },
    { id: 'itinerary', label: 'Lịch trình', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.loadingContainer}>
          <Loader className={styles.spinner} size={48} />
          <p>Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2>{tourId ? 'Chỉnh sửa Tour' : 'Tạo Tour Mới'}</h2>
            <p>{formData.tourCode || 'Chưa có mã tour'}</p>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isSaved = savedTabs[tab.id];
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <Icon size={20} />
                {tab.label}
                {isSaved && tourId && (
                  <Check size={16} className={styles.checkIcon} />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'general' && (
            <GeneralInfoTab
              formData={formData}
              setFormData={setFormData}
              locations={locations}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryTab
              images={images}
              setImages={setImages}
              mediaList={mediaList}
              setMediaList={setMediaList}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryTab
              itineraryDays={itineraryDays}
              setItineraryDays={setItineraryDays}
            />
          )}
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={handleClose}
            disabled={saving}
          >
            {tourId ? 'Đóng' : 'Hủy'}
          </button>
          <button
            type="button"
            className={styles.btnSubmit}
            onClick={handleSaveCurrentTab}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader className={styles.spinner} size={18} />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                {tourId ? `Lưu ${tabs.find(t => t.id === activeTab)?.label}` : 'Tạo tour'}
              </>
            )}
          </button>
        </div>

        {/* Save Status Indicator */}
        {tourId && (
          <div className={styles.saveStatus}>
            <p className={styles.saveStatusTitle}>Trạng thái lưu:</p>
            <div className={styles.saveStatusList}>
              {tabs.map(tab => (
                <div key={tab.id} className={styles.saveStatusItem}>
                  {savedTabs[tab.id] ? (
                    <Check size={16} className={styles.checkIconGreen} />
                  ) : (
                    <div className={styles.unsavedDot} />
                  )}
                  <span>{tab.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourForm;