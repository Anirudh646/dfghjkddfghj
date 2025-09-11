import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, hideText = false }: { className?: string; hideText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary rounded-lg p-2">
        <GraduationCap className="h-6 w-6 text-primary-foreground" />
      </div>
      {!hideText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          CampusConnect AI
        </span>
      )}
    </div>
  );
}
