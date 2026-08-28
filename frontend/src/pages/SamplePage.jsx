import React ,{useState} from 'react';
import QuestionCard from '../components/QuestionCard';
 
import { Link } from 'react-router';
import { Brain, Code, FileCode, Projector } from 'lucide-react';
 
const parsedData= {
  technical: [
    {
      questionText: "Can you explain the difference between 'let', 'const', and 'var' in the context of scoping and hoisting?",
      relatedTo: 'JavaScript'
    },
    {
      questionText: 'How does the React Virtual DOM improve performance compared to direct DOM manipulation?',
      relatedTo: 'React.js'
    },
    {
      questionText: 'Describe the Node.js Event Loop and how it handles asynchronous operations.',
      relatedTo: 'Node.js'
    },
    {
      questionText: 'What is the purpose of middleware in Express.js, and how do you implement a custom one?',
      relatedTo: 'Express.js'
    },
    {
      questionText: 'In MongoDB, what is the difference between an embedded document and a reference?',
      relatedTo: 'MongoDB'
    },
    {
      questionText: 'How do you define a schema in Mongoose, and what is the difference between a Schema and a Model?',
      relatedTo: 'Mongoose'
    },
    {
      questionText: 'Explain the three parts of a JSON Web Token (JWT) and how they ensure security.',
      relatedTo: 'JWT Authentication'
    },
    {
      questionText: "What is the difference between 'git merge' and 'git rebase'?",
      relatedTo: 'Git & GitHub'
    },
    {
      questionText: "How does Tailwind CSS's utility-first approach differ from traditional CSS frameworks like Bootstrap?",
      relatedTo: 'Tailwind CSS'
    },
    {
      questionText: 'Explain the concept of closures in JavaScript and provide a practical use case.',
      relatedTo: 'JavaScript'
    },
    {
      questionText: "What is the significance of the dependency array in the React 'useEffect' hook?",
      relatedTo: 'React.js'
    },
    {
      questionText: 'How do you handle error management in an Express.js application to prevent the server from crashing?',
      relatedTo: 'Express.js'
    },
    {
      questionText: "What are the advantages of using Mongoose middleware (hooks) like 'pre' and 'post' save?",
      relatedTo: 'Mongoose'
    },
    {
      questionText: "Can you explain the 'this' keyword in JavaScript and how its value is determined in different contexts?",
      relatedTo: 'JavaScript'
    },
    {
      questionText: 'What is the difference between a PUT and a PATCH request in a RESTful API?',
      relatedTo: 'REST APIs'
    },
    {
      questionText: 'How do you optimize MongoDB queries using indexing?',
      relatedTo: 'MongoDB'
    },
    {
      questionText: "Explain the concept of 'lifting state up' in React.",
      relatedTo: 'React.js'
    },
    {
      questionText: 'What is a Promise in JavaScript, and how does it differ from a callback?',
      relatedTo: 'JavaScript'
    },
    {
      questionText: 'How do you implement protected routes in a React application using JWT?',
      relatedTo: 'React.js'
    },
    {
      questionText: 'What are semantic HTML5 tags, and why are they important for SEO and accessibility?',
      relatedTo: 'HTML5'
    },
    {
      questionText: 'How do you handle file uploads in a Node.js and Express backend?',
      relatedTo: 'Node.js'
    },
    {
      questionText: "Explain the Box Model in CSS3 and how 'box-sizing: border-box' affects it.",
      relatedTo: 'CSS3'
    },
    {
      questionText: "What is the purpose of the 'alt' attribute in images, and when should it be left empty?",
      relatedTo: 'HTML5'
    },
    {
      questionText: 'How do you use Git stashing to save temporary changes without committing them?',
      relatedTo: 'Git & GitHub'
    },
    {
      questionText: "What is the difference between '==' and '===' in JavaScript?",
      relatedTo: 'JavaScript'
    }
  ],
  projectBased: [
    {
      questionText: 'In your E-Commerce Application, how did you manage the state of the shopping cart across different components?',
      relatedTo: 'E-Commerce Application'
    },
    {
      questionText: 'Why did you choose MongoDB as the database for your Task Management API instead of a relational database like PostgreSQL?',
      relatedTo: 'Task Management API'
    },
    {
      questionText: 'How did you handle user password storage in your E-Commerce Application to ensure security?',
      relatedTo: 'E-Commerce Application'
    },
    {
      questionText: 'What was the most challenging bug you encountered while building the Task Management API, and how did you resolve it?',
      relatedTo: 'Task Management API'
    },
    {
      questionText: 'In your Portfolio Website, how did you ensure the design was fully responsive across mobile and desktop using Tailwind?',
      relatedTo: 'Portfolio Website'
    },
    {
      questionText: 'How did you structure your Mongoose schemas to handle the relationship between Users and Orders in the E-Commerce app?',
      relatedTo: 'E-Commerce Application'
    },
    {
      questionText: 'In the Task Management API, how did you validate the incoming request body for CRUD operations?',
      relatedTo: 'Task Management API'
    },
    {
      questionText: 'What strategy did you use for token persistence on the client side in your E-Commerce project?',
      relatedTo: 'E-Commerce Application'
    },
    {
      questionText: "If you had to add a 'search' feature to your E-Commerce Application, how would you implement it on the backend?",
      relatedTo: 'E-Commerce Application'
    },
    {
      questionText: 'Why did you decide to use Express.js for the Task Management API rather than plain Node.js?',
      relatedTo: 'Task Management API'
    }
  ],
  behavioral: [
    {
      questionText: 'During your internship at TechSoft Solutions, can you describe a specific bug you fixed and the steps you took to identify it?',
      relatedTo: 'Junior Web Developer Intern'
    },
    {
      questionText: 'Tell me about a time you had to learn a new technology quickly to meet a project deadline.',
      relatedTo: 'Fast learner'
    },
    {
      questionText: 'How did you use GitHub to collaborate with other team members at TechSoft Solutions?',
      relatedTo: 'Junior Web Developer Intern'
    },
    {
      questionText: 'Describe a situation where you had a disagreement with a team member on a technical decision; how did you resolve it?',
      relatedTo: 'Teamwork'
    },
    {
      questionText: 'How do you prioritize your tasks when you are working on multiple features for a project like the E-Commerce app?',
      relatedTo: 'Problem solving'
    }
  ],
  fieldBasics: [
    {
      questionText: 'What are the four basic principles of Object-Oriented Programming (OOP)?',
      relatedTo: 'BS Computer Science'
    },
    {
      questionText: 'Can you explain the difference between client-side rendering and server-side rendering?',
      relatedTo: 'Full Stack Development'
    },
    {
      questionText: 'What does the acronym ACID stand for in the context of database transactions?',
      relatedTo: 'Databases'
    },
    {
      questionText: 'What is the purpose of a DNS (Domain Name System)?',
      relatedTo: 'Web Development'
    },
    {
      questionText: 'Explain the difference between LocalStorage, SessionStorage, and Cookies.',
      relatedTo: 'Web Development'
    },
    {
      questionText: 'What is a Cross-Site Scripting (XSS) attack, and how can you prevent it?',
      relatedTo: 'Web Security'
    },
    {
      questionText: 'What are HTTP status codes in the 400 and 500 ranges generally used for?',
      relatedTo: 'REST APIs'
    },
    {
      questionText: 'Explain the concept of inheritance in OOP and how it promotes code reuse.',
      relatedTo: 'BS Computer Science'
    },
    {
      questionText: 'What is a deadlock in the context of operating systems or databases?',
      relatedTo: 'BS Computer Science'
    },
    {
      questionText: 'What is the difference between a stateless and a stateful protocol?',
      relatedTo: 'REST APIs'
    }
  ]
}

const CATEGORY_CONFIG = [
  { id: 'technical', label: 'Technical Expertise', icon: <Code/> },
  { id: 'behavioral', label: 'Behavioral & Soft Skills', icon: <Brain/> },
  { id: 'projectBased', label: 'Past Experience', icon: <Projector/> },
  { id: 'fieldBasics', label: 'Role-Specific Scenarios', icon: <FileCode/> },
];
  
const SamplePage = () => { 
  const technicalQuestions = parsedData.technical;

  // State for Sidebar and List
  const [activeCategory, setActiveCategory] = useState('technical');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const currentQuestions = parsedData[activeCategory] || [];
  const activeConfig = CATEGORY_CONFIG.find(c => c.id === activeCategory);

  // Handle changing categories
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setExpandedIndex(null); // Close any open question when switching tabs
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans flex justify-center">
      
       <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px]">
        
        {/*SideBar */}
        <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
          
          {/* 1. Profile / Export Card */}
          <div className="bg-surface rounded-2xl shadow-card p-6 border border-border">
            <Link to="/cv" className="text-sm text-muted-foreground flex items-center gap-2 mb-6 hover:text-foreground transition-colors">
              <span>←</span> Back to Cv's
            </Link>
            <h2 className="text-2xl font-bold text-foreground mb-1">Senior Frontend Developer</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
              📄 john_doe_cv_2024.pdf
            </p>
            <button className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-md mb-3 hover:bg-primary-hover transition-colors flex justify-center items-center gap-2">
              <span>📄</span> Export to PDF
            </button>
            <button className="w-full bg-accent text-accent-foreground font-semibold py-2.5 rounded-md hover:bg-accent/80 transition-colors flex justify-center items-center gap-2">
              <span>🔗</span> Share Questions
            </button>
          </div>

          {/* 2. Categories Card */}
         <div className="bg-surface rounded-2xl shadow-card p-6 border border-border">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-1">
              {CATEGORY_CONFIG.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = parsedData[cat.id]?.length || 0;
                
                return (
                  <li 
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-accent/30 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-accent/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-primary font-bold' : ''}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span className={`text-xs py-0.5 px-2 rounded-full shadow-sm ${
                      isActive ? 'bg-background text-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Copilot Insight Card */}
          <div className="bg-primary rounded-2xl shadow-card p-6 border border-border relative overflow-hidden text-primary-foreground">
            {/* Subtle background circle effect from your design */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-sm font-bold mb-2">Copilot Insight</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Based on your CV, focus heavily on your experience with state management (Redux/Zustand) during the Technical section, as it's a key requirement for this role.
            </p>
          </div>

        </aside>

         {/* MAIN   AREA       */}
         <main className="flex-1 max-w-[850px]">
          
          {/* Header Area with Progress Bar */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Interview Preparation</h1>
              <p className="text-muted-foreground">50 targeted questions generated for your profile.</p>
            </div>
            
            {/* Progress Bar (Visual Only for now) */}
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground mb-2">Preparation Progress</p>
              <div className="flex gap-1">
                <div className="h-1.5 w-8 bg-success rounded-full"></div>
                <div className="h-1.5 w-8 bg-accent rounded-full"></div>
                <div className="h-1.5 w-8 bg-accent rounded-full"></div>
                <div className="h-1.5 w-8 bg-accent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Section Title */}
        <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-surface border border-border rounded-lg shadow-sm">
              <span className="text-primary font-bold text-xl">{activeConfig?.icon}</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">{activeConfig?.label}</h2>
            <span className="bg-surface border border-border text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {currentQuestions.length} Questions
            </span>
          </div>

          {/* Questions List */}
         <div className="space-y-3">
            {currentQuestions.map((q, index) => (
              <QuestionCard 
                key={index} 
                index={index} 
                questionText={q.questionText} 
                relatedTo={q.relatedTo} 
                isExpanded={expandedIndex === index}
                onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default SamplePage;