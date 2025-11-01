'use client';

import { useMemo, useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import type { Lead } from '@/lib/types';
import { useUser } from '@/firebase/provider';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

function SignInForm() {
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });
  
  function onSignIn(values: z.infer<typeof formSchema>) {
    initiateEmailSignIn(auth, values.email, values.password);
  }

  function onSignUp(values: z.infer<typeof formSchema>) {
    initiateEmailSignUp(auth, values.email, values.password);
  }

  return (
    <div className="flex h-full min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-center">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserCheck className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">
          Secure Access Required
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please sign in or create an account to view leads.
        </p>

        <Tabs defaultValue="signin" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <TabsContent value="signin">
              <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-4 text-left">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
               <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4 text-left">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your-email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Choose a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: { seconds: number; nanoseconds: number }) {
  if (!timestamp || typeof timestamp.seconds !== 'number') {
    return 'Invalid date';
  }
  const date = new Date(timestamp.seconds * 1000);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function LeadsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Date Submitted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-40" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function LeadsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading, userError } = useUser();

  const leadsQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, 'leads'), orderBy('createdAt', 'desc'))
        : null,
    [firestore, user]
  );

  const {
    data: leads,
    isLoading: isLeadsLoading,
    error: leadsError,
  } = useCollection<Lead>(leadsQuery);

  const isLoading = isUserLoading || (user && isLeadsLoading);

  if (isUserLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            Contact information captured from the AI Counselor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadsSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return <SignInForm />;
  }

  const error = userError || leadsError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>
          Contact information captured from the AI Counselor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LeadsSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Fetching Leads</AlertTitle>
            <AlertDescription>
              {error.message.includes('permission-denied') 
                ? "You do not have permission to view this data. Please check Firestore security rules."
                : "There was a problem loading the leads data. Please try again later."
              }
            </AlertDescription>
          </Alert>
        ) : leads && leads.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{formatTimestamp(lead.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
            <p className="text-muted-foreground">No leads captured yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    