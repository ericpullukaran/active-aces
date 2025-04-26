"use client"

import React, { useState } from "react"
import { useMediaQuery } from "@react-hook/media-query"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer"

export const MOBILE_VIEWPORT = "(max-width: 640px)"

type InternalResponsiveDialogProps = {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  title: string
  description?: string
  onClose?: (dismiss?: boolean) => void
}

type CoreResponsiveDialogProps = {
  title: string
  isOpen?: boolean
  description?: string
  onClose?: (dismiss?: boolean) => void
}

type ResponsiveDialogProps = {
  renderTrigger?: (props: InternalResponsiveDialogProps) => React.ReactNode
  renderContent: (props: InternalResponsiveDialogProps) => React.ReactNode
  renderFooter?: (props: InternalResponsiveDialogProps) => React.ReactNode
} & CoreResponsiveDialogProps

const ResponsiveDialog = (props: ResponsiveDialogProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  const isOpen = props.isOpen ?? internalIsOpen

  const openDialog = () => setInternalIsOpen(true)
  const closeDialog = (dismiss?: boolean) => {
    props.onClose?.(dismiss)
    setInternalIsOpen(false)
  }

  return (
    <>
      {props.renderTrigger?.({ ...props, isOpen, openDialog, closeDialog })}
      <ResponsiveDialogCore
        title={props.title}
        description={props.description}
        isOpen={isOpen}
        closeDialog={closeDialog}
        content={props.renderContent({
          ...props,
          isOpen,
          openDialog,
          closeDialog,
        })}
        footer={props.renderFooter?.({
          ...props,
          isOpen,
          openDialog,
          closeDialog,
        })}
      />
    </>
  )
}

type ResponsiveDialogCoreProps = {
  isOpen: boolean
  closeDialog: (dismiss?: boolean) => void
  title: string
  description?: string
  content: React.ReactNode | undefined
  footer?: React.ReactNode | undefined
}

const ResponsiveDialogCore = ({
  isOpen,
  closeDialog,
  title,
  description,
  content,
  footer,
}: ResponsiveDialogCoreProps) => {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)

  return isMobile ? (
    <Drawer
      open={isOpen}
      noBodyStyles={true}
      preventScrollRestoration={false}
      onClose={() => closeDialog(true)}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="overflow-scroll">{content}</div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen}>
      <DialogContent onClose={() => closeDialog(true)}>
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export default ResponsiveDialog
