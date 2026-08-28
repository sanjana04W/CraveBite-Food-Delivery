import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import PracticeArea from "@/app/models/PracticeArea";

const initialAreas = [
  {
    slug: "property-law", title: "Property Law", category: "REAL ESTATE", iconName: "Home", order: 1,
    description: "Legal advice and representation for land, property ownership, transfers, disputes, conveyancing, and real estate contracts.",
    subtitle: "Professional legal guidance for property transactions, ownership matters, real estate disputes, contracts, and other property-related legal issues.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Our property law services provide professional legal guidance for individuals and businesses dealing with property ownership, transactions, agreements, disputes, and real estate matters.",
    services: [
      { icon: "Building2", title: "Property Transactions", description: "Comprehensive guidance for buying, selling, and transferring real estate assets safely." },
      { icon: "Key", title: "Property Ownership", description: "Resolving title deeds, joint ownership issues, and proprietary rights matters." },
      { icon: "FileText", title: "Sale and Purchase Agreements", description: "Drafting, reviewing, and negotiating secure contracts for residential and commercial property." },
      { icon: "Scale", title: "Land Disputes", description: "Strategic representation for boundary conflicts, easement disagreements, and land encroachments." },
      { icon: "ShieldCheck", title: "Property Contracts", description: "Protecting your interests with legally binding, precise agreements and lease documentation." },
      { icon: "Briefcase", title: "Real Estate Legal Advice", description: "Expert consulting on zoning laws, development regulations, and investment acquisitions." }
    ],
    commonMatters: ["Property ownership disputes","Land ownership issues","Property sale and purchase agreements","Lease and rental agreements","Property boundary disputes","Real estate transactions"],
    faqs: [
      { question: "What property matters do you handle?", answer: "We handle residential and commercial real estate transactions, contract reviews, title checks, leasing agreements, and property dispute resolution." },
      { question: "Can you help with property disputes?", answer: "Yes, we provide skilled representation for boundary disagreements, contract breaches, and ownership disputes to protect your investment." },
      { question: "Do you provide legal advice before purchasing property?", answer: "Absolutely. We strongly recommend consulting us to review agreements of sale and check title integrity before signing binding commitments." }
    ],
    status: "Published", visibility: true, views: 1420
  },
  {
    slug: "family-law", title: "Family Law", category: "FAMILY", iconName: "Users", order: 2,
    description: "Compassionate support for divorce, child custody, maintenance, adoption, and all family-related legal matters.",
    subtitle: "Compassionate and confidential legal support for divorce, child custody, spousal support, adoption, and family estate planning.",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Navigating family legal matters requires a delicate balance of legal expertise and empathy. We assist clients through sensitive transitions such as divorce, child custody arrangements, asset distribution, and adoption with utmost discretion.",
    services: [
      { icon: "Users", title: "Divorce & Separation", description: "Guiding you through dissolution proceedings with dignity, fairness, and asset protection." },
      { icon: "HeartHandshake", title: "Child Custody & Support", description: "Prioritizing the welfare of children through structured parenting and support agreements." },
      { icon: "FileSignature", title: "Prenuptial Agreements", description: "Drafting clear pre- and post-marital agreements to secure financial futures." },
      { icon: "Home", title: "Property Division", description: "Equitable distribution of matrimonial assets, homes, and shared investments." },
      { icon: "Shield", title: "Adoption & Guardianship", description: "Legal assistance for growing families through formal adoption and legal guardianship processes." },
      { icon: "MessageSquare", title: "Family Mediation", description: "Alternative dispute resolution to reach amicable settlements outside the courtroom." }
    ],
    commonMatters: ["Contested and uncontested divorce proceedings","Child custody and visitation rights","Child and spousal maintenance support","Division of matrimonial property","Drafting prenuptial and postnuptial agreements","Domestic protection orders"],
    faqs: [
      { question: "How do you approach family law cases?", answer: "We focus on constructive resolution, prioritizing mediation and amicable agreements where possible, while vigorously protecting your rights in court if needed." },
      { question: "What factors influence child custody decisions?", answer: "Courts primarily consider the best interests of the child, looking at stability, primary caregiving history, and emotional well-being." }
    ],
    status: "Published", visibility: true, views: 980
  },
  {
    slug: "civil-law", title: "Civil Law", category: "DISPUTES", iconName: "Scale", order: 3,
    description: "Representation for civil disputes, compensation claims, breach of contract, and enforcement of legal rights.",
    subtitle: "Comprehensive legal solutions for contract disputes, civil litigation, debt recovery, tort claims, and personal injury matters.",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Our civil practice provides rigorous legal representation for individuals and businesses seeking resolution for private disputes, contractual breaches, and civil wrongs.",
    services: [
      { icon: "Scale", title: "Civil Litigation", description: "Aggressive yet professional court representation for contested civil disputes." },
      { icon: "FileText", title: "Contract Disputes", description: "Resolving breaches of agreement and enforcing contractual rights and obligations." },
      { icon: "DollarSign", title: "Debt Recovery", description: "Recovering unpaid debts through legal channels and negotiated settlements." },
      { icon: "AlertCircle", title: "Tort Claims", description: "Pursuing compensation for wrongful acts that caused personal or financial harm." },
      { icon: "ShieldCheck", title: "Consumer Protection", description: "Defending consumer rights against unfair business practices and fraudulent claims." },
      { icon: "FileCheck", title: "Injunctions & Orders", description: "Seeking urgent court orders to prevent ongoing harm or preserve legal rights." }
    ],
    commonMatters: ["Breach of contract disputes","Debt collection and recovery","Personal injury compensation claims","Property damage claims","Consumer rights disputes","Neighbor and nuisance disputes"],
    faqs: [
      { question: "What types of civil cases do you handle?", answer: "We manage contract disputes, debt recovery, personal injury claims, property damage, and other civil litigation matters." },
      { question: "How long does a civil case typically take?", answer: "Timelines vary based on complexity, but most civil matters are resolved within 6 to 18 months through negotiation or litigation." }
    ],
    status: "Published", visibility: true, views: 850
  },
  {
    slug: "criminal-law", title: "Criminal Law", category: "DEFENCE", iconName: "Gavel", order: 4,
    description: "Vigorous legal defence, criminal investigations, court representation, bail hearings, and legal consultation.",
    subtitle: "Experienced criminal defense attorneys providing vigorous representation for all criminal charges and proceedings.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Our criminal defense team provides skilled, experienced representation for individuals facing criminal charges. We uphold the principle that every person deserves a fair trial and the best possible legal defense.",
    services: [
      { icon: "ShieldAlert", title: "Criminal Defense", description: "Comprehensive legal defense strategies to challenge evidence and protect your freedom." },
      { icon: "Scale", title: "Bail Hearings", description: "Presenting compelling arguments for bail to secure your release pending trial." },
      { icon: "FileSearch", title: "Criminal Investigations", description: "Assisting during police investigations to protect your rights and legal interests." },
      { icon: "Gavel", title: "Court Representation", description: "Professional, confident representation during all stages of criminal proceedings." },
      { icon: "FileText", title: "Legal Consultation", description: "Confidential advice on your legal options and the best course of action." },
      { icon: "Lock", title: "Plea Negotiations", description: "Strategic negotiations with prosecutors to achieve the best possible outcome." }
    ],
    commonMatters: ["Assault and battery charges","Theft and fraud offenses","Drug-related offenses","Traffic and driving offenses","White-collar crime defense","Juvenile criminal matters"],
    faqs: [
      { question: "What should I do if I am arrested?", answer: "Remain calm, exercise your right to silence, and contact a criminal defense lawyer immediately before answering any questions." },
      { question: "Can you help with bail applications?", answer: "Yes, we present strong bail arguments to courts to secure your release while your matter proceeds." }
    ],
    status: "Published", visibility: true, views: 620
  },
  {
    slug: "labour-law", title: "Labour Law", category: "EMPLOYMENT", iconName: "UserCheck", order: 5,
    description: "Employment contracts, workplace disputes, employee rights, unfair dismissal, and employer compliance guidance.",
    subtitle: "Protecting employee rights and helping employers maintain legal compliance with all employment laws and regulations.",
    heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "We provide expert legal services in all aspects of employment law, from drafting employment contracts and workplace policies to representing clients in unfair dismissal claims and labor disputes.",
    services: [
      { icon: "UserCheck", title: "Unfair Dismissal Claims", description: "Representing employees who have been wrongfully or unfairly terminated from their employment." },
      { icon: "FileText", title: "Employment Contracts", description: "Drafting, reviewing, and negotiating comprehensive employment agreements and policies." },
      { icon: "Users", title: "Workplace Disputes", description: "Resolving conflicts between employers and employees through mediation or legal action." },
      { icon: "Scale", title: "Discrimination Claims", description: "Addressing workplace discrimination based on race, gender, age, disability, or religion." },
      { icon: "ClipboardList", title: "Employer Compliance", description: "Ensuring businesses comply with all labor laws, regulations, and workplace requirements." },
      { icon: "RefreshCw", title: "Retrenchment & Restructuring", description: "Legal guidance for businesses undergoing workforce restructuring or retrenchment processes." }
    ],
    commonMatters: ["Unfair dismissal and retrenchment","Workplace harassment and discrimination","Employment contract disputes","Wage and salary disputes","Restraint of trade agreements","CCMA and Labour Court representation"],
    faqs: [
      { question: "What constitutes unfair dismissal?", answer: "Unfair dismissal occurs when an employee is terminated without a valid reason, without following a fair process, or in a discriminatory manner." },
      { question: "Can you help with CCMA cases?", answer: "Yes, we represent both employees and employers in CCMA conciliation and arbitration proceedings." }
    ],
    status: "Published", visibility: true, views: 430
  },
  {
    slug: "corporate-law", title: "Corporate Law", category: "BUSINESS", iconName: "Briefcase", order: 6,
    description: "Business registration, legal compliance, company agreements, mergers, acquisitions, and commercial legal services.",
    subtitle: "Comprehensive business and corporate legal solutions for startups, SMEs, and established enterprises.",
    heroImage: "https://images.unsplash.com/photo-1664575600850-c4b712e6e2bf?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Our corporate law team provides comprehensive legal support for businesses at every stage of their lifecycle — from initial registration and compliance through to complex commercial transactions, mergers, and dispute resolution.",
    services: [
      { icon: "Briefcase", title: "Business Registration", description: "Registering companies, partnerships, and other business entities with all required authorities." },
      { icon: "FileText", title: "Commercial Contracts", description: "Drafting and reviewing business agreements, NDAs, service contracts, and MOUs." },
      { icon: "TrendingUp", title: "Mergers & Acquisitions", description: "Legal due diligence, transaction structuring, and documentation for M&A deals." },
      { icon: "ShieldCheck", title: "Corporate Governance", description: "Advising on board structures, shareholder rights, and regulatory compliance obligations." },
      { icon: "CheckSquare", title: "Legal Compliance", description: "Ensuring your business meets all statutory, regulatory, and industry-specific legal requirements." },
      { icon: "BookOpen", title: "Intellectual Property", description: "Protecting trademarks, patents, copyrights, and other business intellectual assets." }
    ],
    commonMatters: ["Company registration and structuring","Shareholder and partnership agreements","Business acquisitions and mergers","Commercial contract disputes","Corporate governance and compliance","Intellectual property protection"],
    faqs: [
      { question: "What types of businesses do you assist?", answer: "We advise startups, SMEs, family businesses, and large corporations across all industries and sectors." },
      { question: "Can you help with business contracts?", answer: "Yes, we draft, review, and negotiate all types of commercial contracts to protect your business interests." }
    ],
    status: "Published", visibility: true, views: 1100
  }
];

export async function POST() {
  try {
    await dbConnect();
    const count = await PracticeArea.countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: false, message: `Already seeded (${count} areas exist).` }, { status: 409 });
    }
    await PracticeArea.insertMany(initialAreas);
    return NextResponse.json({ success: true, message: `Seeded ${initialAreas.length} practice areas.` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
