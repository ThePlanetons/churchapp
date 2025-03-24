"use client"

// import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { useToast } from "@/hooks/use-toast";
import AxiosInstance from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";

export default function Account() {
  // const dummyEvents = [
  //   {
  //     day: new Date("2025-01-02"),
  //     events: [
  //       {
  //         id: 1,
  //         name: "Q1 Planning Session",
  //         time: "10:00 AM",
  //         datetime: "2025-01-02T00:00",
  //       }
  //     ],
  //   },
  //   {
  //     day: new Date("2025-01-07"),
  //     events: [
  //       {
  //         id: 3,
  //         name: "Product Launch Review",
  //         time: "2:00 PM",
  //         datetime: "2025-01-07T00:00",
  //       }
  //     ],
  //   },
  //   {
  //     day: new Date("2025-01-16"),
  //     events: [
  //       {
  //         id: 10,
  //         name: "Client Presentation",
  //         time: "10:00 AM",
  //         datetime: "2025-01-16T00:00",
  //       }
  //     ],
  //   }
  // ]

  const { toast } = useToast();

  // const [loading, setLoading] = useState(true);

  // Memoize axiosInstance so that it isn't recreated on every render.
  const axiosInstance = useMemo(() => AxiosInstance(toast), [toast]);

  const [collections, setCollections] = useState<any[]>([]);
  // const [nextLink, setNextLink] = useState<string | null>(null)
  // const [prevLink, setPrevLink] = useState<string | null>(null)

  let transformedEvents
  // Fetch collections data from the API
  useEffect(() => {
    // setLoading(true);

    axiosInstance
      .get("collections/")
      .then((response: any) => {
        setCollections(response.data.results || []);
        // setNextLink(response.data.next);
        // setPrevLink(response.data.previous);

        transformedEvents = collections.map((collection) => ({
          day: new Date(collection.date),
          events: Object.values(collection.transactions)
            .flat() // Flatten nested arrays (Tithes, Mission, etc.)
            .filter((txn: any) => typeof txn === "object") // Ensure it's an object, not `grand_total`
            .map((txn: any) => ({
              id: txn.id,
              name: `${txn.collection_type} - ${txn.member_name}`,
              time: new Date(txn.transaction_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              datetime: txn.transaction_date,
            })),
        }));

        console.log(transformedEvents)
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error loading collections",
          description: "Failed to fetch collections data.",
        });
      })
      .finally(
        () => {
          // setLoading(false);
        }
      );
  }, [axiosInstance, toast]);

  return (
    <div className="flex flex-1 flex-col">
      {/* <FullScreenCalendar data={transformedEvents} /> */}
    </div>
  )
}