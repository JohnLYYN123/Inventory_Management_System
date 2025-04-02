import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Donut from "../components/PieChart";

const mockDevice = [
    { name: "MacBook Pro M2", type: "laptop", borrowed: "2025-03-14 09:30 AM" },
    { name: "iPhone 15 Pro", type: "mobile", borrowed: "2025-03-14 10:15 AM" },
    { name: "Dell XPS 15", type: "laptop", borrowed: "2025-03-13 05:45 PM" },
    { name: "iPad Pro 2024", type: "tablet", borrowed: "2025-03-14 11:20 AM" },
    { name: "Surface Laptop Studio", type: "laptop", borrowed: "2025-03-14 08:55 AM" },
    { name: "Samsung Galaxy S25", type: "mobile", borrowed: "2025-03-12 03:30 PM" },
  ];

const deviceDistribution = [
    { name: "Laptop", value: 3 },
    { name: "Mobile", value: 2 },
    { name: "Tablet", value: 1 },
];

function MyDevice() {
    const [message, setMessage] = useState(null);
    const [deviceList, setDeviceList] = useState([]);
    const [distribution, setDistribution] = useState([]);

    useEffect(() => {
        setMessage("hello IMS");
        setDeviceList(mockDevice);
        setDistribution(deviceDistribution);
    }, []); // empty dependency array → runs once after mount

    return(
        <div className="px-10 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mt-4">My Devices</h1>
                <Input placeholder="Search devices..." className="w-80" />
            </div>

            {/* Device card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {deviceList.map((device, idx) => 
                    <Card key={idx}>
                        <CardContent className="p-4">
                        <h2 className="text-md font-semibold">{device.name}</h2>
                        <p className="text-sm text-muted-foreground">{device.type}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Borrowed since: {device.borrowed}
                        </p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <h2 className="text-2xl font-bold mb-4">Device Distribution</h2>
            <Donut data={distribution} />
        </div>
    )
}

export default MyDevice;