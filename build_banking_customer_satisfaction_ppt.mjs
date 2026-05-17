const fs = await import("node:fs/promises");
const path = await import("node:path");
const { Presentation, PresentationFile } = await import("@oai/artifact-tool");

const W = 1280;
const H = 720;

const DECK_ID = "banking-customer-satisfaction-ppt";
const BASE_DIR = "/Users/macbook/Desktop/yoon phoo eain(Thesis)/paper 2/paper 3";
const OUT_DIR = `${BASE_DIR}/outputs/${DECK_ID}`;
const SCRATCH_DIR = path.resolve("tmp", "slides", DECK_ID);
const PREVIEW_DIR = path.join(SCRATCH_DIR, "preview");

const PAPER = "#F8F3EA";
const PAPER_SOFT = "#F2EBDD";
const WHITE = "#FFFFFF";
const INK = "#14221E";
const GRAPHITE = "#46544F";
const MUTED = "#6D7A76";
const EMERALD = "#0F7A63";
const EMERALD_DARK = "#0B5D4D";
const EMERALD_SOFT = "#DDF2EB";
const GOLD = "#D4A947";
const GOLD_SOFT = "#F4E7C4";
const CORAL = "#D96E53";
const LINE = "#D8D0C2";
const TRANSPARENT = "#00000000";

const TITLE_FACE = "Cormorant Garamond";
const BODY_FACE = "Aptos";
const MONO_FACE = "Aptos Mono";

const ANALYSIS = {
  totalResponses: "12",
  overallMean: "4.00 / 5",
  topFactor: "Security (4.42)",
  weakFactor: "Digital Convenience (3.67)",
  bankLeaders: "KBZ Bank has the largest sample with 4 respondents.",
  highSatisfaction: "8 of 12 respondents reported high satisfaction.",
};

const SCREENSHOT_DIR = `${BASE_DIR}/assets/screenshots`;
const SCREENSHOTS = {
  home: `${SCREENSHOT_DIR}/home.png`,
  about: `${SCREENSHOT_DIR}/about.png`,
  theory: `${SCREENSHOT_DIR}/theory.png`,
  methodology: `${SCREENSHOT_DIR}/methodology.png`,
  survey: `${SCREENSHOT_DIR}/survey.png`,
  dashboard: `${SCREENSHOT_DIR}/dashboard.png`,
  results: `${SCREENSHOT_DIR}/results.png`,
  recommendations: `${SCREENSHOT_DIR}/recommendations.png`,
  report: `${SCREENSHOT_DIR}/report.png`,
};

function buildSlides() {
  const slides = [];

  slides.push({
    type: "cover",
    kicker: "THESIS PRESENTATION",
    title: "A Web-Based Customer Satisfaction Analysis System for Banking Services",
    subtitle:
      "A comprehensive presentation of the thesis topic, web system, methodology, screenshots, analysis outputs, and future value.",
    emphasis: "This deck expands the proposal into a full system presentation with web interface evidence.",
    screenshot: SCREENSHOTS.home,
  });

  slides.push({
    type: "cards",
    kicker: "PRESENTATION MAP",
    title: "What This 56-Slide Deck Covers",
    subtitle: "The presentation is organized from thesis foundation to system design, live interface walkthrough, and findings.",
    cards: [
      ["Research Foundation", "Background, problem statement, objectives, research questions, significance, scope, and expected contribution."],
      ["Theory And Method", "SERVQUAL, Expectation Confirmation Theory, conceptual framework, quantitative design, questionnaire, and analysis tools."],
      ["Web System Evidence", "System architecture, modules, screenshots of each page, sample analysis outputs, recommendations, and future improvement."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "EXECUTIVE SUMMARY",
    title: "The Main Idea In One View",
    subtitle: "This project turns a written thesis topic into a practical website for collecting, analyzing, and presenting customer satisfaction data.",
    metrics: [
      ["Thesis Topic", "Customer satisfaction in banking services", "Academic focus"],
      ["System Form", "Web-based research platform", "Practical implementation"],
      ["Output", "Survey + dashboard + report", "End-to-end workflow"],
    ],
  });

  slides.push({
    type: "section",
    kicker: "PART I",
    title: "Research Foundation",
    subtitle: "The first section explains why the topic matters and what the study is trying to achieve.",
  });

  slides.push({
    type: "cards",
    kicker: "BACKGROUND",
    title: "Why Customer Satisfaction Matters In Banking",
    subtitle: "Banks are judged not only by financial products but also by customer experience, trust, speed, and convenience.",
    cards: [
      ["Competition", "Modern banks compete through branch service, staff behavior, digital convenience, and reliability."],
      ["Customer View", "Customers care about waiting time, transaction accuracy, security, and how they are treated."],
      ["Research Value", "Studying satisfaction helps identify which service areas support loyalty and retention."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "CONTEXT",
    title: "The Banking Service Problem",
    subtitle: "The study begins with the observation that service quality can vary across touchpoints and influence satisfaction.",
    metrics: [
      ["Branch", "Human interaction matters", "Staff courtesy, speed, queue handling"],
      ["Digital", "Convenience affects trust", "Mobile and online banking quality"],
      ["Outcome", "Satisfaction changes behavior", "Loyalty, trust, and repeat usage"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "PROBLEM STATEMENT",
    title: "Key Issues Observed In Banking Services",
    subtitle: "The study focuses on service quality gaps that can reduce customer satisfaction.",
    cards: [
      ["Long Waiting Time", "Customers may become frustrated when branch services take too long."],
      ["Inconsistent Staff Support", "Poor communication or weak problem-solving can lower confidence in the bank."],
      ["Digital Convenience Gaps", "Customers expect online and mobile channels to be smooth, secure, and easy to use."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "OBJECTIVES",
    title: "What The Study Intends To Achieve",
    subtitle: "The research is structured around measurement, explanation, and improvement.",
    cards: [
      ["Objective 1", "To examine the level of customer satisfaction in banking services."],
      ["Objective 2", "To identify service quality factors that influence customer satisfaction."],
      ["Objective 3", "To provide recommendations for improving banking services."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "RESEARCH QUESTIONS",
    title: "Questions Guiding The Analysis",
    subtitle: "These questions connect the survey design to the analytical output.",
    cards: [
      ["Question 1", "What is the level of customer satisfaction in banking services?"],
      ["Question 2", "Which service factors most strongly affect customer satisfaction?"],
      ["Question 3", "How can banks improve service quality and increase satisfaction?"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "SIGNIFICANCE",
    title: "Why The Study Is Important",
    subtitle: "The study has value for managers, customers, and future researchers.",
    cards: [
      ["For Banks", "It highlights weak service areas and supports evidence-based improvement."],
      ["For Customers", "It encourages more responsive, secure, and convenient banking services."],
      ["For Research", "It creates a structured reference for later studies on service quality and satisfaction."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "SCOPE",
    title: "What The Study Covers",
    subtitle: "The project focuses on selected bank customers and satisfaction-related service factors only.",
    cards: [
      ["Respondents", "Customers who use banking services and can evaluate their experiences."],
      ["Core Factors", "Tangibles, reliability, responsiveness, assurance, empathy, security, and digital convenience."],
      ["Boundary", "The study measures satisfaction and service quality rather than financial profit or policy."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "EXPECTED CONTRIBUTION",
    title: "What The Thesis Adds",
    subtitle: "The project contributes both academic explanation and a working web system artifact.",
    cards: [
      ["Academic", "It applies theory and method to a measurable customer satisfaction topic."],
      ["Technical", "It implements a working website for survey collection and analysis."],
      ["Practical", "It gives banks a clear view of where service quality should improve."],
    ],
  });

  slides.push({
    type: "section",
    kicker: "PART II",
    title: "Theoretical Framework",
    subtitle: "This section explains the models and variables that shape the research design.",
  });

  slides.push({
    type: "metrics",
    kicker: "THEORY OVERVIEW",
    title: "Two Main Theories Support The Study",
    subtitle: "The project uses one service-quality model and one satisfaction theory.",
    metrics: [
      ["SERVQUAL", "Measures service quality", "Five service dimensions"],
      ["ECT", "Explains satisfaction formation", "Expectation vs actual experience"],
      ["Framework", "Links factors to satisfaction", "Supports analysis and discussion"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "SERVQUAL",
    title: "SERVQUAL Model In The Banking Context",
    subtitle: "SERVQUAL is used to examine whether customers experience banking services as dependable and supportive.",
    cards: [
      ["Meaning", "SERVQUAL measures customer perceptions of service quality through structured dimensions."],
      ["Relevance", "Banking service quality strongly depends on process, interaction, environment, and trust."],
      ["Use In This Study", "The model provides the language for rating branch and digital service experiences."],
    ],
  });

  const servqualDimensions = [
    ["Tangibles", "Physical facilities, branch environment, appearance of staff, and visible professionalism."],
    ["Reliability", "Ability to perform promised services accurately and dependably every time."],
    ["Responsiveness", "Willingness to help customers quickly and respond to issues without delay."],
    ["Assurance", "Knowledge, courtesy, and trustworthiness shown by bank staff and service systems."],
    ["Empathy", "Personal attention, understanding of customer needs, and supportive interaction."],
  ];

  for (const [label, body] of servqualDimensions) {
    slides.push({
      type: "cards",
      kicker: "SERVQUAL DIMENSION",
      title: label,
      subtitle: `How ${label.toLowerCase()} contributes to customer satisfaction in banking services.`,
      cards: [
        ["Definition", body],
        ["Banking Example", `This dimension can be observed in the way ${label.toLowerCase()} appears in branch service or digital support.`],
        ["Reason For Inclusion", `If ${label.toLowerCase()} is weak, customer satisfaction may decrease even when other factors are acceptable.`],
      ],
    });
  }

  slides.push({
    type: "cards",
    kicker: "EXPECTATION CONFIRMATION THEORY",
    title: "Expectation Confirmation Theory",
    subtitle: "ECT explains customer satisfaction as the result of comparing expectation with actual experience.",
    cards: [
      ["Expectation", "Customers enter the service process with standards about speed, accuracy, and convenience."],
      ["Confirmation", "If the actual banking experience meets or exceeds those standards, customers feel satisfied."],
      ["Disconfirmation", "If the service falls short, dissatisfaction appears and trust may weaken."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "CONCEPTUAL FRAMEWORK",
    title: "Variables Used In The Study",
    subtitle: "The framework treats service-related factors as independent variables and customer satisfaction as the dependent variable.",
    metrics: [
      ["IVs", "Service quality factors", "Branch and digital experience variables"],
      ["DV", "Customer satisfaction", "Overall satisfaction level"],
      ["Goal", "Relationship analysis", "Identify strongest and weakest factors"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "VARIABLE MAP",
    title: "Indicators Included In The System",
    subtitle: "The website translates the conceptual framework into measurable form fields and dashboard outputs.",
    cards: [
      ["Independent Variables", "Tangibles, reliability, responsiveness, assurance, empathy, security, and digital convenience."],
      ["Dependent Variable", "Overall customer satisfaction with banking services."],
      ["Measured Through", "Structured survey ratings stored in the database and summarized in the dashboard."],
    ],
  });

  slides.push({
    type: "section",
    kicker: "PART III",
    title: "Web System Design",
    subtitle: "This section explains how the thesis topic is converted into a working research website.",
  });

  slides.push({
    type: "cards",
    kicker: "SYSTEM PURPOSE",
    title: "Why A Web-Based System Was Developed",
    subtitle: "Instead of leaving the thesis as a written report only, the project turns it into a practical research platform.",
    cards: [
      ["Presentation", "The website presents the thesis content in a structured and visual way."],
      ["Collection", "It gathers responses directly through an online survey form."],
      ["Analysis", "It transforms the responses into dashboard outputs and printable reports."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "SYSTEM OBJECTIVES",
    title: "Main Functions Of The Website",
    subtitle: "The implementation mirrors the research workflow from theory to findings.",
    metrics: [
      ["Study", "Explain the thesis", "About, theory, methodology"],
      ["Survey", "Collect responses", "Questionnaire and respondent data"],
      ["Analysis", "Present findings", "Dashboard, results, recommendations, report"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "USER ROLES",
    title: "Who Uses The System",
    subtitle: "The project serves both the thesis presenter and the survey respondents.",
    cards: [
      ["Researcher", "Uses the study pages, monitors analysis, and presents the report to the supervisor."],
      ["Respondent", "Completes the customer satisfaction survey on banking service experience."],
      ["Supervisor Or Viewer", "Reviews the interface, screenshots, analysis outputs, and system contribution."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "TECHNOLOGY STACK",
    title: "Technologies Used To Build The System",
    subtitle: "The system is lightweight, practical, and appropriate for a student thesis project.",
    cards: [
      ["Frontend", "HTML, CSS, JavaScript, and Chart.js for page layout and analysis visuals."],
      ["Backend", "Python Flask for routing, business logic, and API handling."],
      ["Database", "SQLite for storing questionnaire responses in a simple local database."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "ARCHITECTURE",
    title: "High-Level System Architecture",
    subtitle: "The system follows a simple web architecture suitable for survey-driven research work.",
    cards: [
      ["Presentation Layer", "Templates render thesis content pages, survey forms, dashboard views, and report output."],
      ["Application Layer", "Flask routes validate input, build analysis results, and provide filtered outputs."],
      ["Data Layer", "SQLite stores respondent profiles, ratings, comments, and timestamps for later interpretation."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "MODULES",
    title: "Core Modules Of The Website",
    subtitle: "Each module supports a different stage of the thesis journey.",
    cards: [
      ["Study Module", "About, Theory, and Methodology pages explain the academic foundation of the project."],
      ["Survey Module", "The form collects respondent information and service-quality ratings."],
      ["Analysis Module", "Dashboard, Results, Recommendations, and Report pages turn raw responses into meaning."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "DATA FLOW",
    title: "How Information Moves Through The System",
    subtitle: "The workflow begins with page reading and ends with analysis and reporting.",
    cards: [
      ["Input", "A bank customer enters profile details and satisfaction ratings through the survey page."],
      ["Processing", "Flask validates the values, stores them, and computes analysis summaries from the database."],
      ["Output", "The dashboard, results page, recommendations, and report present the findings visually."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "DATABASE DESIGN",
    title: "How The Database Supports The Research",
    subtitle: "The database is designed around the survey structure so that each response becomes analyzable.",
    cards: [
      ["Stored Fields", "Name, age, gender, bank name, usage frequency, factor ratings, overall satisfaction, and comments."],
      ["Benefits", "The structure supports simple descriptive analysis and filter-based summaries."],
      ["Why SQLite", "SQLite is lightweight, easy to run locally, and appropriate for a thesis prototype."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "PROCESSING LOGIC",
    title: "Key Backend Features",
    subtitle: "The backend does more than store data; it prepares outputs that are ready for presentation.",
    metrics: [
      ["Validation", "Form values are cleaned", "Prevents missing or invalid ratings"],
      ["Filtering", "Analysis can be narrowed", "Bank, gender, and usage frequency"],
      ["Export", "Report and CSV support", "Presentation-friendly output"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "UI / UX",
    title: "Design Choices Used In The Website",
    subtitle: "The visual system is designed to feel more premium than a basic academic prototype.",
    cards: [
      ["Theme", "An emerald and gold palette is used to create a stronger banking identity."],
      ["Navigation", "The menu is simplified into Home, Study, Survey, Analysis, and Report for clarity."],
      ["Responsiveness", "The site includes a mobile hamburger menu, sticky shrinking header, and polished hover states."],
    ],
  });

  slides.push({
    type: "section",
    kicker: "PART IV",
    title: "Website Walkthrough With Screenshots",
    subtitle: "The following slides show the actual interface pages included in the system.",
  });

  const screenshotSlides = [
    ["Homepage Screenshot", SCREENSHOTS.home, ["Introduces the thesis website and highlights the system purpose.", "Shows the premium banking visual style and simplified navigation.", "Provides direct actions to start the survey or view analysis."]],
    ["About Page Screenshot", SCREENSHOTS.about, ["Explains the background of the study and core research problem.", "Helps the supervisor see how the written thesis is converted into a web page.", "Includes summary framing and structured content panels."]],
    ["Theory Page Screenshot", SCREENSHOTS.theory, ["Shows the theoretical framework section of the website.", "Connects SERVQUAL and Expectation Confirmation Theory to the study.", "Presents theory in a more visual and presentation-friendly format."]],
    ["Methodology Page Screenshot", SCREENSHOTS.methodology, ["Displays the research method, data collection, and analysis logic.", "Keeps methodology content aligned with the thesis chapter structure.", "Demonstrates how research design is translated into system content."]],
    ["Survey Page Screenshot", SCREENSHOTS.survey, ["Shows the respondent form used to collect customer satisfaction data.", "Includes profile fields and Likert-style ratings for service-quality factors.", "This page is the main input module of the system."]],
    ["Dashboard Screenshot", SCREENSHOTS.dashboard, ["Presents live analysis with filters, charts, summaries, and insights.", "Shows how collected data becomes visual evidence for discussion.", "This is the most analytical page in the entire website."]],
    ["Results Page Screenshot", SCREENSHOTS.results, ["Converts dashboard outputs into research-style explanation.", "Supports discussion writing by linking findings to theory.", "Helps explain strengths and weak areas in customer satisfaction."]],
    ["Recommendations Page Screenshot", SCREENSHOTS.recommendations, ["Turns analysis into practical service-improvement suggestions.", "Focuses on operational, human, and digital service improvements.", "Shows the practical usefulness of the study for banks."]],
    ["Report Page Screenshot", SCREENSHOTS.report, ["Provides a printable report view for supervisor review and PDF export.", "Condenses the main results into a simple presentation format.", "This page supports final thesis presentation and documentation."]],
  ];

  for (const [title, shotPath, bullets] of screenshotSlides) {
    slides.push({
      type: "screenshot",
      kicker: "WEB SYSTEM SCREENSHOT",
      title,
      subtitle: "Actual page captured from the running thesis website.",
      screenshot: shotPath,
      bullets,
    });
  }

  slides.push({
    type: "section",
    kicker: "PART V",
    title: "Research Methodology In Practice",
    subtitle: "This section reconnects the working system to the formal research method behind it.",
  });

  slides.push({
    type: "cards",
    kicker: "RESEARCH METHOD",
    title: "Quantitative Method Used In The Study",
    subtitle: "The research uses a quantitative approach because the main variables can be measured through ratings.",
    cards: [
      ["Why Quantitative", "Customer satisfaction can be expressed through structured numeric responses."],
      ["Why Suitable", "The system collects measurable data that can be summarized and compared."],
      ["System Alignment", "The web form and dashboard are designed specifically for numerical analysis."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "RESPONDENTS",
    title: "Sampling And Target Participants",
    subtitle: "The study focuses on bank customers who can evaluate real service experiences.",
    cards: [
      ["Target Group", "Customers who use branch or digital banking services."],
      ["Sampling Approach", "Convenience sampling is practical for a student-level project."],
      ["Reasonable Scope", "The sample is sufficient to demonstrate how the web system supports analysis."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "QUESTIONNAIRE",
    title: "How The Survey Form Is Structured",
    subtitle: "The questionnaire is divided into respondent profile fields and service-quality evaluation fields.",
    cards: [
      ["Profile Data", "Age, gender, bank name, and usage frequency."],
      ["Rating Data", "Tangibles, reliability, responsiveness, assurance, empathy, security, digital convenience, and overall satisfaction."],
      ["Open Comment", "A short text comment captures additional experience that can support interpretation."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "MEASUREMENT",
    title: "Scale Used To Measure Satisfaction",
    subtitle: "The form uses a consistent rating scale so responses can be processed clearly.",
    metrics: [
      ["1 - 5", "Likert scale", "From weaker to stronger agreement or satisfaction"],
      ["8", "Factor ratings", "Seven service factors plus overall satisfaction"],
      ["1", "Comment field", "Adds small qualitative context"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "ANALYSIS TOOLS",
    title: "Techniques Used To Analyze Responses",
    subtitle: "The dashboard and report rely mainly on descriptive statistics suitable for a thesis prototype.",
    cards: [
      ["Frequency", "Shows how many responses fall into each category or group."],
      ["Mean", "Shows the average score for each service factor and overall satisfaction."],
      ["Distribution", "Shows whether satisfaction is mostly high, moderate, or low across the sample."],
    ],
  });

  slides.push({
    type: "metrics",
    kicker: "LIVE SAMPLE",
    title: "Current Dataset In The System",
    subtitle: "The running prototype already contains sample responses that demonstrate the full analysis flow.",
    metrics: [
      [ANALYSIS.totalResponses, "Total responses", "Seeded and test data available"],
      [ANALYSIS.overallMean, "Overall satisfaction mean", "Current dashboard reading"],
      [ANALYSIS.topFactor, "Strongest factor", "Automatically identified by the backend"],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "DATA STORY",
    title: "What The Current Sample Suggests",
    subtitle: "Even the existing sample data shows how the system can reveal interpretable service patterns.",
    cards: [
      ["Strongest Area", `${ANALYSIS.topFactor} suggests customers currently feel most confident about safety and trust.`],
      ["Weakest Area", `${ANALYSIS.weakFactor} indicates a possible improvement need in online or mobile service ease.`],
      ["Satisfaction Pattern", `${ANALYSIS.highSatisfaction} This shows the sample trends more positive than negative.`],
    ],
  });

  slides.push({
    type: "section",
    kicker: "PART VI",
    title: "Findings, Value, And Future Direction",
    subtitle: "The final section explains what the current system already demonstrates and what can be added later.",
  });

  slides.push({
    type: "metrics",
    kicker: "DASHBOARD SNAPSHOT",
    title: "Current Analysis Snapshot",
    subtitle: "The web system already produces a meaningful summary from the stored responses.",
    metrics: [
      [ANALYSIS.totalResponses, "Responses in dataset", ANALYSIS.bankLeaders],
      [ANALYSIS.overallMean, "Overall mean satisfaction", ANALYSIS.highSatisfaction],
      [ANALYSIS.topFactor, "Top factor", ANALYSIS.weakFactor],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "INTERPRETATION",
    title: "How The Results Can Be Explained",
    subtitle: "The system supports the discussion chapter by turning raw scores into interpretable statements.",
    cards: [
      ["Theory Link", "Higher ratings in reliability or security can be discussed through SERVQUAL and customer trust."],
      ["Expectation Link", "Lower ratings in digital convenience can be explained through unmet customer expectations."],
      ["Thesis Use", "These interpretations can be used directly in presentation or chapter discussion writing."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "RECOMMENDATIONS",
    title: "Practical Improvements Suggested By The Study",
    subtitle: "The findings can support realistic recommendations for banks.",
    cards: [
      ["Improve Speed", "Reduce waiting time and make service flow more efficient."],
      ["Strengthen Staff Support", "Train staff in communication, courtesy, and issue handling."],
      ["Upgrade Digital Experience", "Improve mobile and online banking for convenience, clarity, and trust."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "LIMITATIONS",
    title: "Current Limits Of The Prototype",
    subtitle: "The system is already strong for presentation, but some advanced features can still be added.",
    cards: [
      ["Current Scope", "The system uses sample data and a local SQLite database rather than a deployed online environment."],
      ["Feature Gap", "There is no full admin login or deep response management yet."],
      ["Analysis Scope", "The present version focuses more on descriptive analysis than advanced statistical modeling."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "FUTURE ENHANCEMENT",
    title: "Possible Improvements In The Next Version",
    subtitle: "The project can grow beyond the current presentation-ready prototype.",
    cards: [
      ["Admin Module", "Add login, response management, and bank-specific administration tools."],
      ["Advanced Analytics", "Add regression, reliability testing, and richer comparison views."],
      ["Deployment", "Publish the system online for wider respondent access and smoother demonstrations."],
    ],
  });

  slides.push({
    type: "cards",
    kicker: "FINAL SUMMARY",
    title: "Overall Message Of The System",
    subtitle: "The thesis is no longer only a written topic; it is now a working platform that demonstrates the entire research flow.",
    cards: [
      ["Research", "The system explains the study, theories, and methodology in a structured way."],
      ["Technology", "It collects data, stores responses, and generates live analysis outputs."],
      ["Presentation", "It gives the supervisor a visible, testable, and presentation-ready thesis artifact."],
    ],
  });

  slides.push({
    type: "closing",
    kicker: "THANK YOU",
    title: "Questions And Discussion",
    subtitle: "Thank you for reviewing the thesis system presentation.",
    emphasis: "This concludes the presentation of the web-based customer satisfaction analysis system for banking services.",
  });

  return slides;
}

const SLIDES = buildSlides();

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readImageBlob(imagePath) {
  const bytes = await fs.readFile(imagePath);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function normalizeImageConfig(config) {
  if (!config.path) return config;
  const { path: imagePath, ...rest } = config;
  return { ...rest, blob: await readImageBlob(imagePath) };
}

async function ensureDirs() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(SCRATCH_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
}

function lineConfig(fill = TRANSPARENT, width = 0) {
  return { style: "solid", fill, width };
}

function addShape(slide, geometry, x, y, w, h, fill = TRANSPARENT, line = TRANSPARENT, lineWidth = 0) {
  return slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: lineConfig(line, lineWidth),
  });
}

function normalizeText(text) {
  if (Array.isArray(text)) return text.join("\n");
  return String(text ?? "");
}

function wrapText(text, widthChars) {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > widthChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.join("\n");
}

function addText(
  slide,
  text,
  x,
  y,
  w,
  h,
  { size = 22, color = INK, bold = false, face = BODY_FACE, align = "left", valign = "top", fill = TRANSPARENT, line = TRANSPARENT, lineWidth = 0 } = {},
) {
  const box = addShape(slide, "rect", x, y, w, h, fill, line, lineWidth);
  box.text = normalizeText(text);
  box.text.fontSize = size;
  box.text.color = color;
  box.text.bold = bold;
  box.text.typeface = face;
  box.text.alignment = align;
  box.text.verticalAlignment = valign;
  box.text.insets = { left: 0, right: 0, top: 0, bottom: 0 };
  return box;
}

async function addImage(slide, config, x, y, w, h) {
  const image = slide.images.add(await normalizeImageConfig(config));
  image.position = { left: x, top: y, width: w, height: h };
  return image;
}

function paintBackground(slide) {
  slide.background.fill = PAPER;
  addShape(slide, "rect", 0, 0, W, H, PAPER, TRANSPARENT, 0);
  addShape(slide, "ellipse", -80, -40, 360, 240, "#E1F1EC", TRANSPARENT, 0);
  addShape(slide, "ellipse", 980, -30, 280, 220, "#F5E9CB", TRANSPARENT, 0);
  addShape(slide, "ellipse", 1040, 560, 260, 180, "#E7F0E3", TRANSPARENT, 0);
}

function addHeader(slide, slideNo, kicker) {
  addShape(slide, "roundRect", 56, 28, 1168, 44, WHITE, "#ECE2D2", 1);
  addShape(slide, "roundRect", 72, 42, 24, 18, GOLD, TRANSPARENT, 0);
  addText(slide, kicker.toUpperCase(), 108, 40, 560, 18, {
    size: 12,
    color: EMERALD_DARK,
    bold: true,
    face: MONO_FACE,
  });
  addText(slide, `${String(slideNo).padStart(2, "0")} / ${String(SLIDES.length).padStart(2, "0")}`, 1088, 40, 112, 18, {
    size: 12,
    color: EMERALD_DARK,
    bold: true,
    face: MONO_FACE,
    align: "right",
  });
}

function addTitleBlock(slide, title, subtitle, x = 64, y = 96, w = 760) {
  addText(slide, wrapText(title, 28), x, y, w, 120, {
    size: 34,
    color: INK,
    bold: true,
    face: TITLE_FACE,
  });
  if (subtitle) {
    addText(slide, wrapText(subtitle, 62), x, y + 108, Math.min(w, 680), 64, {
      size: 17,
      color: GRAPHITE,
      face: BODY_FACE,
    });
  }
}

function addPanel(slide, x, y, w, h, fill = WHITE, line = LINE, radius = "roundRect") {
  return addShape(slide, radius, x, y, w, h, fill, line, 1.1);
}

function addCard(slide, x, y, w, h, label, body, accent = EMERALD) {
  addPanel(slide, x, y, w, h, "#FFFCF7", LINE);
  addShape(slide, "rect", x, y, 8, h, accent, TRANSPARENT, 0);
  addText(slide, label.toUpperCase(), x + 22, y + 20, w - 44, 20, {
    size: 12,
    color: EMERALD_DARK,
    bold: true,
    face: MONO_FACE,
  });
  addText(slide, wrapText(body, Math.max(26, Math.floor(w / 11))), x + 22, y + 58, w - 44, h - 80, {
    size: 15,
    color: INK,
    face: BODY_FACE,
  });
}

function addMetricCard(slide, x, y, w, h, value, label, note, accent = EMERALD) {
  addPanel(slide, x, y, w, h, WHITE, LINE);
  addShape(slide, "rect", x, y, w, 8, accent, TRANSPARENT, 0);
  addText(slide, value, x + 22, y + 26, w - 44, 50, {
    size: 28,
    color: INK,
    bold: true,
    face: TITLE_FACE,
  });
  addText(slide, wrapText(label, 22), x + 22, y + 82, w - 44, 32, {
    size: 15,
    color: GRAPHITE,
    face: BODY_FACE,
  });
  addText(slide, wrapText(note, 26), x + 22, y + h - 44, w - 44, 24, {
    size: 10,
    color: MUTED,
    face: BODY_FACE,
  });
}

function addBulletList(slide, x, y, w, bullets, accent = GOLD) {
  bullets.forEach((bullet, index) => {
    const top = y + index * 78;
    addPanel(slide, x, top, w, 62, WHITE, LINE);
    addShape(slide, "ellipse", x + 16, top + 18, 24, 24, accent, TRANSPARENT, 0);
    addText(slide, String(index + 1), x + 23, top + 22, 12, 12, {
      size: 10,
      color: INK,
      bold: true,
      face: MONO_FACE,
      align: "center",
    });
    addText(slide, wrapText(bullet, 34), x + 54, top + 16, w - 72, 36, {
      size: 14,
      color: INK,
      face: BODY_FACE,
    });
  });
}

async function renderCover(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addShape(slide, "roundRect", 64, 104, 500, 520, "#FFF9EF", LINE, 1.2);
  addShape(slide, "rect", 64, 104, 10, 520, EMERALD, TRANSPARENT, 0);
  addText(slide, wrapText(data.title, 16), 96, 144, 418, 280, {
    size: 34,
    color: INK,
    bold: true,
    face: TITLE_FACE,
  });
  addText(slide, wrapText(data.subtitle, 44), 98, 444, 394, 90, {
    size: 17,
    color: GRAPHITE,
    face: BODY_FACE,
  });
  addPanel(slide, 98, 548, 392, 56, WHITE, "#E5D39C");
  addText(slide, wrapText(data.emphasis, 44), 118, 564, 352, 28, {
    size: 12,
    color: EMERALD_DARK,
    bold: true,
    face: BODY_FACE,
  });
  addPanel(slide, 596, 104, 620, 520, WHITE, LINE);
  if (data.screenshot && (await pathExists(data.screenshot))) {
    await addImage(slide, { path: data.screenshot, fit: "contain", alt: "Homepage screenshot" }, 620, 128, 572, 472);
  }
}

function renderSection(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addShape(slide, "roundRect", 110, 150, 1060, 390, "#103F36", TRANSPARENT, 0);
  addShape(slide, "rect", 110, 150, 16, 390, GOLD, TRANSPARENT, 0);
  addText(slide, data.kicker, 154, 206, 320, 24, {
    size: 14,
    color: "#E4D9B4",
    bold: true,
    face: MONO_FACE,
  });
  addText(slide, wrapText(data.title, 18), 154, 246, 700, 150, {
    size: 42,
    color: WHITE,
    bold: true,
    face: TITLE_FACE,
  });
  addText(slide, wrapText(data.subtitle, 60), 156, 430, 620, 62, {
    size: 18,
    color: "#E9F0ED",
    face: BODY_FACE,
  });
}

function renderCards(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addTitleBlock(slide, data.title, data.subtitle);
  const cards = data.cards || [];
  const cols = Math.min(3, cards.length);
  const gap = 24;
  const totalW = 1152 - gap * (cols - 1);
  const cardW = totalW / cols;
  for (let i = 0; i < cols; i += 1) {
    const [label, body] = cards[i];
    addCard(slide, 64 + i * (cardW + gap), 388, cardW, 224, label, body, [EMERALD, GOLD, CORAL][i % 3]);
  }
}

function renderMetrics(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addTitleBlock(slide, data.title, data.subtitle);
  const metrics = data.metrics || [];
  const gap = 24;
  const cardW = (1152 - gap * 2) / 3;
  for (let i = 0; i < Math.min(3, metrics.length); i += 1) {
    const [value, label, note] = metrics[i];
    addMetricCard(slide, 64 + i * (cardW + gap), 402, cardW, 190, value, label, note, [EMERALD, GOLD, CORAL][i % 3]);
  }
}

async function renderScreenshot(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addTitleBlock(slide, data.title, data.subtitle, 64, 96, 680);
  addPanel(slide, 64, 214, 760, 434, WHITE, LINE);
  addShape(slide, "rect", 64, 214, 760, 10, EMERALD, TRANSPARENT, 0);
  if (data.screenshot && (await pathExists(data.screenshot))) {
    await addImage(slide, { path: data.screenshot, fit: "contain", alt: data.title }, 86, 238, 716, 388);
  }
  addPanel(slide, 852, 214, 364, 434, "#FFFDF8", LINE);
  addText(slide, "Key Points", 882, 246, 160, 22, {
    size: 13,
    color: EMERALD_DARK,
    bold: true,
    face: MONO_FACE,
  });
  addBulletList(slide, 882, 286, 304, data.bullets || []);
}

function renderClosing(slide, slideNo, data) {
  paintBackground(slide);
  addHeader(slide, slideNo, data.kicker);
  addShape(slide, "roundRect", 156, 126, 968, 470, "#103F36", TRANSPARENT, 0);
  addShape(slide, "ellipse", 862, 148, 170, 170, "#1A6454", TRANSPARENT, 0);
  addShape(slide, "ellipse", 914, 216, 70, 70, GOLD, TRANSPARENT, 0);
  addText(slide, wrapText(data.title, 20), 220, 210, 480, 84, {
    size: 42,
    color: WHITE,
    bold: true,
    face: TITLE_FACE,
  });
  addText(slide, wrapText(data.subtitle, 44), 222, 332, 470, 60, {
    size: 19,
    color: "#EAF2EE",
    face: BODY_FACE,
  });
  addPanel(slide, 222, 432, 612, 78, "#FFF9EF", "#D9CFAF");
  addText(slide, wrapText(data.emphasis, 58), 250, 454, 562, 38, {
    size: 14,
    color: EMERALD_DARK,
    bold: true,
    face: BODY_FACE,
  });
}

async function renderSlide(presentation, slideNo, data) {
  const slide = presentation.slides.add();
  if (data.type === "cover") return renderCover(slide, slideNo, data);
  if (data.type === "section") return renderSection(slide, slideNo, data);
  if (data.type === "metrics") return renderMetrics(slide, slideNo, data);
  if (data.type === "screenshot") return renderScreenshot(slide, slideNo, data);
  if (data.type === "closing") return renderClosing(slide, slideNo, data);
  return renderCards(slide, slideNo, data);
}

async function createDeck() {
  await ensureDirs();
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  for (let i = 0; i < SLIDES.length; i += 1) {
    await renderSlide(presentation, i + 1, SLIDES[i]);
  }
  return presentation;
}

async function saveBlobToFile(blob, filePath) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

async function exportDeck(presentation) {
  for (let idx = 0; idx < presentation.slides.items.length; idx += 1) {
    const slide = presentation.slides.items[idx];
    const preview = await presentation.export({ slide, format: "png", scale: 1 });
    const previewPath = path.join(PREVIEW_DIR, `slide-${String(idx + 1).padStart(2, "0")}.png`);
    await saveBlobToFile(preview, previewPath);
  }
  const pptxBlob = await PresentationFile.exportPptx(presentation);
  const pptxPath = path.join(OUT_DIR, "output.pptx");
  await pptxBlob.save(pptxPath);
  return pptxPath;
}

const presentation = await createDeck();
const pptxPath = await exportDeck(presentation);
console.log(pptxPath);
