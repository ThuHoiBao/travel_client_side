import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Eye, Edit2, Copy, Trash2, 
  ChevronLeft, ChevronRight, Plane, Users, DollarSign, MapPin 
} from 'lucide-react';
import axios from '../../../../utils/axiosCustomize';
import { toast } from 'react-toastify';
import styles from './DepartureList.module.scss';
import DepartureFormModal from './DepartureModal/DepartureFormModal';
import DepartureDetailModal from './DepartureModal/DepartureDetailModal';
import CloneModal from './CloneModal/CloneModal'

const DepartureList = () => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [locations, setLocations] = useState([]);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeparture, setSelectedDeparture] = useState(null);

  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [idToClone, setIdToClone] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalSlots: 0,
    bookedSlots: 0
  });

   useEffect(() => {
      loadLocations();
    }, []);

     const loadLocations = async () => {
    try {
      const response = await axios.get('/admin/locations/national');
      if (response.data.content) {
        setLocations(response.data.content);
      }
      console.log(response.data.content);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Không thể tải danh sách địa điểm');
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, [currentPage, statusFilter]);

  const fetchDepartures = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: 'departureDate',
        sortDirection: 'ASC'
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active';
      }

      const response = await axios.get('/admin/departures', { params });

      if (response.data.success) {
        setDepartures(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);

        // Calculate stats
        const data = response.data.data;
        setStats({
          total: data.length,
          active: data.filter(d => d.status).length,
          totalSlots: data.reduce((sum, d) => sum + (d.availableSlots || 0), 0),
          bookedSlots: data.reduce((sum, d) => sum + (d.bookedSlots || 0), 0)
        });
      }
    } catch (error) {
      console.error('Error fetching departures:', error);
      toast.error('Không thể tải danh sách lịch khởi hành');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartureDetail = async (departureId) => {
    try {
      const response = await axios.get(`/admin/departures/${departureId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching departure detail:', error);
      toast.error('Không thể tải chi tiết lịch khởi hành');
      return null;
    }
  };

  const handleDelete = async (departureId) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch khởi hành này?')) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/departures/${departureId}`);
      
      if (response.data.success) {
        toast.success('Xóa lịch khởi hành thành công!');
        fetchDepartures();
      }
    } catch (error) {
      console.error('Error deleting departure:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa lịch khởi hành');
    }
  };

  const handleClone = async (departureId) => {
    setIdToClone(departureId);
    setShowCloneModal(true);
  };

  const handleCloneSubmit = async (newDate) => {
    if (!idToClone || !newDate) return;
    
    setCloneLoading(true);
    try {
      const response = await axios.post(`/admin/departures/${idToClone}/clone`, null, {
        params: { newDepartureDate: newDate }
      });

      if (response.data.success) {
        toast.success('Sao chép lịch khởi hành thành công!');
        setShowCloneModal(false);
        setIdToClone(null);
        fetchDepartures();
      }
    } catch (error) {
      console.error('Error cloning departure:', error);
      const msg = error.response?.data?.message || 'Không thể sao chép lịch khởi hành';
      toast.error(msg);
    } finally {
      setCloneLoading(false);
    }
  };

  const handleEdit = async (departure) => {
    // Fetch full departure details before opening modal
    const fullDeparture = await fetchDepartureDetail(departure.departureID);
    if (fullDeparture) {
      console.log('Opening edit modal with data:', fullDeparture);
      setSelectedDeparture(fullDeparture);
      setShowFormModal(true);
    }
  };

  const handleViewDetail = (departure) => {
    setSelectedDeparture(departure);
    setShowDetailModal(true);
  };

  const handleCreateNew = () => {
    setSelectedDeparture(null);
    setShowFormModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const filteredDepartures = departures.filter(dep =>
    dep.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.tourCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>
            <Calendar size={32} />
            Quản Lý Lịch Khởi Hành
          </h1>
          <p>Quản lý toàn bộ lịch khởi hành tour du lịch</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleCreateNew}>
          <Plus size={20} />
          Tạo Lịch Khởi Hành
        </button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
            <Calendar size={24} style={{ color: '#3b82f6' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Tổng lịch khởi hành</span>
            <span className={styles.statValue}>{totalItems}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#d1fae5' }}>
            <Users size={24} style={{ color: '#10b981' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Đang hoạt động</span>
            <span className={styles.statValue}>{stats.active}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe' }}>
            <MapPin size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Tổng chỗ trống</span>
            <span className={styles.statValue}>{stats.totalSlots}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fed7aa' }}>
            <DollarSign size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Đã đặt</span>
            <span className={styles.statValue}>{stats.bookedSlots}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên tour, mã tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(0);
          }}
          className={styles.filterSelect}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tour</th>
                  <th>Ngày khởi hành</th>
                  <th>Chỗ trống</th>
                  <th>Giá từ</th>
                  <th>Vận chuyển</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartures.map((departure) => (
                  <tr key={departure.departureID}>
                    <td>
                      <div className={styles.tourInfo}>
                        <p className={styles.tourName}>{departure.tourName}</p>
                        <div className={styles.tourMeta}>
                          <span className={styles.tourCode}>{departure.tourCode}</span>
                          <span className={styles.tourDuration}>{departure.tourDuration}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateInfo}>
                        <Calendar size={16} />
                        <span>{formatDate(departure.departureDate)}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.slotInfo}>
                        <span className={styles.availableSlots}>{departure.availableSlots} chỗ</span>
                        <span className={styles.bookedSlots}>Đã đặt: {departure.bookedSlots}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.price}>{formatPrice(departure.lowestPrice)}</span>
                    </td>
                    <td>
                      <div className={styles.transportIcons}>
                        {departure.hasOutboundTransport && (
                          <div className={styles.transportIcon} title="Chiều đi">
                            <Plane size={14} style={{ transform: 'rotate(-45deg)' }} />
                          </div>
                        )}
                        {departure.hasInboundTransport && (
                          <div className={`${styles.transportIcon} ${styles.inbound}`} title="Chiều về">
                            <Plane size={14} style={{ transform: 'rotate(135deg)' }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${departure.status ? styles.active : styles.inactive}`}>
                        {departure.status ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.btnView}
                          onClick={() => handleViewDetail(departure)}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className={styles.btnEdit}
                          onClick={() => handleEdit(departure)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className={styles.btnClone}
                          onClick={() => handleClone(departure.departureID)}
                          title="Sao chép"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          className={styles.btnDelete}
                          onClick={() => handleDelete(departure.departureID)}
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Hiển thị <strong>{filteredDepartures.length}</strong> kết quả
              </div>
              <div className={styles.paginationControls}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className={styles.pageBtn}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className={styles.pageInfo}>
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className={styles.pageBtn}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showFormModal && (
        <DepartureFormModal
          departure={selectedDeparture}
          locations={locations}
          onClose={() => {
            setShowFormModal(false);
            setSelectedDeparture(null);
          }}
          onSuccess={() => {
            setShowFormModal(false);
            setSelectedDeparture(null);
            fetchDepartures();
          }}
        />
      )}

      <CloneModal
        isOpen={showCloneModal}
        onClose={() => {
          setShowCloneModal(false);
          setIdToClone(null);
        }}
        onClone={handleCloneSubmit}
        loading={cloneLoading}
      />

      {showDetailModal && (
        <DepartureDetailModal
          departureId={selectedDeparture?.departureID}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedDeparture(null);
          }}
          onEdit={async (departure) => {
            setShowDetailModal(false);
            // Fetch full details before editing
            const fullDeparture = await fetchDepartureDetail(departure.departureID);
            if (fullDeparture) {
              setSelectedDeparture(fullDeparture);
              setShowFormModal(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default DepartureList;