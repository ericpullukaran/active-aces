"use client"

import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import TemplateCard from "./TemplateCard"
import { useInfiniteTemplates } from "~/lib/utils/useInfiniteTemplate"

export default function TemplatesCarousel() {
  const templatesQuery = useInfiniteTemplates({
    limit: 10,
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

  if (!templatesQuery.templates.length) {
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
          loop: templatesQuery.templates.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent>
          {templatesQuery.templates.map((template) => (
            <CarouselItem key={template.id} className="basis-[200px]">
              <TemplateCard template={template} />
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
