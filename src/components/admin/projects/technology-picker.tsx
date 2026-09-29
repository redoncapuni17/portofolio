"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input } from "@/components/ui/form";
import { createTechnology } from "@/lib/actions/projects";
import { cn } from "@/lib/utils/cn";
import type { Technology } from "@/types";

export function TechnologyPicker({
  technologies,
  selected,
  onChange,
}: {
  technologies: Technology[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [options, setOptions] = useState(technologies);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  const addTechnology = () => {
    const name = newName.trim();
    if (!name) return;
    setError(null);
    startTransition(async () => {
      const result = await createTechnology({ name, icon: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
      if (!result.ok || !result.data) {
        setError(result.ok ? "Could not add technology." : result.error);
        return;
      }
      const created = result.data;
      setOptions((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      onChange([...selected, created.id]);
      setNewName("");
    });
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-heading">Technologies</p>
      <div className="flex flex-wrap gap-2">
        {options.map((tech) => {
          const active = selected.includes(tech.id);
          return (
            <button
              key={tech.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(tech.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-ring",
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-body hover:border-accent-ring",
              )}
            >
              {tech.name}
            </button>
          );
        })}
        {options.length === 0 ? <p className="text-sm text-muted">No technologies yet. Add one below.</p> : null}
      </div>

      <div className="mt-3 flex max-w-sm gap-2">
        <Input
          aria-label="New technology"
          placeholder="Add a technology (e.g. GraphQL)"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTechnology();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addTechnology} disabled={pending || !newName.trim()}>
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
      <FieldError message={error ?? undefined} />
    </div>
  );
}
