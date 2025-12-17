import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Plane, Save, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from '../../../../../utils/axiosCustomize';
import { toast } from 'react-toastify';
import styles from './DepartureFormModal.module.scss';

const DepartureFormModal = ({ departure, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [policies, setPolicies] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    tourId: '',
    departureDate: '',
    availableSlots: '',
    status: true,
    tourGuideInfo: '',
    policyTemplateId: '',
    couponCode: ''
  });

  const [pricings, setPricings] = useState([
    { passengerType: 'Người lớn', ageDescription: 'Từ 12 tuổi', originalPrice: '', salePrice: '' },
    { passengerType: 'Trẻ em', ageDescription: 'Từ 5-11 tuổi', originalPrice: '', salePrice: '' },
    { passengerType: 'Trẻ nhỏ', ageDescription: 'Dưới 5 tuổi', originalPrice: '', salePrice: '' }
  ]);

  const [outboundTransport, setOutboundTransport] = useState({
    transportCode: '',
    vehicleName: '',
    startPoint: '',
    endPoint: '',
    departTime: '',
    arrivalTime: ''
  });

  const [inboundTransport, setInboundTransport] = useState({
    transportCode: '',
    vehicleName: '',
    startPoint: '',
    endPoint: '',
    departTime: '',
    arrivalTime: ''
  });

  useEffect(() => {
    fetchTours();
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (departure) {
      console.log('Filling form with departure data:', departure);
      
      // Fill basic info
      setFormData({
        tourId: departure.tourId || '',
        departureDate: departure.departureDate ? departure.departureDate.split('T')[0] : '',
        availableSlots: departure.availableSlots || '',
        status: departure.status !== undefined ? departure.status : true,
        tourGuideInfo: departure.tourGuideInfo || '',
        policyTemplateId: departure.policyTemplateId || '',
        couponCode: departure.couponCode || ''
      });

      // Fill pricings - merge with existing passenger types
      if (departure.pricings && departure.pricings.length > 0) {
        const defaultPricings = [
          { passengerType: 'Người lớn', ageDescription: 'Từ 12 tuổi', originalPrice: '', salePrice: '' },
          { passengerType: 'Trẻ em', ageDescription: 'Từ 5-11 tuổi', originalPrice: '', salePrice: '' },
          { passengerType: 'Trẻ nhỏ', ageDescription: 'Dưới 5 tuổi', originalPrice: '', salePrice: '' }
        ];

        const mergedPricings = defaultPricings.map(defaultPricing => {
          const existingPricing = departure.pricings.find(
            p => p.passengerType === defaultPricing.passengerType
          );
          
          if (existingPricing) {
            return {
              passengerType: existingPricing.passengerType,
              ageDescription: existingPricing.ageDescription || defaultPricing.ageDescription,
              originalPrice: existingPricing.originalPrice || '',
              salePrice: existingPricing.salePrice || ''
            };
          }
          
          return defaultPricing;
        });

        setPricings(mergedPricings);
      }

      // Fill outbound transport
      if (departure.outboundTransport) {
        setOutboundTransport({
          transportCode: departure.outboundTransport.transportCode || '',
          vehicleName: departure.outboundTransport.vehicleName || '',
          startPoint: departure.outboundTransport.startPoint || '',
          endPoint: departure.outboundTransport.endPoint || '',
          departTime: departure.outboundTransport.departTime ? departure.outboundTransport.departTime.slice(0, 16) : '',
          arrivalTime: departure.outboundTransport.arrivalTime ? departure.outboundTransport.arrivalTime.slice(0, 16) : ''
        });
      }

      // Fill inbound transport
      if (departure.inboundTransport) {
        setInboundTransport({
          transportCode: departure.inboundTransport.transportCode || '',
          vehicleName: departure.inboundTransport.vehicleName || '',
          startPoint: departure.inboundTransport.startPoint || '',
          endPoint: departure.inboundTransport.endPoint || '',
          departTime: departure.inboundTransport.departTime ? departure.inboundTransport.departTime.slice(0, 16) : '',
          arrivalTime: departure.inboundTransport.arrivalTime ? departure.inboundTransport.arrivalTime.slice(0, 16) : ''
        });
      }
    }
  }, [departure]);

  const fetchTours = async () => {
    try {
      const response = await axios.get('/admin/tours');
      if (response.data.success) {
        setTours(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Không thể tải danh sách tour');
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('/admin/policy-templates');
      console.log('Policy Template', response.data);
      setPolicies(response.data.content || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Không thể tải danh sách chính sách');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate pricing
      const validPricings = pricings.filter(p => p.originalPrice && p.salePrice);
      for (const pricing of validPricings) {
        if (parseFloat(pricing.salePrice) > parseFloat(pricing.originalPrice)) {
          toast.error(`Giá bán của ${pricing.passengerType} không được lớn hơn giá gốc!`);
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        pricings: validPricings,
        outboundTransport: outboundTransport.transportCode ? outboundTransport : null,
        inboundTransport: inboundTransport.transportCode ? inboundTransport : null
      };

      console.log('Submitting payload:', payload);

      let response;
      if (departure) {
        response = await axios.put(`/admin/departures/${departure.departureID}`, payload);
      } else {
        response = await axios.post('/admin/departures', payload);
      }

      if (response.data.success) {
        toast.success(departure ? 'Cập nhật lịch khởi hành thành công!' : 'Tạo lịch khởi hành thành công!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (index, field, value) => {
    const newPricings = [...pricings];
    newPricings[index][field] = value;
    setPricings(newPricings);
  };

  const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || originalPrice === 0) return { amount: 0, percent: 0 };
    const amount = originalPrice - (salePrice || 0);
    const percent = ((amount / originalPrice) * 100).toFixed(1);
    return { amount, percent };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const goToTab = (direction) => {
    const tabs = ['basic', 'pricing', 'transport'];
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      setActiveTab(tabs[newIndex]);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>{departure ? 'Chỉnh Sửa Lịch Khởi Hành' : 'Tạo Lịch Khởi Hành Mới'}</h2>
            <p className={styles.subtitle}>
              {departure ? `ID: ${departure.departureID} - Cập nhật thông tin cho từng tab` : 'Điền đầy đủ thông tin cho lịch khởi hành'}
            </p>
          </div>
          <button onClick={onClose} className={styles.btnClose} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id: 'basic', label: 'Thông tin cơ bản', icon: Info },
            { id: 'pricing', label: 'Bảng giá', icon: DollarSign },
            { id: 'transport', label: 'Vận chuyển', icon: Plane }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.content}>
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className={styles.tabContent}>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>
                      Tour <span className={styles.required}>*</span>
                    </label>
                    <select
                      value={formData.tourId}
                      onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                      required
                    >
                      <option value="">-- Chọn tour --</option>
                      {tours.map(tour => (
                        <option key={tour.tourId} value={tour.tourId}>
                          {tour.tourCode} - {tour.tourName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Ngày khởi hành <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Số chỗ trống <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.availableSlots}
                      onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                      required
                      min="1"
                      placeholder="Nhập số chỗ"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Chính sách</label>
                    <select
                      value={formData.policyTemplateId}
                      onChange={(e) => setFormData({ ...formData, policyTemplateId: e.target.value })}
                    >
                      <option value="">-- Chọn chính sách --</option>
                      {policies.map(policy => (
                        <option key={policy.policyTemplateID} value={policy.policyTemplateID}>
                          {policy.templateName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Mã giảm giá</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    placeholder="Nhập mã giảm giá (nếu có)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Thông tin hướng dẫn viên</label>
                  <textarea
                    value={formData.tourGuideInfo}
                    onChange={(e) => setFormData({ ...formData, tourGuideInfo: e.target.value })}
                    rows={4}
                    placeholder="Thông tin về hướng dẫn viên..."
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <label htmlFor="status">Kích hoạt lịch khởi hành này</label>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className={styles.tabContent}>
                <div className={styles.alert}>
                  <strong>Lưu ý:</strong> Giá bán phải nhỏ hơn hoặc bằng giá gốc
                </div>

                <div className={styles.pricingList}>
                  {pricings.map((pricing, index) => {
                    const discount = calculateDiscount(pricing.originalPrice, pricing.salePrice);
                    const isValid = !pricing.salePrice || !pricing.originalPrice || 
                                    parseFloat(pricing.salePrice) <= parseFloat(pricing.originalPrice);
                    
                    return (
                      <div key={index} className={styles.pricingCard}>
                        <div className={styles.pricingHeader}>
                          <h4>{pricing.passengerType}</h4>
                          <p>{pricing.ageDescription}</p>
                        </div>

                        <div className={styles.grid2}>
                          <div className={styles.formGroup}>
                            <label>Giá gốc (VNĐ)</label>
                            <input
                              type="number"
                              value={pricing.originalPrice}
                              onChange={(e) => handlePricingChange(index, 'originalPrice', e.target.value)}
                              placeholder="0"
                              min="0"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label>Giá bán (VNĐ)</label>
                            <input
                              type="number"
                              value={pricing.salePrice}
                              onChange={(e) => handlePricingChange(index, 'salePrice', e.target.value)}
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        </div>

                        {pricing.originalPrice && pricing.salePrice && (
                          <div className={`${styles.discountInfo} ${isValid ? styles.valid : styles.invalid}`}>
                            {isValid ? (
                              <>
                                Giảm: {formatPrice(discount.amount)} VNĐ ({discount.percent}%)
                              </>
                            ) : (
                              'Giá bán không được lớn hơn giá gốc!'
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Transport Tab */}
            {activeTab === 'transport' && (
              <div className={styles.tabContent}>
                {/* Outbound */}
                <div className={styles.transportSection}>
                  <div className={styles.transportHeader}>
                    <Plane size={20} className={styles.iconOutbound} />
                    <h3>Vận chuyển chiều đi</h3>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label>Mã chuyến</label>
                      <input
                        type="text"
                        value={outboundTransport.transportCode}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, transportCode: e.target.value })}
                        placeholder="VD: VN123"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tên phương tiện</label>
                      <input
                        type="text"
                        value={outboundTransport.vehicleName}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, vehicleName: e.target.value })}
                        placeholder="VD: Máy bay Boeing 787"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Điểm đi</label>
                      <input
                        type="text"
                        value={outboundTransport.startPoint}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, startPoint: e.target.value })}
                        placeholder="VD: Sân bay Nội Bài"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Điểm đến</label>
                      <input
                        type="text"
                        value={outboundTransport.endPoint}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, endPoint: e.target.value })}
                        placeholder="VD: Sân bay Đà Nẵng"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời gian khởi hành</label>
                      <input
                        type="datetime-local"
                        value={outboundTransport.departTime}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, departTime: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời gian đến</label>
                      <input
                        type="datetime-local"
                        value={outboundTransport.arrivalTime}
                        onChange={(e) => setOutboundTransport({ ...outboundTransport, arrivalTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Inbound */}
                <div className={styles.transportSection}>
                  <div className={styles.transportHeader}>
                    <Plane size={20} className={styles.iconInbound} />
                    <h3>Vận chuyển chiều về</h3>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.formGroup}>
                      <label>Mã chuyến</label>
                      <input
                        type="text"
                        value={inboundTransport.transportCode}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, transportCode: e.target.value })}
                        placeholder="VD: VN456"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tên phương tiện</label>
                      <input
                        type="text"
                        value={inboundTransport.vehicleName}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, vehicleName: e.target.value })}
                        placeholder="VD: Máy bay Boeing 787"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Điểm đi</label>
                      <input
                        type="text"
                        value={inboundTransport.startPoint}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, startPoint: e.target.value })}
                        placeholder="VD: Sân bay Đà Nẵng"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Điểm đến</label>
                      <input
                        type="text"
                        value={inboundTransport.endPoint}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, endPoint: e.target.value })}
                        placeholder="VD: Sân bay Nội Bài"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời gian khởi hành</label>
                      <input
                        type="datetime-local"
                        value={inboundTransport.departTime}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, departTime: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời gian đến</label>
                      <input
                        type="datetime-local"
                        value={inboundTransport.arrivalTime}
                        onChange={(e) => setInboundTransport({ ...inboundTransport, arrivalTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.navButtons}>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => goToTab('prev')}
                  className={styles.btnNav}
                >
                  <ChevronLeft size={18} />
                  Quay lại
                </button>
              )}
              
              {activeTab !== 'transport' && (
                <button
                  type="button"
                  onClick={() => goToTab('next')}
                  className={styles.btnNav}
                >
                  Tiếp theo
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={styles.btnCancel}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.btnSubmit}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner} />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {departure ? 'Cập nhật' : 'Tạo mới'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartureFormModal;