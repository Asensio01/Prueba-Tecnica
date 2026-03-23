<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Marker extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'latitude',
        'longitude',
        'color',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'label' => 'encrypted',
            'latitude' => 'float',
            'longitude' => 'float',
            'priority' => 'string',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
