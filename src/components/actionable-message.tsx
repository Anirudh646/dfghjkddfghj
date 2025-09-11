'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import type { Message } from './chat-message';
import { Button } from './ui/button';

interface ActionableMessageProps {
  message: Message;
  courses: string[];
  action: (course: string) => void;
}

export function ActionableMessage({ message, courses, action }: ActionableMessageProps) {
  return (
    <div className={cn('flex items-start gap-4 justify-start')}>
      <Avatar className="h-9 w-9 border">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className={cn('max-w-xl rounded-lg px-4 py-3 bg-muted')}>
        <article className="prose prose-sm dark:prose-invert text-inherit">
          <Markdown>{message.content}</Markdown>
        </article>
        <div className="mt-4 flex flex-wrap gap-2">
          {courses.map((course) => (
            <Button
              key={course}
              variant="outline"
              size="sm"
              onClick={() => action(course)}
            >
              {course}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
