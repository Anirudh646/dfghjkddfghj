
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
import { LeadCaptureForm } from './lead-capture-form';

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

function InitialOptions({ 
  onOptionClick, 
  onQuerySubmit,
  transcript,
  isListening,
  startListening,
  stopListening
}: { 
  onOptionClick: (option: string) => void; 
  onQuerySubmit: (query: string) => void; 
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}) {
  const options = ['Courses', 'Fees', 'FAQ', 'Placement'];
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        if (formRef.current) formRef.current.reset();
        if (inputRef.current) inputRef.current.value = '';
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
  const { transcript, isListening, startListening, stopListening, setTranscript } = useMicrophone();
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

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
    // Automatically submit the form when transcript is ready
    if (!isListening && transcript) {
        const query = transcript;
        setTranscript(''); // Reset transcript after using it

        if (showChat) {
            submitQuery(query);
        } else {
            // If on the initial screen, start the chat with the query
            startChat(query);
        }
        if (formRef.current) formRef.current.reset();
        if (inputRef.current) inputRef.current.value = '';
    }
}, [transcript, isListening, showChat, setTranscript]);

const submitQuery = (query: string) => {
    if (!query.trim() || isPending) return;

    setMessages((prev) => [...prev, { role: 'user', content: query }]);

    if (!leadCaptured) {
      setPendingQuery(query);
    } else {
      const formData = new FormData();
      formData.append('query', query);
      startTransition(() => {
        formAction(formData);
      });
    }
    formRef.current?.reset();
  };

  const handleLeadCapture = (data: { name: string; phone: string }) => {
    console.log('Lead captured:', data);
    setLeadCaptured(true);
    
    // Add a confirmation message
    setMessages(prev => [...prev, { role: 'assistant', content: `Thank you, ${data.name}! Now, let me answer your question.` }]);

    if (pendingQuery) {
      const formData = new FormData();
      formData.append('query', pendingQuery);
      startTransition(() => {
        formAction(formData);
      });
      setPendingQuery(null);
    }
  };

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
            action: (question: string) => submitQuery(question),
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
            action: (course: string) => submitQuery(`Tell me more about placements for ${course}`),
            displayPlacementInfo: true,
          }
        }
      ];
      setMessages(placementMessages);
      setShowChat(true);
      return;
    }

    startChat(option);
  };
  
  const handleQuerySubmit = (query: string) => {
    startChat(query);
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
              action: (feeType: string) => submitQuery(feeType),
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
              action: (course: string) => submitQuery(course),
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
              action: (option: string) => submitQuery(option),
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
  }, [messages, pendingQuery]);

  const startChat = (initialQuery?: string) => {
    const greetingMessage = {
      role: 'assistant',
      content: "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more."
    } as Message;
    
    let initialMessages = [greetingMessage];
    setMessages(initialMessages);

    if (initialQuery) {
        submitQuery(initialQuery);
    }
    
    setShowChat(true);
  };
  
  if (!showChat) {
    return <InitialOptions 
      onOptionClick={handleOptionClick} 
      onQuerySubmit={handleQuerySubmit}
      transcript={transcript}
      isListening={isListening}
      startListening={startListening}
      stopListening={stopListening}
      />;
  }

  const showLeadForm = !leadCaptured && pendingQuery;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 px-4 py-2">
          {messages.map((message, index) => {
             if ((message.component === 'CourseSelector' || message.component === 'FeeTypeSelector' || message.component === 'CourseInfoSelector' || message.component === 'FaqSelector' || message.component === 'PlacementInfoSelector') && message.componentProps) {
              return (
                <ActionableMessage key={index} message={message} {...message.componentProps} action={(q) => submitQuery(q)} />
              )
            }
            return <ChatMessage key={index} message={message} />;
          })}

          {showLeadForm && (
            <div className="flex justify-start animate-slide-in-bottom">
                 <div className="flex items-start gap-4 justify-start">
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xl rounded-lg px-4 py-3 bg-muted">
                        <LeadCaptureForm onSubmit={handleLeadCapture} />
                    </div>
                </div>
            </div>
          )}

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
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get('query') as string;
            submitQuery(query);
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
            disabled={isPending || isListening || showLeadForm}
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
            disabled={isPending || showLeadForm}
          >
            <Mic />
            <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
          </Button>
          <Button type="submit" size="icon" disabled={isPending || showLeadForm}>
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
