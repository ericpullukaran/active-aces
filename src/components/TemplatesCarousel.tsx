"use client"

import React from "react"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { Dumbbell } from "lucide-react"
import TemplateCard from "./TemplateCard"

export const templatesQueryKey: readonly string[] = ["workout-templates"]

export default function TemplatesCarousel() {
  const trpc = useTRPC()

  const templatesQuery = useQuery({
    ...trpc.workouts.historyInfinite.queryOptions({
      limit: 10,
      isTemplate: true,
    }),
    queryKey: [templatesQueryKey],
  })

  if (templatesQuery.isError) {
    return (
      <div className="bg-card h-28 animate-pulse rounded-lg">
        <div className="flex h-full flex-col justify-center">
          <p className="text-muted-foreground text-center">Error loading templates</p>
        </div>
      </div>
    )
  }

  if (templatesQuery.isLoading) {
    return <div className="bg-card h-28 animate-pulse rounded-lg"></div>
  }

  if (!templatesQuery.data?.items.length) {
    return (
      <div>
        <h3 className="mb-3 text-lg font-semibold">Workout Templates</h3>
        <div className="bg-card h-28 rounded-lg">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground text-center">No templates found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h3 className="mb-3 text-lg font-semibold">Workout Templates</h3>
      <Carousel
        opts={{
          align: "start",
          loop: templatesQuery.data.items.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent>
          {templatesQuery.data.items.map((template) => (
            <CarouselItem key={template.id} className="basis-[200px]">
              <TemplateCard template={template}>
                <div className="bg-card flex h-28 flex-col justify-between rounded-2xl border p-4 shadow-sm">
                  <div>
                    <h4 className="line-clamp-2 text-base font-medium">{template.name}</h4>
                    <div className="text-muted-foreground mt-2 flex items-center text-sm">
                      <Dumbbell className="mr-1 h-4 w-4" />
                      {template.workoutExercises.length} exercise
                      {template.workoutExercises.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </TemplateCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-2 flex justify-end gap-1">
          <CarouselPrevious className="static translate-x-0 translate-y-0" />
          <CarouselNext className="static translate-x-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  )
}
