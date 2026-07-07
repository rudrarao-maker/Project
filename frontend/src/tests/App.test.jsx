import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Basic Application Test', () => {
  it('should run a basic math test to confirm vitest setup', () => {
    expect(1 + 1).toBe(2);
  });
});
