declare const brand: unique symbol;

export type Brand<T, TBrand> = T & {
  [brand]: TBrand;
};

// Re-export types from separate files for backward compatibility
export * from './socket.types.js';
export * from './api-validation.types.js';
