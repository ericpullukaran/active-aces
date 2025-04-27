"use client"
import React, { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { AddExercisesList } from "./AddExercisesList"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion, AnimatePresence } from "motion/react"

export const AddExerciseModal: React.FC<{
  children: (props: { openDialog: () => void }) => React.ReactNode
}> = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const toggleSearch = () => setIsSearching(!isSearching)

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
    setIsSearching(false)
  }

  return (
    <ResponsiveDialog
      title="Add Exercise"
      description="Add a new exercise to your workout"
      renderTrigger={({ openDialog }) => children({ openDialog })}
      renderContent={({ closeDialog }) => (
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
                  <button
                    onClick={clearSearch}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    <X size={16} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AddExercisesList searchQuery={searchQuery} />
        </div>
      )}
      renderFooter={({ closeDialog }) => (
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={closeDialog} className="flex-1">
            Dismiss
          </Button>
          <Button variant={"secondary"} onClick={toggleSearch} className="flex-1 gap-2">
            <Search size={18} />
            {isSearching ? "Close Search" : "Search"}
          </Button>
        </div>
      )}
    />
  )
}
