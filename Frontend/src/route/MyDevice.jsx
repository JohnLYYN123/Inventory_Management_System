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


// Helper function to generate page numbers with ellipses.
function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }

  const pages = [];
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(currentPage + 2, totalPages);

  if (startPage > 2) {
    pages.push(1);
    pages.push("…");
  } else if (startPage === 2) {
    pages.push(1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push("…");
    pages.push(totalPages);
  } else if (endPage === totalPages - 1) {
    pages.push(totalPages);
  }

  return pages;
}

function MyDevice() {
  const [deviceList, setDeviceList] = useState([]);
  const [searchedDevice, setSearchedDevice] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch devices from backend API.
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/devices");
        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        const data = await response.json();
        setDeviceList(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  // Filter the device list based on search input.
  const filteredDeviceList = deviceList.filter((device) =>
    device.name.toLowerCase().includes(searchedDevice.toLowerCase())
  );

  // Reset page to 1 when the search query changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchedDevice]);

  // Pagination calculations.
  const totalPages = Math.ceil(filteredDeviceList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeviceList.slice(indexOfFirstItem, indexOfLastItem);

  // Compute device distribution based on the "devicetype" property.
  // This will be used for the Donut chart.
  const computedDistribution = useMemo(() => {
    const distribution = {};
    deviceList.forEach((device) => {
      const type = device.devicetype; // Assumes the fetched device has a "devicetype" field.
      if (distribution[type]) {
        distribution[type] += 1;
      } else {
        distribution[type] = 1;
      }
    });
    // Convert the object into an array [{ name: 'Laptop', value: 3 }, ...].
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [deviceList]);

  // Generate an array of page numbers for truncated pagination.
  const pageNumbers = getPageNumbers(currentPage, totalPages, 5);

  // Function to update the current page.
  const paginate = (pageNumber) => {
    if (typeof pageNumber === "number") {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mt-4">My Devices</h1>
        <Input
          placeholder="Search devices..."
          className="w-80"
          type="text"
          value={searchedDevice}
          onChange={(e) => setSearchedDevice(e.target.value)}
        />
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currentItems.map((device, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <h2 className="text-md font-semibold">{device.name}</h2>
              <p className="text-sm text-muted-foreground">{device.devicetype}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Borrowed since: {device.borrowed}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Truncated Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mb-8">
        {pageNumbers.map((page, index) => {
          if (page === "…") {
            return (
              <span key={index} className="px-3 py-1">
                …
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
      {/* {totalPages > 1 && (
        <Pagination className="mt-5 justify-center items-center">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className={currentPage !== 1 ? "" : "opacity-40" }
                    />
                </PaginationItem>

                <PaginationItem>
                      <span className="text-sm text-muted-foreground px-3">
                        Page {currentPage} of {total}
                    </span>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.max(p + 1, 1))}
                        className={currentPage !== total ? "" : "opacity-40" }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )} */}
      <h2 className="text-2xl font-bold mb-4">Device Distribution</h2>
      <Donut data={computedDistribution} />
    </div>
  );
}

export default MyDevice;
