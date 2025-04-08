
import { Survey } from "../types/survey";

export const mockSurveys: Survey[] = [
  {
    id: "survey-1",
    title: "Hospital Services Evaluation",
    description: "Evaluate the quality of services at our hospital offices",
    questions: [
      {
        id: "q1",
        text: "How would you rate the overall service quality?",
        type: "rating",
        required: true
      },
      {
        id: "q2",
        text: "What aspects of our services need improvement?",
        type: "multiple-choice",
        options: ["Wait times", "Staff attitude", "Facility cleanliness", "Service effectiveness", "Other"],
        required: true
      },
      {
        id: "q3",
        text: "Please share any additional feedback",
        type: "text",
        required: false
      }
    ],
    createdAt: "2025-03-15",
    status: "active",
    responseCount: 42
  },
  {
    id: "survey-2",
    title: "Headquarters Visit Experience",
    description: "Help us improve your visit experience to our main headquarters",
    questions: [
      {
        id: "q1",
        text: "Was it easy to find our headquarters?",
        type: "multiple-choice",
        options: ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"],
        required: true
      },
      {
        id: "q2",
        text: "How would you rate the reception staff?",
        type: "rating",
        required: true
      },
      {
        id: "q3",
        text: "What is one thing we could improve about our headquarters?",
        type: "text",
        required: false
      }
    ],
    createdAt: "2025-03-20",
    status: "active",
    responseCount: 27
  },
  {
    id: "survey-3",
    title: "Online Services Feedback",
    description: "Your thoughts on our digital services and online platform",
    questions: [
      {
        id: "q1",
        text: "How easy is it to navigate our online platform?",
        type: "rating",
        required: true
      },
      {
        id: "q2",
        text: "Which online services do you use most frequently?",
        type: "multiple-choice",
        options: ["Information lookup", "Online appointments", "Document submission", "Status checking", "Other"],
        required: true
      },
      {
        id: "q3",
        text: "What additional online services would you like to see?",
        type: "text",
        required: false
      }
    ],
    createdAt: "2025-04-01",
    status: "inactive",
    responseCount: 12
  }
];
