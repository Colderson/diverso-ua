"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/language-provider"

const filters = [
	{ id: "all", name: "all" },
	{ id: "movies", name: "movies" },
	{ id: "cartoons", name: "cartoons" },
	{ id: "anime", name: "anime" },
	{ id: "games", name: "games" },
]

type FilterButtonsProps = {
	activeFilter: string
	setActiveFilter: (filter: string) => void
}

export function FilterButtons({
	activeFilter,
	setActiveFilter,
}: FilterButtonsProps) {
	const { t } = useTranslation()

	return (
		<div className="flex flex-wrap gap-2 mb-8">
			{filters.map((filter) => (
				<Button
					key={filter.id}
					variant={activeFilter === filter.id ? "default" : "outline"}
					onClick={() => setActiveFilter(filter.id)}
					className="rounded-full"
				>
					{t(filter.name)}
				</Button>
			))}
		</div>
	)
}
