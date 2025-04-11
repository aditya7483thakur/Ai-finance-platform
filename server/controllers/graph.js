import prisma from "../utils/prisma.js";

// Helper to compute date ranges
const getDateRange = (filter) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of day

  switch (filter) {
    case "last_7_days":
      const last7Days = new Date();
      last7Days.setDate(today.getDate() - 6);
      last7Days.setHours(0, 0, 0, 0);
      return { startDate: last7Days, endDate: today };

    case "last_month":
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      lastMonth.setHours(0, 0, 0, 0);
      return { startDate: lastMonth, endDate: today };

    case "last_6_months":
      const last6Months = new Date();
      last6Months.setMonth(today.getMonth() - 5, 1);
      last6Months.setHours(0, 0, 0, 0);
      return { startDate: last6Months, endDate: today };

    default:
      throw new Error("Invalid filter option");
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const { accountId, filter } = req.query;

    // Validate inputs
    if (!accountId || typeof accountId !== "string") {
      return res.status(400).json({ message: "Valid accountId is required" });
    }
    if (!filter || typeof filter !== "string") {
      return res.status(400).json({ message: "Valid filter is required" });
    }

    // Get date range
    let startDate, endDate;

    try {
      ({ startDate, endDate } = getDateRange(filter));
    } catch (error) {
      return res.status(400).json({ message: "Invalid filter option" });
    }

    // Build Prisma query
    const whereClause = {
      accountId,
      ...(startDate && endDate && { date: { gte: startDate, lte: endDate } }),
    };

    // Fetch aggregated data
    const transactions = await prisma.transaction.groupBy({
      by: ["date", "type"],
      _sum: { amount: true },
      where: whereClause,
      orderBy: { date: "asc" },
    });

    // Transform into date-keyed map
    const dailySummary = {};

    transactions.forEach(({ date, type, _sum }) => {
      const dateKey = date.toISOString().split("T")[0];
      if (!dailySummary[dateKey]) {
        dailySummary[dateKey] = { income: 0, expense: 0 };
      }
      if (type === "INCOME") {
        dailySummary[dateKey].income += Number(_sum.amount) || 0;
      } else {
        dailySummary[dateKey].expense += Number(_sum.amount) || 0;
      }
    });

    // Generate complete date series (only for bounded ranges)
    let result = [];

    if (startDate && endDate) {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split("T")[0];
        result.push({
          date: dateKey,
          income: Number(dailySummary[dateKey]?.income) || 0,
          expense: Number(dailySummary[dateKey]?.expense) || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // For "all_time", return only dates with transactions
      result = Object.entries(dailySummary)
        .map(([date, amounts]) => ({
          date,
          ...amounts,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((day) => {
      totalIncome += day.income;
      totalExpense += day.expense;
    });

    const net = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      data: result,
      meta: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        count: result.length,
        totalIncome,
        totalExpense,
        net,
      },
    });
  } catch (error) {
    console.error("Transaction summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getCurrentMonthCategoryExpenses = async (req, res) => {
  try {
    const { userId } = req.query;
    // Validate accountId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Valid userId is required" });
    }

    // Get current month's start and end dates
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    // Fetch and aggregate transactions
    const categoryExpenses = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "EXPENSE", // Only count expenses
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc", // Order by highest expenses first
        },
      },
    });

    // Format the response
    const formattedData = categoryExpenses.map((item) => ({
      name: item.category,
      value: Number(item._sum.amount), // Convert Decimal to number
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
      meta: {
        month: now.toLocaleString("default", { month: "long" }),
        year: now.getFullYear(),
        userId,
      },
    });
  } catch (error) {
    console.error("Error fetching category expenses:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
