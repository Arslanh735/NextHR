import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  Groups,
  PersonAdd,
  EventBusy,
  Payments,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const attendanceData = [
  { day: "Mon", present: 85, absent: 10 },
  { day: "Tue", present: 90, absent: 8 },
  { day: "Wed", present: 82, absent: 13 },
  { day: "Thu", present: 94, absent: 5 },
  { day: "Fri", present: 88, absent: 9 },
  { day: "Sat", present: 75, absent: 15 },
];

const employees = [
  { name: "Ali Ahmed", department: "Development", status: "Present", avatar: "A" },
  { name: "Sara Khan", department: "Human Resources", status: "Present", avatar: "S" },
  { name: "Usman Tariq", department: "Marketing", status: "Absent", avatar: "U" },
  { name: "Ayesha Noor", department: "Finance", status: "Present", avatar: "A" },
];

const stats = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12 this month",
    icon: <Groups />,
    color: "#2563EB",
    background: "#EFF6FF",
  },
  {
    title: "Present Today",
    value: "218",
    change: "87.9% attendance",
    icon: <PersonAdd />,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "On Leave",
    value: "18",
    change: "Today",
    icon: <EventBusy />,
    color: "#D97706",
    background: "#FEF3C7",
  },
  {
    title: "Pending Payroll",
    value: "12",
    change: "Need processing",
    icon: <Payments />,
    color: "#9333EA",
    background: "#F3E8FF",
  },
];

export default function Dashboard() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Dashboard
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Welcome back! Here's what's happening in your organization.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <Stack
  sx={{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
                <Typography color="text.secondary" fontSize={13}>
                  {stat.title}
                </Typography>

                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    color: stat.color,
                    bgcolor: stat.background,
                    display: "flex",
                  }}
                >
                  {stat.icon}
                </Box>
              </Stack>

              <Typography variant="h4" fontWeight={800} mt={2}>
                {stat.value}
              </Typography>

              <Typography fontSize={12} color="text.secondary" mt={1}>
                {stat.change}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6">
              Attendance Overview
            </Typography>

            <Typography color="text.secondary" fontSize={13} mb={3}>
              Weekly employee attendance
            </Typography>

            <Box height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="present"
                    stroke="#2563EB"
                    fill="url(#presentGradient)"
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="absent"
                    stroke="#F59E0B"
                    fill="none"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">
              Quick Summary
            </Typography>

            <Stack spacing={3} mt={3}>
              <Box>
                <Typography color="text.secondary" fontSize={13}>
                  Total Departments
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  08
                </Typography>
              </Box>

              <Box>
                <Typography color="text.secondary" fontSize={13}>
                  Pending Leave Requests
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  06
                </Typography>
              </Box>

              <Box>
                <Typography color="text.secondary" fontSize={13}>
                  New Hires This Month
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  12
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Employees
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.name}>
                    <TableCell>
                      <Stack
  sx={{
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  }}
>
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.dark" }}>
                          {employee.avatar}
                        </Avatar>

                        <Typography fontWeight={600} fontSize={13}>
                          {employee.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{employee.department}</TableCell>

                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={employee.status === "Present" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}