import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../theme';
import {
  Gift,
  Settings,
  History,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Trophy,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  X,
  PlayCircle,
  Clock,
  Ban,
  Target,
  Award,
  Lock,
  CheckSquare,
  LayoutGrid,
  List
} from 'lucide-react';

// Mock Data Types
interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'automated' | 'manual';
  rewardAmount: number;
  rewardType: 'points' | 'currency';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  triggers?: string[];
  totalPayouts: number;
  // Schedule fields
  startDate?: string;
  recurrence?: string;
  duration?: number;
  currentCycle?: number; // Calculated or stored
  // Participant fields
  participants?: string[];
  branchFilter?: string;
  // Metric fields
  metric?: string;
  qualifierType?: string;
  qualifierValue?: number;
  // Archival
  isArchived?: boolean;
  // Stats
  totalRecipients?: number;
  customRecurrenceDays?: number;
  payoutMethod?: 'automatic' | 'manual';
}

interface PayoutRecord {
  id: string;
  date: string;
  recipientName: string;
  recipientEmail: string;
  campaignName: string;
  amount: number;
  status: 'sent' | 'pending' | 'failed';
  snappyGiftId?: string;
}

// Mock Data
const MOCK_USERS = [
  { id: 'u1', name: 'John Doe', role: 'Technicians' },
  { id: 'u2', name: 'Jane Smith', role: 'Technicians' },
  { id: 'u3', name: 'Mike Johnson', role: 'Technicians' },
  { id: 'u4', name: 'Sarah Wilson', role: 'Sales' },
  { id: 'u5', name: 'Tom Brown', role: 'Sales' },
  { id: 'u6', name: 'Emily Davis', role: 'CSRs' },
  { id: 'u7', name: 'Chris Lee', role: 'Technicians' },
  { id: 'u8', name: 'Pat Taylor', role: 'Sales' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: '5-Star Google Review',
    description: 'Reward customers for leaving a 5-star review on Google',
    type: 'automated',
    rewardAmount: 5000,
    rewardType: 'points',
    status: 'running',
    triggers: ['Review Posted', '5 Stars'],
    totalPayouts: 12500,
    startDate: '2023-10-01',
    recurrence: 'monthly',
    duration: 3,
    currentCycle: 3,
    participants: ['Sales'],
    metric: 'revenue',
    qualifierType: 'threshold',
    qualifierValue: 50000,
    isArchived: false,
    payoutMethod: 'manual'
  },
  {
    id: '2',
    name: '5-Star Service Challenge',
    description: 'Reward customers for referring a new client who signs up',
    type: 'manual',
    status: 'running',
    startDate: '2023-11-01',
    recurrence: 'monthly',
    duration: 1,
    participants: ['Technicians'],
    metric: 'reviews',
    qualifierType: 'top_n',
    qualifierValue: 3,
    rewardType: 'points',
    rewardAmount: 10000,
    tieredRewards: [10000, 5000, 2500],
    totalPayouts: 0,
    payoutMethod: 'automatic',
    tieBreakerRule: 'standard',
    tieBreakerPayout: 'full'
  },
  {
    id: '3',
    name: 'Safety First',
    description: 'Monthly reward for the top performing technician',
    type: 'automated',
    status: 'completed',
    startDate: '2023-09-01',
    recurrence: 'monthly',
    duration: 1,
    participants: ['Technicians', 'CSRs'],
    metric: 'pro_score',
    qualifierType: 'threshold',
    qualifierValue: 90,
    rewardType: 'points',
    rewardAmount: 2000,
    totalPayouts: 0,
    payoutMethod: 'manual'
  },
  {
    id: '4',
    name: 'Seasonal Promotion',
    description: 'Summer pest control signup bonus',
    type: 'manual',
    status: 'pending',
    startDate: '2024-06-01',
    recurrence: 'monthly',
    duration: 3,
    participants: ['All Users'],
    metric: 'revenue',
    qualifierType: 'threshold',
    qualifierValue: 500,
    rewardType: 'points',
    rewardAmount: 1000,
    totalPayouts: 0,
    payoutMethod: 'manual'
  },
  {
    id: '5',
    name: 'Failed Experiment',
    description: 'A campaign that did not work out',
    type: 'automated',
    status: 'failed',
    startDate: '2024-01-01',
    recurrence: 'monthly',
    duration: 1,
    participants: ['All Users'],
    metric: 'revenue',
    qualifierType: 'threshold',
    qualifierValue: 1000000,
    rewardType: 'points',
    rewardAmount: 50,
    totalPayouts: 0,
    payoutMethod: 'manual'
  }
];

const MOCK_PAYOUTS: PayoutRecord[] = [
  { id: 'p1', date: '2024-03-15', recipientName: 'Alice Johnson', recipientEmail: 'alice@example.com', campaignName: '5-Star Google Review', amount: 500, status: 'sent', snappyGiftId: 'gift_123' },
  { id: 'p2', date: '2024-03-14', recipientName: 'Bob Smith', recipientEmail: 'bob@example.com', campaignName: 'Referral Bonus', amount: 25, status: 'sent', snappyGiftId: 'gift_124' },
  { id: 'p3', date: '2024-03-12', recipientName: 'Charlie Brown', recipientEmail: 'charlie@example.com', campaignName: '5-Star Google Review', amount: 500, status: 'sent', snappyGiftId: 'gift_125' },
  { id: 'p4', date: '2024-03-10', recipientName: 'David Wilson', recipientEmail: 'david@example.com', campaignName: 'Employee of the Month', amount: 100, status: 'pending' },
  { id: 'p5', date: '2024-03-08', recipientName: 'Eva Green', recipientEmail: 'eva@example.com', campaignName: 'Referral Bonus', amount: 25, status: 'sent', snappyGiftId: 'gift_126' },
  { id: 'p6', date: '2024-03-05', recipientName: 'Frank White', recipientEmail: 'frank@example.com', campaignName: '5-Star Google Review', amount: 500, status: 'failed' },
];

type TabType = 'campaigns' | 'payouts' | 'settings';

const RewardsPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  // Settings State
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [autoApprove, setAutoApprove] = useState(true);
  const [notifyOnPayout, setNotifyOnPayout] = useState(true);

  // Filtered Payouts
  const filteredPayouts = payouts.filter(p =>
    p.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowWizard(true);
  };

  const handleNewCampaign = () => {
    setEditingCampaign(null);
    setShowWizard(true);
  };

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'archive';
    campaignId: string | null;
    campaignName: string;
  }>({
    isOpen: false,
    type: 'cancel',
    campaignId: null,
    campaignName: ''
  });

  const handleCancelOrDeleteClick = (campaign: Campaign) => {
    const isActive = campaign.status === 'running' || campaign.status === 'pending';
    setConfirmationModal({
      isOpen: true,
      type: isActive ? 'cancel' : 'archive',
      campaignId: campaign.id,
      campaignName: campaign.name
    });
  };

  const confirmAction = () => {
    if (!confirmationModal.campaignId) return;

    if (confirmationModal.type === 'cancel') {
      setCampaigns(campaigns.map(c => c.id === confirmationModal.campaignId ? { ...c, status: 'cancelled' } : c));
    } else {
      // Archive instead of delete
      setCampaigns(campaigns.map(c => c.id === confirmationModal.campaignId ? { ...c, isArchived: true } : c));
    }
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return currentTheme.success;
      case 'pending': return currentTheme.warning;
      case 'completed': return currentTheme.primary;
      case 'cancelled': return currentTheme.textSecondary;
      case 'failed': return currentTheme.danger;
      default: return currentTheme.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return PlayCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return Ban;
      case 'failed': return AlertCircle;
      default: return AlertCircle;
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent off-by-one errors with YYYY-MM-DD strings
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(adjustedDate);
  };

  // Helper to calculate end date
  const calculateEndDate = (startDate: string, duration: number, recurrence: string, customDays?: number) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    // Adjust for timezone offset
    const userTimezoneOffset = start.getTimezoneOffset() * 60000;
    const adjustedStart = new Date(start.getTime() + userTimezoneOffset);

    if (recurrence === 'none') return formatDate(startDate); // One-time ends same day

    if (recurrence === 'monthly') {
      const end = new Date(adjustedStart);
      end.setMonth(end.getMonth() + duration);
      return formatDate(end.toISOString());
    }

    if (recurrence === 'quarterly') {
      const end = new Date(adjustedStart);
      end.setMonth(end.getMonth() + (duration * 3));
      return formatDate(end.toISOString());
    }

    let daysToAdd = 0;
    if (recurrence === 'weekly') daysToAdd = duration * 7;
    if (recurrence === 'biweekly') daysToAdd = duration * 14;
    if (recurrence === 'custom') daysToAdd = duration * (customDays || 1);

    const end = new Date(adjustedStart);
    end.setDate(end.getDate() + daysToAdd);

    return formatDate(end.toISOString());
  };

  // Confirmation Modal
  const ConfirmationModal = () => {
    if (!confirmationModal.isOpen) return null;

    const isCancel = confirmationModal.type === 'cancel';
    const title = isCancel ? 'Cancel Campaign?' : 'Archive Campaign?';
    const message = isCancel
      ? `Are you sure you want to cancel "${confirmationModal.campaignName}"? This will immediately stop the campaign and no further rewards will be issued.`
      : `Are you sure you want to archive "${confirmationModal.campaignName}"? It will be hidden from the main list but can be viewed in the archives.`;
    const actionLabel = isCancel ? 'Yes, Cancel Campaign' : 'Yes, Archive Campaign';
    const actionColor = isCancel ? currentTheme.danger : currentTheme.warning;
    const Icon = isCancel ? Ban : CheckSquare;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100
      }}>
        <div style={{
          backgroundColor: currentTheme.cardBg,
          width: '450px',
          maxWidth: '90%',
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: actionColor }}>
            <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: `${actionColor}20` }}>
              <Icon size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', color: currentTheme.textPrimary }}>{title}</h2>
          </div>

          <p style={{ color: currentTheme.textSecondary, lineHeight: '1.6', marginBottom: '24px' }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.border}`,
                backgroundColor: 'transparent',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Keep it
            </button>
            <button
              onClick={confirmAction}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: actionColor,
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };


  // Wizard Component
  const CampaignWizard = () => {
    const [step, setStep] = useState(1);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const isEditing = !!editingCampaign;
    const isActive = editingCampaign?.status === 'running';

    const [formData, setFormData] = useState({
      name: editingCampaign?.name || '',
      startDate: editingCampaign?.startDate || '',
      recurrence: editingCampaign?.recurrence || 'monthly',
      duration: editingCampaign?.duration || 1,
      customRecurrenceDays: editingCampaign?.customRecurrenceDays || 14,
      participants: editingCampaign?.participants || [] as string[],
      branchFilter: editingCampaign?.branchFilter || 'All Branches',
      metric: editingCampaign?.metric || 'pro_score',
      qualifierType: editingCampaign?.qualifierType || 'top_n',
      qualifierValue: editingCampaign?.qualifierValue || 3,
      payoutMethod: editingCampaign?.payoutMethod || 'manual',
      rewardAmount: editingCampaign?.rewardAmount || 50,
      rewardType: editingCampaign?.rewardType || 'points'
    });

    const steps = [
      { id: 1, title: 'Schedule', icon: Calendar },
      { id: 2, title: 'Participants', icon: Users },
      { id: 3, title: 'Evaluation', icon: Target },
      { id: 4, title: 'Qualification', icon: Award },
      { id: 5, title: 'Payout', icon: Gift }
    ];

    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleNext = () => {
      const newErrors: Record<string, boolean> = {};
      let isValid = true;

      if (step === 1) {
        if (!formData.name.trim()) {
          newErrors.name = true;
          isValid = false;
        }
        if (!formData.startDate) {
          newErrors.startDate = true;
          isValid = false;
        }
        if (formData.duration < 1) {
          newErrors.duration = true;
          isValid = false;
        }
      }
      if (step === 2) {
        if (formData.participants.length === 0) {
          newErrors.participants = true;
          isValid = false;
        }
      }
      if (step === 5) {
        if (formData.rewardAmount <= 0) {
          newErrors.rewardAmount = true;
          isValid = false;
        }
      }

      setErrors(newErrors);

      if (isValid) {
        if (step < 5) setStep(step + 1);
        else {
          // Save campaign
          const updatedCampaign: Campaign = {
            id: editingCampaign?.id || Date.now().toString(),
            name: formData.name || 'New Campaign',
            description: `Automated campaign based on ${formData.metric}`,
            type: 'automated',
            rewardAmount: formData.rewardAmount,
            rewardType: 'points', // Enforce points only
            status: editingCampaign?.status || 'pending', // Default to pending for new
            totalPayouts: editingCampaign?.totalPayouts || 0,
            startDate: formData.startDate,
            recurrence: formData.recurrence,
            duration: formData.duration,
            customRecurrenceDays: formData.customRecurrenceDays,
            currentCycle: editingCampaign?.currentCycle || 0,
            participants: formData.participants,
            branchFilter: formData.branchFilter,
            metric: formData.metric,
            qualifierType: formData.qualifierType,
            qualifierValue: formData.qualifierValue,
            payoutMethod: formData.payoutMethod,
            isArchived: editingCampaign?.isArchived || false
          };

          if (isEditing) {
            setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
          } else {
            setCampaigns([...campaigns, updatedCampaign]);
          }
          setShowWizard(false);
        }
      }
    };

    const handleBack = () => {
      if (step > 1) setStep(step - 1);
    };

    const handleWizardCancel = () => {
      if (isEditing && (editingCampaign.status === 'running' || editingCampaign.status === 'pending')) {
        if (window.confirm('Do you want to cancel this campaign?')) {
          setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, status: 'cancelled' } : c));
          setShowWizard(false);
        }
      } else {
        setShowWizard(false);
      }
    };

    const LockedFieldIndicator = ({ label }: { label: string }) => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: currentTheme.textSecondary,
        marginTop: '4px'
      }}>
        <Lock size={12} />
        <span>{label} is locked for active campaigns</span>
      </div>
    );

    const renderStepContent = () => {
      switch (step) {
        case 1: // Schedule
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: false });
                  }}
                  placeholder="e.g., Summer Sales Contest"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.name ? currentTheme.danger : currentTheme.border}`,
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => {
                      setFormData({ ...formData, startDate: e.target.value });
                      if (errors.startDate) setErrors({ ...errors, startDate: false });
                    }}
                    disabled={isActive}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.startDate ? currentTheme.danger : currentTheme.border}`,
                      backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                      color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                      cursor: isActive ? 'not-allowed' : 'text'
                    }}
                  />
                  {isActive && <LockedFieldIndicator label="Start Date" />}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Recurrence</label>
                  <select
                    value={formData.recurrence}
                    onChange={e => setFormData({ ...formData, recurrence: e.target.value })}
                    disabled={isActive}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${currentTheme.border}`,
                      backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                      color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                      cursor: isActive ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="custom">Custom</option>
                  </select>
                  {isActive && <LockedFieldIndicator label="Recurrence" />}

                  {formData.recurrence === 'custom' && (
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500', fontSize: '12px' }}>Repeat every X days</label>
                      <input
                        type="number"
                        value={formData.customRecurrenceDays}
                        onChange={e => setFormData({ ...formData, customRecurrenceDays: parseInt(e.target.value) })}
                        min="1"
                        disabled={isActive}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                          color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                          cursor: isActive ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Duration (Cycles)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={e => {
                    setFormData({ ...formData, duration: parseInt(e.target.value) });
                    if (errors.duration) setErrors({ ...errors, duration: false });
                  }}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.duration ? currentTheme.danger : currentTheme.border}`,
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary
                  }}
                />
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: currentTheme.textSecondary }}>
                    {isActive ? 'You can extend the duration of active campaigns.' : 'How many times this campaign will run'}
                  </p>
                  {formData.startDate && (
                    <p style={{ margin: 0, fontSize: '13px', color: currentTheme.primary, fontWeight: '500' }}>
                      Ends on: {calculateEndDate(formData.startDate, formData.duration, formData.recurrence, formData.customRecurrenceDays)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case 2: // Participants
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Filter by Branch</label>
                <select
                  value={formData.branchFilter}
                  onChange={e => setFormData({ ...formData, branchFilter: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${currentTheme.border}`, backgroundColor: currentTheme.background, color: currentTheme.textPrimary }}
                >
                  <option>All Branches</option>
                  <option>North Branch</option>
                  <option>South Branch</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Who is eligible?</label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: errors.participants ? `1px solid ${currentTheme.danger}` : 'none',
                  borderRadius: '8px',
                  padding: errors.participants ? '8px' : '0'
                }}>
                  {[
                    { id: 'Technicians', label: 'Technicians', count: 12 },
                    { id: 'Sales', label: 'Sales', count: 8 },
                    { id: 'CSRs', label: 'CSRs', count: 5 }
                  ].map(group => {
                    const groupUsers = MOCK_USERS.filter(u => u.role === group.id);
                    const isGroupSelected = formData.participants.includes(group.id);
                    const isExpanded = expandedGroups.includes(group.id);

                    // Check if some users are selected (for indeterminate state visual)
                    const selectedGroupUsers = groupUsers.filter(u => formData.participants.includes(u.id));
                    const isPartial = !isGroupSelected && selectedGroupUsers.length > 0 && selectedGroupUsers.length < groupUsers.length;

                    return (
                      <div key={group.id} style={{
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          backgroundColor: isGroupSelected || isPartial ? `${currentTheme.primary}05` : 'transparent',
                          cursor: 'pointer'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <div onClick={(e) => {
                              e.stopPropagation();
                              const newParticipants = [...formData.participants];
                              if (isGroupSelected) {
                                // Unselect group
                                const filtered = newParticipants.filter(p => p !== group.id);
                                setFormData({ ...formData, participants: filtered });
                              } else {
                                // Select group, remove individual users of this group to avoid dupes
                                const filtered = newParticipants.filter(p => !groupUsers.find(u => u.id === p));
                                setFormData({ ...formData, participants: [...filtered, group.id] });
                              }
                              if (errors.participants) setErrors({ ...errors, participants: false });
                            }}>
                              {isPartial ? (
                                <div style={{ width: '13px', height: '13px', backgroundColor: currentTheme.primary, borderRadius: '2px' }} />
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={isGroupSelected}
                                  readOnly
                                  style={{ cursor: 'pointer' }}
                                />
                              )}
                            </div>
                            <span
                              onClick={() => {
                                if (expandedGroups.includes(group.id)) {
                                  setExpandedGroups(expandedGroups.filter(g => g !== group.id));
                                } else {
                                  setExpandedGroups([...expandedGroups, group.id]);
                                }
                              }}
                              style={{ color: currentTheme.textPrimary, fontWeight: '500', flex: 1 }}
                            >
                              {group.label}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: currentTheme.textSecondary, backgroundColor: currentTheme.background, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${currentTheme.border}` }}>
                              {(isGroupSelected || selectedGroupUsers.length > 0)
                                ? `${isGroupSelected ? group.count : selectedGroupUsers.length} of ${group.count} Selected`
                                : `${group.count} Users`
                              }
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (expandedGroups.includes(group.id)) {
                                  setExpandedGroups(expandedGroups.filter(g => g !== group.id));
                                } else {
                                  setExpandedGroups([...expandedGroups, group.id]);
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentTheme.textSecondary, display: 'flex' }}
                            >
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{
                            padding: '8px 12px 12px 48px',
                            borderTop: `1px solid ${currentTheme.border}`,
                            backgroundColor: `${currentTheme.background}50`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            {groupUsers.map(user => {
                              const isUserSelected = isGroupSelected || formData.participants.includes(user.id);
                              return (
                                <label key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                  <input
                                    type="checkbox"
                                    checked={isUserSelected}
                                    onChange={(e) => {
                                      let newParticipants = [...formData.participants];
                                      if (isGroupSelected) {
                                        // If group was selected, we are now unselecting this specific user
                                        // So we remove group, and add ALL OTHER users
                                        newParticipants = newParticipants.filter(p => p !== group.id);
                                        const otherUsers = groupUsers.filter(u => u.id !== user.id).map(u => u.id);
                                        newParticipants = [...newParticipants, ...otherUsers];
                                      } else {
                                        if (e.target.checked) {
                                          newParticipants.push(user.id);
                                          // Check if all users are now selected, if so, switch to Group ID
                                          const allSelected = groupUsers.every(u => newParticipants.includes(u.id));
                                          if (allSelected) {
                                            newParticipants = newParticipants.filter(p => !groupUsers.find(u => u.id === p));
                                            newParticipants.push(group.id);
                                          }
                                        } else {
                                          newParticipants = newParticipants.filter(p => p !== user.id);
                                        }
                                      }
                                      setFormData({ ...formData, participants: newParticipants });
                                      if (errors.participants) setErrors({ ...errors, participants: false });
                                    }}
                                  />
                                  <span style={{ color: currentTheme.textPrimary }}>{user.name}</span>
                                </label>
                              );
                            })}
                            {groupUsers.length === 0 && (
                              <span style={{ fontSize: '12px', color: currentTheme.textSecondary, fontStyle: 'italic' }}>No users found in this group.</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {isActive && <p style={{ fontSize: '12px', color: currentTheme.textSecondary, marginTop: '8px' }}>Adding new participants to an active campaign is allowed.</p>}
              </div>
            </div>
          );
        case 3: // Evaluation
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Metric to Track</label>
                <select
                  value={formData.metric}
                  onChange={e => setFormData({ ...formData, metric: e.target.value })}
                  disabled={isActive}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.border}`,
                    backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                    color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                    cursor: isActive ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="pro_score">Pro Score (Overall Performance)</option>
                  <option value="revenue">Total Revenue</option>
                  <option value="reviews">5-Star Reviews</option>
                  <option value="completion">Job Completion Rate</option>
                </select>
                {isActive && <LockedFieldIndicator label="Metric" />}
              </div>
              <div style={{ padding: '16px', backgroundColor: `${currentTheme.primary}10`, borderRadius: '8px', border: `1px solid ${currentTheme.primary}30` }}>
                <h4 style={{ margin: '0 0 8px 0', color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> {formData.metric === 'pro_score' ? 'Pro Score Selected' : 'Metric Selected'}
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: currentTheme.textSecondary }}>
                  {formData.metric === 'pro_score'
                    ? "The Pro Score is a composite metric calculated from efficiency, quality, and customer satisfaction. It's the best way to measure overall technician performance."
                    : "This metric will be tracked automatically from the CRM data."}
                </p>
              </div>
            </div>
          );
        case 4: // Qualification
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Qualification Logic</label>
                {isActive && <LockedFieldIndicator label="Qualification Logic" />}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', opacity: isActive ? 0.6 : 1, pointerEvents: isActive ? 'none' : 'auto' }}>
                  {[
                    { id: 'top_n', label: 'Top Performers', desc: 'Reward a specific number of top-ranking users (e.g., Top 3).' },
                    { id: 'threshold', label: 'Fixed Threshold', desc: 'Reward anyone who meets or exceeds a specific score or value.' },
                    { id: 'everyone', label: 'Participation', desc: 'Reward every eligible participant regardless of performance.' }
                  ].map(type => (
                    <div
                      key={type.id}
                      onClick={() => !isActive && setFormData({ ...formData, qualifierType: type.id })}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.qualifierType === type.id ? currentTheme.primary : currentTheme.border}`,
                        cursor: isActive ? 'not-allowed' : 'pointer',
                        backgroundColor: formData.qualifierType === type.id ? `${currentTheme.primary}05` : 'transparent'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: currentTheme.textPrimary, marginBottom: '4px' }}>{type.label}</div>
                      <div style={{ fontSize: '12px', color: currentTheme.textSecondary }}>{type.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {formData.qualifierType !== 'everyone' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {formData.qualifierType === 'top_n' ? 'Number of Winners' :
                      formData.metric === 'pro_score' ? 'Minimum Pro Score (0-100)' :
                        formData.metric === 'revenue' ? 'Minimum Revenue ($)' :
                          formData.metric === 'reviews' ? 'Minimum 5-Star Reviews' :
                            formData.metric === 'completion' ? 'Minimum Completion Rate (%)' :
                              'Minimum Threshold'}
                  </label>
                  <input
                    type="number"
                    value={formData.qualifierValue}
                    onChange={e => setFormData({ ...formData, qualifierValue: parseInt(e.target.value) })}
                    disabled={isActive}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${currentTheme.border}`,
                      backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                      color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                      cursor: isActive ? 'not-allowed' : 'text'
                    }}
                  />
                  <p style={{ marginTop: '8px', fontSize: '12px', color: currentTheme.textSecondary }}>
                    {formData.qualifierType === 'top_n' ? `The top ${formData.qualifierValue} users with the highest ${getMetricLabel(formData.metric)} will be rewarded.` :
                      formData.metric === 'pro_score' ? `Users with a Pro Score of ${formData.qualifierValue} or higher will be rewarded.` :
                        formData.metric === 'revenue' ? `Users who generate $${formData.qualifierValue} or more in revenue will be rewarded.` :
                          formData.metric === 'reviews' ? `Users with ${formData.qualifierValue} or more 5-star reviews will be rewarded.` :
                            formData.metric === 'completion' ? `Users with a completion rate of ${formData.qualifierValue}% or higher will be rewarded.` :
                              `Users meeting the threshold of ${formData.qualifierValue} will be rewarded.`}
                  </p>
                </div>
              )}
            </div>
          );
        case 5: // Payout
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Reward Amount</label>

                {formData.qualifierType === 'top_n' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: formData.qualifierValue || 0 }).map((_, index) => (
                      <div key={index} style={{ padding: '8px 12px', border: `1px solid ${currentTheme.border}`, borderRadius: '8px', backgroundColor: `${currentTheme.background}50`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ minWidth: '80px', margin: 0, color: currentTheme.textPrimary, fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                          <Trophy size={13} style={{ display: 'inline', marginRight: '6px', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : currentTheme.textSecondary }} />
                          Rank #{index + 1}
                        </label>
                        <div style={{ display: 'flex', flex: 1, gap: '12px' }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: currentTheme.textSecondary, minWidth: '35px' }}>Points:</span>
                            <input
                              type="number"
                              placeholder="0"
                              value={formData.tieredRewards?.[index] || ''}
                              onChange={e => {
                                const points = parseInt(e.target.value) || 0;
                                const newTieredRewards = [...(formData.tieredRewards || [])];
                                newTieredRewards[index] = points;
                                setFormData({ ...formData, tieredRewards: newTieredRewards });
                                if (errors[`tieredReward_${index}`]) {
                                  const newErrors = { ...errors };
                                  delete newErrors[`tieredReward_${index}`];
                                  setErrors(newErrors);
                                }
                              }}
                              disabled={isActive}
                              style={{
                                width: '100%',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${errors[`tieredReward_${index}`] ? currentTheme.danger : currentTheme.border}`,
                                backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                                color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                                cursor: isActive ? 'not-allowed' : 'text',
                                fontSize: '13px'
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: currentTheme.textSecondary, minWidth: '35px' }}>Cash:</span>
                            <input
                              type="number"
                              placeholder="$0.00"
                              value={((formData.tieredRewards?.[index] || 0) / 25).toFixed(2)}
                              onChange={e => {
                                const cash = parseFloat(e.target.value) || 0;
                                const points = Math.round(cash * 25);
                                const newTieredRewards = [...(formData.tieredRewards || [])];
                                newTieredRewards[index] = points;
                                setFormData({ ...formData, tieredRewards: newTieredRewards });
                                if (errors[`tieredReward_${index}`]) {
                                  const newErrors = { ...errors };
                                  delete newErrors[`tieredReward_${index}`];
                                  setErrors(newErrors);
                                }
                              }}
                              disabled={isActive}
                              step="0.01"
                              style={{
                                width: '100%',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${errors[`tieredReward_${index}`] ? currentTheme.danger : currentTheme.border}`,
                                backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                                color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                                cursor: isActive ? 'not-allowed' : 'text',
                                fontSize: '13px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: currentTheme.textSecondary }}>Points</label>
                      <input
                        type="number"
                        value={formData.rewardAmount}
                        onChange={e => {
                          const points = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, rewardAmount: points });
                          if (errors.rewardAmount) setErrors({ ...errors, rewardAmount: false });
                        }}
                        disabled={isActive}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${errors.rewardAmount ? currentTheme.danger : currentTheme.border}`,
                          backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                          color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                          cursor: isActive ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: currentTheme.textSecondary }}>Cash Value ($)</label>
                      <input
                        type="number"
                        value={(formData.rewardAmount / 25).toFixed(2)}
                        onChange={e => {
                          const cash = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, rewardAmount: Math.round(cash * 25) });
                          if (errors.rewardAmount) setErrors({ ...errors, rewardAmount: false });
                        }}
                        disabled={isActive}
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${errors.rewardAmount ? currentTheme.danger : currentTheme.border}`,
                          backgroundColor: isActive ? `${currentTheme.background}80` : currentTheme.background,
                          color: isActive ? currentTheme.textSecondary : currentTheme.textPrimary,
                          cursor: isActive ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>
                  </div>
                )}

                <p style={{ marginTop: '8px', fontSize: '12px', color: currentTheme.textSecondary }}>
                  Conversion Rate: 25 Points = $1.00
                </p>
                {isActive && <LockedFieldIndicator label="Reward Amount" />}
              </div>

              {formData.qualifierType === 'top_n' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Tie Breaker Rule</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      onClick={() => !isActive && setFormData({ ...formData, tieBreakerRule: 'standard' })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.tieBreakerRule === 'standard' ? currentTheme.primary : currentTheme.border}`,
                        backgroundColor: formData.tieBreakerRule === 'standard' ? `${currentTheme.primary}05` : 'transparent',
                        cursor: isActive ? 'not-allowed' : 'pointer',
                        opacity: isActive ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${formData.tieBreakerRule === 'standard' ? currentTheme.primary : currentTheme.textSecondary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {formData.tieBreakerRule === 'standard' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                        </div>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Standard (1224)</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                        Tied users share the rank. The next rank is skipped (e.g., 1st, 2nd, 2nd, 4th).
                      </p>
                    </div>

                    <div
                      onClick={() => !isActive && setFormData({ ...formData, tieBreakerRule: 'dense' })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.tieBreakerRule === 'dense' ? currentTheme.primary : currentTheme.border}`,
                        backgroundColor: formData.tieBreakerRule === 'dense' ? `${currentTheme.primary}05` : 'transparent',
                        cursor: isActive ? 'not-allowed' : 'pointer',
                        opacity: isActive ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${formData.tieBreakerRule === 'dense' ? currentTheme.primary : currentTheme.textSecondary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {formData.tieBreakerRule === 'dense' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                        </div>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Dense (1223)</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                        Tied users share the rank. The next rank is NOT skipped (e.g., 1st, 2nd, 2nd, 3rd).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.qualifierType === 'top_n' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Tie Breaker Payout</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      onClick={() => !isActive && setFormData({ ...formData, tieBreakerPayout: 'full' })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.tieBreakerPayout === 'full' ? currentTheme.primary : currentTheme.border}`,
                        backgroundColor: formData.tieBreakerPayout === 'full' ? `${currentTheme.primary}05` : 'transparent',
                        cursor: isActive ? 'not-allowed' : 'pointer',
                        opacity: isActive ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${formData.tieBreakerPayout === 'full' ? currentTheme.primary : currentTheme.textSecondary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {formData.tieBreakerPayout === 'full' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                        </div>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Full Payout</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                        Each tied winner receives the full reward amount for their rank.
                      </p>
                    </div>

                    <div
                      onClick={() => !isActive && setFormData({ ...formData, tieBreakerPayout: 'split' })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: `2px solid ${formData.tieBreakerPayout === 'split' ? currentTheme.primary : currentTheme.border}`,
                        backgroundColor: formData.tieBreakerPayout === 'split' ? `${currentTheme.primary}05` : 'transparent',
                        cursor: isActive ? 'not-allowed' : 'pointer',
                        opacity: isActive ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${formData.tieBreakerPayout === 'split' ? currentTheme.primary : currentTheme.textSecondary}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {formData.tieBreakerPayout === 'split' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                        </div>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Split Payout</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                        The reward amount for the rank is split equally among tied winners.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: currentTheme.textPrimary, fontWeight: '500' }}>Payout Method</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    onClick={() => !isActive && setFormData({ ...formData, payoutMethod: 'automatic' })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${formData.payoutMethod === 'automatic' ? currentTheme.primary : currentTheme.border}`,
                      backgroundColor: formData.payoutMethod === 'automatic' ? `${currentTheme.primary}05` : 'transparent',
                      cursor: isActive ? 'not-allowed' : 'pointer',
                      opacity: isActive ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `2px solid ${formData.payoutMethod === 'automatic' ? currentTheme.primary : currentTheme.textSecondary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.payoutMethod === 'automatic' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                      </div>
                      <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Automatic</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                      Once the campaign is done, rewards will automatically be paid out to the participants.
                    </p>
                  </div>

                  <div
                    onClick={() => !isActive && setFormData({ ...formData, payoutMethod: 'manual' })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${formData.payoutMethod === 'manual' ? currentTheme.primary : currentTheme.border}`,
                      backgroundColor: formData.payoutMethod === 'manual' ? `${currentTheme.primary}05` : 'transparent',
                      cursor: isActive ? 'not-allowed' : 'pointer',
                      opacity: isActive ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `2px solid ${formData.payoutMethod === 'manual' ? currentTheme.primary : currentTheme.textSecondary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.payoutMethod === 'manual' && <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: currentTheme.primary }} />}
                      </div>
                      <span style={{ fontWeight: '600', color: currentTheme.textPrimary, fontSize: '14px' }}>Manual</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: currentTheme.textSecondary, lineHeight: '1.3' }}>
                      You will need to manually review and approve each person's payout before it is sent.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: `${currentTheme.primary}10`, borderRadius: '8px', border: `1px solid ${currentTheme.primary}30` }}>
                <h4 style={{ margin: '0 0 8px 0', color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} /> Estimated Spend
                </h4>
                {(() => {
                  const participantCount = formData.participants.length; // This is actually IDs, need to check if groups are selected
                  // Calculate actual unique user count
                  let uniqueUserIds = new Set<string>();
                  formData.participants.forEach(p => {
                    if (['Technicians', 'Sales', 'CSRs'].includes(p)) {
                      MOCK_USERS.filter(u => u.role === p).forEach(u => uniqueUserIds.add(u.id));
                    } else {
                      uniqueUserIds.add(p);
                    }
                  });
                  const totalUsers = uniqueUserIds.size;

                  let estimatedWinners = totalUsers;
                  let isMax = true;
                  let totalPoints = 0;

                  if (formData.qualifierType === 'top_n') {
                    estimatedWinners = Math.min(formData.qualifierValue || 0, totalUsers);
                    isMax = false; // Exact count
                    // Calculate total points from tiered rewards, up to the number of estimated winners
                    const rewards = formData.tieredRewards || [];
                    for (let i = 0; i < estimatedWinners; i++) {
                      totalPoints += (rewards[i] || 0);
                    }
                  } else {
                    // Threshold and Everyone are "Max" estimates because not everyone might qualify
                    if (formData.qualifierType === 'everyone') isMax = false; // Everyone gets it
                    totalPoints = estimatedWinners * formData.rewardAmount;
                  }

                  const totalCash = totalPoints / 25;

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: currentTheme.textSecondary }}>Target Audience:</span>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary }}>{totalUsers} Users</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: currentTheme.textSecondary }}>{isMax ? 'Max Potential Winners:' : 'Estimated Winners:'}</span>
                        <span style={{ fontWeight: '600', color: currentTheme.textPrimary }}>{estimatedWinners} Users</span>
                      </div>
                      <div style={{ borderTop: `1px solid ${currentTheme.primary}30`, paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: currentTheme.primary, fontWeight: '600' }}>{isMax ? 'Max Total Spend:' : 'Total Spend:'}</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: currentTheme.primary, fontWeight: '700', fontSize: '18px' }}>{totalPoints.toLocaleString()} Points</div>
                          <div style={{ color: currentTheme.primary, fontSize: '12px' }}>(${totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</div>
                        </div>
                      </div>
                      {formData.qualifierType === 'top_n' && formData.tieBreakerPayout === 'full' && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: currentTheme.warning, fontStyle: 'italic' }}>
                          * Actual spend may be higher if multiple users tie for a rank (Full Payout enabled).
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return createPortal(
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999 // Increased z-index
      }}>
        <div style={{
          backgroundColor: currentTheme.cardBg,
          width: '600px',
          maxWidth: '90%',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)' // Added shadow for depth
        }}>
          {/* Header */}
          <div style={{ padding: '24px', borderBottom: `1px solid ${currentTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, color: currentTheme.textPrimary, fontSize: '20px' }}>
                {isEditing ? 'Edit Campaign' : 'New Campaign Setup'}
              </h2>
              {isActive && (
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: currentTheme.warning, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Some fields are locked because this campaign is active.
                </p>
              )}
            </div>
            <button onClick={() => setShowWizard(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentTheme.textSecondary }}>
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div style={{ padding: '20px 24px', backgroundColor: `${currentTheme.primary}05`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActiveStep = s.id === step;
              const isCompleted = s.id < step;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isActiveStep || isCompleted ? 1 : 0.5 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isActiveStep ? currentTheme.primary : isCompleted ? currentTheme.success : currentTheme.border,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: currentTheme.textPrimary, display: window.innerWidth > 600 ? 'block' : 'none' }}>{s.title}</span>
                </div>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div style={{ padding: '24px', borderTop: `1px solid ${currentTheme.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {isEditing && (isActive || editingCampaign.status === 'pending') && (
                <button
                  onClick={handleWizardCancel}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.danger}`,
                    backgroundColor: 'transparent',
                    color: currentTheme.danger,
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel Campaign
                </button>
              )}
              <button
                onClick={handleBack}
                disabled={step === 1}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.border}`,
                  backgroundColor: 'transparent',
                  color: step === 1 ? currentTheme.textSecondary : currentTheme.textPrimary,
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Back
              </button>
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currentTheme.primary,
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {step === 5 ? (isEditing ? 'Save Changes' : 'Create Campaign') : 'Next'}
              {step < 5 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };


  const renderTabButton = (id: TabType, label: string, icon: React.ElementType) => {
    const isActive = activeTab === id;
    const Icon = icon;
    return (
      <button
        onClick={() => setActiveTab(id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: isActive ? currentTheme.primary : 'transparent',
          color: isActive ? '#FFFFFF' : currentTheme.textSecondary,
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  };

  // Helper to get metric label
  const getMetricLabel = (metric?: string) => {
    switch (metric) {
      case 'pro_score': return 'Pro Score';
      case 'revenue': return 'Total Revenue';
      case 'reviews': return '5-Star Reviews';
      case 'completion': return 'Job Completion Rate';
      case 'referrals': return 'Referrals';
      default: return metric || 'Custom Metric';
    }
  };

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const renderCampaigns = () => {
    const visibleCampaigns = campaigns.filter(c => showArchived ? c.isArchived : !c.isArchived);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '24px' }}>
              {showArchived ? 'Archived Campaigns' : 'Active Campaigns'}
            </h2>
            <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
              {showArchived ? 'View past campaigns' : 'Manage your automated and manual reward programs'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', backgroundColor: currentTheme.background, borderRadius: '8px', padding: '4px', border: `1px solid ${currentTheme.border}` }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? currentTheme.cardBg : 'transparent',
                  color: viewMode === 'grid' ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: viewMode === 'grid' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'
                }}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'list' ? currentTheme.cardBg : 'transparent',
                  color: viewMode === 'list' ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: viewMode === 'list' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'
                }}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: currentTheme.border }}></div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: currentTheme.textSecondary, fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={showArchived}
                onChange={e => setShowArchived(e.target.checked)}
              />
              Show Archived
            </label>
            <button
              onClick={handleNewCampaign}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: currentTheme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              New Campaign
            </button>
          </div>
        </div>

        {visibleCampaigns.length === 0 && (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: currentTheme.textSecondary,
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            border: `1px solid ${currentTheme.border}`
          }}>
            <p>No {showArchived ? 'archived' : 'active'} campaigns found.</p>
          </div>
        )}

        {viewMode === 'list' ? (
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            border: `1px solid ${currentTheme.border}`,
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${currentTheme.border}`, backgroundColor: `${currentTheme.background}50` }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>STATUS</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>CAMPAIGN</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>SCHEDULE</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>REWARD</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>PAID OUT</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {visibleCampaigns.map(campaign => {
                  const StatusIcon = getStatusIcon(campaign.status);
                  const statusColor = getStatusColor(campaign.status);
                  const endDate = calculateEndDate(campaign.startDate || '', campaign.duration || 1, campaign.recurrence || 'none', campaign.customRecurrenceDays);

                  let cycleLabel = 'Run';
                  if (campaign.recurrence === 'monthly') cycleLabel = 'Month';
                  if (campaign.recurrence === 'weekly') cycleLabel = 'Week';
                  if (campaign.recurrence === 'biweekly') cycleLabel = 'Cycle';
                  if (campaign.recurrence === 'quarterly') cycleLabel = 'Quarter';
                  if (campaign.recurrence === 'custom') cycleLabel = 'Cycle';

                  return (
                    <tr key={campaign.id} style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }} title={campaign.status.toUpperCase()}>
                          <StatusIcon size={16} />
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: currentTheme.textPrimary }}>{campaign.name}</div>
                        <div style={{ fontSize: '12px', color: currentTheme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Target size={12} />
                          {getMetricLabel(campaign.metric)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
                          {formatDate(campaign.startDate || '')} - {endDate}
                        </div>
                        {campaign.recurrence !== 'none' && (
                          <div style={{ fontSize: '12px', color: currentTheme.textSecondary }}>
                            {cycleLabel} {campaign.currentCycle} of {campaign.duration}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: currentTheme.textPrimary }}>
                          {campaign.rewardType === 'currency' ? `$${campaign.rewardAmount}` : `${campaign.rewardAmount} pts`}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: currentTheme.textPrimary }}>{campaign.totalRecipients || 0} Users</div>
                        <div style={{ fontSize: '12px', color: currentTheme.textSecondary }}>
                          Total: {campaign.rewardType === 'currency' ? `$${campaign.totalPayouts}` : `${campaign.totalPayouts} pts`}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            style={{
                              padding: '8px',
                              borderRadius: '6px',
                              border: `1px solid ${currentTheme.border}`,
                              backgroundColor: 'transparent',
                              color: currentTheme.textPrimary,
                              cursor: 'pointer'
                            }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          {!campaign.isArchived && (
                            <button
                              onClick={() => handleCancelOrDeleteClick(campaign)}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: `1px solid ${currentTheme.border}`,
                                backgroundColor: 'transparent',
                                color: campaign.status === 'running' || campaign.status === 'pending' ? currentTheme.danger : currentTheme.warning,
                                cursor: 'pointer'
                              }}
                              title={campaign.status === 'running' || campaign.status === 'pending' ? 'Cancel Campaign' : 'Archive Campaign'}
                            >
                              {campaign.status === 'running' || campaign.status === 'pending' ? <Ban size={16} /> : <CheckSquare size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {visibleCampaigns.map(campaign => {
              const StatusIcon = getStatusIcon(campaign.status);
              const statusColor = getStatusColor(campaign.status);
              const endDate = calculateEndDate(campaign.startDate || '', campaign.duration || 1, campaign.recurrence || 'none', campaign.customRecurrenceDays);

              // Determine cycle label
              let cycleLabel = 'Run';
              if (campaign.recurrence === 'monthly') cycleLabel = 'Month';
              if (campaign.recurrence === 'weekly') cycleLabel = 'Week';
              if (campaign.recurrence === 'biweekly') cycleLabel = 'Cycle';
              if (campaign.recurrence === 'quarterly') cycleLabel = 'Quarter';
              if (campaign.recurrence === 'custom') cycleLabel = 'Cycle';

              return (
                <div key={campaign.id} style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  opacity: campaign.isArchived ? 0.7 : 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: campaign.type === 'automated' ? `${currentTheme.primary}20` : `${currentTheme.accent}20`,
                      color: campaign.type === 'automated' ? currentTheme.primary : currentTheme.accent
                    }}>
                      {campaign.type === 'automated' ? <Settings size={20} /> : <Gift size={20} />}
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: `${statusColor}20`,
                      color: statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <StatusIcon size={12} />
                      {campaign.status.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '18px' }}>{campaign.name}</h3>
                    <div style={{ fontSize: '14px', color: currentTheme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={14} />
                      {getMetricLabel(campaign.metric)}
                    </div>
                  </div>

                  {/* Timeline & Occurrence Info */}
                  <div style={{
                    padding: '12px',
                    backgroundColor: currentTheme.background,
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: currentTheme.textSecondary }}>Start: {formatDate(campaign.startDate || '')}</span>
                      <span style={{ color: currentTheme.textSecondary }}>End: {endDate}</span>
                    </div>
                    {campaign.recurrence !== 'none' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: `${currentTheme.border}`, borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${((campaign.currentCycle || 0) / (campaign.duration || 1)) * 100}%`,
                            height: '100%',
                            backgroundColor: currentTheme.primary
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: currentTheme.textPrimary }}>
                          {cycleLabel} {campaign.currentCycle} of {campaign.duration}
                        </span>
                      </div>
                    )}
                    {campaign.recurrence === 'none' && (
                      <div style={{ fontSize: '12px', color: currentTheme.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> One-time event
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${currentTheme.border}` }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Reward</p>
                      <p style={{ color: currentTheme.textPrimary, fontWeight: '600', margin: 0 }}>
                        {campaign.rewardType === 'currency' ? `$${campaign.rewardAmount}` : `${campaign.rewardAmount} pts`}
                      </p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Paid Out</p>
                      <p style={{ color: currentTheme.textPrimary, fontWeight: '600', margin: 0 }}>
                        {campaign.totalRecipients || 0} Users
                      </p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 4px 0' }}>Total</p>
                      <p style={{ color: currentTheme.textPrimary, fontWeight: '600', margin: 0 }}>
                        {campaign.rewardType === 'currency' ? `$${campaign.totalPayouts}` : `${campaign.totalPayouts} pts`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => handleEditCampaign(campaign)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: `1px solid ${currentTheme.border}`,
                        backgroundColor: 'transparent',
                        color: currentTheme.textPrimary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    {!campaign.isArchived && (
                      <button
                        onClick={() => handleCancelOrDeleteClick(campaign)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor: 'transparent',
                          color: campaign.status === 'running' || campaign.status === 'pending' ? currentTheme.danger : currentTheme.warning,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '14px'
                        }}
                        title={campaign.status === 'running' || campaign.status === 'pending' ? 'Cancel Campaign' : 'Archive Campaign'}
                      >
                        {campaign.status === 'running' || campaign.status === 'pending' ? (
                          <>
                            <Ban size={14} /> Cancel
                          </>
                        ) : (
                          <>
                            <CheckSquare size={14} /> Archive
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderPayouts = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '24px' }}>Payout History</h2>
          <p style={{ color: currentTheme.textSecondary, margin: 0 }}>Track all rewards sent to customers and employees</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: currentTheme.textSecondary }} />
            <input
              type="text"
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 16px 10px 40px',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.border}`,
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                outline: 'none',
                width: '250px'
              }}
            />
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: currentTheme.cardBg,
            color: currentTheme.textPrimary,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <Filter size={18} />
            Filter
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: currentTheme.cardBg,
            color: currentTheme.textPrimary,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        border: `1px solid ${currentTheme.border}`,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${currentTheme.border}`, backgroundColor: `${currentTheme.primary}05` }}>
              <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Recipient</th>
              <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Campaign</th>
              <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '16px', textAlign: 'left', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right', color: currentTheme.textSecondary, fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayouts.map(payout => (
              <tr key={payout.id} style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                <td style={{ padding: '16px', color: currentTheme.textPrimary }}>{formatDate(payout.date)}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>{payout.recipientName}</div>
                  <div style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>{payout.recipientEmail}</div>
                </td>
                <td style={{ padding: '16px', color: currentTheme.textPrimary }}>{payout.campaignName}</td>
                <td style={{ padding: '16px', color: currentTheme.textPrimary, fontWeight: '600' }}>
                  {payout.amount > 100 ? `${payout.amount} pts` : `$${payout.amount}`}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor:
                      payout.status === 'sent' ? `${currentTheme.success}20` :
                        payout.status === 'pending' ? `${currentTheme.warning}20` :
                          `${currentTheme.danger}20`,
                    color:
                      payout.status === 'sent' ? currentTheme.success :
                        payout.status === 'pending' ? currentTheme.warning :
                          currentTheme.danger
                  }}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentTheme.textSecondary }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '24px' }}>Program Settings</h2>
        <p style={{ color: currentTheme.textSecondary, margin: 0 }}>Configure your rewards program preferences</p>
      </div>

      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${currentTheme.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: `1px solid ${currentTheme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#E6F4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src="https://assets-global.website-files.com/65368697d936946872869673/65453f693359824b49848742_Snappy%20Logo.svg" alt="Snappy" style={{ width: '28px', height: '28px' }} />
            </div>
            <div>
              <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '16px' }}>Snappy Connection</h3>
              <p style={{ color: currentTheme.success, margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> Connected to Cross Pest Control ID: 1
              </p>
            </div>
          </div>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: 'transparent',
            color: currentTheme.textPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Manage <ExternalLink size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '16px' }}>Enable Rewards Program</h4>
            <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>Allow customers to earn and redeem rewards</p>
          </div>
          <div
            onClick={() => setRewardsEnabled(!rewardsEnabled)}
            style={{
              width: '48px',
              height: '24px',
              backgroundColor: rewardsEnabled ? currentTheme.success : currentTheme.border,
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: rewardsEnabled ? '26px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '16px' }}>Auto-Approve Payouts</h4>
            <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>Automatically send rewards for automated campaigns</p>
          </div>
          <div
            onClick={() => setAutoApprove(!autoApprove)}
            style={{
              width: '48px',
              height: '24px',
              backgroundColor: autoApprove ? currentTheme.success : currentTheme.border,
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: autoApprove ? '26px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '16px' }}>Payout Notifications</h4>
            <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>Receive an email when a reward is sent</p>
          </div>
          <div
            onClick={() => setNotifyOnPayout(!notifyOnPayout)}
            style={{
              width: '48px',
              height: '24px',
              backgroundColor: notifyOnPayout ? currentTheme.success : currentTheme.border,
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: notifyOnPayout ? '26px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* Top Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: `1px solid ${currentTheme.border}`,
        paddingBottom: '16px'
      }}>
        {renderTabButton('campaigns', 'Campaigns', Trophy)}
        {renderTabButton('payouts', 'Payout Points', History)}
        {renderTabButton('settings', 'Settings', Settings)}
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'payouts' && renderPayouts()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Wizard Modal */}
      {showWizard && <CampaignWizard />}

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};

export default RewardsPage;