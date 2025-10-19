# **App Name**: LoanPilot AI

## Core Features:

- Eligibility Scoring Logic: AI model computes eligibility score based on weighted criteria (credit score, income-to-EMI ratio, etc.) following RBI guidelines. It uses a tool to determine when to incorporate guidelines.
- Automated Decision Report: Auto-generates a Loan Evaluation Report with applicant details, criteria breakdown, eligibility score, decision, and reasons for rejection (if any).
- Customer Eligibility Checker: Public page for customers to instantly view eligibility percentage by entering basic details.
- Admin Dashboard: Dashboard for admins to view all applicants with real-time eligibility scores, filter by branch/loan type, and update approval threshold dynamically.
- Branch Staff Dashboard: Dashboard for branch staff to upload applications, track loan status, and view auto-generated reports.
- Notifications & Audit Trail: Email alerts on loan decisions (via Firebase Cloud Functions) and activity logs for each application.

## Style Guidelines:

- Primary color: Deep Blue (#1A5276) to evoke trust and stability.
- Background color: Light Blue (#EBF5FB), a desaturated version of the primary color for a calm feel.
- Accent color: Teal (#2E86AB) for interactive elements and highlights, contrasting with the primary blue.
- Body and headline font: 'Inter', a sans-serif font, providing a modern and neutral look suitable for both headings and body text.
- Use clean, professional icons related to banking, analytics, and AI, for visual clarity.
- Implement a responsive layout using Material UI or Tailwind CSS, ensuring optimal viewing experience across devices.
- Incorporate subtle animations for loading states and user interactions, enhancing user experience without distraction.