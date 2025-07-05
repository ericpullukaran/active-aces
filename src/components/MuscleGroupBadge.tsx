import { Badge } from "./ui/badge"

export default function MuscleGroupBadge({ muscleGroup }: { muscleGroup: string }) {
  return (
    <Badge variant="outline" className="bg-primary/10">
      {muscleGroup}
    </Badge>
  )
}
