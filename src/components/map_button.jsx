import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"

export default function MapButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>See Map</span>
      <Map className={`w-5 h-5 ${isHovered ? "animate-pulse" : ""}`} />
    </Button>
  )
}
