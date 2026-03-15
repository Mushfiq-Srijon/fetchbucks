<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // These fields are allowed to be mass assigned
    protected $fillable = ['user_id', 'name', 'color'];

    // A category belongs to one user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A category has many expenses
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}