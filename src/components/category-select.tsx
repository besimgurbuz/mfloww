import { useRef, useState } from "react"
import { CheckIcon, Cross2Icon, PlusIcon } from "@radix-ui/react-icons"

import { useStorage } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import EmojiPicker from "./emoji-picker"
import { Input } from "./ui/input"

type CategorySelectProps = {
  value?: string
  onChange: (value: string) => void
}

type Category = {
  name: string
  icon: React.ReactNode | string
}

const predefiedCategories: Category[] = [
  { name: "Salary", icon: "💰" },
  { name: "Rent", icon: "🏠" },
  { name: "Food", icon: "🍔" },
  { name: "Entertainment", icon: "🍿" },
  { name: "Shopping", icon: "🛍" },
  { name: "Bills", icon: "🧾" },
]

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [addActive, setAddActive] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("💰")
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryInputError, setNewCategoryInputError] = useState(false)
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useStorage<Category[]>(
    "CUSTOM_CATEGORIES",
    "sessionStorage",
    predefiedCategories
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewCategory(value)
  }
  const handleCreateCategory = () => {
    if (newCategory === "") {
      setNewCategoryInputError(true)
      return
    }

    const newCategoryName = newCategory
    setNewCategory("")
    setAddActive(false)
    onChange(`${selectedEmoji} ${newCategoryName}`)
    setNewCategoryInputError(false)
    setCategories([
      { name: newCategoryName, icon: selectedEmoji },
      ...categories,
    ])
  }

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onChange}
      className="flex justify-start flex-wrap gap-1"
    >
      {categories.map(({ name, icon }) => (
        <ToggleGroupItem
          key={name}
          value={`${icon} ${name}`}
          className="flex items-center justify-center"
        >
          {icon}
          <p className="text-xs font-medium ml-1">{name}</p>
        </ToggleGroupItem>
      ))}
      {!addActive && (
        <Button variant="ghost" onClick={() => setAddActive(!addActive)}>
          <PlusIcon />
        </Button>
      )}
      {addActive && (
        <div className="flex">
          <Input
            type="text"
            inputRef={newCategoryInputRef}
            className={cn({
              "border-red": newCategoryInputError,
            })}
            prefix={
              <EmojiPicker
                onEmojiSelect={(emoji) => {
                  setSelectedEmoji(emoji)
                  setTimeout(() => {
                    newCategoryInputRef.current?.focus()
                  }, 300)
                }}
              />
            }
            onChange={handleInputChange}
          />
          <Button variant="ghost" onClick={handleCreateCategory}>
            <CheckIcon />
          </Button>
          <Button variant="ghost" onClick={() => setAddActive(!addActive)}>
            <Cross2Icon />
          </Button>
        </div>
      )}
    </ToggleGroup>
  )
}
