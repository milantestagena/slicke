<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserCollection extends Model
{
    use HasFactory;

    protected $table = 'user_collections';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'collection_id',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function item(): HasMany
    {
        return $this->hasMany(Item::class, 'item_id');
    }
    public static function userCollections($user)
    {
        return UserCollection::where('user_id', $user->id)->get();
    }
    public static function userCollection($user, $collectionId)
    {
        return UserCollection::where('user_id', $user->id)->where('collection_id', $collectionId)->get()->firstOrFail();
    }
    public static function createNew($user, $collectionId)
    {
        return UserCollection::where('user_id', $user->id)->where('collection_id', $collectionId)->first();
    }
}
