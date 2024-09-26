import { renderHook } from '@testing-library/react-hooks';
import { useCarbonFootprint } from '../useCarbonFootprint';

// Mock for @tgwf/co2
jest.mock('@tgwf/co2', () => ({
  co2: jest.fn().mockImplementation(() => ({
    perByte: jest.fn().mockReturnValue(42) // Mockeamos un valor de emisión constante
  }))
}));

// Mock for PerformanceObserver
const disconnect = jest.fn();
const performanceObserverMock: any = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect,
  supportedTypes: ['resource'],
}));

// Mock for performance.getEntriesByType
beforeEach(() => {
  global.performance.getEntriesByType = jest.fn().mockReturnValue([
    { transferSize: 1000 },
    { transferSize: 2000 }
  ]);

  global.PerformanceObserver = performanceObserverMock;
});

describe('useCarbonFootprint', () => {
  it('Should calculate and return the carbon footprint correctly', () => {
    const { result } = renderHook(() => useCarbonFootprint());

    const [carbonFootprint] = result.current;
    expect(carbonFootprint).toBe(42);
  });

  it('Should keep the transfer size correctly', () => {
    const { result } = renderHook(() => useCarbonFootprint());

    const [_carbonFootprint, bytesTransferred] = result.current;
    expect(bytesTransferred).toBe(3000);
  });

  it('Should call performance.getEntriesByType and PerformanceObserver', () => {
    renderHook(() => useCarbonFootprint());

    expect(global.performance.getEntriesByType).toHaveBeenCalledWith('resource');
    expect(global.PerformanceObserver).toHaveBeenCalled();
  });

  it('should disconnect PerformanceObserver when unmounted', () => {
    const { unmount } = renderHook(() => useCarbonFootprint());
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
