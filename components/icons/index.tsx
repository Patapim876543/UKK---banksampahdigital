import React from "react";
export {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  Check,
  Plus,
  Trash2,
  Edit3,
  Filter,
  Calendar,
  User,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  Menu,
  Home,
  FileText,
  Gift,
  BarChart3,
  Layers,
  Settings,
  Shield,
  HelpCircle,
  TrendingUp,
  Award,
  PackageCheck,
  RefreshCw,
  Coins,
  History,
  QrCode,
  Sparkles,
  Building2 as Building,
  Key,
} from "lucide-react";

// Domain-specific hand-authored minimal SVG icons (Apple-aesthetic, single color currentColor, flat)
export function IconRecycle({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.2a1.8 1.8 0 0 0 1.558-.898 1.787 1.787 0 0 0-.005-1.787L17.5 11" />
      <path d="m15.5 4-4.2 7.5" />
      <path d="M9.5 4h5a1.8 1.8 0 0 1 1.56.9 1.8 1.8 0 0 1 0 1.8l-1.56 2.8" />
      <path d="m4.5 14.5 2.5 4.5 2.5-4.5" />
      <path d="M19 14.5 16.5 19 14 14.5" />
      <path d="m7 7 2.5-4.5 2.5 4.5" />
    </svg>
  );
}

export function IconPlasticBottle({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="9" y="2" width="6" height="3" rx="1" />
      <path d="M10 5v2.5L7 10.5V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.5L14 7.5V5" />
      <line x1="7" y1="14" x2="17" y2="14" />
      <line x1="7" y1="17" x2="17" y2="17" />
    </svg>
  );
}

export function IconPaperWaste({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function IconMetalCan({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </svg>
  );
}

export function IconGlassJar({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="8" y="2" width="8" height="3" rx="1" />
      <path d="M9 5c-2.5 1-3 3-3 5v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10c0-2-.5-4-3-5" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}

export function IconScale({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  );
}

export function IconCoinLeaf({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9c0 3-2 5-5 5" />
      <path d="M10 9c0 3 2 5 5 5" />
      <path d="M12 7v10" />
    </svg>
  );
}

export function IconBankUnit({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="5 6 12 3 19 6" />
      <line x1="4" y1="10" x2="4" y2="21" />
      <line x1="20" y1="10" x2="20" y2="21" />
      <line x1="8" y1="14" x2="8" y2="17" />
      <line x1="12" y1="14" x2="12" y2="17" />
      <line x1="16" y1="14" x2="16" y2="17" />
    </svg>
  );
}

export function IconReceipt({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  );
}
