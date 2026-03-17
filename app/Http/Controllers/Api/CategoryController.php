<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = $request->user()->categories()
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'color' => 'nullable|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $category = $request->user()->categories()->create($validated);

        return response()->json($category, 201);
    }

    public function show(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'color' => 'nullable|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}