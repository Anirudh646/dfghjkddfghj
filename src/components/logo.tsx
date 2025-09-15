import { cn } from '@/lib/utils';

export function Logo({ className, hideText = false }: { className?: string; hideText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary rounded-lg p-2 text-primary-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M12 2L3 5v6.2C3 17.3 7 21.4 12 22.9c5-1.5 9-5.6 9-11.7V5L12 2zm0 18.5c-4.2 0-7-3.1-7-8.2V6.3l7-2.1 7 2.1v6.3c0 5.1-2.8 8.2-7 8.2z"/>
          <path d="M12 7l-4 1.5v3.5c0 2.8 1.9 5.2 4.1 5.9.3.1.6.1.9 0 2.2-.7 4.1-3.1 4.1-5.9V8.5L12 7z" />
        </svg>
      </div>
      {!hideText && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          CampusConnect AI
        </span>
      )}
    </div>
  );
}
