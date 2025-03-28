"use client";
import React, { MouseEventHandler, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  badge?: React.ReactNode;
}

interface DrawerDialogProps {
  trigger?: React.ReactNode;
  closeTrigger?: React.ReactNode;
  children: React.ReactNode;
  desktopBreakpoint?: string;
  headerProps: HeaderProps;
  footerContent?: React.ReactNode;
  // Add controlled state props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
interface AlertDialogProps {
  trigger?: React.ReactNode;
  closeTrigger?: React.ReactNode;
  children?: React.ReactNode;
  desktopBreakpoint?: string;
  headerProps: HeaderProps;
  footerContent?: React.ReactNode;
  // Add controlled state props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: MouseEventHandler<HTMLButtonElement>;
}

export const AlertDialogHeaderContent: React.FC<HeaderProps> = ({
  title,
  badge,
  subtitle,
}) => {
  return (
    <AlertDialogHeader>
      <div className="flex flex-row items-center gap-6">
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {badge}
      </div>
      {subtitle && <AlertDialogDescription>{subtitle}</AlertDialogDescription>}
    </AlertDialogHeader>
  );
};

export const DialogHeaderContent: React.FC<HeaderProps> = ({
  title,
  badge,
  subtitle,
}) => {
  return (
    <DialogHeader>
      <div className="flex flex-row items-center  gap-6">
        <DialogTitle>{title}</DialogTitle>
        {badge}
      </div>
      {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
    </DialogHeader>
  );
};

export const DrawerHeaderContent: React.FC<HeaderProps> = ({
  title,
  badge,
  subtitle,
}) => {
  return (
    <DrawerHeader className="flex flex-col items-start">
      <div className="flex flex-row items-center gap-6">
        <DrawerTitle>{title}</DrawerTitle>
        {badge}
      </div>
      {subtitle && <DrawerDescription>{subtitle}</DrawerDescription>}
    </DrawerHeader>
  );
};
export function AlertDeleteDialog({
  trigger,
  children,
  onAction,
  headerProps,
  footerContent,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeaderContent {...headerProps} />
        {children}
        <AlertDialogFooter>
          {footerContent ? footerContent : null}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export function ResponsiveDrawerDialog({
  trigger,
  closeTrigger,
  children,
  desktopBreakpoint = "(min-width: 768px)",
  headerProps,
  footerContent,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DrawerDialogProps) {
  // Use internal state if not controlled externally
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
        <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
          <DialogHeaderContent {...headerProps} />
          {children}
          <DialogFooter>
            {footerContent ? footerContent : null}
            {closeTrigger ? (
              <DialogClose asChild>{closeTrigger}</DialogClose>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeaderContent {...headerProps} />
        <ScrollArea className="h-auto overflow-y-auto px-4">
          {children}
        </ScrollArea>
        <DrawerFooter>
          {footerContent ? footerContent : null}
          {closeTrigger ? (
            <DrawerClose asChild>{closeTrigger}</DrawerClose>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
