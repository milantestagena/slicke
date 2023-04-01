<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Collection;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'country_id',
        'membership_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function messagesSent(): HasMany
    {
        return $this->hasMany(User::class, 'sender_id');
    }

    public function messagesReceived(): HasMany
    {
        return $this->hasMany(User::class, 'sender_id');
    }

    public function coversations()
    {
        $allMessages =  $this->messagesSent()->merge($this->messagesReceived());
        // for testing
        print_r($allMessages);
    }

    public function proposalSent(): HasMany
    {
        return $this->hasMany(Proposal::class, 'sender_id');
    }

    public function proposalReceived(): HasMany
    {
        return $this->hasMany(Proposal::class, 'receiver_id');
    }

    public function userCollections(): HasMany
    {
        return $this->hasMany(UserCollection::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Countries::class);
    }

    public function doubles(): HasMany
    {
        return $this->hasMany(Double::class, 'user_id');
    }

    public function missing(): HasMany
    {
        return $this->hasMany(Missing::class, 'user_id');
    }

    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class, 'membership_id');
    }


    public function itemsMatching(): HasMany
    {
        return $this->hasMany(ItemsMatching::class, 'user_id');
    }

    public static function getUsersForCollection($collectionId, $term){
        return UserCollection::join("users", "user_collections.user_id", '=', "users.id")
        ->select("users.*")
        ->where('user_collections.collection_id', '=', $collectionId)
        ->where('users.name', 'like', '%'.$term.'%')
        ->orderBy('users.membership_id', 'DESC')->get();
    }
    public static function getUsers($term){
        return User::where('users.name', 'like', '%'.$term.'%')
        ->orderBy('membership_id', 'DESC')->orderBy('users.membership_id', 'DESC')->get();
    }

}
