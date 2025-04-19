import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Donut from "../components/PieChart";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

function MyDevice() {
  const [deviceList, setDeviceList] = useState([]);
  const [searchedDevice, setSearchedDevice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch current user's devices (includes transactions)
  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const user = parsed.data?.identity || parsed.identity || parsed;
      try {
        const token = parsed.data?.token || parsed.token;
        const response = await fetch(
          `http://localhost:4000/api/inventory?deviceUserId=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok && result.success) {
          setDeviceList(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchedDevice]);

  // Filter by name (case-insensitive)
  const filtered = deviceList.filter((d) =>
    d.deviceName.toLowerCase().includes(searchedDevice.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Compute distribution by deviceTypeName from nested deviceType
  const distribution = useMemo(() => {
    const counts = {};
    deviceList.forEach((d) => {
      const label = d.deviceType?.deviceTypeName || "Unknown";
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [deviceList]);

  // Helper to get latest borrow activity time
  const getBorrowedSince = (transactions) => {
    if (!transactions?.length) return "N/A";
    // filter only 'Borrow' entries then find most recent
    const borrows = transactions.filter(t => t.activity === 'Borrow');
    if (!borrows.length) return "N/A";
    const latest = borrows.reduce((prev, curr) =>
      new Date(curr.activityTime) > new Date(prev.activityTime) ? curr : prev
    );
    return new Date(latest.activityTime).toLocaleString();
  };

  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Devices</h1>
        <Input
          placeholder="Search devices..."
          className="w-80"
          value={searchedDevice}
          onChange={(e) => setSearchedDevice(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currentItems.map((device) => (
          <Card key={device.id}>
            <CardContent className="p-4">
              <h2 className="font-semibold">{device.deviceName}</h2>
              <p className="text-sm text-muted-foreground">
                {device.deviceType?.deviceTypeName}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Borrowed since: {getBorrowedSince(device.transactions)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={currentPage === 1 ? "opacity-40" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-3">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={currentPage === totalPages ? "opacity-40" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Device Distribution</h2>
      <Donut data={distribution} />
    </div>
  );
}

export default MyDevice;
