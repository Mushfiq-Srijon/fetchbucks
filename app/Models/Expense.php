<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'amount',
        'date',
        'note'
    ];

    // Tell Laravel to treat these as the correct data types
    protected $casts = [
        'amount' => 'decimal:2',
        'date'   => 'date',
    ];

    // An expense belongs to one user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // An expense belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}