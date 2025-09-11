'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
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
            <CardTitle>Welcome to CampusConnect AI</CardTitle>
            <CardDescription>
              To get started, tell us what you're interested in studying. We'll create a personalized guide to help you on your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="studyInterest"
              placeholder="e.g., 'Computer Science', 'Business', 'JEE Preparation'..."
              rows={3}
              required
            />
             {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
          </CardContent>
          <CardFooter>
            <SubmitButton label="Get My Guide" pendingLabel="Generating..." />
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

  useEffect(() => {
    if (aiState.answer) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiState.answer as string },
      ]);
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
        // A slight delay to allow the new message to render
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
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          ref={formRef}
          action={(formData) => {
            const query = formData.get('query') as string;
            if (query.trim()) {
              setMessages((prev) => [...prev, { role: 'user', content: query }]);
              formAction(formData);
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
          />
          <Button type="submit" size="icon">
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
