<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserCollection extends Model
{
    use HasFactory;

    //protected $table = 'user_collections';
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
        return $this->belongsTo(Collection::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(UserItem::class, 'user_collection_id');
    }
    public static function userCollections($user)
    {
        return UserCollection::where('user_id', $user->id)->get();
    }
    public static function userCollection($user, $collectionId)
    {
        return UserCollection::firstOrCreate([
            'user_id' => $user->id,
            'collection_id' => $collectionId
        ]);
    }

    public static function createNew($user, $collectionId)
    {
        return UserCollection::where('user_id', $user->id)->where('collection_id', $collectionId)->first();
    }
}
