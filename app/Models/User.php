<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
        return $this->hasMany(Collection::class, 'collection_id');
    }
}
