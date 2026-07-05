import { describe, expect, it } from 'vitest';
import {
  shadowElevationOrder,
  shadowOrder,
  shadowTokens,
  shadowTopOrder,
} from './scale';

describe('shadowTokens', () => {
  it('includes every token in shadowOrder exactly once', () => {
    expect(new Set(shadowOrder).size).toBe(shadowOrder.length);
    expect([...shadowOrder].sort()).toEqual(
      Object.keys(shadowTokens).sort(),
    );
  });

  it('has matching name, utility, and cssVar for each token', () => {
    for (const [key, token] of Object.entries(shadowTokens)) {
      expect(token.name).toBe(key);
      expect(token.utility).toBe(`shadow-${key}`);
      expect(token.cssVar).toBe(`--shadow-${key}`);
      expect(token.light).toMatch(/\S/);
      expect(token.dark).toMatch(/\S/);
      expect(token.description).toMatch(/\S/);
    }
  });

  it('splits elevation and top scales without overlap (except shared catalog)', () => {
    expect([...shadowElevationOrder]).toEqual([
      'none',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ]);
    expect([...shadowTopOrder]).toEqual([
      'top-xs',
      'top-sm',
      'top-md',
      'top-lg',
    ]);
    for (const name of shadowTopOrder) {
      expect(shadowTokens[name].group).toBe('top');
    }
  });

  it('uses non-none values for elevation shadows in both modes', () => {
    for (const name of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      expect(shadowTokens[name].light).not.toBe('none');
      expect(shadowTokens[name].dark).not.toBe('none');
    }
  });
});
