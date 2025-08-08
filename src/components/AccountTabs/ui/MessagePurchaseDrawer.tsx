"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusCircle } from "lucide-react";

export const MessagePurchaseDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="size-4" /> Get More
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center">
        <div className="flex flex-col px-4 py-8 gap-2 items-center max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Purchase additional message bundles</DrawerTitle>
            <DrawerDescription>
              Purchase a bundle of additional messages to use when your daily
              limits run out, instead of upgrading your plan.
            </DrawerDescription>
          </DrawerHeader>

          {/* Additional message bundles displayed here */}
          {/* Clicking on one takes you to the checkout for that bundle */}
          <div className="flex flex-col gap-2">
            <p className="text-pretty text-sm">
              Currently there are no additional message bundles for purchase. We
              aim to introduce some very soon
            </p>
          </div>

          <DrawerFooter>
            <p className="text-pretty text-xs text-muted-foreground">
              Purchases are final and stay on your account until you delete it.
            </p>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
