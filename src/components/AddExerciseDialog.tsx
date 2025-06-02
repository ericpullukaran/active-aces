"use client"
import React, { useState, useRef, useEffect } from "react"
import { Search, X, Plus, ListFilter } from "lucide-react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { AddExercisesList } from "./AddExercisesList"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion, AnimatePresence } from "motion/react"
import { type ExerciseFilterOptions } from "~/lib/utils/useExercises"
import { cn } from "~/lib/utils"
import { CreateExerciseDialog } from "./CreateExerciseDialog"
import { ExercisesFilterDialog, useExercisesFilters } from "./ExercisesFilterDialog"

export const AddExerciseDialog: React.FC<{
  children: (props: { openDialog: () => void }) => React.ReactNode
}> = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useState(false)
  const [initialExerciseName, setInitialExerciseName] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { filters, setFilters, hasFiltersApplied } = useExercisesFilters()

  const toggleSearch = () => {
    if (isSearching) {
      setSearchQuery("")
    }
    setIsSearching(!isSearching)
  }

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const openCreateExercise = (initialName?: string) => {
    setInitialExerciseName(initialName || "")
    setIsAddExerciseOpen(false)
    setIsCreateExerciseOpen(true)
  }

  const openFilters = () => {
    setIsFilterOpen(true)
  }

  const handleApplyFilters = (newFilters: ExerciseFilterOptions) => {
    setFilters(newFilters)
  }

  const handleCreateFromSearch = (name: string) => {
    openCreateExercise(name)
  }

  return (
    <>
      {children({ openDialog: () => setIsAddExerciseOpen(true) })}

      <ResponsiveDialog
        title="Add Exercise"
        description="Add a new exercise to your workout"
        open={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        renderContent={() => (
          <div className="h-full p-4">
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative mb-4"
                >
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-8"
                  />
                  {searchQuery && (
                    <Button
                      onClick={clearSearch}
                      variant="ghost"
                      className="absolute top-1/2 right-2 -translate-y-1/2 px-0"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <AddExercisesList
              searchQuery={searchQuery}
              filterOptions={filters}
              onCreateExercise={handleCreateFromSearch}
            />
          </div>
        )}
        renderFooter={() => (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => openCreateExercise()} className="flex-1 gap-2">
              <Plus size={18} />
              Create
            </Button>
            <Button variant="secondary" onClick={toggleSearch} className="flex-2 gap-2">
              <Search size={18} />
              {isSearching ? "Close Search" : "Search"}
            </Button>
            <Button
              variant="outline"
              onClick={openFilters}
              className={cn("flex-1 gap-2", { "border-primary text-primary": hasFiltersApplied })}
            >
              <ListFilter size={18} />
              Filters
            </Button>
          </div>
        )}
      />

      <CreateExerciseDialog
        initialName={initialExerciseName}
        isOpen={isCreateExerciseOpen}
        onClose={() => setIsCreateExerciseOpen(false)}
      />

      <ExercisesFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  )
}
