import { mk } from "./helper";

const p = mk("greedy");

export const greedy = [
  p("gas-station", "Gas Station", "greedy", "medium", 40, ["array-traversal"]),
  p("candy", "Candy", "greedy", "hard", 50, ["array-traversal"]),
  p("hand-of-straights", "Hand of Straights", "greedy", "medium", 40, ["hash-map"]),
  p("merge-triplets-to-form-target-triplet", "Merge Triplets to Form Target Triplet", "greedy", "medium", 35, ["array-traversal"]),
  p("partition-labels", "Partition Labels", "greedy", "medium", 35, ["hash-map"]),
  p("valid-parenthesis-string", "Valid Parenthesis String", "greedy", "medium", 40, ["array-traversal"]),
  p("minimum-number-of-arrows-to-burst-balloons", "Minimum Number of Arrows to Burst Balloons", "intervals", "medium", 40, ["greedy"]),
  p("meeting-rooms", "Meeting Rooms", "intervals", "easy", 25, ["greedy"]),
  p("meeting-rooms-ii", "Meeting Rooms II", "intervals", "medium", 45, ["greedy"]),
  p("car-pooling", "Car Pooling", "intervals", "medium", 40, ["greedy"]),
  p("boats-to-save-people", "Boats to Save People", "two-pointers", "medium", 30, ["array-traversal"]),
  p("assign-cookies", "Assign Cookies", "greedy", "easy", 20, ["array-traversal"]),
  p("lemonade-change", "Lemonade Change", "greedy", "easy", 25, ["array-traversal"]),
  p("queue-reconstruction-by-height", "Queue Reconstruction by Height", "greedy", "medium", 45, ["array-traversal"]),
  p("maximum-units-on-a-truck", "Maximum Units on a Truck", "greedy", "easy", 25, ["array-traversal"]),
  p("minimum-number-of-refueling-stops", "Minimum Number of Refueling Stops", "heap", "hard", 55, ["heap"]),
  p("two-city-scheduling", "Two City Scheduling", "greedy", "medium", 35, ["array-traversal"]),
  p("remove-covered-intervals", "Remove Covered Intervals", "intervals", "medium", 35, ["greedy"]),
];
