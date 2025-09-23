"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIGuild } from "discord-api-types/v10";
import { useState } from "react";

import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface ServerInfoProps {
  apiGuild: APIGuild;
  isDirty: boolean;
  setDirtyAction: Dispatch<SetStateAction<boolean>>;
}
export const ServerInfo = ({
  apiGuild,
  isDirty,
  setDirtyAction,
}: ServerInfoProps) => {
  const initialName = apiGuild.name || "";
  const initialDescription = apiGuild.description ?? "";
  const [name, setName] = useState<string>(initialName);
  const [description, setDescription] = useState<string>(initialDescription);

  const [invite, setInvite] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { data, isPending, error, mutate } = useMutation({
    mutationKey: ["modify-guild-info"],
    mutationFn: async () => {
      const req = await client.dash.setGuildInfo.$post(
        {
          guildId: apiGuild.id,
          name,
          description,
          initialName,
          initialDescription,
        },
        undefined
      );

      return await req.json();
    },
  });

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Changes saved");
        setDirtyAction(false);
        queryClient.invalidateQueries({ queryKey: ["get-guild-info"] });
        queryClient.invalidateQueries({
          queryKey: ["get-header-info"],
        });
      } else if (!data.success) {
        toast.error(data.error);
      }
    }

    if (error) {
      toast.error(error.message);
    }
  }, [data, error]);

  useEffect(() => {
    setName(apiGuild.name || "");
    setDescription(apiGuild.description ?? "");
  }, [apiGuild.name, apiGuild.description]);

  const isDisabled =
    isPending || (name === initialName && description === initialDescription);

  return (
    <div className="flex flex-col flex-1 w-full gap-4 justify-center">
      <Heading className="text-base font-semibold tracking-wide uppercase text-muted-foreground">
        Server information
      </Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="flex flex-col gap-5 w-full"
      >
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value !== initialName) {
              setDirtyAction(true);
            } else {
              setDirtyAction(false);
            }
          }}
        />
        <Input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value !== initialDescription) {
              setDirtyAction(true);
            } else {
              setDirtyAction(false);
            }
          }}
        />
        <div className="flex w-full items-center justify-end pt-2">
          <Button
            type="submit"
            disabled={isDisabled}
            variant="gradient"
            className="min-w-32"
          >
            {isDisabled ? "No changes" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};
