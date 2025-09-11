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
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          <path d="M12 13c-2.33 0-7 1.17-7 3.5V18c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-1.5c0-2.33-4.67-3.5-7-3.5zm5 5H7v-.5c.22-1.25 3.03-2.5 5-2.5s4.78 1.25 5 2.5V18z" />
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
