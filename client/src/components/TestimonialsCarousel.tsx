'use client';

import { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';

interface TestimonialsProps {
  items: Testimonial[];
}

export function TestimonialsCarousel({ items }: TestimonialsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const prev = () => emblaApi.scrollPrev();
    const next = () => emblaApi.scrollNext();
    prevBtn.current?.addEventListener('click', prev);
    nextBtn.current?.addEventListener('click', next);
    return () => {
      prevBtn.current?.removeEventListener('click', prev);
      nextBtn.current?.removeEventListener('click', next);
    };
  }, [emblaApi]);

  if (!items.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-2"
            >
              <div className="card p-6 h-full flex flex-col">
                <Quote className="w-8 h-8 text-sm-200 mb-3" />
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{t.message}</p>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sm-50 text-sm-700 flex items-center justify-center font-bold">
                      {t.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-sm-700">{t.client_name}</p>
                    <p className="text-xs text-gray-500">
                      {t.position}{t.position && t.company ? ' · ' : ''}{t.company}
                    </p>
                  </div>
                  <div className="ml-auto text-amber-400 text-sm">
                    {'★'.repeat(t.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        ref={prevBtn}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-sm-50"
      >
        <ChevronLeft className="w-5 h-5 text-sm-700" />
      </button>
      <button
        ref={nextBtn}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-sm-50"
      >
        <ChevronRight className="w-5 h-5 text-sm-700" />
      </button>
    </div>
  );
}