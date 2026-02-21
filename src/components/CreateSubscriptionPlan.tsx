import React, { useState, useEffect } from 'react';
import { createSubscriptionPlan, type CreateSubscriptionPlanDto, type SubscriptionPlanTranslationDto } from '@/services/subscriptionPlansApi';
import { getExamsList, type ExamDto } from '@/services/examsApi';
import { languageApi, type LanguageDto } from '@/services/masterApi';
import toast from 'react-hot-toast';

const COLOR_THEMES = [
  '#DBEAFE', '#F3E8FF', '#DBFCE7', '#FFEDD4', '#FCE7F3', '#FEF9C2'
];

const DURATION_TYPES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (err) {
    console.error('translateText error', err);
    return text;
  }
};

interface CreateSubscriptionPlanProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSubscriptionPlan: React.FC<CreateSubscriptionPlanProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateSubscriptionPlanDto>({
    name: '',
    description: '',
    type: 'Monthly',
    price: 0,
    currency: 'INR',
    duration: 1,
    durationType: 'Monthly',
    validityDays: 30,
    examId: 0,
    examType: '',
    features: [],
    imageUrl: null,
    isPopular: false,
    isRecommended: false,
    isActive: true,
    cardColorTheme: COLOR_THEMES[0],
    translations: []
  });

  const [featureInput, setFeatureInput] = useState('');
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      // Fetch exams
      const examsResponse = await getExamsList({ page: 1, limit: 1000 });
      if (Array.isArray(examsResponse?.data)) {
        setExams(examsResponse.data);
      } else {
        setExams([]);
      }

      // Fetch languages
      const languagesResponse = await languageApi.getAll();
      if (languagesResponse?.data?.success && languagesResponse.data.data) {
        setLanguages(languagesResponse.data.data);
      } else if (Array.isArray(languagesResponse?.data)) {
        setLanguages(languagesResponse.data);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
      setExams([]);
      setLanguages([]);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleLanguageChange = async (languageId: number, checked: boolean) => {
    let newSelectedLanguages;
    if (checked) {
      newSelectedLanguages = [...selectedLanguages, languageId];
    } else {
      newSelectedLanguages = selectedLanguages.filter(id => id !== languageId);
    }
    setSelectedLanguages(newSelectedLanguages);

    // Auto-translate when languages are selected
    if (checked && formData.name && formData.description) {
      const selectedLang = languages.find(lang => lang.id === languageId);
      if (selectedLang) {
        try {
          const translatedName = await translateText(formData.name, selectedLang.code);
          const translatedDescription = await translateText(formData.description, selectedLang.code);
          const translatedFeatures = await Promise.all(
            (formData.features || []).map(feature => translateText(feature, selectedLang.code))
          );

          const newTranslation: SubscriptionPlanTranslationDto = {
            languageCode: selectedLang.code,
            name: translatedName,
            description: translatedDescription,
            features: translatedFeatures
          };

          setFormData(prev => ({
            ...prev,
            translations: [
              ...(prev.translations || []).filter(t => t.languageCode !== selectedLang.code),
              newTranslation
            ]
          }));
        } catch (error) {
          console.error('Translation error:', error);
        }
      }
    } else if (!checked) {
      // Remove translation when language is deselected
      setFormData(prev => ({
        ...prev,
        translations: (prev.translations || []).filter(t => {
          const lang = languages.find(l => l.id === languageId);
          return lang ? t.languageCode !== lang.code : true;
        })
      }));
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Only send the required fields as per API specification
      const selectedExam = exams.find(exam => exam.id === formData.examId);
      const requestData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: formData.price,
        currency: formData.currency,
        duration: formData.duration,
        durationType: formData.durationType,
        examId: formData.examId,
        examType: selectedExam ? selectedExam.name : ''
      };
      
      await createSubscriptionPlan(requestData);
      toast.success('Subscription plan created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating subscription plan:', error);
      toast.error(error.message || 'Failed to create subscription plan');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '6px',
    display: 'block',
    color: '#374151'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: '720px',
        borderRadius: '18px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        <div style={{ 
          padding: '24px 28px', 
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600 }}>Create New Subscription Plan</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px', display: 'grid', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Plan Name *</label>
              <input name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} maxLength={200} required />
            </div>

            <div>
              <label style={labelStyle}>Exam *</label>
              <select name="examId" value={formData.examId} onChange={handleInputChange} style={inputStyle} required>
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Languages (Multi-select for auto-translation)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '60px' }}>
              {languages.map(language => (
                <label key={language.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language.id)}
                    onChange={(e) => handleLanguageChange(language.id, e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{language.name} ({language.code})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Type *</label>
              <select name="type" value={formData.type} onChange={handleInputChange} style={inputStyle} required>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="ExamSpecific">Exam Specific</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Duration *</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} style={inputStyle} min="1" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} style={inputStyle} min="0" step="0.01" required />
            </div>

            <div>
              <label style={labelStyle}>Currency *</label>
              <select name="currency" value={formData.currency} onChange={handleInputChange} style={inputStyle}>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Duration Type</label>
              <select name="durationType" value={formData.durationType} onChange={handleInputChange} style={inputStyle}>
                {DURATION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label style={labelStyle}>Features</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Add feature"
              />
              <button type="button" onClick={handleAddFeature} style={{
                padding: '10px 18px',
                background: 'linear-gradient(to right, #2B5DBC, #073081)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(formData.features || []).map((feature, index) => (
                <div key={index} style={{
                  background: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {feature}
                  <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleRemoveFeature(index)}>×</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <label style={labelStyle}>Card Color Theme</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {COLOR_THEMES.map(color => {
                const selected = formData.cardColorTheme === color;
                return (
                  <div
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, cardColorTheme: color }))}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: color,
                      cursor: 'pointer',
                      border: selected ? '3px solid #111' : '2px solid #e5e7eb',
                      transform: selected ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all .2s'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active</label>
            <label><input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleInputChange} /> Most Popular</label>
            <label><input type="checkbox" name="isRecommended" checked={formData.isRecommended} onChange={handleInputChange} /> Recommended</label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              background: '#fff'
            }}>
              Cancel
            </button>

            <button type="submit" disabled={loading} style={{
              padding: '10px 22px',
              borderRadius: '20px',
              background: loading ? '#9ca3af' : 'linear-gradient(to right, #2B5DBC, #073081)',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionPlan;