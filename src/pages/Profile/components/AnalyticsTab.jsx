import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WeightTrendChart from "../../../components/Shared/WeightTrendChart";
import ActivityChart    from "../../../components/Shared/ActivityChart";
import api from "../../../lib/api";

export default function AnalyticsTab() {
  const [weightRange, setWeightRange] = useState("7 days");
  const [activityTab, setActivityTab] = useState("Steps");

  const { data: weightHistory = [] } = useQuery({
    queryKey: ["weight-history", weightRange],
    queryFn: () =>
      api.get(`/user/weight-history?range=${weightRange === "7 days" ? "7d" : "30d"}`).then((r) => r.data),
  });

  const { data: activityHistory = [] } = useQuery({
    queryKey: ["activity", activityTab],
    queryFn: () =>
      api.get(`/user/activity?type=${activityTab === "Steps" ? "steps" : "workout"}&range=7d`).then((r) => r.data),
  });

  const weightData = weightHistory.map((d) => ({ day: d.day, weight: d.weight_kg ?? d.weight }));
  const weightVals = weightData.map((d) => d.weight);
  const weightDomain = weightVals.length
    ? [Math.floor(Math.min(...weightVals)) - 2, Math.ceil(Math.max(...weightVals)) + 2]
    : [75, 95];

  const activityData = activityHistory.map((d) => ({ day: d.day, value: Number(d.value) }));
  const activityFormatter = activityTab === "Steps"
    ? (v) => [v.toLocaleString(), "Steps"]
    : (v) => [`${v} min`, "Workout"];

  return (
    <div className="space-y-4">
      <WeightTrendChart
        data={weightData}
        domain={weightDomain}
        range={weightRange}
        onRangeChange={setWeightRange}
        subtitle={weightRange === "7 days" ? "This week" : "Last 30 days"}
      />
      <ActivityChart
        data={activityData}
        tab={activityTab}
        onTabChange={setActivityTab}
        formatter={activityFormatter}
        subtitle={activityTab === "Steps" ? "Daily steps this week" : "Workout minutes this week"}
      />
    </div>
  );
}
