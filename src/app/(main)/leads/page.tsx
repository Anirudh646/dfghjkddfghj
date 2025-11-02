'use client';

import { useMemo, useState, useEffect } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { AlertCircle, Trash2, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import type { Lead } from '@/lib/types';
import { useUser, useAuth } from '@/firebase/provider';
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
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

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

  async function onSignIn(values: z.infer<typeof formSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        form.setError('password', {
          type: 'manual',
          message: 'Incorrect email or password.',
        });
      } else {
        form.setError('root.serverError', {
          type: 'manual',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    }
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
          Please sign in to view leads.
        </p>

        <Card className="mt-6 text-left">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSignIn)}
                className="space-y-4"
              >
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
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.root?.serverError && (
                  <FormMessage className="text-destructive">
                    {form.formState.errors.root.serverError.message}
                  </FormMessage>
                )}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
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
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function LeadsPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

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

  useEffect(() => {
    return () => {
      if (auth.currentUser) {
        signOut(auth);
      }
    };
  }, [auth]);

  const handleDelete = async () => {
    if (!leadToDelete) return;
    const leadRef = doc(firestore, 'leads', leadToDelete.id);
    try {
      await deleteDoc(leadRef);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

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
    <>
      <AlertDialog
        open={!!leadToDelete}
        onOpenChange={(open) => !open && setLeadToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead
              for <span className="font-semibold">{leadToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                Contact information captured from the AI Counselor.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => signOut(auth)}>
              Sign Out
            </Button>
          </div>
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
                  ? 'You do not have permission to view this data. Please check Firestore security rules.'
                  : 'There was a problem loading the leads data. Please try again later.'}
              </AlertDescription>
            </Alert>
          ) : leads && leads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{formatTimestamp(lead.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLeadToDelete(lead)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
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
    </>
  );
}
