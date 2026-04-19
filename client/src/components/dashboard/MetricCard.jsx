'use client'
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const MetricCard = ({ title, stats, icon, body }) => {
  return (
    <Card className={'gap-2 bg-background dark:bg-input/30'}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats}</div>
        <p className="text-xs text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
