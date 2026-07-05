import { describe, expect, it } from 'vitest';
import {
  zIndexClass,
  zIndexCssVar,
  zIndexOrder,
  zIndexTokens,
} from './scale';

describe('zIndexTokens', () => {
  it('lists every token once in ascending order', () => {
    expect(new Set(zIndexOrder).size).toBe(zIndexOrder.length);
    expect([...zIndexOrder].sort()).toEqual(Object.keys(zIndexTokens).sort());

    let prev = -Infinity;
    for (const name of zIndexOrder) {
      const value = zIndexTokens[name].value;
      expect(value).toBeGreaterThan(prev);
      prev = value;
    }
  });

  it('matches the product stacking scale', () => {
    expect(zIndexTokens.base.value).toBe(0);
    expect(zIndexTokens.raised.value).toBe(10);
    expect(zIndexTokens.dropdown.value).toBe(100);
    expect(zIndexTokens.sticky.value).toBe(200);
    expect(zIndexTokens.overlay.value).toBe(300);
    expect(zIndexTokens.modal.value).toBe(400);
    expect(zIndexTokens.toast.value).toBe(500);
    expect(zIndexTokens.tooltip.value).toBe(600);
  });

  it('helpers build class and CSS variable names', () => {
    expect(zIndexClass('modal')).toBe('z-modal');
    expect(zIndexCssVar('toast')).toBe('--z-index-toast');
  });
});
