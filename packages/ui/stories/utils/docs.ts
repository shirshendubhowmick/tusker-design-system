/**
 * Storybook Args table "Default" column is filled from argTypes.table.defaultValue
 * (and/or react-docgen), not from CVA defaultVariants or function destructuring.
 * Use this helper on every prop that has a real default so Docs stays accurate.
 */
export function docsDefault(
  summary: string,
  options?: {
    /** Optional Args table type summary (e.g. `ReactNode`, `TextVariant`). */
    type?: string;
  },
): {
  table: {
    defaultValue: { summary: string };
    type?: { summary: string };
  };
} {
  return {
    table: {
      defaultValue: { summary },
      ...(options?.type ? { type: { summary: options.type } } : {}),
    },
  };
}
