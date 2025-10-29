
'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, LoaderCircle, Mic, Search } from 'lucide-react';

import { askAI } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, type Message } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { courses, faqs } from '@/lib/data';
import { ActionableMessage } from './actionable-message';
import { Logo } from '@/components/logo';
import { useMicrophone } from '@/hooks/use-microphone';

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

function InitialOptions({ onOptionClick, onQuerySubmit }: { onOptionClick: (option: string) => void; onQuerySubmit: (query: string) => void; }) {
  const options = ['Courses', 'Fees', 'FAQ', 'Placement'];
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { transcript, isListening, startListening, stopListening } = useMicrophone();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.value = transcript;
    }
    if (!isListening && transcript) {
        onQuerySubmit(transcript);
    }
  }, [transcript, isListening, onQuerySubmit]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    if (query.trim()) {
      onQuerySubmit(query);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center animate-fade-in-up">
        <Logo className="mb-8 justify-center" />
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to the AI Admission Counselor</CardTitle>
            <CardDescription className="text-lg">
              How can I help you today? Select an option below or type your question.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
             <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                name="query"
                placeholder={isListening ? "Listening..." : "Ask a question..."}
                className="w-full rounded-full bg-background/80 pl-10 pr-12 py-3 text-lg"
                disabled={isListening}
              />
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'ghost'}
                onClick={handleVoiceInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
              </Button>
            </form>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
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
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { transcript, isListening, startListening, stopListening } = useMicrophone();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (transcript && inputRef.current) {
      inputRef.current.value = transcript;
      // Automatically submit the form when transcript is ready
      if (!isListening && transcript) {
        const formData = new FormData(formRef.current!);
        formData.set('query', transcript);
         if (messages.length === 0) {
            startChat(transcript);
        } else {
            setMessages((prev) => [...prev, { role: 'user', content: transcript }]);
            startTransition(() => {
                formAction(formData);
            });
        }
        formRef.current?.reset();
      }
    }
  }, [transcript, isListening, formAction, messages.length]);


  const handleOptionClick = (option: string) => {
    if (option === 'FAQ') {
      const faqMessages: Message[] = [
        {
          role: 'assistant',
          content: "Hello! I'm your AI admission counselor. Here are some frequently asked questions. Feel free to select one or ask your own question.",
        },
        {
          role: 'assistant',
          content: 'Frequently Asked Questions',
          component: 'FaqSelector',
          componentProps: {
            courses: faqs.map(faq => faq.question),
            action: (question: string) => handleAction(question),
          }
        }
      ];
      setMessages(faqMessages);
      setShowChat(true);
      return;
    }
     if (option === 'Placement') {
        const placementMessages: Message[] = [
        {
          role: 'assistant',
          content: "I can certainly help with that. Here is a summary of placement records for our popular courses. Select one to learn more.",
        },
        {
          role: 'assistant',
          content: 'Placement Records',
          component: 'PlacementInfoSelector',
          componentProps: {
            courses: courses,
            action: (course: string) => handleAction(`Tell me more about placements for ${course}`),
            displayPlacementInfo: true,
          }
        }
      ];
      setMessages(placementMessages);
      setShowChat(true);
      return;
    }


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
  
  const handleQuerySubmit = (query: string) => {
    startChat(query);
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
        
        if (aiState.answer !== "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more.") {
           newMessages.push({
            role: 'assistant',
            content: 'Thank you for your query! What would you like to know next?',
            component: 'FeeTypeSelector', // Re-using for general options
            componentProps: {
              courses: ['Courses', 'Fees', 'FAQ', 'Placement'],
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
    return <InitialOptions onOptionClick={handleOptionClick} onQuerySubmit={handleQuerySubmit} />;
  }


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 px-4 py-2">
          {messages.map((message, index) => {
             if ((message.component === 'CourseSelector' || message.component === 'FeeTypeSelector' || message.component === 'CourseInfoSelector' || message.component === 'FaqSelector' || message.component === 'PlacementInfoSelector') && message.componentProps) {
              return (
                <ActionableMessage key={index} message={message} {...message.componentProps} />
              )
            }
            return <ChatMessage key={index} message={message} />;
          })}
           {isPending && (
            <div className="flex justify-start animate-pulse">
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
            ref={inputRef}
            name="query"
            placeholder={isListening ? "Listening..." : "Ask about courses, fees, eligibility..."}
            autoComplete="off"
            className="flex-1"
            required
            disabled={isPending || isListening}
            onFocus={() => {
              if (messages.length === 0) {
                startChat();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'destructive' : 'outline'}
            onClick={handleVoiceInput}
            disabled={isPending}
          >
            <Mic />
            <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
          </Button>
          <Button type="submit" size="icon" disabled={isPending}>
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
