export interface IndiaAIModuleQuestion {
  Question: string;
  Options: string[];
  "Correct Option": string;
}

export type IndiaAIModuleId = 1 | 2 | 3 | 4 | 5 | 6;

// Structure for module quizzes: can have mid-module quiz (after specific video) and end-of-module quiz
export interface IndiaAIModuleQuizzes {
  midModule?: {
    afterVideo: string; // e.g., "module1B", "module2C"
    questions: IndiaAIModuleQuestion[];
  };
  endModule: IndiaAIModuleQuestion[];
}

export type IndiaAIModuleQuestionMap = Record<`Module - ${IndiaAIModuleId}`, IndiaAIModuleQuizzes>;

export const INDIA_AI_MCQS: IndiaAIModuleQuestionMap = {
  "Module - 1": {
    midModule: {
      afterVideo: "module1B",
      questions: [
    {
      Question: "How does human intelligence work?",
      Options: [
        "By reading instruction manuals and following them word-by-word",
        "By learning from experience, making mistakes, and gradually improving",
        "By watching others and copying their actions",
        "None of these"
      ],
      "Correct Option": "By learning from experience, making mistakes, and gradually improving"
    },
    {
      Question: "In the example of Arun the auto-rickshaw driver, how many times did he interact with AI in the entire day?",
      Options: [
        "Just once when he used Google Maps",
        "Three times - Maps, UPI payment, and Google Lens translation",
        "Many times throughout his day",
        "He didn't use AI at all"
      ],
      "Correct Option": "Many times throughout his day"
    }
      ]
    },
    endModule: [
    {
      Question: "What does 'intelligence becoming free' mean in today's world?",
      Options: [
        "AI tools are available without any cost",
        "Only rich people can access intelligent solutions",
        "Intelligence is now becoming accessible to everyone",
        "Computers are being given away for free"
      ],
      "Correct Option": "Intelligence is now becoming accessible to everyone"
    },
    {
      Question: "How did AI become so powerful in the last few years?",
      Options: [
        "Availability of huge amounts of data",
        "Increase in computing power",
        "Better machine learning algorithms",
        "All of these"
      ],
      "Correct Option": "All of these"
    },
    {
      Question: "What is the main difference between rule-based AI systems (1950s-2000s) and modern pattern-learning AI?",
      Options: [
        "Rule-based systems tried to write rules for everything, while pattern-learning AI learns from examples",
        "Rule-based systems were faster and more accurate",
        "Pattern-learning AI only works in English",
        "Rule-based systems were cheaper to build"
      ],
      "Correct Option": "Rule-based systems tried to write rules for everything, while pattern-learning AI learns from examples"
    },
    {
      Question: "What are AI's main strengths compared to humans?",
      Options: [
        "Creativity and emotional understanding",
        "Speed, scale, pattern recognition, and stamina",
        "Making ethical decisions and showing empathy",
        "Understanding context and cultural differences"
      ],
      "Correct Option": "Speed, scale, pattern recognition, and stamina"
    }
    ]
  },
  "Module - 2": {
    midModule: {
      afterVideo: "module2C",
      questions: [
    {
      Question: "In the cooking analogy, what is the main difference between Ravi (with the Magic Food Box) and Priya (the skilled cook)?",
      Options: [
        "Ravi's food tastes better than Priya's",
        "Ravi works faster than Priya",
        "Priya can fix problems because she understands how everthing works",
        " Priya uses more expensive ingredients"
      ],
      "Correct Option": "Priya can fix problems because she understands how everythinks works"
    },
    {
      Question: "What are the four steps in the AI learning journey?",
      Options: [
        "Design, Code, Test, Deploy",
        "Input, Processing, Output, Feedback",
        "Planning, Learning, Testing, Implementation",
        "Data, Training, Model, Inference"
      ],
      "Correct Option": "Data, Training, Module, Inference"
    }
      ]
    },
    endModule: [
    {
      Question: "What does 'Garbage in, garbage out' mean when it comes to AI?",
      Options: [
        "AI systems create too much electronic waste",
        "If you give an AI messy data, it can clean it up automatically",
        "If you give AI poor quality data, you'll get poor quality results",
        "AI systems need regular maintenance to function properly"
      ],
      "Correct Option": "If you give AI poor quality data, you'll get poor quality results"
    },
    {
      Question: "What is a 'token' in AI language processing?",
      Options: [
        "A reward given to AI for correct answers",
        "The blocks of language that AI uses to understand text",
        "A password needed to access AI systems",
        "A type of computer memory used by AI"
      ],
      "Correct Option": "The blocks of language that AI uses to understand text"
    },
    {
      Question: "What is the name of the breakthrough technology that powers modern AI?",
      Options: ["Transformer", "Saboteur", "Gearbox", "Astronomer"],
      "Correct Option": "Transformer"
    },
    {
      Question: "The ability to feed AI the correct information, in the right way, is called ______________.",
      Options: [
        "Creative Engineering",
        "Retrospective Engineering",
        "Context Engineering",
        "Prompt Engineering"
      ],
      "Correct Option": "Prompt Engineering"
    }
    ]
  },
  "Module - 3": {
    midModule: {
      afterVideo: "module3B",
      questions: [
    {
      Question:
        "Priya is a Class 12 student in Jaipur preparing for her chemistry exam. She finds organic chemistry reactions confusing. Using the CRAFT method, which of these would be the best prompt for her to use?",
      Options: [
        "Explain organic chemistry reactions.",
        "As a Class 12 chemistry teacher, help me understand the SN1 and SN2 reactions in chemistry.",
        "Act as a chemistry teacher. I'm a Class 12 student in Jaipur struggling with organic chemistry. Explain the SN1 and SN2 reactions in simple terms with everyday examples. Present it as 3 bullet points under 100 words.",
        "What are SN1 and SN2 chemical reactions and how do they work?"
      ],
      "Correct Option":
        "Act as a chemistry teacher. I'm a Class 12 student in Jaipur struggling with organic chemistry. Explain the SN1 and SN2 reactions in simple terms with everyday examples. Present it as 3 bullet points under 100 words."
    },
    {
      Question:
        "According to the course, what is the main advantage of using Perplexity AI over other AI tools?",
      Options: [
        "It's completely free to use",
        "It provides sources and links to verify information in real-time",
        "It works faster than other AI tools",
        "It also works in Indian languages"
      ],
      "Correct Option": "It provides sources and links to verify information in real-time"
    }
      ]
    },
    endModule: [
    {
      Question:
        "Vikram runs a mobile repair shop in Indore and wants to create an Instagram post about his new screen replacement service. Based on the CRAFT framework, which element is he missing in this prompt: 'Create an Instagram post about mobile screen replacement'?",
      Options: ["Context and Role", "Action and Format", "Tweaks", "All CRAFT elements except Action"],
      "Correct Option": "All CRAFT elements except Action"
    },
    {
      Question:
        "Meera collected customer feedback for her beauty salon in Kochi and wants AI to analyze it. She wrote: 'I run a beauty salon in Kochi. Act as a customer service expert. Analyze my customer reviews to find top 3 complaints and top 3 compliments. Give me two lists with examples.' What CRAFT element could make this prompt even better?",
      Options: [
        "Adding Tweaks like 'focus on issues I can fix quickly' and 'prioritize by frequency'",
        "Changing the Role to something differen",
        "Making the Action less specific",
        "Removing the Context about location"
      ],
      "Correct Option": "Adding Tweaks like 'focus on issues I can fix quickly' and 'prioritize by frequency'"
    },
    {
      Question:
        "In Karthik's resume example, what was the key lesson about using AI for content creation?",
      Options: [
        "AI can replace all human creativity",
        "You should copy AI output exactly without changes",
        "AI helps you present your existing skills professionally, but you need to add personal touches",
        "Only technical people can benefit from AI-generated content"
      ],
      "Correct Option":
        "AI helps you present your existing skills professionally, but you need to add personal touches"
    },
    {
      Question:
        "When using AI to analyze data (like Sanjay's resort reviews), what is the most important step after getting AI results?",
      Options: [
        "Immediately implement all AI suggestions",
        "Share the results with customers",
        "Verify the insights by checking actual data and getting human feedback",
        "Ask the AI to analyze the data again"
      ],
      "Correct Option": "Verify the insights by checking actual data and getting human feedback"
    }
    ]
  },
  "Module - 4": {
    midModule: {
      afterVideo: "module4A",
      questions: [
    {
      Question:
        "Rajesh wants to start a small catering business in Nagpur specializing in Maharashtrian food for office parties. Using CRAFT, which prompt would help him brainstorm the best initial ideas?",
      Options: [
        "I want to start a catering business in Nagpur for Maharashtrian food. Act as a business consultant. Suggest 5 low-investment ideas for office catering. Present as a table with columns: Idea Name, Target Customers, First Step. Focus on ideas requiring less than ₹50,000 initial investment.",
        "Give me business ideas for food",
        "How do I start a food business?",
        "I want to start a catering business in Nagpur for Maharashtrian food. What food should I sell that the people in Nagpur like? Give me cheap ideas that I can easily implement"
      ],
      "Correct Option":
        "I want to start a catering business in Nagpur for Maharashtrian food. Act as a business consultant. Suggest 5 low-investment ideas for office catering. Present as a table with columns: Idea Name, Target Customers, First Step. Focus on ideas requiring less than ₹50,000 initial investment."
    },
    {
      Question:
        "In Parth's plastic waste project example, why does the course emphasize that AI provides 'starting points' and not 'final solutions'?",
      Options: [
        "Because AI doesn't understand local context, community behavior, and real-world feasibility",
        "Because AI is not smart enough to solve real problems",
        "Because AI only works for technical projects",
        "Because students shouldn't rely on any external help"
      ],
      "Correct Option":
        "Because AI doesn't understand local context, community behavior, and real-world feasibility"
    }
      ]
    },
    endModule: [
    {
      Question:
        "Which AI Model should you use to keep in touch with the latest research in your industry?",
      Options: ["Chat GPT", "Google Gemini", "Perplexity", "Claude"],
      "Correct Option": "Perplexity"
    },
    {
      Question:
        "Deepika is a freelance graphic designer in Kolkata who wants to create a pricing strategy for her design packages. She's confused about whether to charge per hour or per project. What should be her primary approach when using AI for this decision?",
      Options: [
        "Ask AI to set final prices for her services",
        "Copy what other graphic designers are charging",
        "Copy whatever pricing strategy AI suggests",
        "Use AI to research market rates, then apply her local knowledge and business goals to make the decision"
      ],
      "Correct Option":
        "Use AI to research market rates, then apply her local knowledge and business goals to make the decision"
    },
    {
      Question: "What is the most important thing to remember when using AI as a thinking partner?",
      Options: [
        "Choose the right AI Model",
        "Implement what the AI is saying immediately",
        "AI can’t think, only humans can!",
        "Verify the information that the AI has given"
      ],
      "Correct Option": "Verify the information that the AI has given"
    },
    {
      Question:
        "Ravi owns a small electronics store in Coimbatore and notices his sales dropping during certain months. He has 2 years of monthly sales data. What would be the BEST way to use AI for this business challenge?",
      Options: [
        "Ask AI to predict exactly what will happen to his business next year",
        "Upload his data and ask AI to identify patterns, then verify findings with local market knowledge and customer feedback",
        "Ask AI to compare his store with big electronic chains",
        "Use AI to create advertisements without analyzing the sales data"
      ],
      "Correct Option":
        "Upload his data and ask AI to identify patterns, then verify findings with local market knowledge and customer feedback"
    }
    ]
  },
  "Module - 5": {
    midModule: {
      afterVideo: "module5B",
      questions: [
    {
      Question: "What are the FAST principles of AI Ethics?",
      Options: [
        "Fast, Accurate, Simple, Trustworthy",
        "Fair, Automated, Secure, Technical",
        "Functional, Advanced, Smart, Technological",
        "Fairness, Accountability, Safety, Transparency"
      ],
      "Correct Option": "Fairness, Accountability, Safety, Transparency"
    },
    {
      Question: " What does Fairness mean when it comes to AI Ethics?",
      Options: [
        "AI should treat similar people in similar ways",
        "People should treat similar AI Models in similar ways",
        "People should know who to blame when AI makes a mistake",
        "None of the above"
      ],
      "Correct Option": "AI should treat similar people in similar ways"
    }
      ]
    },
    endModule: [
    {
      Question: "What is sampling bias in AI?",
      Options: [
        "When AI works too slowly",
        "When training data doesn't represent everyone equally",
        "When AI systems are too expensive",
        "When AI gives the same answer repeatedly"
      ],
      "Correct Option": "When training data doesn't represent everyone equally"
    },
    {
      Question: "According to the course, what details should you NEVER share with AI?",
      Options: [
        "Your favorite movies and books",
        "Questions about homework and assignments",
        "Aadhaar details, bank information, and OTPs",
        "Your city name and preferred language"
      ],
      "Correct Option": "Aadhaar details, bank information, and OTPs"
    },
    {
      Question: "What should you do to make your AI usage more environmentally friendly?",
      Options: [
        "Always say 'please' and 'thank you' to AI",
        "Use AI for generating memes and funny images",
        "Avoid unnecessary prompts and use Google search for simple questions",
        "Only use AI during daytime hours"
      ],
      "Correct Option": "Avoid unnecessary prompts and use Google search for simple questions"
    },
    {
      Question: "What makes AI untrustworthy?",
      Options: [
        "AI can give outdated information",
        "AI can give false information",
        "AI presents wrong information confidently",
        "All of the above"
      ],
      "Correct Option": "All of the above"
    }
    ]
  },
  "Module - 6": {
    endModule: [
    {
      Question: "What is the difference between AI tools and AI agents?",
      Options: [
        "AI tools tell you what to do, while AI agents actually do things for you",
        "AI tools are free while AI agents cost money",
        "AI tools work faster than AI agents",
        "All of the above"
      ],
      "Correct Option": "All of the above"
    },
    {
      Question: "What does 'English and Hindi is the new coding' mean?",
      Options: [
        "All computers will only work in English and Hindi",
        "Programming languages are becoming easier to learn",
        "People can now get output from AI by describing what they want in plain language",
        "None of the above"
      ],
      "Correct Option": "People can now get output from AI by describing what they want in plain language"
    },
    {
      Question:
        "What does NVIDIA CEO Jensen Huang mean when he says 'IT will become the HR of AI Agents'?",
      Options: [
        "Workplaces will have AI agents as team members alongside humans",
        "HR will no longer be needed in companies",
        "Only IT professionals can work with AI",
        "IT departments will be replaced by HR departments"
      ],
      "Correct Option": "Workplaces will have AI agents as team members alongside humans"
    },
    {
      Question:
        "Just as reading and writing became essential skills in previous centuries, ____________________ is becoming essential for success in the 21st century.",
      Options: [
        "Computer programming",
        "Learning an artform",
        "Using AI to replace humans",
        "Understanding and working with AI"
      ],
      "Correct Option": "Understanding and working with AI"
    }
    ]
  }
};
