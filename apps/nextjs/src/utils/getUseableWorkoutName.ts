export const getUsableWorkoutName = () => {
  const hours = new Date().getHours();
  let timeOfDay;

  if (hours >= 5 && hours < 12) {
    timeOfDay = "Morning";
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = "Afternoon";
  } else if (hours >= 18 && hours < 21) {
    timeOfDay = "Evening";
  } else if (hours >= 2 && hours < 5) {
    timeOfDay = "Degen Hours";
  } else {
    timeOfDay = "Night";
  }

  return `${timeOfDay}`;
};
