import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 animate-in fade-in duration-500">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Chat Interface Skeleton */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-32" />
          </CardHeader>

          <CardContent className="flex-1 p-4 space-y-4">
            {/* Chat Messages Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${
                    i % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-xs ${
                      i % 2 === 0 ? 'bg-muted' : 'bg-primary'
                    } rounded-lg p-3`}
                  >
                    <Skeleton
                      className={`h-4 w-32 ${
                        i % 2 === 0
                          ? 'bg-muted-foreground/20'
                          : 'bg-primary-foreground/20'
                      }`}
                    />
                    {i % 2 === 1 && (
                      <Skeleton className="h-3 w-20 mt-2 bg-primary-foreground/20" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Input Area Skeleton */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
