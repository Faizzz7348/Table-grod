/**
 * Performance Monitoring Utilities
 * Memantau performa aplikasi di production
 */

// Check if running in production
export const isProduction = import.meta.env.PROD;

// Performance monitoring class
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0
    };
    
    if (typeof window !== 'undefined' && isProduction) {
      this.init();
    }
  }

  init() {
    // Measure page load time
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        this.metrics.pageLoad = perfData.loadEventEnd - perfData.fetchStart;
      }

      // First Paint and First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });

      // Log metrics in production (can be sent to analytics)
      if (isProduction) {
        this.logMetrics();
      }
    });

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if LCP is not supported
      }
    }
  }

  logMetrics() {
    console.log('📊 Performance Metrics:', {
      'Page Load': `${this.metrics.pageLoad.toFixed(2)}ms`,
      'First Paint': `${this.metrics.firstPaint.toFixed(2)}ms`,
      'First Contentful Paint': `${this.metrics.firstContentfulPaint.toFixed(2)}ms`,
      'Largest Contentful Paint': `${this.metrics.largestContentfulPaint.toFixed(2)}ms`
    });

    // Here you can send metrics to your analytics service
    // Example: sendToAnalytics(this.metrics);
  }

  getMetrics() {
    return this.metrics;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (!isProduction && renderTime > 16) { // Warn if render takes > 16ms (60fps)
      console.warn(`⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  };
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if device has good performance
 */
export const hasGoodPerformance = () => {
  if (typeof navigator === 'undefined') return true;
  
  // Check for hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check for device memory (in GB)
  const memory = navigator.deviceMemory || 4;
  
  // Check for connection type
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // Consider device as having good performance if:
  // - Has 4+ CPU cores
  // - Has 4GB+ RAM
  // - Has 4g or better connection
  return cores >= 4 && memory >= 4 && (effectiveType === '4g' || effectiveType === 'wifi');
};

/**
 * Optimize images based on device capabilities
 */
export const getOptimalImageQuality = () => {
  const hasGoodPerf = hasGoodPerformance();
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = connection?.saveData || false;
  
  if (saveData) return 'low'; // User wants to save data
  if (!hasGoodPerf) return 'medium';
  return 'high';
};

/**
 * Log performance in development only
 */
export const devLog = (...args) => {
  if (!isProduction) {
    console.log(...args);
  }
};

export default {
  performanceMonitor,
  measureRenderTime,
  debounce,
  throttle,
  hasGoodPerformance,
  getOptimalImageQuality,
  devLog,
  isProduction
};
