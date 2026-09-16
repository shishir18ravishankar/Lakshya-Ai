/**
 * Core UI & Domain Data Types for Lakshya AI (SIH 2026 - Problem Statement 26091)
 */

export type GoalCategory = "tech" | "learning" | "career" | "health" | "finance";

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export interface Milestone {
  id: string;
  title: string;
  targetTimeline: string;
  priority: PriorityLevel;
  completed: boolean;
  description?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  progress: number;
  milestones: Milestone[];
  createdAt: string;
  targetDate: string;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string | number;
  trend?: string;
  iconName?: string;
}

/**
 * Location Hierarchy for Rural Micro-Enterprises
 */
export interface LocationHierarchy {
  village: string;
  gramPanchayat?: string;
  taluk: string;
  district: string;
  state: string;
}

/**
 * Business Intake Form Payload
 */
export interface BusinessIntakePayload {
  mode: "start" | "scale";
  businessIdea: string;
  businessDescription: string;
  location: LocationHierarchy;
  availableCapital: number;
  expectedInvestment: number;
  goal: string;

  // Scale mode specific fields
  currentBusiness?: string;
  currentRevenue?: number;
  currentExpenses?: number;
  expansionInvestment?: number;
  expansionGoal?: string;

  submittedAt?: string;
}
