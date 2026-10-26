import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { navigationSections, footerNavigationItems } from '../../config/navigation';
import { NavSection, NavItem } from '../../types/navigation';
import { colors } from '../../constants/theme';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  // Management expanded by default; other sections collapsed by default
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationSections.forEach((section) => {
      initial[section.id] = section.defaultExpanded ?? false;
    });
    return initial;
  });

  // Automatically expand the section containing the active route
  useEffect(() => {
    const activeSection = navigationSections.find((section) =>
      section.items.some(
        (item) =>
          item.path === location.pathname ||
          (item.path === '/management/ceo-dashboard' && (location.pathname === '/' || location.pathname === ''))
      )
    );

    if (activeSection) {
      setExpandedSections((prev) => ({
        ...prev,
        [activeSection.id]: true,
      }));
    }
  }, [location.pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isCurrentActive = (path: string) => {
    if (path === '/management/ceo-dashboard' && (location.pathname === '/' || location.pathname === '')) {
      return true;
    }
    return location.pathname === path;
  };

  const isSectionActive = (section: NavSection) => {
    return section.items.some(
      (item) =>
        item.path === location.pathname ||
        (item.path === '/management/ceo-dashboard' && (location.pathname === '/' || location.pathname === ''))
    );
  };

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        height: '100vh',
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.sidebarBorderRight}`,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none',
        flexShrink: 0,
        fontFamily: "'Inter', sans-serif",
      }}
      aria-label="Aside - Main Sidebar Navigation"
    >
      {/* Brand Header: Fixed (259px) x Fixed (68px), Border Bottom 1px #142144 */}
      <div
        style={{
          width: '100%',
          height: '68px',
          minHeight: '68px',
          maxHeight: '68px',
          borderBottom: `1px solid ${colors.sidebarHeaderBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {/* Logo Container: Exactly 223px Hug x 36px Hug matching Figma Inspector */}
        <NavLink
          to="/management/ceo-dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            outline: 'none',
            width: '223px',
            height: '36px',
            flexShrink: 0,
          }}
        >
          <img
            src="/kalpanaaa-logo.png"
            alt="KALPANAAA SOFTWARE SOLUTIONS"
            style={{
              width: '223px',
              height: '36px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </NavLink>
      </div>

      {/* Scrollable Navigation Menu: Fixed Width 235px, Left 13px, Top 92px (24px below header), Gap 16px */}
      <div
        className="sidebar-scrollable"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 11px 16px 13px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        {navigationSections.map((section: NavSection) => {
          const isExpanded = expandedSections[section.id] ?? false;
          const isActive = isSectionActive(section);
          const SectionIcon = section.icon;

          return (
            <div
              key={section.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '235px',
                boxSizing: 'border-box',
                marginBottom: isExpanded ? '12px' : '0px',
              }}
            >
              {/* Dynamic Section Header: Highlights in purple #4F46E5 whenever active */}
              {isActive ? (
                // Active Category Banner (Solid Purple)
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '40px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    backgroundColor: colors.secondaryBrand,
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'background-color 0.15s ease',
                    marginBottom: isExpanded ? '6px' : '0px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.secondaryBrand;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <SectionIcon size={17} strokeWidth={2.2} color="#FFFFFF" />
                    <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.2px' }}>
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} strokeWidth={2.4} color="#FFFFFF" />
                  ) : (
                    <ChevronDown size={16} strokeWidth={2.4} color="#FFFFFF" />
                  )}
                </button>
              ) : (
                // Inactive Category Header
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '38px',
                    padding: '0 14px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#CAD5E8',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    transition: 'color 0.15s ease',
                    marginBottom: isExpanded ? '4px' : '0px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#CAD5E8';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <SectionIcon size={16} strokeWidth={1.9} color="#8A99B5" />
                    <span style={{ fontSize: '13.5px', fontWeight: 600, letterSpacing: '0.2px' }}>
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={15} strokeWidth={2.2} style={{ color: '#8A99B5' }} />
                  ) : (
                    <ChevronDown size={15} strokeWidth={2.2} style={{ color: '#8A99B5' }} />
                  )}
                </button>
              )}

              {/* Submenu Items */}
              {isExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {section.items.map((item: NavItem) => {
                    const active = isCurrentActive(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          height: '40px',
                          width: '100%',
                          padding: '0 14px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '13.5px',
                          fontFamily: "'Inter', sans-serif",
                          boxSizing: 'border-box',
                          transition: 'all 0.15s ease',
                          backgroundColor: active ? colors.sidebarActivePill : 'transparent',
                          backgroundImage: active
                            ? 'linear-gradient(90deg, #182C62 0%, #122146 100%)'
                            : 'none',
                          border: 'none',
                          outline: 'none',
                          boxShadow: active ? 'inset 3.5px 0 0 0 #5845E8' : 'none',
                          color: active ? '#FFFFFF' : '#8A99B5',
                          fontWeight: active ? 600 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
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
                          size={17}
                          strokeWidth={active ? 2.2 : 1.8}
                          color={active ? '#60A5FA' : '#7E8DA6'}
                        />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Anchored Bottom Footer */}
      <div
        style={{
          width: '100%',
          borderTop: `1px solid ${colors.sidebarHeaderBorder}`,
          padding: '14px 13px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: colors.sidebarBg,
          flexShrink: 0,
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {footerNavigationItems.map((item: NavItem) => {
          const active = isCurrentActive(item.path);
          const FooterIcon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '36px',
                padding: '0 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
                transition: 'all 0.15s ease',
                backgroundColor: active ? colors.sidebarActivePill : 'transparent',
                color: active ? '#FFFFFF' : '#8A99B5',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
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
              <FooterIcon
                size={16}
                strokeWidth={1.8}
                color={active ? '#60A5FA' : '#7E8DA6'}
              />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
