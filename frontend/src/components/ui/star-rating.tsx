import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  rating: number; // 0-5
  max?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, max = 5, onRatingChange, readonly = false, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => onRatingChange?.(starValue)}
            className={cn(
              "transition-all focus:outline-none",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
              isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          >
            <Star className={sizeClass} />
          </button>
        );
      })}
    </div>
  );
}