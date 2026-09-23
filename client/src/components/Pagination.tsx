'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl = '/productos',
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val && key !== 'page') {
          params.set(key, val);
        }
      });
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers array with sliding window & ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const renderItem = (
    label: React.ReactNode,
    page: number,
    isDisabled: boolean,
    isActive: boolean,
    key: string | number
  ) => {
    const baseClasses = `px-3 py-1.5 min-w-[36px] text-center text-sm font-medium rounded-lg transition-colors flex items-center justify-center select-none ${
      isActive
        ? 'bg-sm-700 text-white shadow-sm'
        : isDisabled
        ? 'opacity-40 cursor-not-allowed text-gray-400 border border-gray-200'
        : 'text-gray-700 bg-white border border-gray-200 hover:bg-sm-50 hover:text-sm-700 hover:border-sm-400'
    }`;

    if (isDisabled) {
      return (
        <span key={key} className={baseClasses} aria-disabled="true">
          {label}
        </span>
      );
    }

    if (onPageChange) {
      return (
        <button
          key={key}
          type="button"
          onClick={() => onPageChange(page)}
          className={baseClasses}
        >
          {label}
        </button>
      );
    }

    return (
      <Link key={key} href={createPageUrl(page)} className={baseClasses}>
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 py-2" aria-label="Paginación">
      {/* Anterior */}
      {renderItem(
        <>
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Anterior</span>
        </>,
        currentPage - 1,
        !hasPrev,
        false,
        'prev'
      )}

      {/* Números de página */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <span
                key={`dots-${idx}`}
                className="px-2 py-1.5 text-xs text-gray-400 font-bold select-none"
              >
                ...
              </span>
            );
          }
          return renderItem(p, p, false, p === currentPage, `page-${p}`);
        })}
      </div>

      {/* Siguiente */}
      {renderItem(
        <>
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </>,
        currentPage + 1,
        !hasNext,
        false,
        'next'
      )}
    </nav>
  );
}
