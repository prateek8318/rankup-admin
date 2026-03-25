import Cropper from 'react-easy-crop';
import { CrossIcon } from '@/components/common/CrossIcon';
import styles from '@/styles/pages/Exams.module.css';

interface ExamCropModalProps {
  imageFile: File | null;
  isOpen: boolean;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onCropComplete: (_: any, croppedAreaPixels: any) => void;
  onZoomChange: (zoom: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const ExamCropModal = ({
  imageFile,
  isOpen,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
  onCancel,
  onConfirm,
}: ExamCropModalProps) => {
  if (!isOpen || !imageFile) {
    return null;
  }

  return (
    <div className={styles.cropperOverlay}>
      <div className={styles.cropperModal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className={styles.cropperTitle}>Crop Image</h3>
          <CrossIcon onClick={onCancel} />
        </div>
        <div className={styles.cropperContainer}>
          <Cropper
            image={URL.createObjectURL(imageFile)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className={styles.formLabel}>Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(event) => onZoomChange(parseFloat(event.target.value))}
            className={styles.zoomInput}
          />
        </div>
        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel} className={styles.secondaryButton}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={styles.primaryButton}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCropModal;
