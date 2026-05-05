import {
    GitPullRequest,
    SquareKanban,
    RadioTower,
    WandSparkles,
    Layers,
    BatteryCharging,
    HandHelping, Users, Zap,
    SlidersHorizontal,
    MessagesSquare,
    BriefcaseBusiness,
    Activity,
    LayoutTemplate,
    PanelTopClose,
    Target,
    Download,
    History,
    Home,
    Settings,
    Briefcase,
    FileUser,
    CreditCard,
    ShieldCheck,
    Receipt,
    ScrollText,
    Library,
} from "lucide-react";

export const navItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "AI Interview",
        href: "/ai-interview",
    },
    {
        name: "AI Resume",
        href: "/resume",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    },
]
export const SidebarItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: <Home />,
    },
    {
        title: "Mock Interviews",
        url: "/dashboard/mock-interviews",
        icon: <Briefcase />,
    },
    {
        title: "Resume Builder",
        url: "/dashboard/resume-builder",
        icon: <FileUser />,
    },
    {
        title: "Practice Questions",
        url: "/dashboard/practice-questions",
        icon: <Library />,
    },
    {
        title: "Interview History",
        url: "/dashboard/interview-history",
        icon: <History />,
    },
    {
        title: "Billing",
        url: "/dashboard/billing",
        icon: <CreditCard />,
    },
    {
        title: "Admin",
        url: "/admin",
        icon: <ShieldCheck />,
        roles: ["admin", "super_admin", "support", "billing_admin"],
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: <Users />,
        roles: ["admin", "super_admin", "support", "billing_admin"],
    },
    {
        title: "Subscriptions",
        url: "/admin/subscriptions",
        icon: <Layers />,
        roles: ["admin", "super_admin", "billing_admin"],
    },
    {
        title: "Payments",
        url: "/admin/payments",
        icon: <Receipt />,
        roles: ["admin", "super_admin", "billing_admin"],
    },
    {
        title: "Usage",
        url: "/admin/usage",
        icon: <Activity />,
        roles: ["admin", "super_admin", "support"],
    },
    {
        title: "Audit Logs",
        url: "/admin/ai-logs",
        icon: <ScrollText />,
        roles: ["admin", "super_admin"],
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: <Settings />,
    },
];
export const aiInterview = [
    {
        id: 1,
        title: "How Marketing Analytics is Reshaping Business Strategies",
        category: "Analytics",
        date: "April 18, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        excerpt:
            "Data-driven marketing is changing how companies make decisions. Learn how to leverage analytics for better results.",
    },
    {
        id: 2,
        title: "The Rise of Video Marketing: Why You Can't Ignore It",
        category: "Video",
        date: "April 12, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
        excerpt:
            "Video content has become an essential part of modern marketing strategies. Find out why and how to get started.",
    },
    {
        id: 3,
        title: "Building Customer Loyalty Through Content Marketing",
        category: "Content",
        date: "April 5, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        excerpt:
            "Create content that not only attracts but retains customers. Strategies for building long-term relationships through your content.",
    },
    {
        id: 4,
        title: "Social Media Trends That Will Dominate in 2023",
        category: "Social Media",
        date: "March 29, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80",
        excerpt:
            "Stay ahead of the curve with these emerging social media trends that will shape the digital landscape this year.",
    },
    {
        id: 5,
        title: "Email Marketing Personalization: Going Beyond First Name",
        category: "Email",
        date: "March 22, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        excerpt:
            "Advanced techniques for personalizing your email campaigns that go well beyond simply using a subscriber's name.",
    },
    {
        id: 6,
        title: "Sustainable Marketing: Building Eco-Friendly Campaigns",
        category: "Sustainability",
        date: "March 15, 2023",
        imageUrl:
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
        excerpt:
            "How to integrate sustainability into your marketing strategy and connect with environmentally conscious consumers.",
    },
];
export const footerContents = {
    title: "NeuroHire",
    description:
        "NeuroHire is the next-gen AI career assistant that transforms how you land your dream job. Craft intelligent resumes, experience real-time AI-driven voice interviews, and feedback—all powered by cutting-edge neural models. The future prep starts here.",
    menu: [
        {
            title: "Product",
            links: [
                { text: "Features", url: "#" },
                { text: "Pricing", url: "#" },
                { text: "Testimonials", url: "#" },
                { text: "FAQ", url: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { text: "About Us", url: "#" },
                { text: "Careers", url: "#" },
                { text: "Blog", url: "#" },
                { text: "Contact", url: "#" },
            ],
        },
        {
            title: "Legal",
            links: [
                { text: "Privacy Policy", url: "#" },
                { text: "Terms of Service", url: "#" },
                { text: "Cookie Policy", url: "#" },
            ],
        },
    ],
    copyRight: `© ${new Date().getFullYear()} NeuroHire. All rights reserved.`,
    link: "https://my-profolio-five.vercel.app/"

};

export const homeContent = {
    hero: {
        title: "Ace Every Interview. Build the Perfect Resume.",
        description:
            " Nail your next job with confidence. NeuroHire helps you craft  ATS-friendly resumes and prepares you through realistic, voice-enabled mock interviews tailored to your role and experience — all powered by cutting-edge AI.",
        firstCTA: "Get Started",
        secondCTA: "Learn More",
        link: "#"
    },
    features: [
        {
            icon: <HandHelping className="h-auto w-5" />,
            title: "Flexible Support",
            description:
                "Benefit from around-the-clock assistance to keep your business running smoothly.",
        },
        {
            icon: <Users className="h-auto w-5" />,
            title: "Collaborative Tools",
            description:
                "Enhance teamwork with tools designed to simplify project management and communication.",
        },
        {
            icon: <Zap className="h-auto w-5" />,
            title: "Lightning Fast Speed",
            description:
                "Experience the fastest load times with our high performance servers.",
        }
    ],
    whyUse: {
        sectionName: "Feature Highlights",
        title: " Why Use NeuroHire?",
        subTitle: " Unlock your interview potential with our powerful features designed to make you stand out.",
        reasons: [
            {
                title: "AI-Powered Mock Interviews",
                description:
                    "Simulate realistic interviews with voice-enabled AI. Receive real-time feedback on your performance, tone, and delivery.",
                icon: <RadioTower className="size-6" />,
            },
            {
                title: "Smart Resume Builder",
                description:
                    "Create polished, ATS-optimized resumes with intelligent suggestions tailored to your job goals and experience.",
                icon: <SquareKanban className="size-6" />,
            },
            {
                title: "Role-Based Question Generation",
                description:
                    "Practice with AI-generated questions tailored to your specific job role, industry, and experience level.",
                icon: <GitPullRequest className="size-6" />,
            },
            {
                title: "Skill Gap Analysis",
                description:
                    "Upload your resume or job posting to identify gaps in your skills and receive personalized improvement tips.",
                icon: <WandSparkles className="size-6" />,
            },
            {
                title: "Secure & Seamless Access",
                description:
                    "Login with LinkedIn or Google, with robust authentication and secure data encryption built-in.",
                icon: <Layers className="size-6" />,
            },
            {
                title: "Built for Career Growth",
                description:
                    "From students to professionals, NeuroHire adapts to your career stage and helps you grow with confidence.",
                icon: <BatteryCharging className="size-6" />,
            },
        ]
    },
    testimonials: {
        sectionName: "Customer Feedback",
        title: "Hear what our users are saying",
        subTitle: "Real stories from job seekers, students, and professionals who transformed their careers with NeuroHire",
        testimony: [
            {
                id: 7,
                name: "Liam Carter",
                username: "@liamcarter",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"Absolutely love the automation features! They’ve helped me cut down redundant tasks and focus on strategic work."',
                date: "2023-09-15",
            },
            {
                id: 8,
                name: "Sophia Turner",
                username: "@sophiat",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"From onboarding to execution, everything about this platform feels smooth and well thought out. It’s a real asset for any team."',
                date: "2023-09-10",
            },
            {
                id: 9,
                name: "Noah Bennett",
                username: "@noahb",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"One of the best investments we’ve made. The user interface is clean, and the learning curve is practically non-existent."',
                date: "2023-08-28",
            },
            {
                id: 10,
                name: "Emily Clark",
                username: "@emilyclark",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"Their mobile experience is just as powerful as the desktop version. I can manage everything on the go!"',
                date: "2023-08-22",
            },
            {
                id: 11,
                name: "Daniel Evans",
                username: "@danevans",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"It integrates seamlessly with our existing tools, which made adoption painless. Great work by the dev team!" "It integrates seamlessly with our existing tools, which made adoption painless. Great work by the dev team!"',
                date: "",
            },
            {
                id: 12,
                name: "Chloe Martin",
                username: "@chloem",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"Excellent for both beginners and power users. I appreciate how customizable the workflows are."',
                date: "",
            },
            {
                id: 13,
                name: "Jack Roberts",
                username: "@jackroberts",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"This tool has become indispensable for our daily operations. We’d be lost without it now."',
                date: "",
            },
            {
                id: 14,
                name: "Ava Scott",
                username: "@avascott",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"Setup was incredibly fast, and support walked us through everything. You don’t get service like this often!"',
                date: "2023-08-10",
            },
            {
                id: 15,
                name: "Oliver Reed",
                username: "@oliverreed",
                avatar: "/placeholder.svg?height=40&width=40",
                verified: true,
                testimonial:
                    '"We’ve improved our team’s response time and collaboration since adopting this platform. It’s a win across the board."',
                date: "2023-07-30",
            },
        ]
    }
}
export const interviewGeneratorContent = {
    hero: {
        title: "Generate Tailored Mock Interview Questions with AI",
        subtitle: "Prepare smarter, not harder.",
        description:
            "Leverage the power of advanced AI to instantly generate realistic, role-specific interview questions based on your resume, job title, or skill focus. Whether you're targeting your first job or your next big career move, our intelligent system creates personalized question sets that mimic real interview scenarios—helping you build confidence and improve your responses through practice and feedback.",
        cta: "Get Started",
        link: "#"
    },
    features: [
        {
            title: "Hyper-Personalized Questions",
            description:
                "Our AI analyzes your uploaded resume, job description, and skill preferences to craft questions that match your experience and target role.",
            icon: <SlidersHorizontal className="h-auto w-5" />,
        },
        {
            title: "Covers Technical & Behavioral",
            description:
                "Get a mix of technical, situational, and behavioral questions to prepare for every stage of the hiring process.",
            icon: <MessagesSquare className="h-auto w-5" />,
        },
        {
            title: "Industry-Specific Intelligence",
            description:
                "Tailored for various industries and roles—from software engineering and product management to marketing and HR.",
            icon: <BriefcaseBusiness className="h-auto w-5" />,
        },
        {
            title: "Real-Time Difficulty Adjustment",
            description:
                "As you answer questions, the system adapts dynamically—escalating complexity or shifting focus to areas where improvement is needed.",
            icon: <Activity className="h-auto w-5" />,
        },
    ],
    howItWorks: {
        title: "How It Works",
        subtitle: " Our simple 4-step process helps you prepare effectively for your interviews",
        steps: [
            {
                step: "01",
                title: "Create Your Job Profile",
                description:
                    "Enter your target role, experience level, and skills to customize your interview experience.",
            },
            {
                step: "02",
                title: "Generate AI Questions",
                description:
                    "Our AI creates relevant technical and behavioral questions based on your profile.",
            },
            {
                step: "03",
                title: "Practice with Voice",
                description:
                    "Speak your answers naturally as if in a real interview with our voice recognition technology.",
            },
            {
                step: "04",
                title: "Receive Detailed Feedback",
                description:
                    "Get AI-powered analysis of your answers with specific improvement suggestions.",
            },
        ],
        cta: "Try It Now",
        link: "#",
        picture: {
            image: "/layout/ai-interview.png",
            alt: "interview-image"
        }
    },

};
export const resumeBuilderContent = {
    hero: {
        title: "Create a Job-Winning Resume",
        subtitle: "Build a resume that gets noticed.",
        description:
            "Our intuitive resume builder gives you complete control to craft a polished, professional resume that highlights your skills, experience, and achievements. Whether you're starting from scratch or refining an existing draft, our tools help you present your career story with confidence.",
        cta: "Get Started",
        link: "#"
    },
    features: [
        {
            title: "Professionally Designed Templates",
            description:
                "Choose from clean, modern, and recruiter-friendly templates that meet industry standards and are optimized for both readability and ATS compatibility.",
            icon: <LayoutTemplate />,
        },
        {
            title: "Fully Customizable Layouts",
            description:
                "Drag, drop, and edit every section to fit your personal style and career path. Rearrange content, tweak spacing, and fine-tune formatting with ease.",
            icon: <PanelTopClose />,
        },
        {
            title: "Tailored to Your Career Goals",
            description:
                "Select from predefined sections like Experience, Skills, Projects, Certifications, and more—customize them based on your role, industry, and objectives.",
            icon: <Target />,
        },
        {
            title: "Export-Ready Formats",
            description:
                "Download your resume in high-quality PDF or share it online with a link. Revisit and update your resume anytime as your career evolves.",
            icon: <Download />,
        },
    ],
    howItWorks: {
        title: "How It Works",
        subtitle: " Our simple 4-step process helps you to create effectively resume",
        steps: [
            {
                step: "01",
                title: "Enter Your Information",
                description:
                    "Start by filling in your basic details, work experience, education, and skills. You can also start with a blank canvas or edit a saved draft.",
            },
            {
                step: "02",
                title: "Choose a Template",
                description:
                    "Pick a professional resume template that best suits your industry and personal brand.",
            },
            {
                step: "03",
                title: "Customize Your Layout",
                description:
                    "Use our easy-to-use editor to organize sections, adjust text, and style your content to make it uniquely yours.",
            },
            {
                step: "04",
                title: "Download or Share",
                description:
                    "Once you’re happy with the result, download your resume or share a public link. Come back anytime to update or improve your content.",
            },
        ],
        cta: "Try It Now",
        link: "#",
        picture: {
            image: "/layout/ai-resume.webp",
            alt: "resume-image"
        }
    },
};
export const jobProfiles = [
    {
        title: "Frontend Developer",
        companyName: "TechNova Inc.",
        role: "Software Engineer",
        duration: 12,
        domain: "Web Development",
        experienceLevel: "entry",
        technicalDifficulty: 60,
        behavioralDifficulty: 40,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters for internal and customer communications
• Distributing HTML mailers, newsletters, and webpages to staff and business partners for internal communications
• Conceptualizing creative ideas for emailers and e-newsletters with internal clients
• Testing emailers and newsletters for mobile responsiveness and browser compatibility before release
• Following design guidelines, standards, and best practices while creating HTML mailers, newsletters, and webpages
• Maintaining Microsoft SharePoint Intranet site
• Updating and maintaining the internal communications website
• Working with different content management systems
• Incorporating functionalities and features into internal communications websites and webpages
• Maintaining MIS of Internal Communications work
`,
        preferredCandidateProfile: "Basic React.js knowledge, HTML/CSS expertise, strong attention to UI/UX details."
    },
    {
        title: "Backend Developer",
        companyName: "CodeCrux",
        role: "Node.js Developer",
        duration: 18,
        domain: "API Development",
        experienceLevel: "entry",
        technicalDifficulty: 65,
        behavioralDifficulty: 45,
        generalDifficulty: 55,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters for internal and customer communications
...
• Maintaining MIS of Internal Communications work
`,
        preferredCandidateProfile: "Node.js fundamentals, familiarity with REST APIs, basic MongoDB experience."
    },
    {
        title: "Data Analyst",
        companyName: "DataMatrix",
        role: "Junior Analyst",
        duration: 10,
        domain: "Data Science",
        experienceLevel: "entry",
        technicalDifficulty: 45,
        behavioralDifficulty: 50,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Excel, SQL, and Python basics; good communication and analytical skills."
    },
    {
        title: "DevOps Engineer",
        companyName: "CloudZilla",
        role: "DevOps Intern",
        duration: 8,
        domain: "Cloud Infrastructure",
        experienceLevel: "entry",
        technicalDifficulty: 55,
        behavioralDifficulty: 60,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Basic knowledge of CI/CD, Docker, and Linux command line tools."
    },
    {
        title: "Mobile App Developer",
        companyName: "AppVerge",
        role: "Flutter Developer",
        duration: 14,
        domain: "Mobile Development",
        experienceLevel: "entry",
        technicalDifficulty: 50,
        behavioralDifficulty: 40,
        generalDifficulty: 45,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Familiarity with Flutter and Dart; understanding of mobile UI guidelines."
    },
    {
        title: "QA Tester",
        companyName: "BugHunterz",
        role: "Manual Tester",
        duration: 6,
        domain: "Quality Assurance",
        experienceLevel: "entry",
        technicalDifficulty: 30,
        behavioralDifficulty: 55,
        generalDifficulty: 40,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Detail-oriented; experience in writing and executing test cases."
    },
    {
        title: "UI/UX Designer",
        companyName: "Pixel Perfect",
        role: "Design Intern",
        duration: 9,
        domain: "Product Design",
        experienceLevel: "entry",
        technicalDifficulty: 40,
        behavioralDifficulty: 50,
        generalDifficulty: 45,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Knowledge of Figma or Adobe XD; creative thinker with attention to detail."
    },
    {
        title: "Content Writer",
        companyName: "VerbaTech",
        role: "Technical Content Creator",
        duration: 7,
        domain: "Content Strategy",
        experienceLevel: "entry",
        technicalDifficulty: 25,
        behavioralDifficulty: 40,
        generalDifficulty: 35,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Excellent grammar, basic HTML knowledge, interest in tech writing."
    },
    {
        title: "System Administrator",
        companyName: "SecureNet",
        role: "Junior SysAdmin",
        duration: 12,
        domain: "IT Infrastructure",
        experienceLevel: "entry",
        technicalDifficulty: 55,
        behavioralDifficulty: 50,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Windows/Linux basics, scripting skills (Bash or PowerShell) preferred."
    },
    {
        title: "SEO Analyst",
        companyName: "SearchEnginePro",
        role: "SEO Intern",
        duration: 5,
        domain: "Digital Marketing",
        experienceLevel: "entry",
        technicalDifficulty: 30,
        behavioralDifficulty: 35,
        generalDifficulty: 40,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Familiar with keyword research tools and Google Analytics."
    },
    {
        title: "Cybersecurity Analyst",
        companyName: "SafeByte",
        role: "Security Trainee",
        duration: 9,
        domain: "Cybersecurity",
        experienceLevel: "entry",
        technicalDifficulty: 60,
        behavioralDifficulty: 55,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Basic network security, OWASP Top 10 awareness, good troubleshooting skills."
    },
    {
        title: "Database Administrator",
        companyName: "DataNest",
        role: "Junior DBA",
        duration: 11,
        domain: "Database Management",
        experienceLevel: "entry",
        technicalDifficulty: 55,
        behavioralDifficulty: 40,
        generalDifficulty: 45,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "SQL knowledge, basic understanding of backup and recovery techniques."
    },
    {
        title: "Graphic Designer",
        companyName: "CreativeCore",
        role: "Graphic Design Intern",
        duration: 4,
        domain: "Design",
        experienceLevel: "entry",
        technicalDifficulty: 35,
        behavioralDifficulty: 45,
        generalDifficulty: 40,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Photoshop/Illustrator skills, eye for layout and visual consistency."
    },
    {
        title: "Business Analyst",
        companyName: "BizScope",
        role: "BA Intern",
        duration: 10,
        domain: "Business Analysis",
        experienceLevel: "entry",
        technicalDifficulty: 40,
        behavioralDifficulty: 50,
        generalDifficulty: 50,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Strong analytical thinking, communication skills, familiarity with flowcharts and diagrams."
    },
    {
        title: "Full Stack Developer",
        companyName: "DevMerge",
        role: "Junior Developer",
        duration: 13,
        domain: "Software Development",
        experienceLevel: "entry",
        technicalDifficulty: 70,
        behavioralDifficulty: 50,
        generalDifficulty: 60,
        jobProfileDescription: `
Role & Responsibilities:
• Creating mobile-responsive and browser-compatible HTML mailers and newsletters...
`,
        preferredCandidateProfile: "Hands-on with MERN stack, understanding of Git, and RESTful architecture."
    }
];
