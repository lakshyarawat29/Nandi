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

        {/* Trust Score Display */}
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="relative inline-block">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-12 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <Skeleton
                    className="h-2 rounded-full"
                    style={{ width: `${(i + 1) * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-4 border rounded-lg"
              >
                <Skeleton className="h-5 w-5 rounded-full mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* History Chart */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
