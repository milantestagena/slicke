<?php

namespace App\Models;

use App\Enums\CollectionType;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    use HasFactory;
     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'name',
        'description',
        'year',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [

    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => CollectionType::class,
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'collection_id');
    }

    public static function getCollections(){
        return Collection::all();
    }

    public static function getAvailableCollections($user){
        return Collection::join('collections_per_countries', 'collections.id', '=','collections_per_countries.collection_id')
            ->join('countries', 'collections_per_countries.country_id', '=','countries.id')
            ->where('countries.id', $user->country_id)
            ->get();
    }

    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(Countries::class, 'collections_per_countries', 'collection_id', 'country_id');
    }

    public function doubles(): HasMany
    {
        return $this->hasMany(Double::class, 'collection_id');
    }

    public function missing(): HasMany
    {
        return $this->hasMany(Missing::class, 'collection_id');
    }

}
