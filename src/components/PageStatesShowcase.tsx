import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  MousePointer,
  Crosshair,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  Ban,
  Loader2,
  Check,
  AlertCircle,
  AlertTriangle,
  Inbox,
  FileCode,
  WifiOff,
  ShieldAlert,
  KeyRound,
  HelpCircle,
  Wrench,
  Lock,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  Eye,
  Asterisk,
  Clock,
  Cpu,
  CheckCheck,
  XCircle,
  Hourglass,
  FileEdit,
  Globe,
  Archive,
  SearchX,
  PieChart,
  RefreshCw,
  RotateCw,
  Save,
  BookmarkCheck,
  Trash2,
  UploadCloud,
  DownloadCloud,
  Radio,
  Search,
  Maximize2,
  Minimize2,
  ArrowRight,
  ShieldCheck,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { PageStateId, PageStateCategory, PageStateMeta } from '../types';

interface PageStatesShowcaseProps {
  onNavigateHome?: () => void;
  onNavigateMenu?: () => void;
}

export const ALL_PAGE_STATES: PageStateMeta[] = [
  // 1. Interaction
  {
    id: 'default',
    label: 'Default',
    category: 'Interaction',
    description: 'The pristine, resting state of elements before any pointer or keyboard engagement occurs.',
    badgeTone: 'neutral',
  },
  {
    id: 'hover',
    label: 'Hover',
    category: 'Interaction',
    description: 'Elevated visual feedback, subtle shadow depth, and micro-motion triggered by pointer cursor presence.',
    badgeTone: 'accent',
  },
  {
    id: 'focus',
    label: 'Focus',
    category: 'Interaction',
    description: 'High-contrast accessible focus ring and typographic prominence during keyboard tab navigation.',
    badgeTone: 'info',
  },
  {
    id: 'active',
    label: 'Active',
    category: 'Interaction',
    description: 'Currently engaged route, live extraction timer, or active selected atelier workshop station.',
    badgeTone: 'accent',
  },
  {
    id: 'pressed',
    label: 'Pressed',
    category: 'Interaction',
    description: 'Tactile physical press down (active mouse down/touch) with inset shadow and optical scale compression.',
    badgeTone: 'neutral',
  },
  {
    id: 'selected',
    label: 'Selected',
    category: 'Interaction',
    description: 'Chosen micro-lot or harvest allocation with dark contrast ring and confirmation token.',
    badgeTone: 'accent',
  },
  {
    id: 'disabled',
    label: 'Disabled',
    category: 'Interaction',
    description: 'Unavailable seasonal allocation or non-actionable button with muted opacity and blocked cursor.',
    badgeTone: 'neutral',
  },

  // 2. Feedback & Async
  {
    id: 'loading',
    label: 'Loading',
    category: 'Feedback & Async',
    description: 'Active continuous async request, espresso extraction telemetry, or cupping calculation.',
    badgeTone: 'accent',
  },
  {
    id: 'success',
    label: 'Success',
    category: 'Feedback & Async',
    description: 'Successful transaction verification, roast parameter validation, or order dispatch confirmation.',
    badgeTone: 'success',
  },
  {
    id: 'error',
    label: 'Error',
    category: 'Feedback & Async',
    description: 'Payment declination, sensor malfunction, or temperature breach outside acceptable tolerances.',
    badgeTone: 'error',
  },
  {
    id: 'warning',
    label: 'Warning',
    category: 'Feedback & Async',
    description: 'Critical inventory scarcity notification (< 3 bags remain) or water boiler scaling advisory.',
    badgeTone: 'warning',
  },
  {
    id: 'empty',
    label: 'Empty',
    category: 'Feedback & Async',
    description: 'Zero items in atelier tasting flight, empty harvest allocation, or cleared roast logs.',
    badgeTone: 'neutral',
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    category: 'Feedback & Async',
    description: 'Shimmering geometric wireframe placeholder maintaining layout stability prior to asset render.',
    badgeTone: 'neutral',
  },
  {
    id: 'no_results',
    label: 'No Results',
    category: 'Feedback & Async',
    description: 'Zero harvest lots matching restrictive cupping score or anaerobic processing filter parameters.',
    badgeTone: 'neutral',
  },
  {
    id: 'partial',
    label: 'Partial',
    category: 'Feedback & Async',
    description: 'Split fulfillment status where primary whole bean bag is shipped while artisan ceramic dripper is on backorder.',
    badgeTone: 'warning',
  },

  // 3. Access & Security
  {
    id: 'offline',
    label: 'Offline',
    category: 'Access & Security',
    description: 'Local cache mode active without cellular or Wi-Fi connectivity; read-only harvest notes served.',
    badgeTone: 'warning',
  },
  {
    id: 'restricted',
    label: 'Restricted',
    category: 'Access & Security',
    description: 'Atelier Private Cellar restricted exclusively to certified SCA Q-Graders and Guild members.',
    badgeTone: 'error',
  },
  {
    id: 'authentication',
    label: 'Authentication',
    category: 'Access & Security',
    description: 'Passkey / cryptographic biometric prompt required to release reserve harvest allocations.',
    badgeTone: 'info',
  },
  {
    id: 'not_found',
    label: 'Not Found',
    category: 'Access & Security',
    description: '404 Missing harvest dossier or obsolete auction lot URL with graceful navigation recovery.',
    badgeTone: 'neutral',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    category: 'Access & Security',
    description: 'Scheduled roastery calibration: Giesen drum sensor overhaul and laser burr re-alignment.',
    badgeTone: 'warning',
  },
  {
    id: 'locked',
    label: 'Locked',
    category: 'Access & Security',
    description: 'Sealed humidity-controlled green coffee vault #04 locked awaiting Q-Grader keycard access.',
    badgeTone: 'error',
  },
  {
    id: 'connection_lost',
    label: 'Connection Lost',
    category: 'Access & Security',
    description: 'Immediate signal interruption between roast datalogger probe and live telemetry canvas.',
    badgeTone: 'error',
  },

  // 4. Form & Input
  {
    id: 'expanded',
    label: 'Expanded',
    category: 'Form & Input',
    description: 'Accordion drawer open revealing full soil mineral breakdown, altitude logs, and brew curve.',
    badgeTone: 'accent',
  },
  {
    id: 'collapsed',
    label: 'Collapsed',
    category: 'Form & Input',
    description: 'Compact accordion summary displaying high-level title and expand chevron affordance.',
    badgeTone: 'neutral',
  },
  {
    id: 'checked',
    label: 'Checked',
    category: 'Form & Input',
    description: 'Active affirmative selection for monthly micro-lot roaster allocation subscription.',
    badgeTone: 'accent',
  },
  {
    id: 'unchecked',
    label: 'Unchecked',
    category: 'Form & Input',
    description: 'Clear, neutral checkbox awaiting user consent or option opt-in.',
    badgeTone: 'neutral',
  },
  {
    id: 'indeterminate',
    label: 'Indeterminate',
    category: 'Form & Input',
    description: 'Mixed selection across multiple harvest lots (some bags chosen, some omitted in batch action).',
    badgeTone: 'info',
  },
  {
    id: 'read_only',
    label: 'Read-only',
    category: 'Form & Input',
    description: 'Certified SCA cupping evaluation form locked against edits to preserve grade integrity.',
    badgeTone: 'neutral',
  },
  {
    id: 'required',
    label: 'Required',
    category: 'Form & Input',
    description: 'Mandatory field (e.g. Mahlkönig grind calibration specification) highlighted with asterisk indicator.',
    badgeTone: 'error',
  },
  {
    id: 'optional',
    label: 'Optional',
    category: 'Form & Input',
    description: 'Supplementary field (e.g. personalized barista dedication gift note) marked as non-mandatory.',
    badgeTone: 'neutral',
  },

  // 5. Lifecycle & Records
  {
    id: 'draft',
    label: 'Draft',
    category: 'Lifecycle & Records',
    description: 'Unpublished harvest lot profile saved locally by roastmaster before cupping panel approval.',
    badgeTone: 'warning',
  },
  {
    id: 'published',
    label: 'Published',
    category: 'Lifecycle & Records',
    description: 'Live public catalog release visible globally to specialty coffee purveyors.',
    badgeTone: 'success',
  },
  {
    id: 'archived',
    label: 'Archived',
    category: 'Lifecycle & Records',
    description: 'Historical vintage 2023 Ethiopian Guji harvest season archived for archival reference.',
    badgeTone: 'neutral',
  },
  {
    id: 'pending',
    label: 'Pending',
    category: 'Lifecycle & Records',
    description: 'Consignment shipment #AU-992 awaiting green bean phytosanitary customs release.',
    badgeTone: 'warning',
  },
  {
    id: 'processing',
    label: 'Processing',
    category: 'Lifecycle & Records',
    description: 'Roast profile batch #402 currently rotating inside the convective drum at 204.5°C.',
    badgeTone: 'info',
  },
  {
    id: 'completed',
    label: 'Completed',
    category: 'Lifecycle & Records',
    description: 'Extraction protocol complete; TDS score 1.38% with 21.2% optimal extraction yield verified.',
    badgeTone: 'success',
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    category: 'Lifecycle & Records',
    description: 'Reservation cancelled by patron; allocation returned to inventory with receipt generated.',
    badgeTone: 'neutral',
  },
  {
    id: 'expired',
    label: 'Expired',
    category: 'Lifecycle & Records',
    description: '15-minute reservation timer on Panama Geisha auction lot expired and opened to waitlist.',
    badgeTone: 'error',
  },

  // 6. Network & Transfer
  {
    id: 'syncing',
    label: 'Syncing',
    category: 'Network & Transfer',
    description: 'Bi-directional synchronization of roast curves between Tokyo and Copenhagen roasteries.',
    badgeTone: 'info',
  },
  {
    id: 'updating',
    label: 'Updating',
    category: 'Network & Transfer',
    description: 'Pushing firmware patch v4.12 to precision water flow meters and grouphead pressure gauges.',
    badgeTone: 'accent',
  },
  {
    id: 'saving',
    label: 'Saving',
    category: 'Network & Transfer',
    description: 'Persisting barista cupping score notes to encrypted secure cloud storage.',
    badgeTone: 'info',
  },
  {
    id: 'saved',
    label: 'Saved',
    category: 'Network & Transfer',
    description: 'All harvest edits and roasting parameters safely stored in persistent roastery records.',
    badgeTone: 'success',
  },
  {
    id: 'deleted',
    label: 'Deleted',
    category: 'Network & Transfer',
    description: 'Discarded batch record moved to roastery archive trash with instant undo window.',
    badgeTone: 'error',
  },
  {
    id: 'uploading',
    label: 'Uploading',
    category: 'Network & Transfer',
    description: 'Streaming high-resolution spectrometer bean density scan (74% completed).',
    badgeTone: 'accent',
  },
  {
    id: 'downloading',
    label: 'Downloading',
    category: 'Network & Transfer',
    description: 'Downloading full official SCA Certified Q-Grader Harvest Dossier PDF (14.2 MB).',
    badgeTone: 'info',
  },
];

export const PageStatesShowcase: React.FC<PageStatesShowcaseProps> = ({
  onNavigateHome,
  onNavigateMenu,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<PageStateId>('default');
  const [fullPageMode, setFullPageMode] = useState(false);

  // Interactive sample states
  const [interactivePressed, setInteractivePressed] = useState(false);
  const [interactiveChecked, setInteractiveChecked] = useState(true);
  const [interactiveExpanded, setInteractiveExpanded] = useState(true);
  const [interactiveSyncCounter, setInteractiveSyncCounter] = useState(0);

  const categories = ['All', 'Interaction', 'Feedback & Async', 'Access & Security', 'Form & Input', 'Lifecycle & Records', 'Network & Transfer'];

  const filteredStates = ALL_PAGE_STATES.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentState = ALL_PAGE_STATES.find((s) => s.id === selectedStateId) || ALL_PAGE_STATES[0];

  const getStateIcon = (id: PageStateId) => {
    switch (id) {
      case 'default': return <Layers className="w-5 h-5 text-[#9D8461]" />;
      case 'hover': return <MousePointer className="w-5 h-5 text-[#9D8461]" />;
      case 'focus': return <Crosshair className="w-5 h-5 text-blue-600" />;
      case 'active': return <Sparkles className="w-5 h-5 text-[#9D8461]" />;
      case 'pressed': return <Fingerprint className="w-5 h-5 text-[#1A1A18]" />;
      case 'selected': return <CheckCircle2 className="w-5 h-5 text-[#9D8461]" />;
      case 'disabled': return <Ban className="w-5 h-5 text-neutral-400" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-[#9D8461] animate-spin" />;
      case 'success': return <Check className="w-5 h-5 text-emerald-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'empty': return <Inbox className="w-5 h-5 text-neutral-400" />;
      case 'skeleton': return <FileCode className="w-5 h-5 text-neutral-400" />;
      case 'offline': return <WifiOff className="w-5 h-5 text-amber-600" />;
      case 'restricted': return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'authentication': return <KeyRound className="w-5 h-5 text-blue-600" />;
      case 'not_found': return <HelpCircle className="w-5 h-5 text-neutral-500" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'locked': return <Lock className="w-5 h-5 text-rose-600" />;
      case 'expanded': return <ChevronDown className="w-5 h-5 text-[#9D8461]" />;
      case 'collapsed': return <ChevronRight className="w-5 h-5 text-neutral-500" />;
      case 'checked': return <CheckSquare className="w-5 h-5 text-[#9D8461]" />;
      case 'unchecked': return <Square className="w-5 h-5 text-neutral-400" />;
      case 'indeterminate': return <MinusSquare className="w-5 h-5 text-blue-600" />;
      case 'read_only': return <Eye className="w-5 h-5 text-neutral-500" />;
      case 'required': return <Asterisk className="w-5 h-5 text-rose-600" />;
      case 'optional': return <HelpCircle className="w-5 h-5 text-neutral-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'processing': return <Cpu className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'completed': return <CheckCheck className="w-5 h-5 text-emerald-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-neutral-400" />;
      case 'expired': return <Hourglass className="w-5 h-5 text-rose-600" />;
      case 'draft': return <FileEdit className="w-5 h-5 text-amber-600" />;
      case 'published': return <Globe className="w-5 h-5 text-emerald-600" />;
      case 'archived': return <Archive className="w-5 h-5 text-neutral-500" />;
      case 'no_results': return <SearchX className="w-5 h-5 text-neutral-400" />;
      case 'partial': return <PieChart className="w-5 h-5 text-amber-600" />;
      case 'syncing': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'updating': return <RotateCw className="w-5 h-5 text-[#9D8461] animate-spin" />;
      case 'saving': return <Save className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'saved': return <BookmarkCheck className="w-5 h-5 text-emerald-600" />;
      case 'deleted': return <Trash2 className="w-5 h-5 text-rose-600" />;
      case 'uploading': return <UploadCloud className="w-5 h-5 text-[#9D8461] animate-bounce" />;
      case 'downloading': return <DownloadCloud className="w-5 h-5 text-blue-600" />;
      case 'connection_lost': return <Radio className="w-5 h-5 text-rose-600 animate-pulse" />;
      default: return <Layers className="w-5 h-5 text-[#9D8461]" />;
    }
  };

  // Render the specific, ultra-polished UI realization for the current state
  const renderStatePreview = (stateId: PageStateId) => {
    switch (stateId) {
      case 'default':
        return (
          <div className="p-8 rounded-2xl bg-white border border-[#1A1A18]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A18]/5 text-[#1A1A18] text-[10px] uppercase tracking-widest font-sans font-medium">
                Resting State
              </span>
              <span className="font-mono text-xs text-[#1A1A18]/50">Elevation: 0dp</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Ethiopia Guji Reserve • Grade 1</h3>
            <p className="font-sans text-sm text-[#1A1A18]/70 leading-relaxed">
              Pristine baseline presentation. Standard kerning, optical contrast ratio 8.2:1, unengaged button with neutral border.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium tracking-[0.06em] uppercase"
              >
                Reserve Harvest
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-full border border-[#1A1A18]/20 text-[#1A1A18] text-xs font-sans font-medium tracking-[0.06em] uppercase"
              >
                Inspect Dossier
              </button>
            </div>
          </div>
        );

      case 'hover':
        return (
          <div className="p-8 rounded-2xl bg-[#FCFBF9] border border-[#1A1A18]/30 shadow-[0_16px_36px_rgba(26,26,24,0.08)] -translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#9D8461]/15 text-[#9D8461] text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <MousePointer className="w-3 h-3" /> Cursor Hover Active
              </span>
              <span className="font-mono text-xs text-[#9D8461]">Elevation: +4dp • Scale: 1.015</span>
            </div>
            <h3 className="font-serif text-2xl text-[#9D8461]">Panama Geisha • Hacienda La Esmeralda</h3>
            <p className="font-sans text-sm text-[#1A1A18]/80 leading-relaxed">
              Hovered state with subtle warm-gold accent glow, micro-elevation, expanded shadow depth, and cursor feedback.
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full bg-[#9D8461] text-white text-xs font-sans font-medium tracking-[0.06em] uppercase shadow-sm"
            >
              Add to Sensory Flight
            </button>
          </div>
        );

      case 'focus':
        return (
          <div className="p-8 rounded-2xl bg-white border-2 border-[#1A1A18] ring-4 ring-[#9D8461]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <Crosshair className="w-3 h-3" /> Focus Visible (WCAG 2.2 AAA)
              </span>
              <span className="font-mono text-xs text-blue-600">Outline: 3px solid #9D8461</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Precision Extraction Grind Specification</h3>
            <input
              type="text"
              defaultValue="22 clicks • Comandante C40 MK4"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1A1A18] ring-2 ring-[#9D8461] text-sm font-mono text-[#1A1A18] bg-[#FAF9F6] outline-none"
            />
            <p className="font-sans text-xs text-[#1A1A18]/60">
              Clear keyboard navigation focus ring with accessible contrast exceeds 3:1 against surrounding surface.
            </p>
          </div>
        );

      case 'active':
        return (
          <div className="p-8 rounded-2xl bg-[#1A1A18] text-[#F8F7F4] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#9D8461] text-white text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Active Extraction Phase
              </span>
              <span className="font-mono text-xs text-[#9D8461]">Timer: 02:44 • 93.5°C</span>
            </div>
            <h3 className="font-serif text-2xl text-[#F8F7F4]">Currently Brewing: Gesha Anaerobic Slow-Drip</h3>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#9D8461] h-full w-2/3 animate-pulse" />
            </div>
            <p className="font-sans text-xs text-white/70">
              Indicates an ongoing active state: active route highlight, running extraction clock, and energized layout.
            </p>
          </div>
        );

      case 'pressed':
        return (
          <div className="p-8 rounded-2xl bg-[#F4F1EA] border border-[#1A1A18]/25 shadow-inner space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A18]/15 text-[#1A1A18] text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <Fingerprint className="w-3 h-3" /> Depressed / Pressed Down
              </span>
              <span className="font-mono text-xs text-[#1A1A18]/60">Scale: 0.98 • Box-Shadow: Inset</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Tactile Steam Pressure Solenoid</h3>
            <button
              type="button"
              onMouseDown={() => setInteractivePressed(true)}
              onMouseUp={() => setInteractivePressed(false)}
              className={`w-full py-3.5 rounded-xl border border-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.08em] transition-all ${
                interactivePressed
                  ? 'bg-[#1A1A18] text-white shadow-inner scale-[0.98]'
                  : 'bg-[#1A1A18]/90 text-white shadow-xs'
              }`}
            >
              {interactivePressed ? 'Solenoid Engaged (Release Mouse)' : 'Press & Hold Solenoid'}
            </button>
            <p className="font-sans text-xs text-[#1A1A18]/60 text-center">
              Physical button down-state with kinetic haptic response.
            </p>
          </div>
        );

      case 'selected':
        return (
          <div className="p-8 rounded-2xl bg-[#F8F7F4] border-2 border-[#1A1A18] shadow-sm space-y-4 relative">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-[10px] font-sans font-medium uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3 h-3" /> Selected Lot
            </div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#9D8461] font-sans font-medium">
              Harvest Lot #8821
            </span>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Kenya Nyeri Hill • AA Top Lot</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] font-mono">
                Phosphoric Acidity
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] font-mono">
                Blackcurrant • Jammy
              </span>
            </div>
            <p className="font-sans text-xs text-[#1A1A18]/70">
              Clear visual distinction for selected radio choice, harvest allocation, or active grinder hopper.
            </p>
          </div>
        );

      case 'disabled':
        return (
          <div className="p-8 rounded-2xl bg-neutral-100/70 border border-neutral-200 opacity-60 cursor-not-allowed select-none space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <Ban className="w-3 h-3" /> Allocation Depleted
              </span>
              <span className="font-mono text-xs text-neutral-400">pointer-events: none</span>
            </div>
            <h3 className="font-serif text-2xl text-neutral-500">Yemen Mocca Matari 1800m • Sold Out</h3>
            <p className="font-sans text-sm text-neutral-500">
              This seasonal micro-lot has exhausted available green stock. Interactivity is disabled with reduced contrast and no pointer trigger.
            </p>
            <button
              type="button"
              disabled
              className="px-5 py-2.5 rounded-full bg-neutral-300 text-neutral-500 text-xs font-sans font-medium uppercase tracking-[0.06em] cursor-not-allowed"
            >
              Waitlist Closed
            </button>
          </div>
        );

      case 'loading':
        return (
          <div className="p-8 rounded-2xl bg-white border border-[#1A1A18]/10 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#9D8461]/10 text-[#9D8461] text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Roastery Calibrating
              </span>
              <span className="font-mono text-xs text-[#9D8461]">ETA 1.8s</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-[#F2ECE4] rounded-md animate-pulse w-3/4" />
              <div className="h-3 bg-[#F2ECE4] rounded-md animate-pulse w-1/2" />
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1A1A18]/8 flex items-center gap-3">
              <Coffee className="w-5 h-5 text-[#9D8461] animate-bounce" />
              <span className="font-sans text-xs text-[#1A1A18]/70">
                Fetching real-time cupping sensory data from origin laboratory...
              </span>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] uppercase tracking-widest font-sans font-medium">
              Order Dispatched
            </span>
            <h3 className="font-serif text-2xl text-emerald-950">Allocation Token #AU-7749 Verified</h3>
            <p className="font-sans text-sm text-emerald-800/90 leading-relaxed">
              Your whole bean roast has passed infrared spectrometer verification (Agtron 64). Barista shipment label generated.
            </p>
            <div className="font-mono text-xs text-emerald-700 bg-emerald-100/80 px-3 py-2 rounded-lg">
              Dispatch: Counter Pickup • Ready in 4 minutes
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="p-8 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] uppercase tracking-widest font-sans font-medium">
              Extraction Anomaly
            </span>
            <h3 className="font-serif text-2xl text-rose-950">Boiler Pressure Fluctuation (12.4 Bar)</h3>
            <p className="font-sans text-sm text-rose-800/90 leading-relaxed">
              Pressure exceeded specialty coffee tolerance limit of 9.2 Bar. Extraction auto-vented to prevent over-extraction.
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-rose-800 text-white text-xs font-sans font-medium uppercase tracking-[0.06em] hover:bg-rose-900"
            >
              Purge Grouphead & Retry
            </button>
          </div>
        );

      case 'warning':
        return (
          <div className="p-8 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] uppercase tracking-widest font-sans font-medium">
              Harvest Scarcity Advisory
            </span>
            <h3 className="font-serif text-2xl text-amber-950">Only 2 Bags Remaining of 2026 Lot</h3>
            <p className="font-sans text-sm text-amber-800/90 leading-relaxed">
              High allocation demand on Colombia Pink Bourbon. Next harvest lot will not arrive until late Autumn 2026.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-amber-800 text-white text-xs font-sans font-medium uppercase tracking-[0.06em]"
              >
                Lock Final Bag
              </button>
            </div>
          </div>
        );

      case 'empty':
        return (
          <div className="p-10 rounded-2xl bg-white border border-[#1A1A18]/10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#1A1A18]/10 flex items-center justify-center mx-auto text-[#9D8461]">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Your Tasting Flight is Empty</h3>
            <p className="font-sans text-sm text-[#1A1A18]/60 max-w-sm mx-auto leading-relaxed">
              No roasted lots or reserve beverages currently selected. Explore our single-origin harvests to begin.
            </p>
            {onNavigateMenu && (
              <button
                type="button"
                onClick={onNavigateMenu}
                className="px-6 py-2.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.08em]"
              >
                Explore Harvest Menu
              </button>
            )}
          </div>
        );

      case 'skeleton':
        return (
          <div className="p-8 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-neutral-200 rounded-full animate-pulse" />
              <div className="w-12 h-4 bg-neutral-200 rounded-full animate-pulse" />
            </div>
            <div className="aspect-[16/9] w-full bg-neutral-200 rounded-xl animate-pulse" />
            <div className="w-3/4 h-6 bg-neutral-200 rounded-md animate-pulse" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-neutral-150 rounded-md animate-pulse" />
              <div className="w-5/6 h-3 bg-neutral-150 rounded-md animate-pulse" />
            </div>
            <div className="w-32 h-9 bg-neutral-200 rounded-full animate-pulse pt-2" />
          </div>
        );

      case 'offline':
        return (
          <div className="p-8 rounded-2xl bg-[#2A241F] text-[#F8F7F4] border border-[#9D8461]/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-sans text-xs font-semibold uppercase tracking-wider">
              <WifiOff className="w-4 h-4" /> Cached Offline Mode
            </div>
            <h3 className="font-serif text-2xl text-[#F8F7F4]">Network Connection Unavailable</h3>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              Displaying locally cached brew parameters and recipe archives. Synchronized telemetry will resume upon reconnecting.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-amber-300">
              Saved Cache: 8 Single Origins • Last Synced 14m ago
            </div>
          </div>
        );

      case 'restricted':
        return (
          <div className="p-8 rounded-2xl bg-[#1A1A18] text-[#F8F7F4] border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-sans text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Q-Grader Restricted Access
            </div>
            <h3 className="font-serif text-2xl text-[#F8F7F4]">Atelier Private Cellar • Level 3</h3>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              This tasting vault contains confidential competition lots. Verification requires an active Specialty Coffee Association Guild credential.
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-rose-400 text-rose-300 hover:bg-rose-400/10 text-xs font-sans font-medium uppercase tracking-[0.06em]"
            >
              Verify SCA Credentials
            </button>
          </div>
        );

      case 'authentication':
        return (
          <div className="p-8 rounded-2xl bg-white border border-[#1A1A18]/15 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-sans text-xs font-semibold uppercase tracking-wider">
              <KeyRound className="w-4 h-4" /> Passkey Authentication Required
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Roastery Member Sign-in</h3>
            <p className="font-sans text-sm text-[#1A1A18]/70">
              Confirm your identity using your device biometric passkey or security key to decrypt your custom roasting curve.
            </p>
            <button
              type="button"
              className="w-full py-3 rounded-full bg-[#1A1A18] text-white text-xs font-sans font-medium uppercase tracking-[0.08em] flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" /> Authenticate via Touch ID / Face ID
            </button>
          </div>
        );

      case 'not_found':
        return (
          <div className="p-10 rounded-2xl bg-[#FAF8F5] border border-[#1A1A18]/10 text-center space-y-4">
            <span className="font-mono text-5xl text-[#9D8461] font-light">404</span>
            <h3 className="font-serif text-2xl text-[#1A1A18]">Harvest Lot Not Found</h3>
            <p className="font-sans text-sm text-[#1A1A18]/60 max-w-sm mx-auto">
              The requested harvest dossier or auction batch does not exist or has been archived into historical annals.
            </p>
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-6 py-2.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.08em]"
              >
                Return to Roastery Home
              </button>
            )}
          </div>
        );

      case 'maintenance':
        return (
          <div className="p-8 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4 text-amber-950">
            <div className="flex items-center gap-2 text-amber-700 font-sans text-xs font-semibold uppercase tracking-wider">
              <Wrench className="w-4 h-4" /> Scheduled Atelier Maintenance
            </div>
            <h3 className="font-serif text-2xl text-amber-950">Mahlkönig EK43 Laser Burr Re-alignment</h3>
            <p className="font-sans text-sm text-amber-900/80 leading-relaxed">
              Our dial-in sensors are undergoing optical calibration to ensure 99.4% grind unimodality. Expected resumption: 15 minutes.
            </p>
            <div className="font-mono text-xs text-amber-800 bg-amber-100 p-3 rounded-xl">
              Status: Dialing in 98mm SSP Red Speed Burrs
            </div>
          </div>
        );

      case 'locked':
        return (
          <div className="p-8 rounded-2xl bg-[#1A1A18] text-[#F8F7F4] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#F8F7F4]">
              <Lock className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] uppercase tracking-widest font-sans font-medium">
              Vault Sealed
            </span>
            <h3 className="font-serif text-2xl text-[#F8F7F4]">Vintage 2019 Oak-Barrel Geisha Vault</h3>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              This lot is aged in French oak casks and locked until the winter equinox auction release date.
            </p>
          </div>
        );

      case 'expanded':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/15 space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setInteractiveExpanded(!interactiveExpanded)}
            >
              <h4 className="font-serif text-lg text-[#1A1A18]">Terroir & Fermentation Biology (Expanded)</h4>
              <ChevronDown className="w-5 h-5 text-[#9D8461]" />
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#1A1A18]/5 space-y-2 text-xs font-sans text-[#1A1A18]/80">
              <p>• Soil: Volcanic loam rich in potassium & phosphorus</p>
              <p>• Inoculation: Yeast strain Saccharomyces cerevisiae v. diastaticus</p>
              <p>• Maceration: 96 hours carbon dioxide pressurized tank at 14°C</p>
            </div>
          </div>
        );

      case 'collapsed':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] transition-colors">
            <div>
              <h4 className="font-serif text-lg text-[#1A1A18]">Terroir & Fermentation Biology (Collapsed)</h4>
              <p className="text-xs text-[#1A1A18]/50 font-sans">Click to expand details</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1A1A18]/50" />
          </div>
        );

      case 'checked':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/15 flex items-center gap-3">
            <div
              onClick={() => setInteractiveChecked(!interactiveChecked)}
              className="w-6 h-6 rounded-md bg-[#1A1A18] text-[#F8F7F4] flex items-center justify-center cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans text-sm font-medium text-[#1A1A18]">
                Monthly Roaster's Allocation Subscription (Active)
              </span>
              <p className="font-sans text-xs text-[#1A1A18]/50">Automatic fresh shipment on the 1st of every month.</p>
            </div>
          </div>
        );

      case 'unchecked':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 flex items-center gap-3">
            <div className="w-6 h-6 rounded-md border-2 border-[#1A1A18]/30 bg-white cursor-pointer hover:border-[#1A1A18]" />
            <div>
              <span className="font-sans text-sm font-medium text-[#1A1A18]/70">
                Include Custom Artisan Gift Box & Handwritten Card
              </span>
              <p className="font-sans text-xs text-[#1A1A18]/40">Optional complementary packaging.</p>
            </div>
          </div>
        );

      case 'indeterminate':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/15 flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#9D8461] text-white flex items-center justify-center cursor-pointer">
              <div className="w-3 h-0.5 bg-white rounded-full" />
            </div>
            <div>
              <span className="font-sans text-sm font-medium text-[#1A1A18]">
                Select All Harvest Lots (Indeterminate • 4 of 12 Selected)
              </span>
              <p className="font-sans text-xs text-[#1A1A18]/50">Batch action state when partial items are highlighted.</p>
            </div>
          </div>
        );

      case 'read_only':
        return (
          <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-[#1A1A18]/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#1A1A18]/50 font-sans">
              <span className="flex items-center gap-1.5 font-medium text-[#9D8461] uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" /> Certified SCA Cupping Form (Read-Only)
              </span>
              <span className="font-mono">Locked by Head Q-Grader</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#1A1A18]/5">
                <span className="text-[10px] text-[#1A1A18]/50 uppercase font-sans">SCA Cupping Score</span>
                <div className="font-serif text-xl text-[#1A1A18]">92.75 / 100</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#1A1A18]/5">
                <span className="text-[10px] text-[#1A1A18]/50 uppercase font-sans">Defects Count</span>
                <div className="font-serif text-xl text-[#1A1A18]">0 (Grade 1 Specialty)</div>
              </div>
            </div>
          </div>
        );

      case 'required':
        return (
          <div className="p-6 rounded-2xl bg-white border border-rose-200/80 space-y-2">
            <label className="block text-xs font-sans font-medium text-[#1A1A18] uppercase tracking-wider">
              Grind Calibration Setting <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aeropress Fine / V60 Medium"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-sm font-sans focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <p className="text-[11px] text-rose-600 font-sans">Required to ensure proper extraction in your brewer.</p>
          </div>
        );

      case 'optional':
        return (
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-sans font-medium text-[#1A1A18]/70 uppercase tracking-wider">
                Barista Dedication Message
              </label>
              <span className="text-[10px] text-[#1A1A18]/40 uppercase font-sans font-medium">Optional</span>
            </div>
            <textarea
              rows={2}
              placeholder="Any specific brewing temperature preference or gift note..."
              className="w-full px-4 py-2 rounded-xl border border-[#1A1A18]/15 text-sm font-sans outline-none focus:border-[#1A1A18]"
            />
          </div>
        );

      case 'draft':
        return (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] uppercase tracking-widest font-sans font-medium">
                Draft Blend Profile
              </span>
              <span className="text-xs font-mono text-amber-800">Last edited 2m ago</span>
            </div>
            <h4 className="font-serif text-xl text-amber-950">Winter Solstice Espresso Blend 2026 (Unpublished)</h4>
            <p className="text-xs font-sans text-amber-900/80">
              This blend recipe is visible only in your workspace. It requires cupping sign-off before public publication.
            </p>
          </div>
        );

      case 'published':
        return (
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" /> Live & Published
              </span>
              <span className="text-xs font-mono text-emerald-800">Public URL Active</span>
            </div>
            <h4 className="font-serif text-xl text-emerald-950">Aura Reserve Vol. 14 • Global Release</h4>
            <p className="text-xs font-sans text-emerald-800">
              Available across all global online terminals and in-person atelier brew bars.
            </p>
          </div>
        );

      case 'archived':
        return (
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-neutral-300 text-neutral-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <Archive className="w-3 h-3" /> Archived Vintage 2023
              </span>
              <span className="text-xs font-mono text-neutral-500">Read-only Archive</span>
            </div>
            <h4 className="font-serif text-xl text-neutral-700">Costa Rica Las Lajas Natural Harvest 2023</h4>
            <p className="text-xs font-sans text-neutral-500">
              This harvest year is completely closed and cataloged for historical cupping benchmark studies.
            </p>
          </div>
        );

      case 'pending':
        return (
          <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending Customs Clearance
              </span>
              <span className="text-xs font-mono text-amber-800">Port of Hamburg</span>
            </div>
            <h4 className="font-serif text-xl text-amber-950">Consignment #AU-9920 • 60 Bags Green Bean</h4>
            <p className="text-xs font-sans text-amber-800">
              Awaiting phytosanitary sample inspection before transport to our roastery drum.
            </p>
          </div>
        );

      case 'processing':
        return (
          <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 animate-pulse" /> Drum Roasting Active
              </span>
              <span className="font-mono text-xs text-blue-700">RoR: 8.4°C/min</span>
            </div>
            <h4 className="font-serif text-xl text-blue-950">Giesen W6A • Batch #402 in First Crack</h4>
            <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-4/5 animate-pulse" />
            </div>
            <p className="text-xs font-sans text-blue-800">
              Bean temperature: 204.2°C • Development time ratio: 14.8%.
            </p>
          </div>
        );

      case 'completed':
        return (
          <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" /> Extraction Completed
              </span>
              <span className="font-mono text-xs text-emerald-700">Yield: 42.0g</span>
            </div>
            <h4 className="font-serif text-xl text-emerald-950">Perfect Brew Target Achieved</h4>
            <p className="text-xs font-sans text-emerald-800">
              Total Dissolved Solids: 1.41% • Extraction Yield: 21.4%. Balanced sweetness and bright clarity.
            </p>
          </div>
        );

      case 'cancelled':
        return (
          <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Order Cancelled
              </span>
              <span className="font-mono text-xs text-neutral-500">Refund Ref: #RF-2291</span>
            </div>
            <h4 className="font-serif text-xl text-neutral-700">Reservation Voided</h4>
            <p className="text-xs font-sans text-neutral-500">
              Harvest allocation has been safely credited back and returned to the cellar catalog.
            </p>
          </div>
        );

      case 'expired':
        return (
          <div className="p-6 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <Hourglass className="w-3.5 h-3.5" /> Reservation Expired
              </span>
              <span className="font-mono text-xs text-rose-700">Timer: 00:00</span>
            </div>
            <h4 className="font-serif text-xl text-rose-950">15-Minute Allocation Hold Cleared</h4>
            <p className="text-xs font-sans text-rose-800">
              The exclusive hold on Panama Geisha lot #4 has lapsed and released to the next collector on waitlist.
            </p>
          </div>
        );

      case 'no_results':
        return (
          <div className="p-8 rounded-2xl bg-white border border-[#1A1A18]/10 text-center space-y-3">
            <SearchX className="w-10 h-10 text-neutral-400 mx-auto" />
            <h4 className="font-serif text-xl text-[#1A1A18]">No Harvest Lots Match Your Query</h4>
            <p className="text-xs font-sans text-[#1A1A18]/60 max-w-xs mx-auto">
              No single-origin coffees found with filters: "Decaf Natural 2600m". Try expanding your altitude or process range.
            </p>
          </div>
        );

      case 'partial':
        return (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5" /> Partial Fulfillment (1/2 Shipped)
              </span>
              <span className="font-mono text-xs text-amber-800">Split Dispatch</span>
            </div>
            <h4 className="font-serif text-xl text-amber-950">250g Whole Bean Shipped • Ceramic Mug Backordered</h4>
            <p className="text-xs font-sans text-amber-800">
              Your freshly roasted coffee was dispatched immediately; companion artisan pottery follows in 3 days.
            </p>
          </div>
        );

      case 'syncing':
        return (
          <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing Distributed Roasteries
              </span>
              <span className="font-mono text-xs text-blue-700">Tokyo & Copenhagen</span>
            </div>
            <h4 className="font-serif text-xl text-blue-950">Synchronizing Roast Curves & Sensor Profiles</h4>
            <p className="text-xs font-sans text-blue-800">
              Transmitting real-time thermocouple data across international ateliers...
            </p>
          </div>
        );

      case 'updating':
        return (
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#1A1A18]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A18]/10 text-[#1A1A18] text-[10px] uppercase tracking-widest font-sans font-medium flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-[#9D8461]" /> Updating Sensors
              </span>
              <span className="font-mono text-xs text-[#9D8461]">Firmware 4.2.1</span>
            </div>
            <h4 className="font-serif text-xl text-[#1A1A18]">Applying Flow Rate Calibration</h4>
            <p className="text-xs font-sans text-[#1A1A18]/70">
              Refining digital scale precision to 0.05g sensitivity on Slayer steam groups.
            </p>
          </div>
        );

      case 'saving':
        return (
          <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-sans text-xs font-medium">
              <Save className="w-4 h-4 animate-pulse" /> Saving custom tasting flight notes to cloud...
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-3/4 animate-pulse" />
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-sans text-sm font-medium text-emerald-950">Roast Profile Saved</span>
                <p className="font-sans text-xs text-emerald-800/80">Encrypted backup recorded 2 seconds ago.</p>
              </div>
            </div>
            <span className="font-mono text-xs text-emerald-700">Checksum: #7A19</span>
          </div>
        );

      case 'deleted':
        return (
          <div className="p-6 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-sans text-sm font-medium text-rose-950">Batch Record Deleted</span>
                <p className="font-sans text-xs text-rose-800">Moved to roastery archive bin.</p>
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full border border-rose-300 text-rose-800 text-xs font-sans font-medium uppercase tracking-wider hover:bg-rose-100 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Undo
            </button>
          </div>
        );

      case 'uploading':
        return (
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#1A1A18]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-medium text-[#1A1A18] flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#9D8461]" /> Uploading Spectrometer Roast Scan
              </span>
              <span className="font-mono text-xs text-[#9D8461]">78% • 1.2 MB/s</span>
            </div>
            <div className="w-full bg-[#1A1A18]/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#9D8461] h-full w-[78%] transition-all duration-300" />
            </div>
            <span className="text-[11px] font-mono text-[#1A1A18]/50 block">spectrum_scan_guji_lot4.raw (8.4 MB)</span>
          </div>
        );

      case 'downloading':
        return (
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-medium text-blue-950 flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-blue-600" /> Downloading SCA Q-Grader Dossier PDF
              </span>
              <span className="font-mono text-xs text-blue-600">62% • 2.4 MB/s</span>
            </div>
            <div className="w-full bg-blue-200/70 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[62%] transition-all duration-300" />
            </div>
            <span className="text-[11px] font-mono text-blue-800/70 block">official_cupping_certificate_2026.pdf</span>
          </div>
        );

      case 'connection_lost':
        return (
          <div className="p-8 rounded-2xl bg-rose-950 text-rose-50 border border-rose-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-sans text-xs font-semibold uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse" /> Telemetry Signal Interrupted
            </div>
            <h3 className="font-serif text-2xl text-rose-100">Connection Lost with Roast Probe</h3>
            <p className="font-sans text-sm text-rose-200/80 leading-relaxed">
              Real-time temperature telemetry from probe #2 was disconnected. Re-establishing secure TLS socket to roaster...
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-sans font-medium uppercase tracking-[0.06em] flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Reconnect Probe
              </button>
              <span className="font-mono text-xs text-rose-300">Retry attempt 3 of 5...</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A18] pb-24">
      {/* 1. Header Banner */}
      <div className="border-b border-[#1A1A18]/10 bg-[#F8F7F4] pt-12 pb-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9D8461]/10 text-[#9D8461] text-[11px] font-sans font-medium uppercase tracking-[0.08em] mb-2">
                <Layers className="w-3.5 h-3.5" /> Design System & State Architecture
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A18] tracking-[-0.03em]">
                All 45 Page & UI States
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#1A1A18]/70 max-w-2xl mt-1.5 leading-relaxed">
                Comprehensive interactive implementation of all 45 interaction, asynchronous, security, input, and lifecycle states across the Atelier web experience.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#1A1A18]/10 shadow-2xs">
              <div className="text-center px-2">
                <span className="block font-serif text-2xl text-[#1A1A18] font-normal leading-none">45</span>
                <span className="text-[10px] uppercase tracking-wider text-[#9D8461] font-sans font-medium mt-1 block">
                  Total States
                </span>
              </div>
              <div className="w-[1px] h-8 bg-[#1A1A18]/10" />
              <div className="text-center px-2">
                <span className="block font-serif text-2xl text-[#1A1A18] font-normal leading-none">6</span>
                <span className="text-[10px] uppercase tracking-wider text-[#9D8461] font-sans font-medium mt-1 block">
                  Categories
                </span>
              </div>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-[0.04em] whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1A1A18] text-[#F8F7F4] font-medium shadow-2xs'
                      : 'bg-white text-[#1A1A18]/70 hover:text-[#1A1A18] border border-[#1A1A18]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#1A1A18]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state (e.g. Loading, Offline)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#1A1A18]/15 text-xs font-sans text-[#1A1A18] placeholder-[#1A1A18]/40 outline-none focus:border-[#1A1A18]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Dual-Pane Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: All 45 States List Navigator */}
          <div className="lg:col-span-5 space-y-2 max-h-[780px] overflow-y-auto pr-2 scrollbar-thin">
            <div className="flex items-center justify-between text-xs font-sans text-[#1A1A18]/50 pb-2 px-1">
              <span>Showing {filteredStates.length} of 45 States</span>
              <span>Select to inspect live UI</span>
            </div>

            {filteredStates.map((state, idx) => {
              const isSelected = selectedStateId === state.id;
              return (
                <button
                  key={state.id}
                  id={`state-selector-${state.id}`}
                  onClick={() => setSelectedStateId(state.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1A1A18] ring-1 ring-[#1A1A18] shadow-sm'
                      : 'bg-white/70 hover:bg-white border-[#1A1A18]/10 hover:border-[#1A1A18]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#1A1A18]/10 flex items-center justify-center shrink-0">
                      {getStateIcon(state.id)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#1A1A18] font-normal truncate">
                          {state.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-[#9D8461] shrink-0">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[11px] font-sans text-[#1A1A18]/50 truncate block">
                        {state.category}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#1A1A18] translate-x-0.5' : 'text-[#1A1A18]/20'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Live State Inspector & Full-Screen Canvas */}
          <div className="lg:col-span-7 sticky top-24 space-y-6">
            <div className="bg-[#FAF8F5] rounded-3xl border border-[#1A1A18]/15 p-6 sm:p-8 shadow-xs space-y-6">
              {/* State Header Card */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#1A1A18]/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#9D8461]/10 text-[#9D8461] text-[11px] font-sans font-medium uppercase tracking-wider">
                      {currentState.category}
                    </span>
                    <span className="font-mono text-xs text-[#1A1A18]/40">stateId: '{currentState.id}'</span>
                  </div>
                  <h2 className="font-serif text-3xl font-light text-[#1A1A18]">
                    State: {currentState.label}
                  </h2>
                  <p className="font-sans text-sm text-[#1A1A18]/70 leading-relaxed max-w-xl">
                    {currentState.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFullPageMode(true)}
                  className="px-3.5 py-2 rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.06em] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>

              {/* Dynamic Live Render Surface */}
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] font-sans font-medium text-[#9D8461] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Live Rendered Component State
                </div>
                {renderStatePreview(currentState.id)}
              </div>

              {/* Specs & Developer Tokens */}
              <div className="p-4 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-2">
                <span className="text-[10px] uppercase font-sans font-medium tracking-widest text-[#1A1A18]/50 block">
                  Design Architecture Token Reference
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-[#1A1A18]/80">
                  <div className="p-2 bg-[#FAF8F5] rounded-lg">
                    <span className="text-[9px] block text-[#1A1A18]/40 uppercase">State Class</span>
                    <span className="truncate block font-semibold text-[#1A1A18]">state-{currentState.id}</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F5] rounded-lg">
                    <span className="text-[9px] block text-[#1A1A18]/40 uppercase">WCAG Contrast</span>
                    <span className="truncate block text-emerald-700 font-semibold">Pass AAA (7:1+)</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F5] rounded-lg">
                    <span className="text-[9px] block text-[#1A1A18]/40 uppercase">Transition</span>
                    <span className="truncate block">duration-200 ease-out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Full-Page Simulation Modal for Any State */}
      <AnimatePresence>
        {fullPageMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-center items-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#1A1A18]/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Full view top bar */}
              <div className="px-6 py-4 border-b border-[#1A1A18]/10 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9D8461]" />
                  <span className="font-serif text-lg text-[#1A1A18]">
                    Full-Page View Simulation: <span className="font-normal">{currentState.label}</span>
                  </span>
                </div>
                <button
                  onClick={() => setFullPageMode(false)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Full View</span>
                </button>
              </div>

              {/* Simulation body */}
              <div className="p-8 sm:p-12 overflow-y-auto flex-1 flex flex-col justify-center">
                <div className="max-w-2xl mx-auto w-full">
                  {renderStatePreview(currentState.id)}
                </div>
              </div>

              {/* Simulation footer */}
              <div className="px-6 py-3 border-t border-[#1A1A18]/10 bg-white/70 flex items-center justify-between text-xs font-sans text-[#1A1A18]/60">
                <span>Simulation Active for state: {currentState.id}</span>
                <span className="font-mono text-[11px]">Aura Roastery Design System</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
