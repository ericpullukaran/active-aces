import { type MeasurementMetric, MeasurementType } from "~/lib/db/types"
import { type ChartConfig } from "~/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, LabelList } from "recharts"
import { ChartContainer, ChartTooltip } from "~/components/ui/chart"
import { type Doc } from "../db"
import { getFieldKeys, MEASUREMENT_FIELDS } from "./measurement"
import { ChartLegend, ChartLegendContent } from "~/components/ui/chart"

export interface ChartDataPoint {
  setLabel: string
  setNumber: number
  [K: string]: string | number
}

interface TooltipPayload {
  color: string
  dataKey: string
  value: number
  payload: ChartDataPoint
}

interface ChartTypeConfig {
  renderChart: (
    data: ChartDataPoint[],
    config: ChartConfig,
    fieldKeys: MeasurementMetric[],
  ) => React.ReactNode
  renderTooltip: (
    active: boolean,
    payload: TooltipPayload[],
    label: string,
    fieldKeys: MeasurementMetric[],
  ) => React.ReactNode | null
}

const CHART_COLORS = {
  weight: "var(--chart-1)",
  reps: "var(--chart-2)",
  assistedReps: "var(--chart-3)",
  time: "var(--chart-4)",
  distance: "var(--chart-5)",
} satisfies Record<MeasurementMetric, string>

function transformSetsToChartData(
  sets: Doc<"exerciseSets">[],
  fieldKeys: MeasurementMetric[],
): ChartDataPoint[] {
  return sets.map((set, index) => {
    const dataPoint: ChartDataPoint = {
      setLabel: `Set ${index + 1}`,
      setNumber: index + 1,
    }

    fieldKeys.forEach((key) => {
      dataPoint[key] = set[key] ?? 0
    })

    return dataPoint
  })
}

function getGenericChartConfig(fieldKeys: MeasurementMetric[]): ChartConfig {
  const config: ChartConfig = {}

  fieldKeys.forEach((key) => {
    config[key] = {
      label: MEASUREMENT_FIELDS[key].label,
      color: CHART_COLORS[key],
    }
  })

  return config
}

const weightRepsConfig: ChartTypeConfig = {
  renderChart: (data, config, fieldKeys) => (
    <ChartContainer config={config} className="min-h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 24, right: 24, top: 30, bottom: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="setNumber" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={({ active, payload, label }) => {
            return weightRepsConfig.renderTooltip(
              active ?? false,
              (payload as TooltipPayload[]) ?? [],
              label,
              fieldKeys,
            )
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {fieldKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="linear"
            stroke={CHART_COLORS[key]}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS[key], strokeWidth: 2, r: 4 }}
            animationDuration={300}
            animationEasing="ease-out"
          >
            <LabelList
              dataKey={key}
              position="top"
              offset={12}
              className="fill-foreground"
              formatter={(value: number) => {
                if (key === "weight") return `${value}kg`
                if (key === "reps") return `${value}`
              }}
            />
          </Line>
        ))}
      </LineChart>
    </ChartContainer>
  ),

  renderTooltip: (active, payload, label, fieldKeys) => {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload
    return (
      <div className="bg-background rounded-lg border p-3 shadow-lg">
        <p className="mb-2 font-medium">{data.setLabel}</p>
        <div className="space-y-1">
          {fieldKeys.map((key) => {
            const value = data[key] as number
            if (value <= 0) return null

            const payloadItem = payload.find((p) => p.dataKey === key)
            const unit = key === "weight" ? "kg" : ""

            return (
              <div key={key} className="flex justify-between gap-4">
                <div className="h-2 w-2" style={{ backgroundColor: payloadItem?.color }}></div>
                <span className="text-muted-foreground">{MEASUREMENT_FIELDS[key].label}:</span>
                <span className="font-medium">
                  {value}
                  {unit}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}

// No-op configuration for unsupported types
const noOpConfig: ChartTypeConfig = {
  renderChart: () => (
    <div className="text-muted-foreground py-8 text-center">
      Sorry, exercise type is not supported yet!
    </div>
  ),
  renderTooltip: () => null,
}

const CHART_CONFIGS = {
  [MeasurementType.WEIGHT_REPS]: weightRepsConfig,
  [MeasurementType.REPS]: noOpConfig,
  [MeasurementType.TIME]: noOpConfig,
  [MeasurementType.TIME_DISTANCE]: noOpConfig,
  [MeasurementType.WEIGHT_DURATION]: noOpConfig,
  [MeasurementType.WEIGHT_DISTANCE]: noOpConfig,
} satisfies Record<MeasurementType, ChartTypeConfig>

export interface ChartConfigResult {
  chartData: ChartDataPoint[]
  chartConfig: ChartConfig
  renderChart: () => React.ReactNode
}

export function getChartConfigForSets(
  measurementType: MeasurementType,
  sets: Doc<"exerciseSets">[],
): ChartConfigResult {
  const config = CHART_CONFIGS[measurementType] || noOpConfig
  const fieldKeys = getFieldKeys(measurementType, {
    enableAssistedReps: sets.some((set) => set.assistedReps && set.assistedReps > 0),
    enableWeightedReps: sets.some((set) => set.weight && set.weight > 0),
  })
  const chartData = transformSetsToChartData(sets, fieldKeys)
  const chartConfig = getGenericChartConfig(fieldKeys)

  return {
    chartData,
    chartConfig,
    renderChart: () => config.renderChart(chartData, chartConfig, fieldKeys),
  }
}
