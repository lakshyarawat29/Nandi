import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 animate-in fade-in duration-500">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prediction Models */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
