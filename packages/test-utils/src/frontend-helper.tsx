/**
 * Frontend test helper: provides a renderWithProviders wrapper that
 * includes common React providers (QueryClient, Theme, etc.).
 *
 * Usage:
 *   import { renderWithProviders } from '@valorasec/test-utils';
 *   const { element, wrapper } = renderWithProviders(<MyComponent />);
 *
 * The TestWrapper can be composed with additional providers
 * by passing them through the options parameter.
 *
 * Note: This is a framework-agnostic base. For RTL-based rendering,
 * use with @testing-library/react render() and pass TestWrapper as wrapper.
 */

import React, { type ReactNode } from 'react';

export interface TestWrapperProps {
  children: ReactNode;
  /**
   * Additional providers to wrap the component with.
   * Each provider should be a component that accepts children.
   */
  providers?: Array<React.ComponentType<{ children: ReactNode }>>;
}

/**
 * A wrapper component that nests all providers around children.
 * Add project-specific providers (QueryClient, Theme, Router, etc.)
 * via the providers prop.
 */
export function TestWrapper({ children, providers = [] }: TestWrapperProps): React.ReactElement {
  if (providers.length === 0) {
    return React.createElement(React.Fragment, null, children);
  }

  // Nest providers from outermost to innermost
  let wrapped: React.ReactNode = children;
  for (let i = providers.length - 1; i >= 0; i--) {
    const Provider = providers[i]!;
    wrapped = React.createElement(Provider, null, wrapped);
  }

  return wrapped as React.ReactElement;
}

export interface RenderWithProvidersResult {
  /** The original element passed to render */
  element: React.ReactElement;
  /** The fully wrapped element with all providers applied */
  wrapper: React.ReactElement;
}

/**
 * Render a React element wrapped with common providers.
 *
 * @param element - The React element to render
 * @param options - Optional configuration
 * @param options.providers - Additional provider components to wrap around the element
 * @returns The rendered element and its provider-wrapped version
 *
 * @example
 * ```tsx
 * import { renderWithProviders } from '@valorasec/test-utils';
 * import { QueryProvider } from '../providers/query-provider';
 * import { ThemeProvider } from '../providers/theme-provider';
 *
 * const { wrapper } = renderWithProviders(<MyComponent />, {
 *   providers: [QueryProvider, ThemeProvider],
 * });
 * ```
 */
export function renderWithProviders(
  element: React.ReactElement,
  options: {
    providers?: Array<React.ComponentType<{ children: ReactNode }>>;
  } = {},
): RenderWithProvidersResult {
  const wrapper = React.createElement(TestWrapper, {
    providers: options.providers,
    children: element,
  } as TestWrapperProps);
  return { element, wrapper };
}
