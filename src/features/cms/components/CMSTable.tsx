import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import viewIcon from '@/assets/icons/view.png';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import styles from '../styles/CMS.module.css';
import { CMSItem } from '../hooks/useCMSList';

interface CMSTableProps {
  loading: boolean;
  cmsItems: CMSItem[];
  languages: { code: string; name: string }[];
  handleToggleStatus: (id: string, status: string) => void;
  handleDelete: (id: string) => void;
}

export const CMSTable: React.FC<CMSTableProps> = ({
  loading,
  cmsItems,
  languages,
  handleToggleStatus,
  handleDelete,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/home/cms/${id}`);
  };

  const stripHtmlTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loader fullPage={false} message="Loading CMS content..." />;
  }

  return (
    <div className={styles.tableResponsive}>
      <table className={styles.cmsTable}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>Title</th>
            <th className={styles.tableHeadCell}>Content</th>
            <th className={styles.tableHeadCell}>Language</th>
            <th className={styles.tableHeadCell}>Created Date</th>
            <th className={styles.tableHeadCell}>Updated Date</th>
            <th className={styles.tableHeadCell}>Status</th>
            <th className={styles.tableHeadCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {cmsItems.map((item) => (
            <tr 
              key={item.id} 
              className={styles.tableBodyRow}
              onClick={() => handleRowClick(item.id)}
            >
              <td className={styles.tableBodyCell}>{item.title}</td>
              <td className={styles.tableBodyCell}>
                <div className={styles.contentPreviewCell}>
                  {stripHtmlTags(item.content)}
                </div>
              </td>
              <td className={styles.tableBodyCell}>
                {(() => {
                  const lang = languages.find(l => l.code === item.language);
                  return lang ? lang.name : (item.language ? item.language.toUpperCase() : 'EN');
                })()}
              </td>
              <td className={styles.tableBodyCell}>{formatDate(item.createdAt)}</td>
              <td className={styles.tableBodyCell}>{formatDate(item.updatedAt)}</td>
              <td className={styles.tableBodyCell}>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(item.id, item.status);
                  }}
                  className={`${styles.statusBadge} ${item.status === 'Active' ? styles.statusBadgeActive : styles.statusBadgeInactive}`}
                >
                  {item.status}
                  <span style={{ fontSize: "10px" }}>▼</span>
                </span>
              </td>
              <td className={styles.tableBodyCell}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRowClick(item.id); }}
                    className={styles.actionIconButton} title="View"
                  >
                    <img src={viewIcon} alt="View" style={{ width: "14px", height: "14px" }} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRowClick(item.id); }}
                    className={styles.actionIconButton} title="Edit"
                  >
                    <img src={editIcon} alt="Edit" style={{ width: "14px", height: "14px" }} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className={styles.actionIconButton} title="Delete"
                  >
                    <img src={deleteIcon} alt="Delete" style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {cmsItems.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
          No CMS content found. Add your first content item.
        </div>
      )}
    </div>
  );
};
