
import { KnowledgeItem } from './types';

export const defaultKnowledge: KnowledgeItem[] = [
  {
    id: "course-overview",
    title: "1. Welcome & Course Overview",
    content: `DL Guidebook 2025/26 - Electronic Systems Engineering (Distance Learning)
Course Leader: Dr Shamsul Masum.

Welcome to the School of Electrical and Mechanical Engineering. This guidebook is specifically focused on our Distance Learning (DL) courses. Even though you are spread across the world, we want you to feel part of the School.

Communication:
All e-mail communication must be made via your student Microsoft Outlook account (Microsoft.com). Check it frequently. 
Useful portals:
- MyPort: Your personalized view of University and Internet resources.
- MyStudentView: New interface for managing various aspects of your course.
- MyPort Article Hub: For solving common queries.
Forum Preferences: Adjust "Forum Preferences" in Moodle to receive a daily digest instead of individual emails for every post.`,
    source: 'paste'
  },
  {
    id: "registration-admin",
    title: "2. Registration & Administrative Setup",
    content: `REGISTRATION PROCESS
Continuing Students: Re-register via Student Portal. ID cards are sent to MyPort Hub for mailing (timescales vary).
New Students (4-Step Process):
Step 1: Get student account details.
Step 2: Register for your course.
Step 3: Submit personal identification (ID) and course entry qualification check.
Step 4: Apply for student card.

Course Administrator: Katie Strong (katie.strong@port.ac.uk | +44 (0)23 9284 6271). Katie supports a large number of courses; always include your student ID in any email.
IT Support: Use the "Student IT Support" link for self-service or raise concerns via Hornbill.
TEC Academic Services Hub: tecacademicservices@port.ac.uk | +44 (0) 23 9284 6871.`,
    source: 'paste'
  },
  {
    id: "course-structure-dates",
    title: "3. Course Structure & Key Dates",
    content: `ACADEMIC YEAR STRUCTURE
Two Teaching Blocks: TB1 (Sept/Oct to Jan) and TB2 (Jan to May/June).
Referral Period: Late summer for re-assessments.

2-YEAR PART-TIME (U2177PTD)
September Intake:
- Year 1: Electronics (TB1), Data Comm (TB2), DSP (TB2).
- Year 2: AI (TB1), Quality Management (TB1), Project (TB2).
January Intake:
- Year 1: DSP (TB2).
- Year 2: AI (TB1), Quality Management (TB1), Data Comm (TB2).
- Year 3: Electronics (TB1), Project (TB2).

3-YEAR PART-TIME (U2404PTD)
September Intake:
- Year 1: Electronics (TB1), Data Comm (TB2).
- Year 2: Quality Management (TB1), DSP (TB2).
- Year 3: AI (TB1), Project (TB2).
January Intake:
- Year 1: DSP (TB2).
- Year 2: Quality Management (TB1), AI (TB1), Data Comm (TB2).
- Year 3: Electronics (TB1), Project (TB2).`,
    source: 'paste'
  },
  {
    id: "module-catalogue",
    title: "4. Module Descriptions & Coordinators",
    content: `MODULE DETAILS
- Electronics (M21495): Dr Shamsul Masum & Dr Ludo Ausiello. Focuses on VHDL and Measurement systems.
- Data Communication (M21498): Dr Salem Aljareh.
- Digital Signal Processing (M21497): Dr John Chiverton.
- Foundation of Artificial Intelligence (M33615): Dr Hongjie Ma. Recommended language: Python.
- Quality Management (M30940): Dr Ivan Popov. Uses MS Excel.
- Individual Project (M21499): Dr Shamsul Masum. Requires research proposal and 5,000-word report.

Use the M-code (e.g., 21495) to search the University Module Catalogue for full syllabus details.`,
    source: 'paste'
  },
  {
    id: "software-guide",
    title: "5. Software Requirements & Access",
    content: `SOFTWARE BY MODULE
M21495 Electronics: EDA Playground (online VHDL), LTSpice (available via AppsAnywhere or local install).
M33615 AI: Python (Jupyter, VS Code, JetBrains).
M21497 DSP: Matlab + DSP Toolbox. 
- Local Install: Download via Mathworks account using UoP email.
- AppsAnywhere: Run virtualized Windows version (requires VPN if off-campus).
- Remote Access: Connect to University lab computers remotely.
- Online: matlab.mathworks.com.
M30940 Quality Management: MS Excel.

AppsAnywhere: https://appsanywhere.port.ac.uk/
VPN: Required for some library resources and AppsAnywhere.`,
    source: 'paste'
  },
  {
    id: "assessments-regulations",
    title: "6. Assessments, Grading & Plagiarism",
    content: `ASSESSMENT STRATEGY
Pass mark: 40% overall for the module. You can pass a module even if you fail one component (e.g., 60% CW + 30% Exam = 45% PASS).
Late Submission: Max mark 40% if submitted within 10 working days, unless you have valid EC.

ACADEMIC CITIZENSHIP
Plagiarism: Presenting others' work as your own. Includes copying code, paraphrasing without citation, or collusion.
TurnitinUK: Used to check all submissions against web pages and other students' work.
Penalties: Can range from mark reduction to expulsion.

Results: 
- 70%+ (First/Grade A)
- 60-69% (2:1/Grade B)
- 50-59% (2:2/Grade C)
- 40-49% (3rd/Grade D)
Marks are provisional until confirmed by the MAB (June/July).`,
    source: 'paste'
  },
  {
    id: "student-support",
    title: "7. Support, EC & Difficulties",
    content: `ENCOUNTERING DIFFICULTIES
Extenuating Circumstances (EC): For short-term serious issues (health/personal). Successful claims allow +10 days for CW or a deferred exam attempt.
Interruption of Studies:
- Module Interruption: Stop one module.
- Course Interruption: Suspend the whole course.
Requires Course Leader approval.

Personal Tutor: Named staff member for pastoral support. Find details on Student Portal.
ASDAC: For students requiring additional support due to disabilities or learning needs.`,
    source: 'paste'
  },
  {
    id: "applicant-faqs",
    title: "8. Common FAQs for Applicants",
    content: `Q1: Study time?
A1: 2-4 hours online teaching + 3-5 hours self-study per module, per week.
Q2: Dissertation?
A2: Individual Project (M21499) concludes with a 5,000-word written report.
Q3: Internet at sea?
A3: Lectures are recorded and downloadable. EC forms can cover missed deadlines due to connectivity issues.
Q4: Accreditation?
A4: This course is NOT accredited.
Q5: International Time Zones (e.g. Texas)?
A5: Sessions recorded. Exams are online.
Q6: Lab kits?
A6: Not provided. We use online software. Project hardware must be student-funded.
Q7: MOD Lyneham students?
A7: Select 3 out of 5 modules. Project module is excluded.
Q8: Entry requirements?
A8: Relevant Level 5 qualification (HND/Foundation Degree) + IELTS 6.0 (no component < 5.5).`,
    source: 'paste'
  },
  {
    id: "contact-directory",
    title: "9. Useful Contacts Directory",
    content: `Course Leader: Dr Shamsul Masum (shamsul.masum@port.ac.uk | +44 (0)23 9284 2311)
Course Admin: Katie Strong (katie.strong@port.ac.uk | +44 (0)23 9284 6271)
TEC Academic Services: tecacademicservices@port.ac.uk | +44 (0) 23 9284 6871
Graduation Team: graduation@port.ac.uk | +44 (0) 23 9284 3434
Tuition Fees: tuition.fees@port.ac.uk | +44 (0)23 9284 5259
Sponsors Team: sponsors@port.ac.uk
Income Team: income@port.ac.uk
IT Support: https://myport.port.ac.uk/it-support/student-it-support`,
    source: 'paste'
  }
];
