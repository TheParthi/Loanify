'use client'

import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

interface EligibilityResultProps {
  result: {
    eligibilityPercentage: number;
    reasons: string[];
  };
}

export function EligibilityResult({ result }: EligibilityResultProps) {
  const [strokeDashoffset, setStrokeDashoffset] = useState(283);

  useEffect(() => {
    // Circumference = 2 * PI * r = 2 * 3.14159 * 45 = 282.74
    const circumference = 283;
    const offset = circumference - (result.eligibilityPercentage / 100) * circumference;
    setStrokeDashoffset(offset);
  }, [result.eligibilityPercentage]);
  
  const scoreColor = result.eligibilityPercentage >= 75 ? 'text-green-500' : result.eligibilityPercentage >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-gray-200 dark:text-gray-700"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
          ></circle>
          <circle
            className={`stroke-current ${scoreColor} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          ></circle>
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${scoreColor}`}>
          {result.eligibilityPercentage}%
        </div>
      </div>
      <p className="text-lg font-medium text-center">Your Eligibility Score</p>
      
      <div className="w-full rounded-lg bg-primary/5 p-4">
        <h4 className="font-semibold mb-2 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/> AI Insights</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {result.reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
