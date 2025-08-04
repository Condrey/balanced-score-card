"use client";

import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import LoadingButton from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  organizationSchema,
  PositionSchema,
  positionSchema,
} from "@/lib/validations/others";
import { zodResolver } from "@hookform/resolvers/zod";
import { Organization, Position } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "@/components/ui/input";

interface BSCInitialDataFormProps {
  data: {
    positions: Position[];
    organizations: Organization[];
    position: Position | null;
    organization: Organization | null;
  };
  year: string;
}
export default function BSCInitialDataForm({
  data: { position, positions, organization, organizations },
  year,
}: BSCInitialDataFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const schema = z.object({
    position: positionSchema.optional(),
    organization: organizationSchema.required(),
    year: z.string(),
  });
  type Schema = z.infer<typeof schema>;
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: position
        ? ({
            ...position,
            duties: position.duties.map((d) => ({ value: d })),
          } as PositionSchema)
        : undefined,
      organization: organization!,
      year,
    },
  });
  const handleSubmit = (input: Schema) =>
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("position", input.position?.id!);
      params.set("organization", input.organization?.id!);
      params.set("year", input.year);
      router.push(pathname + "?" + params.toString());
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* <pre>{JSON.stringify(form.formState.errors,null,2)}</pre> */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial Year</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2025/2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!organizations && organizations.length ? (
          <FormField
            control={form.control}
            name="organization.id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Organization</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? organizations.find((org) => org.id === field.value)
                              ?.name
                          : "Select organization"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search organizations..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No organization found. Please consult the admin to add
                          organization.
                        </CommandEmpty>
                        <CommandGroup>
                          {organizations?.map((org) => (
                            <CommandItem
                              value={`${org.name} (${org.voteName})`}
                              key={org.id}
                              onSelect={() => {
                                form.setValue("organization", org);
                              }}
                            >
                              {org.name}{" "}
                              <span className="text-muted-foreground text-xs align-baseline inline">
                                ({org.voteName})
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  org.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <EmptyContainer message="The database has no organizations. Please contact the admin for further guidance" />
        )}
        {!!positions && positions.length ? (
          <FormField
            control={form.control}
            name="position.id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Position</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? positions.find(
                              (_position) => _position.id === field.value,
                            )?.jobTitle
                          : "Select position"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search positions..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No position found. Please consult the admin to add
                          position.
                        </CommandEmpty>
                        <CommandGroup>
                          {positions?.map((_position) => (
                            <CommandItem
                              value={`${_position.jobTitle} (${_position.salaryScale})`}
                              key={_position.id}
                              onSelect={() => {
                                form.setValue("position", {
                                  ..._position,
                                  duties: _position.duties.map((d) => ({
                                    value: d,
                                  })),
                                  reportsToId: _position.reportsToId || "",
                                } as PositionSchema);
                              }}
                            >
                              {_position.jobTitle}{" "}
                              <span className="text-muted-foreground text-xs align-baseline inline">
                                ({_position.salaryScale})
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  _position.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <EmptyContainer message="The database has no positions. Please contact the admin for further guidance" />
        )}
        <LoadingButton loading={isPending} className="w-full">
          Continue
        </LoadingButton>
      </form>
    </Form>
  );
}
