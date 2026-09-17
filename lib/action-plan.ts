import type { Tagged } from "./ai/types";

export interface ActionPlanStepContent {
  title: string;
  description: string;
  duration: string;
  responsibleEntity: string;
}

const SOURCE = "Standard NSFDC application process";

function standardStep(content: ActionPlanStepContent): Tagged<ActionPlanStepContent> {
  return {
    value: content,
    tag: "estimate",
    source: SOURCE,
    source_year: null,
    grounding_ids: [],
  };
}

// A fixed, standard NSFDC loan-application sequence — the same for every
// user, not AI-generated advice specific to any one business. Tag's
// 3-value enum (verified/estimate/user_input) has no exact fit for
// "standard process information"; "estimate" was chosen as the closest
// available value, with an explicit source noting this is a standard
// process, not a per-business AI judgment or user-supplied data.
export const STANDARD_NSFDC_ACTION_PLAN: Tagged<ActionPlanStepContent>[] = [
  standardStep({
    title: "Prepare Documentation",
    description: "Gather ID proof, address proof, business plan, and quotations for equipment/setup costs.",
    duration: "1-2 weeks",
    responsibleEntity: "Applicant",
  }),
  standardStep({
    title: "Approach State Channelizing Agency (SCA)",
    description: "Submit application with the margin capital contribution ready.",
    duration: "1 week",
    responsibleEntity: "Applicant",
  }),
  standardStep({
    title: "SCA Verification & Forwarding",
    description: "SCA verifies documents and forwards to NSFDC for sanction.",
    duration: "2-4 weeks",
    responsibleEntity: "SCA",
  }),
  standardStep({
    title: "Sanction & Disbursement",
    description: "Loan sanctioned per the scheme tier, disbursed to SCA then to applicant.",
    duration: "2-3 weeks",
    responsibleEntity: "NSFDC/SCA",
  }),
  standardStep({
    title: "Business Setup & Utilization",
    description: "Begin operations per the business plan submitted.",
    duration: "Ongoing",
    responsibleEntity: "Applicant",
  }),
];
