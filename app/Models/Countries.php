<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Countries extends Model
{
    use HasFactory;
    protected $fillable = [
        'country',
        'region',
        'active',
    ];
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'user_id');
    }
    public function membershipPrice(): HasMany
    {
        return $this->HasMany(MembershipPrice::class, 'country_id');
    }
    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collections_per_countries', 'country_id', 'collection_id');
    }
}
