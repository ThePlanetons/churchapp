"use client"

import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
// import { useToast } from "@/hooks/use-toast";
// import AxiosInstance from "@/lib/axios";
// import { useEffect, useMemo, useState } from "react";

export default function Account() {
  // const { toast } = useToast();
  // // const [loading, setLoading] = useState(true);

  // // Memoize axiosInstance so that it isn't recreated on every render.
  // const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  return (
    <div className="flex flex-1 flex-col">
      <FullScreenCalendar />
    </div>
  )
}