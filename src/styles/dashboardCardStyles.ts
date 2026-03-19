export interface DashboardCardProps {
  number: string;
  label: string;
  gradient?: string;
  isWhiteBackground?: boolean;
  topWaveImage?: any;
  bottomWaveImage?: any;
  icon?: any;
}

export const DashboardCardStyles = {
  card: {
    width: 275,
    height: 140,
    borderRadius: 13,
    padding: 16,
    position: "relative" as const,
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
    boxSizing: "border-box" as const,
    overflow: "hidden",
  },
  
  waveImage: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "auto",
    objectFit: "cover" as const,
    opacity: 0.8
  },
  
  waveImageRight: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    width: "100%",
    height: "auto",
    objectFit: "cover" as const,
    opacity: 0.9
  },
  
  iconContainer: {
    position: "absolute" as const,
    top: 26,
    right: 20,
    width: 55,
    height: 55,
    zIndex: 1
  },
  
  icon: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  },
  
  number: {
    fontSize: 32,
    fontWeight: 700,
    position: "relative" as const,
    zIndex: 1,
    paddingTop: 10,
  },
  
  label: {
    fontSize: 18,
    paddingTop: 10,
    position: "relative" as const,
    zIndex: 1,
  },
  
  bottomWaveContainer: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    height: 160,
    overflow: "hidden",
  },
  
  bottomWaveImage: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: 'cover' as const
  }
};
