/**
 * StatsChart Component
 *
 * A responsive and accessible ECharts component for visualizing todo statistics
 * using a Pie Nightingale chart with modern styling and interactions.
 *
 * Features:
 * - Responsive design with mobile optimizations
 * - Accessibility support with ARIA labels and keyboard navigation
 * - Interactive tooltips with detailed information
 * - Smooth animations and hover effects
 * - Memoized for optimal performance
 */

import React, { memo, useMemo, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "../../ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";

// Types
interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress?: number;
}

interface StatsChartProps {
  /** Statistics data for the chart */
  stats: TodoStats;
  /** Chart height in pixels */
  height?: number;
  /** Whether to show the title */
  showTitle?: boolean;
  /** Chart title */
  title?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Callback when chart is ready */
  onChartReady?: (echarts: unknown) => void;
  /** Callback when chart segment is clicked */
  onSegmentClick?: (data: {
    name: string;
    value: number;
    percentage: number;
  }) => void;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
}

// Constants
const CHART_COLORS = {
  completed: "#10b981", // green-500
  pending: "#f59e0b", // yellow-500
  inProgress: "#3b82f6", // blue-500
  total: "#6b7280", // gray-500
};

const CHART_CONFIG = {
  animationDuration: 1000,
  animationEasing: "cubicOut",
  radius: ["20%", "70%"],
  center: ["50%", "50%"],
  roseType: "area", // Nightingale chart type
} as const;

/**
 * StatsChart Component
 *
 * Renders an interactive Pie Nightingale chart for todo statistics
 * using ECharts with modern styling and accessibility features.
 */
export const StatsChart: React.FC<StatsChartProps> = memo(
  ({
    stats,
    height = 400,
    showTitle = true,
    title = "Estadísticas de Tareas",
    isLoading = false,
    error = null,
    onChartReady,
    onSegmentClick,
    className = "",
    ariaLabel = "Gráfico de estadísticas de tareas",
  }) => {
    // Memoized chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
      const data = [];

      if (stats.completed > 0) {
        data.push({
          value: stats.completed,
          name: "Completadas",
          itemStyle: { color: CHART_COLORS.completed },
        });
      }

      if (stats.pending > 0) {
        data.push({
          value: stats.pending,
          name: "Pendientes",
          itemStyle: { color: CHART_COLORS.pending },
        });
      }

      if (stats.inProgress && stats.inProgress > 0) {
        data.push({
          value: stats.inProgress,
          name: "En Progreso",
          itemStyle: { color: CHART_COLORS.inProgress },
        });
      }

      return data;
    }, [stats]);

    // Memoized chart options for optimal performance
    const chartOptions = useMemo(() => {
      const config: Record<string, unknown> = {
        aria: {
          enabled: true,
          decal: {
            show: true,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: (params: {
            name: string;
            value: number;
            color: string;
          }) => {
            const percentage = ((params.value / stats.total) * 100).toFixed(1);
            return `
            <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="width: 12px; height: 12px; background: ${params.color}; border-radius: 2px; margin-right: 8px;"></div>
                <span style="font-weight: 600; color: #1f2937;">${params.name}</span>
              </div>
              <div style="color: #6b7280; font-size: 14px;">
                <div>Cantidad: <span style="font-weight: 500; color: #1f2937;">${params.value}</span></div>
                <div>Porcentaje: <span style="font-weight: 500; color: #1f2937;">${percentage}%</span></div>
              </div>
            </div>
          `;
          },
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          borderRadius: 8,
          textStyle: {
            color: "#1f2937",
            fontSize: 14,
          },
        },
        legend: {
          orient: "vertical",
          left: "left",
          top: "middle",
          itemGap: 20,
          textStyle: {
            color: "#374151",
            fontSize: 13,
            fontWeight: 500,
          },
          icon: "circle",
          itemWidth: 12,
          itemHeight: 12,
        },
        series: [
          {
            name: "Estadísticas de Tareas",
            type: "pie",
            radius: CHART_CONFIG.radius,
            center: CHART_CONFIG.center,
            roseType: CHART_CONFIG.roseType,
            data: chartData,

            // Animation configuration
            animationType: "scale",
            animationEasing: CHART_CONFIG.animationEasing,
            animationDelay: (idx: number) => idx * 100,
            animationDuration: CHART_CONFIG.animationDuration,

            // Label configuration
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{d}%",
              fontSize: 12,
              color: "#374151",
              fontWeight: 500,
            },

            // Label line configuration
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              smooth: true,
            },

            // Item style configuration
            itemStyle: {
              borderRadius: 4,
              borderColor: "#ffffff",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },

            // Emphasis (hover) configuration
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.2)",
              },
              label: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
          },
        ],

        // Responsive configuration
        media: [
          {
            query: { maxWidth: 768 },
            option: {
              title: {
                textStyle: { fontSize: 16 },
                subtextStyle: { fontSize: 12 },
              },
              series: [
                {
                  radius: ["15%", "60%"],
                  label: { fontSize: 10 },
                  labelLine: { length: 10, length2: 5 },
                },
              ],
              legend: {
                orient: "horizontal",
                bottom: "2%",
                itemGap: 15,
                textStyle: { fontSize: 11 },
              },
            },
          },
        ],
      };

      if (showTitle) {
        config.title = {
          text: title,
          subtext: `Total: ${stats.total} tareas`,
          left: "center",
          top: "5%",
          textStyle: {
            fontSize: 18,
            fontWeight: 600,
            color: "#1f2937",
          },
          subtextStyle: {
            fontSize: 14,
            color: "#6b7280",
          },
        };
      }

      return config;
    }, [chartData, stats.total, showTitle, title]);

    // Chart ready callback
    const handleChartReady = useCallback(
      (echarts: unknown) => {
        console.log("StatsChart is ready", echarts);
        onChartReady?.(echarts);
      },
      [onChartReady]
    );

    // Chart click callback
    const handleChartClick = useCallback(
      (params: { name: string; value: number }) => {
        if (onSegmentClick) {
          const percentage = (params.value / stats.total) * 100;
          onSegmentClick({
            name: params.name,
            value: params.value,
            percentage: parseFloat(percentage.toFixed(1)),
          });
        }
      },
      [onSegmentClick, stats.total]
    );

    // Loading state
    if (isLoading) {
      return (
        <Card className={`p-6 bg-white border-gray-200 shadow-sm ${className}`}>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2 text-gray-500">
              <BarChart3 className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-medium">Cargando gráfico...</span>
            </div>
          </div>
        </Card>
      );
    }

    // Error state
    if (error) {
      return (
        <Card className={`p-6 bg-white border-gray-200 shadow-sm ${className}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Error al cargar el gráfico</p>
              <p className="text-xs text-gray-500 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      );
    }

    // Empty state
    if (stats.total === 0) {
      return (
        <Card className={`p-6 bg-white border-gray-200 shadow-sm ${className}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">No hay datos para mostrar</p>
              <p className="text-xs text-gray-400 mt-1">
                Crea tu primera tarea para ver las estadísticas
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card
        className={`p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      >
        <div role="img" aria-label={ariaLabel} tabIndex={0}>
          <ReactECharts
            option={chartOptions}
            style={{ height, width: "100%" }}
            onChartReady={handleChartReady}
            onEvents={{
              click: handleChartClick,
            }}
            opts={{
              renderer: "canvas",
              locale: "ES",
            }}
          />
        </div>
      </Card>
    );
  }
);

StatsChart.displayName = "StatsChart";

export default StatsChart;
