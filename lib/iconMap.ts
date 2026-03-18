import {
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiWordpress,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiFlutter,
  SiNextdotjs,
} from '@icons-pack/react-simple-icons';
import { Sparkles } from 'lucide-react';

export const iconMap: Record<string, any> = {
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiWordpress,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiFlutter,
  SiNextdotjs,
};

export const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Sparkles; // Fallback ke Sparkles jika tidak ada
};
