import React, { ReactNode } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FeatureItem = ({ title, content }: { title: string; content: ReactNode }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-8 text-2xl font-semibold text-foreground">{title}</h2>
      <div className="text-foreground">{content}</div>
    </div>
  );
};

export const LogSection = ({ children }: { children: ReactNode }) => {
  return <Accordion type="multiple">{children}</Accordion>;
};

export const Logs = ({ type, data }: { type: 'Improvements' | 'Fixes' | 'API'; data: ReactNode[] }) => {
  return (
    <Accordion type="multiple">
      <AccordionItem className="text-foreground" value="item-1">
        <AccordionTrigger>{type}</AccordionTrigger>
        <AccordionContent>
          <ul className="text-neutral-300">
            {data.map((item, index) => {
              return (
                <li key={index} className="my-2">
                  - {item}
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
