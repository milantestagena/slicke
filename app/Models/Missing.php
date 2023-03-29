<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Missing extends Model
{
    use HasFactory;
    /**
    * The attributes that are mass assignable.
    *
    * @var array<int, string>
    */
   protected $fillable = [
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

   public function user(): BelongsTo
   {
       return $this->belongsTo(User::class, 'user_id');
   }

   public function collection(): BelongsTo
   {
       return $this->belongsTo(User::class, 'collection_id');
   }

   public function userCollection(): BelongsTo
   {
       return $this->belongsTo(UserCollection::class, 'user_collection_id');
   }

   public function item(): BelongsTo
   {
       return $this->belongsTo(Item::class, 'item_id');
   }


}
