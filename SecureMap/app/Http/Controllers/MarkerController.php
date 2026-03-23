<?php

namespace App\Http\Controllers;

use App\Models\Marker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MarkerController extends Controller
{
    public function index(Request $request): View
    {
        $markers = $request->user()
            ->markers()
            ->latest('updated_at')
            ->get(['id', 'label', 'latitude', 'longitude', 'color', 'priority']);

        return view('map.index', [
            'markers' => $markers,
            'apiToken' => null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => ['nullable', 'string', 'max:120'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'color' => ['nullable', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'priority' => ['nullable', 'in:baja,media,alta'],
        ]);

        $marker = $request->user()->markers()->create([
            'label' => $validated['label'] ?? 'Nuevo marcador',
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'color' => $validated['color'] ?? '#ff6b35',
            'priority' => $validated['priority'] ?? 'media',
        ]);

        return response()->json($marker, 201);
    }

    public function update(Request $request, Marker $marker): JsonResponse
    {
        abort_if($marker->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'label' => ['nullable', 'string', 'max:120'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'color' => ['nullable', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'priority' => ['nullable', 'in:baja,media,alta'],
        ]);

        $marker->update($validated);

        return response()->json($marker->fresh());
    }

    public function destroy(Request $request, Marker $marker): JsonResponse
    {
        abort_if($marker->user_id !== $request->user()->id, 403);

        $marker->delete();

        return response()->json(['message' => 'Marcador eliminado']);
    }
}
