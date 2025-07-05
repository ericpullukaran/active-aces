"use client"

import type { Transition } from "motion/react"
import type { ReactElement } from "react"
import { Children, cloneElement, useId } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "~/lib/utils"

type ChildrenType = {
  "data-id": string
  "data-checked"?: string
} & React.HTMLAttributes<HTMLElement>

type HoverInteractionHandler = {
  type: "hover"
  onChange: (newActiveId: string | null) => void
}

type ClickInteractionHandler = {
  type: "click"
  onChange: (newActiveId: string) => void
}

type InteractionHandler = HoverInteractionHandler | ClickInteractionHandler

type AnimatedBackgroundProps = {
  children: ReactElement<ChildrenType>[] | ReactElement<ChildrenType>
  value?: string
  activeClassName?: string
  transition?: Transition
  interactionHandler?: InteractionHandler
}

export default function AnimatedTabs({
  children,
  value,
  activeClassName,
  transition,
  interactionHandler,
}: AnimatedBackgroundProps) {
  const uniqueId = useId()

  return Children.map(children, (child, index) => {
    const id = child.props["data-id"]

    const interactionProps = (() => {
      if (!interactionHandler) return

      switch (interactionHandler.type) {
        case "hover":
          return {
            onMouseEnter: () => interactionHandler.onChange(id),
            onMouseLeave: () => interactionHandler.onChange(null),
          }
        case "click":
          return {
            onClick: () => interactionHandler.onChange(id),
          }
      }
    })()

    return cloneElement(
      child,
      {
        key: index,
        className: cn("relative", child.props.className),
        "aria-selected": value === id,
        "data-checked": value === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {value === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", activeClassName)}
              transition={transition}
              initial={{ opacity: value ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{child.props.children}</span>
      </>,
    )
  })
}
