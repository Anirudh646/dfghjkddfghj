import { summarizeCourseInformation } from '@/ai/flows/summarize-course-information';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/types';
import { BookCheck, Briefcase, Milestone } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export async function CourseCard({ course }: { course: Course }) {
  const summary = await summarizeCourseInformation({
    courseDescription: course.description,
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-headline">{course.title}</CardTitle>
          <Badge variant="secondary">{course.department}</Badge>
        </div>
        <CardDescription>
          {course.code} | {course.credits} Credits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <BookCheck className="h-5 w-5 text-primary" />
            Core Content
          </h3>
          <p className="text-sm text-muted-foreground">
            {summary.coreContent}
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Milestone className="h-5 w-5 text-primary" />
            Prerequisites
          </h3>
          <p className="text-sm text-muted-foreground">
            {summary.prerequisites}
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Briefcase className="h-5 w-5 text-primary" />
            Potential Career Paths
          </h3>
          <p className="text-sm text-muted-foreground">
            {summary.potentialCareerPaths}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-5 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
