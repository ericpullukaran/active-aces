import React from "react";

import { api } from "~/trpc/server";

type Props = {};

export default async function ExercisesListPage({}: Props) {
  const exercises = await api.exercises.all();
  console.log(exercises);

  return <div>Testing {JSON.stringify(exercises)}</div>;
}
