// Icons the admin panel can choose from. Content stores the name; pages render
// the component. Unknown names fall back to a neutral icon.
import {
  Backpack, BookOpen, FlaskConical, GraduationCap, BarChart3,
  Palette, Music2, Swords, Dumbbell, Activity, Flower2, Monitor,
  Microscope, Laptop, Presentation, Snowflake, Bus,
  Heart, Target, Shield, Lightbulb, Star, Trophy, Users, Sparkles,
  Leaf, Globe, Calculator, Pencil, Brush, Camera, Bike, Library, Sun, Smile,
} from 'lucide-react';

export const ICONS = {
  Backpack, BookOpen, FlaskConical, GraduationCap, BarChart3,
  Palette, Music2, Swords, Dumbbell, Activity, Flower2, Monitor,
  Microscope, Laptop, Presentation, Snowflake, Bus,
  Heart, Target, Shield, Lightbulb, Star, Trophy, Users, Sparkles,
  Leaf, Globe, Calculator, Pencil, Brush, Camera, Bike, Library, Sun, Smile,
};

export const ICON_NAMES = Object.keys(ICONS);

export const TONES = ['red', 'tan', 'green', 'purple', 'gray', 'crimson', 'olive', 'orange', 'blue'];

export const iconFor = (name) => ICONS[name] ?? Star;
