import React, { useState, useEffect } from 'react';
import { type ExamDto, type ExamListParams } from '@/services';
import { getExamsList, getExamsCount, deleteExam, updateExamStatus } from '@/services/examsApi';
import examsIcon from '@/assets/icons/exams.png';
import totalExamsIcon from '@/assets/icons/total exams.png';
import vectorIcon from '@/assets/icons/Vector (3).png';
import viewIcon from '@/assets/icons/view.png';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

interface ExamCardProps {
  number: string;
  label: string;
  gradient: string;
}

const ExamCard: React.FC<ExamCardProps> = ({ number, label, gradient }) => {
  // Get appropriate icon based on label
  const getIcon = () => {
    if (label.includes("Total Exams")) return totalExamsIcon;
    if (label.includes("Active")) return examsIcon;
    return examsIcon; // default icon
  };

  return (
    <div
      style={{
        width: 240,
        height: 120,
        background: gradient,
        borderRadius: 13,
        padding: 16,
        color: "#fff",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Top right icon */}
      <div style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 44,
        height: 44,
      }}>
        <img
          src={getIcon()}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <div style={{ fontSize: 26, fontWeight: 700 }}>
        {number}
      </div>
      <div style={{ fontSize: 18, paddingTop: 10 }}>
        {label}
      </div>

      {/* Bottom left vector image */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 160,
        overflow: "hidden",

      }}>
        <img
          src={vectorIcon}
          alt="Vector"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: 'cover'
          }}
        />
      </div>
    </div>
  );
};

const ExamsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [allExams, setAllExams] = useState<ExamDto[]>([]); // Store all exams for pagination
  const [filters, setFilters] = useState({
    sortBy: '',
    category: 'All Categories',
    course: '',
    examType: '',
    status: '',
    dateRange: '',
    all: '',
    attempt: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExams, setTotalExams] = useState(0);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [examStats, setExamStats] = useState({
    totalExams: 0,
    activeExams: 0,
    inactiveExams: 0,
    totalQuestions: 0,
    avgDuration: 0
  });

  const examCards = [
    { number: examStats.totalExams.toLocaleString(), label: "Total Exams", gradient: "linear-gradient(135deg,#4780CF,#2B6AEC)" },
    { number: examStats.activeExams.toLocaleString(), label: "Active Exams", gradient: "linear-gradient(135deg,#FF8C42,#FF6B1A)" },
    { number: examStats.inactiveExams.toLocaleString(), label: "Inactive Exams", gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
    { number: examStats.totalQuestions.toLocaleString(), label: "Total Questions", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
    { number: `${examStats.avgDuration} min`, label: "Avg Duration", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" }
  ];

  const fetchExams = async () => {
    try {
      setLoading(true);
      // Fetch exams with pagination for current page only
      const params: ExamListParams = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };

      console.log('Fetching exams with params:', params);
      const response = await getExamsList(params);

      console.log('Exams API Response:', response);

      if (response.success && response.data) {
        // Set exams for current page
        setExams(response.data);
        
        // Set total count from API response if available, otherwise use current total
        if (response.totalCount) {
          setTotalExams(response.totalCount);
        } else {
          // If API doesn't return totalCount, keep existing total or calculate from allExams
          if (allExams.length === 0) {
            // First time fetching, set total from current page data
            setTotalExams(response.data.length);
          }
        }

        // Store all exams for stats calculation
        if (allExams.length === 0) {
          setAllExams(response.data);
        }

        // Calculate stats from current page data and use API total count
        const total = totalExams || response.data.length;
        const active = response.data.filter((exam: ExamDto) => exam.isActive).length;
        const inactive = response.data.filter((exam: ExamDto) => !exam.isActive).length;
        const totalQuestions = response.data.reduce((sum: number, exam: ExamDto) => sum + (exam.totalMarks || 0), 0);
        const avgDuration = response.data.length > 0 ? Math.round(response.data.reduce((sum: number, exam: ExamDto) => sum + exam.durationInMinutes, 0) / response.data.length) : 0;

        console.log('Processed current page exams:', response.data);
        console.log('Calculated stats:', { total, active, inactive, totalQuestions, avgDuration });

        setExamStats({
          totalExams: total,
          activeExams: active,
          inactiveExams: inactive,
          totalQuestions: totalQuestions,
          avgDuration: avgDuration
        });
      } else {
        console.log('API response unsuccessful or no data:', response);
        setExams([]);
        setExamStats({
          totalExams: 0,
          activeExams: 0,
          inactiveExams: 0,
          totalQuestions: 0,
          avgDuration: 0
        });
      }
    } catch (error: unknown) {
      console.error('Error fetching exams:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      // Set fallback values
      setExams([]);
      setExamStats({
        totalExams: 0,
        activeExams: 0,
        inactiveExams: 0,
        totalQuestions: 0,
        avgDuration: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalExamsCount = async () => {
    try {
      const response = await getExamsCount();
      console.log('Exams Count Response:', response);

      if (response.success && response.data) {
        // Use the actual total count from API for pagination display
        setTotalExams(response.data.totalExams || 0);
      }
    } catch (error) {
      console.error('Error fetching exams count:', error);
      setTotalExams(0);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchTotalExamsCount();
  }, [currentPage, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getExamId = (exam: ExamDto) => `EXM${String(exam.id).padStart(3, '0')}`;
  const getStatus = (exam: ExamDto) => exam.isActive ? 'Active' : 'Inactive';

  const handleSelectExam = (examId: string) => {
    setSelectedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExams.length === exams.length) {
      setSelectedExams([]);
    } else {
      setSelectedExams(exams.map(exam => getExamId(exam)));
    }
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    fetchExams();
  };

  const handleReset = () => {
    setFilters({
      sortBy: '',
      category: 'All Categories',
      course: '',
      examType: '',
      status: '',
      dateRange: '',
      all: '',
      attempt: ''
    });
    setSearchTerm('');
    setSelectedExams([]);
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log('Exporting exam data...');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewExam = (exam: ExamDto) => {
    console.log('View exam:', exam);
    // TODO: Implement view functionality - open modal or navigate to view page
  };

  const handleEditExam = (exam: ExamDto) => {
    console.log('Edit exam:', exam);
    // TODO: Implement edit functionality - open modal or navigate to edit page
  };

  const handleDeleteExam = async (exam: ExamDto) => {
    if (window.confirm(`Are you sure you want to delete "${exam.name}"?`)) {
      try {
        await deleteExam(exam.id);
        console.log('Exam deleted successfully');
        // Refresh the exams list
        fetchExams();
        fetchTotalExamsCount();
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Error deleting exam. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (exam: ExamDto) => {
    try {
      await updateExamStatus(exam.id, !exam.isActive);
      fetchExams();
      fetchTotalExamsCount();
    } catch (error) {
      console.error('Error updating exam status:', error);
      alert('Error updating exam status. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            Exams Management
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.5" }}>
            Create and manage exams, questions, and assessments
          </p>
        </div>

        {/* CARDS */}
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          marginBottom: "30px",
          flexWrap: "wrap"
        }}>
          {examCards.map((card, index) => (
            <ExamCard
              key={index}
              number={card.number}
              label={card.label}
              gradient={card.gradient}
            />
          ))}
        </div>

        {/* FILTER AND ACTION BAR */}
        <div style={{
          
          padding: "20px",
          marginBottom: 4,
         
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "120px"
                }}
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="marks">Marks</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "140px"
                }}
              >
                <option value="All Categories">All Categories</option>
                <option value="Mock Test">Mock Test</option>
                <option value="Practice Test">Practice Test</option>
                <option value="Previous Year">Previous Year</option>
              </select>

              <select
                value={filters.course}
                onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "120px"
                }}
              >
                <option value="">Course</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="UPSC">UPSC</option>
              </select>

              <select
                value={filters.examType}
                onChange={(e) => setFilters(prev => ({ ...prev, examType: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "120px"
                }}
              >
                <option value="">Exam Type</option>
                <option value="International">International</option>
                <option value="National">National</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "100px"
                }}
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <input
                type="text"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                placeholder="16 jan 2026 - 23 jan 2026"
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "200px"
                }}
              />

              <select
                value={filters.all}
                onChange={(e) => setFilters(prev => ({ ...prev, all: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "80px"
                }}
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>

              <select
                value={filters.attempt}
                onChange={(e) => setFilters(prev => ({ ...prev, attempt: e.target.value }))}
                style={{
                  padding: "8px 16px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "25px",
                  background: "#fff",
                  fontSize: "16px",
                  minWidth: "100px"
                }}
              >
                <option value="">Attempt</option>
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
              </select>
              <button
                onClick={handleApply}
                style={{
                  padding: "8px 48px",
                  border: "none",
                  borderRadius: "20px",
                  background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Apply
              </button>
            </div>

            
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px",justifyContent: "flex-end",marginBottom: "10px" }}>
              

              <button
                onClick={handleReset}
                style={{
                  padding: "8px 24px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Reset
              </button>

              <button
                onClick={handleExport}
                style={{
                  padding: "8px 24px",
                  border: "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>↑</span> Export
              </button>
            </div>

        {/* EXAM TABLE */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "18px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
              Loading exams...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1e40af" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                      <input
                        type="checkbox"
                        checked={selectedExams.length === exams.length}
                        onChange={handleSelectAll}
                        style={{ width: "16px", height: "16px" }}
                      />
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                      Test Category
                      <span style={{ marginLeft: "4px", fontSize: "12px" }}>▼</span>
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Exam Name</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Subject</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Access</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Total Ques.</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Difficulty</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Total Marks</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Exam Date</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Duration</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Language</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                      Status
                      <span style={{ marginLeft: "4px", fontSize: "12px" }}>▼</span>
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam: ExamDto) => {
                    const examId = getExamId(exam);
                    const status = getStatus(exam);
                    const duration = formatDuration(exam.durationInMinutes);

                    return (
                      <tr key={exam.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                        <td style={{ padding: "12px" }}>
                          <input
                            type="checkbox"
                            checked={selectedExams.includes(examId)}
                            onChange={() => handleSelectExam(examId)}
                            style={{ width: "16px", height: "16px" }}
                          />
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>
                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: "#E9D5FF",
                            color: "#7C3AED"
                          }}>
                            {(exam as any).category || "NA"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{exam.name}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{(exam as any).subject || "NA"}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>
                          {(exam as any).access ? (
                            <div style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: (exam as any).access === "Paid" ? "#10b981" : "#f59e0b",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}>
                              {(exam as any).access === "Paid" ? "P" : "F"}
                            </div>
                          ) : "NA"}
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{(exam as any).totalQuestions || "NA"}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{(exam as any).difficulty || "NA"}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{exam.totalMarks}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{formatDate(exam.createdAt)}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{duration}</td>
                        <td style={{ padding: "12px", fontSize: "14px" }}>{(exam as any).language || "English"}</td>
                        <td style={{ padding: "12px" }}>
                          <span 
                            onClick={() => handleToggleStatus(exam)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                              background: status === "Active" ? "#dcfce7" : "#fee2e2",
                              color: status === "Active" ? "#166534" : "#991b1b",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {status}
                            <span style={{ fontSize: "10px" }}>▼</span>
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button 
                              onClick={() => handleViewExam(exam)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              title="View"
                            >
                              <img 
                                src={viewIcon} 
                                alt="View" 
                                style={{ width: "20px", height: "20px" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.textContent = '👁️';
                                }}
                              />
                              <span style={{ display: 'none', fontSize: '18px' }}>👁️</span>
                            </button>
                            <button 
                              onClick={() => handleEditExam(exam)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              title="Edit"
                            >
                              <img 
                                src={editIcon} 
                                alt="Edit" 
                                style={{ width: "20px", height: "20px" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.textContent = '✏️';
                                }}
                              />
                              <span style={{ display: 'none', fontSize: '18px' }}>✏️</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteExam(exam)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              title="Delete"
                            >
                              <img 
                                src={deleteIcon} 
                                alt="Delete" 
                                style={{ width: "20px", height: "20px" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.textContent = '🗑️';
                                }}
                              />
                              <span style={{ display: 'none', fontSize: '18px' }}>🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #f3f4f6"
          }}>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalExams)} of {totalExams} exams
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: currentPage === 1 ? "#f9fafb" : "#fff",
                  color: currentPage === 1 ? "#d1d5db" : "#374151",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                &lt; Prev
              </button>

              {/* Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(totalExams / 10);
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
                return pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      background: currentPage === page ? "#2563eb" : "#fff",
                      color: currentPage === page ? "#fff" : "#374151",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {page}
                  </button>
                ));
              })()}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalExams / 10)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: currentPage >= Math.ceil(totalExams / 10) ? "#f9fafb" : "#fff",
                  color: currentPage >= Math.ceil(totalExams / 10) ? "#d1d5db" : "#374151",
                  cursor: currentPage >= Math.ceil(totalExams / 10) ? "not-allowed" : "pointer",
                  fontSize: "14px"
                }}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsManagement;