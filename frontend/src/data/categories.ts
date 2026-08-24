import { Activity, Cpu, Package, Bot, Layers, GraduationCap } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: typeof Activity;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "sensors",
    name: "Sensors",
    description: "Temperature, humidity, motion, gas, and more",
    icon: Activity,
    productCount: 24,
  },
  {
    id: "boards",
    name: "Development Boards",
    description: "Arduino, Raspberry Pi, ESP32, and more",
    icon: Cpu,
    productCount: 18,
  },
  {
    id: "kits",
    name: "IoT Kits",
    description: "Complete starter kits and project bundles",
    icon: Package,
    productCount: 12,
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "Motors, arms, chassis, and robotic components",
    icon: Bot,
    productCount: 15,
  },
  {
    id: "modules",
    name: "Modules",
    description: "Displays, relays, drivers, and communication modules",
    icon: Layers,
    productCount: 30,
  },
  {
    id: "courses",
    name: "Workshops & Courses",
    description: "Learn IoT, embedded systems, and robotics",
    icon: GraduationCap,
    productCount: 8,
  },
];
