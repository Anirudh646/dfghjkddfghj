
'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, LoaderCircle } from 'lucide-react';

import { askAI } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, type Message } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { courses } from '@/lib/data';
import { ActionableMessage } from './actionable-message';
import { Logo } from '@/components/logo';

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}

const initialAIState: { answer?: string; error?: string } = {};

function InitialOptions({ onOptionClick }: { onOptionClick: (option: string) => void }) {
  const options = ['Courses', 'Fees', 'Eligibility Criteria'];

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <Logo className="mb-8 justify-center" />
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to the AI Admission Counselor</CardTitle>
            <CardDescription className="text-lg">
              How can I help you today? Select an option below or type your question.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {options.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="lg"
                onClick={() => onOptionClick(option)}
                className="w-full transition-transform hover:scale-105"
              >
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [aiState, formAction] = useActionState(askAI, initialAIState);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleOptionClick = (option: string) => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your AI admission counselor. How can I help you today?",
      },
      {
        role: 'user',
        content: option
      }
    ]);

    const formData = new FormData();
    formData.append('query', option);
    startTransition(() => {
      formAction(formData);
    });

    setShowChat(true);
  };

  const handleAction = (query: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    const formData = new FormData();
    formData.append('query', query);
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (aiState.answer) {
      if (aiState.answer === 'ACTION_SELECT_FEE_TYPE') {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: 'I can help with that. Are you interested in course fees, hostel fees, or bus fees?',
            component: 'FeeTypeSelector',
            componentProps: {
              courses: ['Course Fees', 'Hostel Fees', 'Bus Fees'],
              action: (feeType: string) => handleAction(feeType),
            }
          },
        ]);
      } else if (aiState.answer === 'ACTION_SELECT_COURSE_FOR_FEES') {
         setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: 'Of course! Please select a course to see the fee structure.',
            component: 'CourseSelector',
            componentProps: {
              courses: courses.map(c => c.title),
              action: (course: string) => handleAction(`What are the fees for ${course}?`),
            }
          },
        ]);
      } else if (aiState.answer === 'ACTION_SELECT_COURSE_INFO') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Here are the courses we offer. Select one to learn more.',
            component: 'CourseInfoSelector',
            componentProps: {
              courses: courses,
              action: (course: string) => handleAction(course),
              displayEligibility: true,
            },
          },
        ]);
      } else {
         const newMessages: Message[] = [
          { role: 'assistant', content: aiState.answer as string },
        ];

        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : '';
        const isSpecificCourseQuery = courses.some(c => lastUserMessage.includes(c.title.toLowerCase()));
        
        if (isSpecificCourseQuery && aiState.answer !== "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more.") {
           newMessages.push({
            role: 'assistant',
            content: 'What would you like to know next?',
            component: 'FeeTypeSelector', // Re-using for general options
            componentProps: {
              courses: ['Courses', 'Fees', 'Eligibility Criteria'],
              action: (option: string) => handleAction(option),
            },
          });
        }

        setMessages((prev) => [
          ...prev,
          ...newMessages
        ]);
      }
    }
    if (aiState.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: aiState.error,
      });
    }
  }, [aiState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const startChat = (initialQuery?: string) => {
    const greetingMessage = {
      role: 'assistant',
      content: "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more."
    } as Message;
    
    let initialMessages = [greetingMessage];

    if (initialQuery) {
      initialMessages.push({ role: 'user', content: initialQuery });
      const formData = new FormData();
      formData.append('query', initialQuery);
      startTransition(() => {
        formAction(formData);
      });
    }
    
    setMessages(initialMessages);
    setShowChat(true);
  };
  
  if (!showChat) {
    return <InitialOptions onOptionClick={startChat} />;
  }


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 px-4 py-2">
          {messages.map((message, index) => {
             if ((message.component === 'CourseSelector' || message.component === 'FeeTypeSelector' || message.component === 'CourseInfoSelector') && message.componentProps) {
              return (
                <ActionableMessage key={index} message={message} {...message.componentProps} />
              )
            }
            return <ChatMessage key={index} message={message} />;
          })}
           {isPending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          ref={formRef}
          action={(formData) => {
            const query = formData.get('query') as string;
            if (query.trim() && !isPending) {
              
              if (messages.length === 0) {
                 startChat(query);
              } else {
                 setMessages((prev) => [...prev, { role: 'user', content: query }]);
                startTransition(() => {
                  formAction(formData);
                });
              }
              formRef.current?.reset();
            }
          }}
          className="flex items-center gap-2"
        >
          <Input
            name="query"
            placeholder="Ask about courses, fees, eligibility..."
            autoComplete="off"
            className="flex-1"
            required
            disabled={isPending}
            onFocus={() => {
              if (messages.length === 0) {
                startChat();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
