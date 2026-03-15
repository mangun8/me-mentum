import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// --- Card Component ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pb-2 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`font-bold text-lg text-dark ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-secondary mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-2 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 flex items-center ${className}`}>{children}</div>
);

// --- Badge Component ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-primary text-white border-transparent hover:bg-primary/80',
    secondary: 'bg-gray-100 text-dark border-transparent hover:bg-gray-200',
    outline: 'text-dark border-gray-200 hover:bg-gray-100',
    accent: 'bg-blue-50 text-primary border-blue-100'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Accordion Component ---
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-primary w-full text-left"
        onClick={onClick}
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200" /> : <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
      </button>
      <div
        className={`overflow-hidden text-sm transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Separator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-[1px] w-full bg-gray-200 my-4 ${className}`} />
);
