<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Collection;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    public function collections(): HasMany
    {
        return $this->hasMany(UserCollection::class, 'user_id');
    }

    public function getCollection(Collection $collection): HasMany
    {
        return $this->hasOne(UserCollection::class, 'user_id')->where('collection_id', $collection->id)->first();
    }
    public function country(): BelongsTo
    {
        return $this->belongsTo(Countries::class);
    }
}
