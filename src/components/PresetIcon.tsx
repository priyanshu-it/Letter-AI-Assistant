import { Briefcase, FileText, Home, Calendar, Send } from "lucide-react";

interface PresetIconProps {
  iconName: string;
  className?: string;
}

export function PresetIcon({ iconName, className }: PresetIconProps) {
  switch (iconName) {
    case "Briefcase":
      return <Briefcase className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "Home":
      return <Home className={className} />;
    case "Calendar":
      return <Calendar className={className} />;
    case "Send":
      return <Send className={className} />;
    default:
      return <FileText className={className} />;
  }
}
