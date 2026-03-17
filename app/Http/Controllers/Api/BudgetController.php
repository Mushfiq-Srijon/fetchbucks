<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $budgets = $request->user()->budgets()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'month'  => 'required|integer|min:1|max:12',
            'year'   => 'required|integer|min:2000|max:2100',
        ]);

        // If a budget already exists for this month+year, update it instead
        $budget = $request->user()->budgets()->updateOrCreate(
            ['month' => $validated['month'], 'year' => $validated['year']],
            ['amount' => $validated['amount']]
        );

        return response()->json($budget, 201);
    }

    public function show(Request $request, Budget $budget)
    {
        if ($budget->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($budget);
    }

    public function update(Request $request, Budget $budget)
    {
        if ($budget->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'month'  => 'sometimes|integer|min:1|max:12',
            'year'   => 'sometimes|integer|min:2000|max:2100',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }

    public function destroy(Request $request, Budget $budget)
    {
        if ($budget->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $budget->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}