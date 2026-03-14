import React from 'react';
import examsIcon from '@/assets/icons/exams.png';
import totalExamsIcon from '@/assets/icons/total exams.png';
import vector1Icon from '@/assets/icons/Vector (3).png';
import vector2Icon from '@/assets/icons/Vector (6).png';
import vector3Icon from '@/assets/icons/Vector (2).png';
import styles from '../styles/Subscriptions.module.css';

export interface PlanCardProps {
  number: string | number;
  label: string;
  gradient: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({ number, label, gradient }) => {
  const getIcon = () => {
    if (label.includes("Active")) return examsIcon;
    if (label.includes("Total")) return totalExamsIcon;
    return examsIcon;
  };

  const getVectorImage = () => {
    if (gradient.includes("#8B5CF6") || gradient.includes("#7C3AED")) return vector1Icon;
    if (gradient.includes("#FF8C42") || gradient.includes("#FF6B1A")) return vector2Icon;
    if (gradient.includes("#EC4899") || gradient.includes("#DB2777")) return vector3Icon;
    if (gradient.includes("#4780CF") || gradient.includes("#2B6AEC")) return vector1Icon;
    return vector1Icon;
  };

  return (
    <div 
      className={styles.planCard}
      style={{ background: gradient }}
    >
      <div className={styles.planCardIconWrapper}>
        <img
          src={getIcon()}
          alt={label}
          className={styles.planCardIcon}
        />
      </div>

      <div className={styles.planCardNumber}>{number}</div>
      <div className={styles.planCardLabel}>{label}</div>

      <div className={styles.planCardVectorWrapper}>
        <img
          src={getVectorImage()}
          alt="Vector"
          className={styles.planCardVector}
        />
      </div>
    </div>
  );
};
