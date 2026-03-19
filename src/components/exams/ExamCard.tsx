import React from "react";
import examsIcon from "@/assets/icons/exams.png";
import totalExamsIcon from "@/assets/icons/total exams.png";
import vectorIcon from "@/assets/icons/Vector (3).png";

export interface ExamCardProps {
  number: string;
  label: string;
  gradient: string;
}

const ExamCard: React.FC<ExamCardProps> = ({ number, label, gradient }) => {
  const getIcon = () => {
    if (label.includes("Total Exams")) return totalExamsIcon;
    if (label.includes("Active")) return examsIcon;
    return examsIcon;
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
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
        }}
      >
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

      <div style={{ fontSize: 26, fontWeight: 700 }}>{number}</div>
      <div style={{ fontSize: 18, paddingTop: 10 }}>{label}</div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 160,
          overflow: "hidden",
        }}
      >
        <img
          src={vectorIcon}
          alt="Vector"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default ExamCard;

