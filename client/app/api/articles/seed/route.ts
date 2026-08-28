import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Article from "@/app/models/Article";

const initialArticles = [
  {
    slug: "complete-guide-to-property-transactions",
    title: "The Complete Guide to Property Transactions: Legal Steps Every Buyer and Seller Must Follow",
    category: "Property Law",
    author: "Attorney-at-Law",
    date: "July 18, 2026",
    readingTime: "12 min read",
    excerpt: "A comprehensive walkthrough of the entire property transaction process — from initial offer and due diligence to contract execution and title transfer.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    summary: "A comprehensive walkthrough of the entire property transaction process — from initial offer and due diligence to contract execution and title transfer. Learn about the critical legal steps necessary to protect your interests.",
    content: [
      { heading: "Understanding the Purchase Process", paragraphs: ["The property transaction process begins with an offer and acceptance, but the legal obligations start well before that.", "Buyers should conduct due diligence including title searches, inspections, and reviewing zoning restrictions before committing."] },
      { heading: "Due Diligence and Inspections", paragraphs: ["Conducting a professional property inspection helps identify structural issues, compliance problems, or encumbrances on the title.", "Legal review of the property history ensures no pending disputes, liens, or ownership complications exist."] },
      { heading: "Contract Review and Negotiation", paragraphs: ["The sale and purchase agreement is the cornerstone of the transaction and must clearly define all terms and conditions.", "Both parties benefit from legal review to confirm obligations, mitigate risks, and ensure enforceable contract language."] },
      { heading: "Closing the Deal", paragraphs: ["Closing requires coordinating title insurance, lender documents, escrow funds, and final signatures from all parties.", "A detailed review of the closing statement helps prevent unexpected costs and ensures the transfer follows local property regulations."] },
      { heading: "After Closing", paragraphs: ["Once the transaction is complete, verifying the recording of the deed and confirming clear title protects your ownership rights.", "Professional legal counsel can help resolve any post-closing disputes or issues that arise with the property transfer."] }
    ],
    featured: true,
    status: "Published",
    views: 1500
  },
  {
    slug: "understanding-property-rights",
    title: "Understanding Property Rights: A Comprehensive Guide",
    category: "Property Law",
    author: "Attorney-at-Law",
    date: "July 15, 2026",
    readingTime: "8 min read",
    excerpt: "Navigate the complexities of property ownership, easements, and boundary disputes with this comprehensive legal guide.",
    heroImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop",
    summary: "Navigate the complexities of property ownership, easements, and boundary disputes with expert legal guidance.",
    content: [
      { heading: "What Are Property Rights?", paragraphs: ["Property rights define who legally owns, uses, and controls a piece of land or building.", "These rights are protected by law and can be transferred, sold, or inherited."] },
      { heading: "Types of Ownership", paragraphs: ["Sole ownership, joint ownership, and sectional title are the most common forms of property ownership.", "Each carries different legal obligations and implications for inheritance and sale."] },
      { heading: "Easements and Servitudes", paragraphs: ["An easement grants a party the right to use another's land for a specific purpose such as access or utility lines.", "Understanding registered servitudes is vital before purchasing any property."] },
      { heading: "Resolving Disputes", paragraphs: ["Boundary and ownership disputes should be addressed early with professional legal advice.", "Mediation can often resolve property conflicts before costly litigation becomes necessary."] }
    ],
    featured: false,
    status: "Published",
    views: 1245
  },
  {
    slug: "navigating-divorce-proceedings",
    title: "Navigating Divorce Proceedings: What You Need to Know",
    category: "Family Law",
    author: "Attorney-at-Law",
    date: "July 12, 2026",
    readingTime: "6 min read",
    excerpt: "Essential information about the divorce process, asset division, child custody, and how to protect your legal interests.",
    heroImage: "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?q=80&w=1200&auto=format&fit=crop",
    summary: "Essential information about the divorce process, asset division, child custody, and how to protect your legal interests throughout proceedings.",
    content: [
      { heading: "Starting the Divorce Process", paragraphs: ["Divorce proceedings begin with filing a petition and serving the other party with the relevant legal documents.", "Understanding whether your divorce will be contested or uncontested affects the timeline and legal strategy."] },
      { heading: "Division of Assets", paragraphs: ["Matrimonial property division follows the principle of equitable distribution, taking into account contributions by both spouses.", "Separate property acquired before marriage or through inheritance may be excluded from division."] },
      { heading: "Child Custody Considerations", paragraphs: ["Courts prioritize the best interests of the child when determining custody and visitation arrangements.", "A parenting plan that addresses living arrangements, decision-making, and holidays helps minimize conflict."] },
      { heading: "Protecting Your Interests", paragraphs: ["Retain legal counsel early to ensure your financial and parental rights are fully protected throughout the process.", "Mediation can reduce costs and emotional stress while reaching a fair settlement for both parties."] }
    ],
    featured: false,
    status: "Published",
    views: 986
  },
  {
    slug: "business-compliance-2026",
    title: "Business Compliance in 2026: Key Legal Updates Every Business Owner Must Know",
    category: "Corporate Law",
    author: "Attorney-at-Law",
    date: "July 8, 2026",
    readingTime: "10 min read",
    excerpt: "Stay ahead of regulatory changes with our comprehensive analysis of the latest business compliance requirements.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    summary: "Stay ahead of regulatory changes with our comprehensive analysis of the latest business compliance requirements for 2026.",
    content: [
      { heading: "New Compliance Requirements", paragraphs: ["Businesses in 2026 face updated regulatory requirements covering data privacy, employment records, and financial reporting.", "Non-compliance can result in significant fines, penalties, and reputational damage."] },
      { heading: "Corporate Governance Updates", paragraphs: ["Revised governance frameworks require companies to maintain updated shareholder registers and board resolutions.", "Annual compliance reviews help identify and address gaps before regulatory audits occur."] },
      { heading: "Employment Law Changes", paragraphs: ["New labour regulations affect minimum wage, contract formats, and employee benefits across multiple sectors.", "Updating employment contracts and HR policies ensures alignment with the latest legal standards."] },
      { heading: "Action Steps for Business Owners", paragraphs: ["Schedule a compliance audit with your legal team to identify areas of risk and prioritize corrective action.", "Proactive legal planning reduces exposure and supports sustainable business growth."] }
    ],
    featured: false,
    status: "Published",
    views: 745
  },
  {
    slug: "defense-rights-investigations",
    title: "Key Constitutional Protections and Defense Rights in Investigations",
    category: "Criminal Law",
    author: "Attorney-at-Law",
    date: "July 4, 2026",
    readingTime: "9 min read",
    excerpt: "An introduction to fundamental legal rights and strategies during criminal investigations.",
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
    summary: "An introduction to fundamental legal rights and strategies during criminal investigations and police questioning.",
    content: [
      { heading: "Your Rights During an Investigation", paragraphs: ["Understanding your constitutional protections is critical when law enforcement initiates an investigation.", "Knowing when to speak, when to remain silent, and when to seek legal counsel can preserve your rights."] },
      { heading: "Searches and Seizures", paragraphs: ["Police must generally obtain a warrant before searching a home or vehicle, unless an exception applies.", "Challenging an unlawful search can lead to evidence being suppressed and strengthen your defense."] },
      { heading: "Interrogation and Legal Counsel", paragraphs: ["You have the right to an attorney during interrogation, and requesting one should be done clearly and immediately.", "A defense attorney can help ensure your rights are protected throughout the process."] },
      { heading: "Conclusion", paragraphs: ["Early legal advice can make a major difference in the outcome of an investigation.", "Contact our criminal defense team before you answer questions or sign documents."] }
    ],
    featured: false,
    status: "Published",
    views: 620
  },
  {
    slug: "employee-rights-regulations",
    title: "Employee Rights and Employer Obligations Under New Labour Rules",
    category: "Labour Law",
    author: "Attorney-at-Law",
    date: "June 29, 2026",
    readingTime: "7 min read",
    excerpt: "A deep dive into unfair dismissal claims, contract changes, and workplace safety obligations.",
    heroImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    summary: "A deep dive into unfair dismissal claims, contract changes, and workplace safety under new labour regulations.",
    content: [
      { heading: "Modern Labour Protections", paragraphs: ["Recent labour reforms strengthen protections for employees in hiring, dismissal, and workplace safety.", "Employers are increasingly required to provide clear policies, written contracts, and fair procedural reviews."] },
      { heading: "Dismissal and Unfair Treatment", paragraphs: ["Unfair dismissal can arise when an employer terminates employment without valid cause or due process.", "Employees may be entitled to compensation, reinstatement, or settlement depending on the situation."] },
      { heading: "Workplace Safety and Compliance", paragraphs: ["Workers have the right to a safe workplace and the ability to report hazards without retaliation.", "Employers must follow labour regulations governing hours, leave, and safety protocols."] },
      { heading: "Conclusion", paragraphs: ["Knowing your rights empowers you to protect your career and hold employers accountable.", "Consult with our labour law team if you face unfair treatment or contract disputes."] }
    ],
    featured: false,
    status: "Published",
    views: 540
  },
  {
    slug: "civil-dispute-resolution",
    title: "Understanding Civil Dispute Resolution and Out-of-Court Settlements",
    category: "Civil Law",
    author: "Attorney-at-Law",
    date: "June 25, 2026",
    readingTime: "10 min read",
    excerpt: "How to resolve civil disputes efficiently through mediation and arbitration rather than costly court proceedings.",
    heroImage: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=1200&auto=format&fit=crop",
    summary: "How to resolve civil disputes efficiently through mediation and arbitration rather than costly court proceedings.",
    content: [
      { heading: "Introduction to Civil Resolution", paragraphs: ["Civil disputes often involve contracts, property rights, family matters, or personal injury claims.", "Many conflicts can be resolved outside court through negotiation, mediation, or arbitration."] },
      { heading: "Mediation and Arbitration", paragraphs: ["Mediation provides a structured, confidential setting where parties can reach a voluntary agreement.", "Arbitration offers a binding decision from an impartial third party without courtroom formality."] },
      { heading: "Benefits of Alternative Dispute Resolution", paragraphs: ["Alternative dispute resolution is typically faster, less expensive, and more private than litigation.", "It also preserves relationships by encouraging collaborative problem solving."] },
      { heading: "Conclusion", paragraphs: ["Effective dispute resolution starts with the right legal strategy and experienced counsel.", "Contact us to discuss whether mediation, arbitration, or litigation is best for your case."] }
    ],
    featured: false,
    status: "Published",
    views: 432
  },
  {
    slug: "child-custody-guide-parents",
    title: "Child Custody Arrangements: A Complete Guide for Parents",
    category: "Family Law",
    author: "Attorney-at-Law",
    date: "June 18, 2026",
    readingTime: "11 min read",
    excerpt: "Comprehensive guidance on child custody types, factors courts consider, and how to prepare your case effectively.",
    heroImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1200&auto=format&fit=crop",
    summary: "Comprehensive guidance on child custody types, factors courts consider, and how to prepare your case effectively.",
    content: [
      { heading: "Types of Custody", paragraphs: ["Courts distinguish between physical custody and legal custody, which covers decision-making authority.", "Parents can seek sole custody, joint custody, or a shared arrangement depending on the child's best interests."] },
      { heading: "Factors Courts Consider", paragraphs: ["The court evaluates the child's age, emotional needs, parental relationships, and stability when making decisions.", "A parent's ability to provide a safe, nurturing home environment is critical to the court's assessment."] },
      { heading: "Preparing Your Custody Case", paragraphs: ["Gather documentation about your parenting involvement, living arrangements, and relevant communications.", "Work with an attorney to present a clear and child-focused plan that supports the best outcome."] },
      { heading: "Conclusion", paragraphs: ["Child custody disputes are emotionally difficult, but the right legal guidance can help protect your child's future.", "Contact our family law team for confidential support and case preparation."] }
    ],
    featured: false,
    status: "Published",
    views: 389
  }
];

export async function POST() {
  try {
    await dbConnect();
    const count = await Article.countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: false, message: `Already seeded (${count} articles exist).` }, { status: 409 });
    }
    await Article.insertMany(initialArticles);
    return NextResponse.json({ success: true, message: `Seeded ${initialArticles.length} articles.` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
