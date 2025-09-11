'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, LoaderCircle } from 'lucide-react';

import { askAI } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, type Message } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" /> : <ArrowUp />}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

const initialState: { answer?: string; error?: string } = {};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI admission counselor. How can I help you today? You can ask me about courses, fees, eligibility, and more.",
    },
  ]);
  const [state, formAction] = useActionState(askAI, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.answer) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: state.answer as string },
      ]);
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

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
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
