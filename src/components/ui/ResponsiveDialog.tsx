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
import { cn, MOBILE_VIEWPORT } from "~/lib/utils"

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
  headerAction?: (props: InternalResponsiveDialogProps) => React.ReactNode
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
        headerAction={props.headerAction?.({
          ...props,
          isOpen,
          openDialog,
          closeDialog,
        })}
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
  headerAction?: React.ReactNode
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
  headerAction,
}: ResponsiveDialogCoreProps) => {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)

  return isMobile ? (
    <Drawer
      open={isOpen}
      noBodyStyles={true}
      preventScrollRestoration={false}
      onClose={() => closeDialog(true)}
    >
      <DrawerContent onClick={(e) => e.stopPropagation()} onClose={() => closeDialog(true)}>
        <DrawerHeader className={cn("flex flex-row items-center gap-2")}>
          <div className={cn("flex-1 text-center", headerAction && "text-left")}>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </div>
          {headerAction && <div className="ml-auto">{headerAction}</div>}
        </DrawerHeader>
        <div className="overflow-scroll">{content}</div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen}>
      <DialogContent
        hideCloseButton={!!headerAction}
        onClick={(e) => e.stopPropagation()}
        onClose={() => closeDialog(true)}
      >
        <DialogHeader className={cn("flex flex-row text-left")}>
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          {headerAction && <div className="ml-auto">{headerAction}</div>}
        </DialogHeader>
        <div className="max-h-96 overflow-scroll">{content}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export default ResponsiveDialog
