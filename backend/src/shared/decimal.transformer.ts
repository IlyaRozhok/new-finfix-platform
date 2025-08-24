export const DecimalTransformer = {
    to: (value: number | string) => value,
    from: (value: string | null) => (value == null ? null : Number(value)),
  };