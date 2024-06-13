import React, { ChangeEvent, useState } from "react"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Icon } from "./icons"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"

interface Emoji {
  emoji: string
  name: string
}

interface EmojiGroups {
  [key: string]: Emoji[]
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("💰")
  const [selectedGroup, setSelectedGroup] = useState("dollar")

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji)
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  const filteredEmojis: EmojiGroups = Object.entries(emojiGroups).reduce(
    (result: EmojiGroups, [group, emojis]) => {
      result[group] = emojis.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase())
      )
      return result
    },
    {}
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className={cn(className)}>
        <Button variant="ghost">{selectedEmoji}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        {!search && (
          <Tabs
            value={selectedGroup}
            onValueChange={setSelectedGroup}
            className="flex flex-col justify-center"
          >
            <TabsList>
              {Object.keys(emojiGroups).map((group) => (
                <TabsTrigger key={group} value={group}>
                  <Icon name={group as any} className="w-5 h-5" />
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(filteredEmojis).map(([group, emojis]) => (
              <TabsContent
                key={group}
                value={group}
                hidden={selectedGroup !== group}
              >
                <EmojiGroup emojis={emojis} onEmojiSelect={handleEmojiClick} />
              </TabsContent>
            ))}
          </Tabs>
        )}
        {search && (
          <EmojiGroup
            emojis={Object.values(filteredEmojis).flatMap((emojies) => emojies)}
            onEmojiSelect={handleEmojiClick}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmojiGroup({
  emojis,
  onEmojiSelect,
}: {
  emojis: Emoji[]
  onEmojiSelect: (emoji: string) => void
}) {
  return (
    <DropdownMenuGroup>
      <div className="flex flex-wrap gap-2 justify-center max-w-48 max-h-48 overflow-y-auto">
        {emojis.map(({ emoji, name }) => (
          <DropdownMenuItem key={name} onClick={() => onEmojiSelect(emoji)}>
            {emoji}
          </DropdownMenuItem>
        ))}
        {emojis.length === 0 && (
          <p className="text-muted-foreground text-xs py-2">No emojis found</p>
        )}
      </div>
    </DropdownMenuGroup>
  )
}

const emojiGroups: EmojiGroups = {
  dollar: [
    { emoji: "💰", name: "Money Bag" },
    { emoji: "🤑", name: "Money-Mouth Face" },
    { emoji: "🏦", name: "Bank" },
    { emoji: "💸", name: "Money with Wings" },
    { emoji: "💵", name: "Dollar Banknote" },
    { emoji: "💴", name: "Yen Banknote" },
    { emoji: "💶", name: "Euro Banknote" },
    { emoji: "💷", name: "Pound Banknote" },
    { emoji: "💎", name: "Gem Stone" },
    { emoji: "🏠", name: "House" },
    { emoji: "🚗", name: "Car" },
    { emoji: "🛒", name: "Shopping Cart" },
    { emoji: "🎮", name: "Video Game" },
    { emoji: "💳", name: "Credit Card" },
  ],
  food: [
    { emoji: "🍔", name: "Hamburger" },
    { emoji: "🍕", name: "Pizza" },
    { emoji: "🌮", name: "Taco" },
    { emoji: "🍣", name: "Sushi" },
    { emoji: "🍦", name: "Ice Cream" },
    { emoji: "🍩", name: "Donut" },
    { emoji: "🍺", name: "Beer" },
    { emoji: "🍷", name: "Wine" },
    { emoji: "🍹", name: "Cocktail" },
    { emoji: "☕", name: "Coffee" },
  ],
  globe: [
    { emoji: "✈️", name: "Airplane" },
    { emoji: "🚗", name: "Car" },
    { emoji: "🚲", name: "Bicycle" },
    { emoji: "⛵", name: "Sailboat" },
    { emoji: "🏔️", name: "Mountain" },
    { emoji: "🏖️", name: "Beach" },
    { emoji: "🏰", name: "Castle" },
    { emoji: "🗽", name: "Statue of Liberty" },
  ],
  threeDotsHorizontal: [
    { emoji: "😀", name: "Grinning Face" },
    { emoji: "😃", name: "Grinning Face with Big Eyes" },
    { emoji: "😄", name: "Grinning Face with Smiling Eyes" },
    { emoji: "😁", name: "Beaming Face with Smiling Eyes" },
    { emoji: "😆", name: "Grinning Squinting Face" },
    { emoji: "😅", name: "Grinning Face with Sweat" },
    { emoji: "😂", name: "Face with Tears of Joy" },
    { emoji: "🤣", name: "Rolling on the Floor Laughing" },
    { emoji: "😊", name: "Smiling Face with Smiling Eyes" },
    { emoji: "😇", name: "Smiling Face with Halo" },
    { emoji: "🌍", name: "Earth Globe" },
    { emoji: "🌙", name: "Crescent Moon" },
    { emoji: "🌳", name: "Tree" },
    { emoji: "🌺", name: "Flower" },
    { emoji: "🌼", name: "Blossom" },
    { emoji: "🌻", name: "Sunflower" },
    { emoji: "🌸", name: "Cherry Blossom" },
    { emoji: "🌿", name: "Herb" },
    { emoji: "🍃", name: "Leaf Fluttering in Wind" },
    { emoji: "🌱", name: "Seedling" },
    { emoji: "🌷", name: "Tulip" },
    { emoji: "🌹", name: "Rose" },
    { emoji: "⚽", name: "Soccer Ball" },
    { emoji: "🏀", name: "Basketball" },
    { emoji: "🏈", name: "American Football" },
    { emoji: "⚾", name: "Baseball" },
    { emoji: "🎾", name: "Tennis" },
    { emoji: "🏐", name: "Volleyball" },
    { emoji: "🏓", name: "Ping Pong" },
    { emoji: "🏸", name: "Badminton" },
    { emoji: "🏒", name: "Ice Hockey" },
    { emoji: "🥊", name: "Boxing Glove" },
    { emoji: "☀️", name: "Sun" },
    { emoji: "🌤️", name: "Sun Behind Small Cloud" },
    { emoji: "⛅", name: "Sun Behind Cloud" },
    { emoji: "🌦️", name: "Sun Behind Rain Cloud" },
    { emoji: "🌧️", name: "Cloud with Rain" },
    { emoji: "⛈️", name: "Cloud with Lightning and Rain" },
    { emoji: "🌩️", name: "Cloud with Lightning" },
    { emoji: "❄️", name: "Snowflake" },
    { emoji: "🌨️", name: "Cloud with Snow" },
    { emoji: "🌪️", name: "Tornado" },
    { emoji: "🐶", name: "Dog Face" },
    { emoji: "🐱", name: "Cat Face" },
    { emoji: "🐭", name: "Mouse Face" },
    { emoji: "🐹", name: "Hamster Face" },
    { emoji: "🐰", name: "Rabbit Face" },
    { emoji: "🦊", name: "Fox Face" },
    { emoji: "🐻", name: "Bear Face" },
    { emoji: "🐼", name: "Panda Face" },
    { emoji: "🐨", name: "Koala" },
    { emoji: "🐯", name: "Tiger Face" },
    { emoji: "🎵", name: "Musical Note" },
    { emoji: "🎶", name: "Musical Notes" },
    { emoji: "🎤", name: "Microphone" },
    { emoji: "🎸", name: "Guitar" },
    { emoji: "🎹", name: "Musical Keyboard" },
    { emoji: "🥁", name: "Drum" },
    { emoji: "🎺", name: "Trumpet" },
    { emoji: "🎻", name: "Violin" },
    { emoji: "🎧", name: "Headphone" },
    { emoji: "🎼", name: "Sheet Music" },
    { emoji: "💻", name: "Laptop" },
    { emoji: "📱", name: "Mobile Phone" },
    { emoji: "🖥️", name: "Desktop Computer" },
    { emoji: "⌨️", name: "Keyboard" },
    { emoji: "🖱️", name: "Computer Mouse" },
    { emoji: "🖨️", name: "Printer" },
    { emoji: "📷", name: "Camera" },
    { emoji: "🎥", name: "Movie Camera" },
    { emoji: "🔋", name: "Battery" },
    { emoji: "💡", name: "Light Bulb" },
  ],
}

export default EmojiPicker
