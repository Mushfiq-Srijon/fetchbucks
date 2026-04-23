<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get current month and year
        $month = now()->month;
        $year  = now()->year;

        // Total spent this month
        $totalSpent = $user->expenses()
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');

        // Budget for this month
        $budget = $user->budgets()
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        $budgetAmount = $budget ? $budget->amount : 0;

        // Last 5 expenses with category
        $recentExpenses = $user->expenses()
            ->with('category')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Spending grouped by category this month
        $byCategory = $user->expenses()
            ->with('category')
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get()
            ->groupBy(fn($e) => $e->category?->name ?? 'Uncategorized')
            ->map(fn($group, $name) => [
                'name'   => $name,
                'color'  => $group->first()->category?->color ?? '#6366f1',
                'amount' => $group->sum('amount'),
            ])
            ->values();

        return response()->json([
            'total_spent'     => (float) $totalSpent,
            'budget'          => (float) $budgetAmount,
            'remaining'       => (float) ($budgetAmount - $totalSpent),
            'recent_expenses' => $recentExpenses,
            'by_category'     => $byCategory,
        ]);
    }
}