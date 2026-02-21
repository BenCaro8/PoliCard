import { useEffect } from 'react';
import { KeyboardKey } from '../types/Keyboard';

export type KeyHandler = {
  key: KeyboardKey | KeyboardKey[];
  handler: (event: KeyboardEvent, context: NavigationContext) => void;
  preventDefault?: boolean;
};

export type NavigationElement = {
  ref: React.RefObject<HTMLElement | null>;
  name: string;
  getChildren?: () => HTMLElement[];
  onAction?: (index?: number) => void;
};

export type NavigationContext = {
  activeElement: Element | null;
  elements: NavigationElement[];
  getElementIndex: (
    element: Element | null,
  ) => { elementIndex: number; childIndex: number } | null;
  focusElement: (elementIndex: number, childIndex?: number) => void;
  getCurrentChildIndex: (elementIndex: number) => number;
};

type Props = {
  elements: NavigationElement[];
  keyHandlers: KeyHandler[];
  dependencies?: unknown[];
};

export const useKeyboardNavigation = ({ elements, keyHandlers }: Props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const getElementIndex = (
        element: Element | null,
      ): { elementIndex: number; childIndex: number } | null => {
        if (!element) return null;

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (el.ref.current === element) {
            return { elementIndex: i, childIndex: -1 };
          }
          if (el.getChildren && el.ref.current?.contains(element)) {
            const children = el.getChildren();
            const childIndex = children.indexOf(element as HTMLElement);
            if (childIndex !== -1) {
              return { elementIndex: i, childIndex };
            }
          }
        }
        return null;
      };

      const focusElement = (elementIndex: number, childIndex?: number) => {
        const element = elements[elementIndex];
        if (!element?.ref.current) return;

        if (
          childIndex !== undefined &&
          childIndex >= 0 &&
          element.getChildren
        ) {
          const children = element.getChildren();
          children[childIndex]?.focus();
        } else {
          element.ref.current.focus();
        }
      };

      const getCurrentChildIndex = (elementIndex: number): number => {
        const element = elements[elementIndex];
        if (!element?.getChildren || !activeElement) return -1;

        const children = element.getChildren();
        return children.indexOf(activeElement as HTMLElement);
      };

      const context: NavigationContext = {
        activeElement,
        elements,
        getElementIndex,
        focusElement,
        getCurrentChildIndex,
      };

      // Find and execute matching key handlers
      for (const keyHandler of keyHandlers) {
        const keys = Array.isArray(keyHandler.key)
          ? keyHandler.key
          : [keyHandler.key];
        if (keys.includes(event.key as KeyboardKey)) {
          if (keyHandler.preventDefault !== false) {
            event.preventDefault();
          }
          keyHandler.handler(event, context);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [elements, keyHandlers]);
};

// Helper functions for common navigation patterns
export const createNavigationHelpers = () => ({
  // Navigate up/down within a grid or list
  navigateVertically: (
    direction: 'up' | 'down',
    context: NavigationContext,
  ) => {
    const { activeElement, getElementIndex, focusElement } = context;
    if (!activeElement) return;

    const elementInfo = getElementIndex(activeElement);
    if (!elementInfo) return;

    const { elementIndex, childIndex } = elementInfo;
    const element = context.elements[elementIndex];

    if (childIndex >= 0 && element.getChildren) {
      // Navigate within children
      const children = element.getChildren();
      const newChildIndex =
        direction === 'up' ? childIndex - 1 : childIndex + 1;

      if (newChildIndex >= 0 && newChildIndex < children.length) {
        focusElement(elementIndex, newChildIndex);
      } else if (direction === 'up' && elementIndex > 0) {
        // Move to previous element
        focusElement(elementIndex - 1);
      } else if (
        direction === 'down' &&
        elementIndex < context.elements.length - 1
      ) {
        // Move to next element
        focusElement(elementIndex + 1);
      }
    } else {
      // Navigate between elements
      const newElementIndex =
        direction === 'up' ? elementIndex - 1 : elementIndex + 1;
      if (newElementIndex >= 0 && newElementIndex < context.elements.length) {
        const targetElement = context.elements[newElementIndex];
        if (direction === 'down' && targetElement.getChildren) {
          // Focus first child of next element
          focusElement(newElementIndex, 0);
        } else if (direction === 'up' && targetElement.getChildren) {
          // Focus last child of previous element
          const children = targetElement.getChildren();
          focusElement(newElementIndex, children.length - 1);
        } else {
          focusElement(newElementIndex);
        }
      }
    }
  },

  // Navigate left/right (for carousels or horizontal toggles)
  navigateHorizontally: (
    _direction: 'left' | 'right',
    context: NavigationContext,
    callback?: (elementIndex: number, childIndex?: number) => void,
  ) => {
    const { activeElement, getElementIndex } = context;
    if (!activeElement) return;

    const elementInfo = getElementIndex(activeElement);
    if (!elementInfo) return;

    const { elementIndex, childIndex } = elementInfo;
    callback?.(elementIndex, childIndex >= 0 ? childIndex : undefined);
  },

  // Execute action on current element
  executeAction: (context: NavigationContext) => {
    const { activeElement, getElementIndex } = context;
    if (!activeElement) return;

    const elementInfo = getElementIndex(activeElement);
    if (!elementInfo) return;

    const { elementIndex, childIndex } = elementInfo;
    const element = context.elements[elementIndex];
    element.onAction?.(childIndex >= 0 ? childIndex : undefined);
  },
});
