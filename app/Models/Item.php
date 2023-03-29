<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'collection_id',
        'identifier',
        'description',
        'link',
        'title',
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
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(ProposalItem::class, 'item_id');
    }

    public static function getForCollection(int $collectionId){
        return Item::where('collection_id', $collectionId)->get();
    }

    public function doubles(): HasMany
    {
        return $this->hasMany(Double::class, 'item_id');
    }

    public function missing(): HasMany
    {
        return $this->hasMany(Missing::class, 'item_id');
    }
}
