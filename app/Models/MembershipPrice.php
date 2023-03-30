<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'membership_id',
        'amount',
        'currency_international',
        'currency',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Countries::class, 'country_id');
    }
    
    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class, 'membership_id');
    }

}
