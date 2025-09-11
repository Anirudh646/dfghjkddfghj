'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, LoaderCircle } from 'lucide-react';

import { askAI, getStarted } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, type Message } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { courses } from '@/lib/data';
import { ActionableMessage } from './actionable-message';

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
const initialGuideState: { guide?: string; error?: string } = {};

function GetStarted({ onGuideReceived }: { onGuideReceived: (guide: string) => void }) {
  const [state, formAction] = useActionState(getStarted, initialGuideState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.guide) {
      onGuideReceived(state.guide);
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, onGuideReceived, toast]);

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Welcome to the AI Admission Counselor</CardTitle>
            <CardDescription>
              Tell us what you're interested in studying, and we'll create a personalized guide to help you get started on your academic journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="studyInterest"
              placeholder="For example: 'Mechanical Engineering', 'BBA', or 'JEE Preparation'"
              rows={3}
              required
            />
             {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
          </CardContent>
          <CardFooter>
            <SubmitButton label="Get My Personalised Guide" pendingLabel="Generating..." />
          </CardFooter>
        </form>
      </Card>
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

  const handleGuideReceived = (guide: string) => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your AI admission counselor. How can I help you today?",
      },
      {
        role: 'assistant',
        content: `Here is a personalized guide to get you started:\n\n${guide}`,
      }
    ]);
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
      } else if (aiState.answer === 'ACTION_CLARIFY_COURSE_QUERY') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Hi! Could you clarify what you mean by "COURSE"? Are you looking for:',
            component: 'CourseQueryClarification',
            componentProps: {
              courses: [
                'Information on a university course',
                'A course on a specific subject',
                'An online course recommendation',
              ],
              action: (query: string) => handleAction(query),
            },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: aiState.answer as string },
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

  if (!showChat) {
    return <GetStarted onGuideReceived={handleGuideReceived} />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 px-4 py-2">
          {messages.map((message, index) => {
             if ((message.component === 'CourseSelector' || message.component === 'FeeTypeSelector' || message.component === 'CourseQueryClarification') && message.componentProps) {
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
              setMessages((prev) => [...prev, { role: 'user', content: query }]);
              startTransition(() => {
                formAction(formData);
              });
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
