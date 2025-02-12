"use client";

  import { useEffect, useState } from "react";
  import { useTheme } from "next-themes";
  import { useFont } from "@/contexts/FontContext";
  import { Stars, ArrowUp, ArrowDown } from "lucide-react";
  import { Card, CardHeader, CardContent } from "@/components/ui/card";
import axios from "axios";

  export default function StatsPage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { font } = useFont();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({ totalHits: 0, successfulHits: 0, failedHits: 0 });

    useEffect(() => {
      setMounted(true);
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/user123');
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (!mounted) {
      return null;
    }

    return (
      <main className="container mx-auto justify-center items-center max-w-4xl px-4 sm:px-8 lg:px-12 py-6 space-y-6 bg-background text-foreground">
        <div className="flex items-center gap-2 mb-6">
          <Stars className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`font-${font}`}>
            <CardHeader className="text-lg font-semibold">Total Hits</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.totalHits}</div>
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">24%</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`font-${font}`}>
            <CardHeader className="text-lg font-semibold">Successful Hits</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.successfulHits}</div>
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">18%</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`font-${font}`}>
            <CardHeader className="text-lg font-semibold">Failed Hits</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.failedHits}</div>
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">8%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }