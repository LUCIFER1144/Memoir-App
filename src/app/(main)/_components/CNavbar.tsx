"use client";

import React from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Menu,
  Star,
  Ellipsis,
  MessageSquareText,
  Share,
  Sun,
  Moon,
  StarOff,
  Trash2Icon,
  Proportions,
} from "lucide-react";
import { Title } from "@/app/(main)/_components/title";
import { useTheme } from "next-themes";
import { useSidebar } from "../contexts/SidebarContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Publish } from "./publish";
import { useLocalization } from "../contexts/LocalizationContext";
import { toast } from "sonner";

export const CNavbar = ({ document }: { document: Doc<"documents"> }) => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const { dict } = useLocalization();

  const update = useMutation(api.documents.update);
  const archive = useMutation(api.documents.archive);

  const id = document._id
  const onArchive = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id });
    toast.promise(promise, {
      loading: dict.main.components.item.toastArchiveLoading,
      success: dict.main.components.item.toastArchiveSuccess,
      error: dict.main.components.item.toastArchiveError,
    });
  };

  const toggleFav = () => {
    update({
      id: document._id,
      isFav: !document.isFav,
    });
  };

  const toggleEditorWidth = () => {
    update({
      id: document._id,
      isFullWidth: !document.isFullWidth,
    });
  };

  return (
    // <div className=" h-screen bg-background text-foreground w-screen">
    <div
      className={`flex items-center h-11 top-0 end-0 bg-opacity-50 backdrop-blur-lg drop-shadow-md bg-background text-default-foreground border-b border-default-200 justify-between`}
    >
      {/* items on the left */}
      <div className="flex items-center gap-x-2 ps-2">
        <Button onClick={toggleSidebar} variant="light" isIconOnly size="sm">
          <Menu size={20} />
          {/* <PanelLeft size={20} /> */}
        </Button>
        <Title initialData={document} />
      </div>

      {/* items on the right */}
      <div className="flex items-center gap-x-2 pe-2">
        <Button variant="light" isIconOnly size="sm">
          <MessageSquareText size={20} />
        </Button>
        <Publish initialData={document} />
        <Button
          variant="light"
          isIconOnly
          size="sm"
          onClick={() => {
            toggleFav();
          }}
        >
          {document.isFav ? <StarOff size={20} /> : <Star size={20} />}
        </Button>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <ThemeIcon size={20} />
        </Button>
        <Dropdown offset={12}>
          <DropdownTrigger>
            <Button variant="light" isIconOnly size="sm">
              <Ellipsis size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
            <DropdownItem
              onClick={() => {
                toggleEditorWidth();
              }}
              key="width"
              shortcut="⌘⇧I"
              startContent={<Proportions />}
            >
              {dict.main.components.cnavbar.toggleWidth}
            </DropdownItem>
            <DropdownItem
              onClick={onArchive as React.MouseEventHandler<HTMLElement>}
              key="delete"
              className="text-danger"
              color="danger"
              shortcut="⌘⇧D"
              startContent={<Trash2Icon />}
            >
              {dict.main.components.cnavbar.archive}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* <p>end of nav bar</p> */}
      </div>
    </div>
  );
};
