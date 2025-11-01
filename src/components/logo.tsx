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
          <path d="M21.43,8.45,12.7,4.22A1.2,1.2,0,0,0,12,4a1.2,1.2,0,0,0-.7.22L2.57,8.45a1.43,1.43,0,0,0-.87,1.3,1.38,1.38,0,0,0,.87,1.3L4,11.6V16a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V11.6l1.43-.55a1.38,1.38,0,0,0,.87-1.3A1.43,1.43,0,0,0,21.43,8.45ZM18,15H6V12.4l6,2.25,6-2.25Z" />
          <path d="M12,14.22,3.3,10,12,6.78,20.7,10Z" />
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
