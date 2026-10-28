import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { NavSection, NavItem } from '../../types/navigation';
import { navigationSections } from '../../config/navigation';
import { colors } from '../../constants/theme';

interface FlyoutPortalProps {
  section: NavSection | null;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentPath: string;
}

export const FlyoutPortal: React.FC<FlyoutPortalProps> = ({
  section,
  anchorRect,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  currentPath,
}) => {
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !section || !anchorRect) {
    return null;
  }

  // Calculate position to avoid overflowing viewport vertically
  const flyoutWidth = 280;
  const estimatedHeight = 60 + section.items.length * 42;
  const padding = 12;

  let top = anchorRect.top;
  if (top + estimatedHeight > window.innerHeight - padding) {
    top = Math.max(padding, window.innerHeight - estimatedHeight - padding);
  }

  const left = Math.max(anchorRect.right + 10, 72);
  const SectionIcon = section.icon;

  return createPortal(
    <div
      ref={flyoutRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${flyoutWidth}px`,
        maxHeight: `calc(100vh - ${padding * 2}px)`,
        backgroundColor: '#0F1A36',
        border: '1px solid #1E2D54',
        borderRadius: '14px',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        animation: 'flyoutIn 0.15s ease-out',
      }}
      role="menu"
      aria-label={`${section.title} submenu`}
    >
      {/* Category Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderBottom: '1px solid #17264C',
          backgroundColor: '#122044',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: colors.secondaryBrand,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SectionIcon size={15} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {section.title}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#556582',
              whiteSpace: 'nowrap',
            }}
          >
            {section.items.length} {section.items.length === 1 ? 'module' : 'modules'}
          </span>
        </div>
      </div>

      {/* Submenu Items List */}
      <div
        className="search-flyout-scrollable"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '6px 8px',
          gap: '3px',
          overflowY: 'auto',
          maxHeight: '360px',
        }}
      >
        {section.items.map((item: NavItem) => {
          const active =
            currentPath === item.path ||
            (item.path === '/management/ceo-dashboard' &&
              (currentPath === '/' || currentPath === ''));
          const ItemIcon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                height: '38px',
                padding: '0 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                boxSizing: 'border-box',
                transition: 'all 0.12s ease',
                backgroundColor: active ? '#182C62' : 'transparent',
                backgroundImage: active
                  ? 'linear-gradient(90deg, #182C62 0%, #122146 100%)'
                  : 'none',
                boxShadow: active ? 'inset 3.5px 0 0 0 #5845E8' : 'none',
                color: active ? '#FFFFFF' : '#8A99B5',
                fontWeight: active ? 700 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#8A99B5';
                }
              }}
            >
              <ItemIcon
                size={16}
                strokeWidth={active ? 2.2 : 1.8}
                color={active ? '#60A5FA' : '#6B7C9E'}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: active ? 700 : 400,
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>,
    document.body
  );
};

export interface SearchFlyoutPortalProps {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentPath: string;
}

export const SearchFlyoutPortal: React.FC<SearchFlyoutPortalProps> = ({
  isOpen,
  anchorRect,
  onClose,
  onMouseEnter,
  onMouseLeave,
  currentPath,
}) => {
  const flyoutRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      setSearchQuery('');
    }
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, onClose]);

  const matchingItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const results: Array<{ item: NavItem; sectionTitle: string }> = [];

    navigationSections.forEach((section) => {
      section.items.forEach((item) => {
        if (!q || item.label.toLowerCase().includes(q) || section.title.toLowerCase().includes(q)) {
          results.push({ item, sectionTitle: section.title });
        }
      });
    });

    return results;
  }, [searchQuery]);

  if (!isOpen || !anchorRect) {
    return null;
  }

  const flyoutWidth = 300;
  const padding = 12;

  let top = anchorRect.top;
  const maxHeight = 440;
  if (top + maxHeight > window.innerHeight - padding) {
    top = Math.max(padding, window.innerHeight - maxHeight - padding);
  }

  const left = Math.max(anchorRect.right + 10, 72);

  return createPortal(
    <div
      ref={flyoutRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${flyoutWidth}px`,
        maxHeight: `calc(100vh - ${padding * 2}px)`,
        backgroundColor: '#0F1A36',
        border: '1px solid #1E2D54',
        borderRadius: '14px',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        animation: 'flyoutIn 0.15s ease-out',
      }}
      role="dialog"
      aria-label="Navigation Search"
    >
      {/* Search Input Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          borderBottom: '1px solid #17264C',
          backgroundColor: '#122044',
          boxSizing: 'border-box',
        }}
      >
        <Search size={16} color="#818CF8" strokeWidth={2.2} style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search navigation..."
          aria-label="Search navigation input"
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
          }}
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: '#8A99B5',
              borderRadius: '4px',
              outline: 'none',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8A99B5';
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        ) : (
          <span
            style={{
              fontSize: '10px',
              color: '#5A6B88',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontWeight: 600,
              flexShrink: 0,
              letterSpacing: '0.2px',
            }}
          >
            ESC
          </span>
        )}
      </div>

      {/* Results Header or Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px 6px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#4A5B78',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 700,
          }}
        >
          {searchQuery ? 'Matching Results' : 'ALL MODULES'}
        </span>
        <span style={{ fontSize: '11px', color: '#4A5B78', fontWeight: 500 }}>
          {matchingItems.length} {matchingItems.length === 1 ? 'module' : 'modules'}
        </span>
      </div>

      {/* Results List */}
      <div
        className="search-flyout-scrollable"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '6px 8px',
          gap: '3px',
          overflowY: 'auto',
          maxHeight: '380px',
        }}
      >
        {matchingItems.length === 0 ? (
          <div
            style={{
              padding: '28px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Search size={18} color="#475569" strokeWidth={1.5} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>
              No modules found
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              No navigation matches &ldquo;{searchQuery}&rdquo;
            </span>
          </div>
        ) : (
          matchingItems.map(({ item, sectionTitle }) => {
            const active =
              currentPath === item.path ||
              (item.path === '/management/ceo-dashboard' &&
                (currentPath === '/' || currentPath === ''));
            const ItemIcon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  height: '38px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.12s ease',
                  backgroundColor: active ? '#182C62' : 'transparent',
                  backgroundImage: active
                    ? 'linear-gradient(90deg, #182C62 0%, #122146 100%)'
                    : 'none',
                  boxShadow: active ? 'inset 3.5px 0 0 0 #5845E8' : 'none',
                  color: active ? '#FFFFFF' : '#8A99B5',
                  fontWeight: active ? 700 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8A99B5';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <ItemIcon
                    size={16}
                    strokeWidth={active ? 2.2 : 1.8}
                    color={active ? '#60A5FA' : '#6B7C9E'}
                    style={{ flexShrink: 0 }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '13px',
                      fontWeight: active ? 700 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: active ? '#5E7094' : '#50617F',
                    backgroundColor: active ? '#1D2E56' : '#18233E',
                    padding: '2.5px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontWeight: 500,
                  }}
                >
                  {sectionTitle}
                </span>
              </NavLink>
            );
          })
        )}
      </div>
    </div>,
    document.body
  );
};
