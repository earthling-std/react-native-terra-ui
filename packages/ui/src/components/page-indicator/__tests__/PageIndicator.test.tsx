import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';

import type { PageIndicatorProps } from '../PageIndicator';
import { DotIndicator, PageIndicator, PillIndicator } from '../PageIndicator';

const scrollProgress = { value: 0.5 } as SharedValue<number>;

function assertVariantPropTypes() {
  const dot: PageIndicatorProps = {
    count: 4,
    current: 0,
    variant: 'dot',
    loading: true,
    vertical: true,
    loadingColor: 'content.disabled',
  };

  const pill: PageIndicatorProps = {
    count: 4,
    current: 0,
    activeColor: 'content.accent',
  };

  // @ts-expect-error loading is only on the dot variant
  const invalidPill: PageIndicatorProps = {
    count: 4,
    current: 0,
    loading: true,
  };

  // @ts-expect-error loadingColor is only on the dot variant
  const invalidPillLoadingColor: PageIndicatorProps = {
    count: 4,
    current: 0,
    loadingColor: 'content.disabled',
  };

  void dot;
  void pill;
  void invalidPill;
  void invalidPillLoadingColor;
}

void assertVariantPropTypes;

describe('PageIndicator', () => {
  it('renders pill with discrete current prop', () => {
    render(<PageIndicator count={4} current={1} />);
    expect(screen.root).toBeTruthy();
  });

  it('renders pill with scroll-linked current prop', () => {
    render(<PageIndicator count={4} current={scrollProgress} />);
    expect(screen.root).toBeTruthy();
  });

  it('renders pill variant vertically', () => {
    render(<PageIndicator count={4} current={1} vertical />);
    expect(screen.root).toBeTruthy();
  });

  it('renders dot variant vertically with loading', () => {
    render(
      <PageIndicator count={4} current={1} variant="dot" vertical loading />
    );
    expect(screen.root).toBeTruthy();
  });
});

describe('DotIndicator', () => {
  it('renders with current index', () => {
    render(<DotIndicator count={4} current={1} />);
    expect(screen.root).toBeTruthy();
  });

  it('renders with scroll-linked current', () => {
    render(<DotIndicator count={4} current={scrollProgress} />);
    expect(screen.root).toBeTruthy();
  });
});

describe('PillIndicator', () => {
  it('renders with current index', () => {
    render(<PillIndicator count={4} current={1} />);
    expect(screen.root).toBeTruthy();
  });

  it('renders with scroll-linked current', () => {
    render(<PillIndicator count={4} current={scrollProgress} />);
    expect(screen.root).toBeTruthy();
  });

  it('renders vertically', () => {
    render(<PillIndicator count={4} current={1} vertical />);
    expect(screen.root).toBeTruthy();
  });
});
